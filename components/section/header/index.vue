<script setup>
const { locale } = useI18n();
const { list: social } = useSocial();
const { list: menu } = useMenu();
const { data: setting } = await useAsyncData("settings", () =>
	$api("settings"),
);

const localePath = useLocalePath();
const router = useRouter();

const applyRef = ref();
const navbarRef = ref();
const cartRef = ref(); // ← korzinka ref

const searchQuery = ref("");
const searchOpen = ref(false);
const searchInputRef = ref(null);

// ── Cart count (reactive, listens to cart-updated) ──────
const cartCount = ref(0);

function readCartCount() {
	try {
		const arr = JSON.parse(localStorage.getItem("clinic_cart") || "[]");
		cartCount.value = arr.length;
	} catch {
		cartCount.value = 0;
	}
}

onMounted(() => {
	readCartCount();
	window.addEventListener("cart-updated", (e) => {
		cartCount.value = (e.detail || []).length;
	});
});

// ── Search ───────────────────────────────────────────────
const handleSearch = () => {
	if (searchQuery.value.trim()) {
		router.push(
			localePath(
				`/search?word=${encodeURIComponent(searchQuery.value.trim())}`,
			),
		);
		searchOpen.value = false;
	}
};

const toggleSearch = async () => {
	searchOpen.value = !searchOpen.value;
	if (searchOpen.value) {
		await nextTick();
		searchInputRef.value?.focus?.();
	}
};

// ── Panels ───────────────────────────────────────────────
function openNavbar() {
	if (navbarRef.value?.toOpen) navbarRef.value.toOpen();
}
function openApply() {
	if (applyRef.value?.toOpen) applyRef.value.toOpen();
}
function openCart() {
	if (cartRef.value?.toOpen) cartRef.value.toOpen();
}
</script>

<template>
	<header class="h">
		<div class="container h__row">
			<!-- LEFT: logo -->
			<div class="h__left">
				<NuxtLink :to="localePath('/')" class="h__brand">
					<img class="h__logo" src="/logo.jpg" alt="Logo" />
					<span class="h__brandText">Salomatlik <br />maskani</span>
				</NuxtLink>
			</div>

			<!-- CENTER: nav OR search -->
			<div class="h__center">
				<Transition name="h-fade" mode="out-in">
					<!-- SEARCH BAR -->
					<div v-if="searchOpen" class="hSearch" key="search">
						<div class="hSearch__field">
							<input
								ref="searchInputRef"
								v-model="searchQuery"
								class="hSearch__input"
								type="text"
								:placeholder="$t('search')"
								@keyup.enter="handleSearch"
							/>
							<button
								class="hSearch__btn"
								@click="handleSearch"
								aria-label="Search"
							>
								<i class="ri-search-line"></i>
							</button>
						</div>
					</div>

					<!-- MENU -->
					<nav v-else class="hNav" key="nav">
						<ul class="hNav__list">
							<li class="hNav__item">
								<NuxtLink class="hNav__link" :to="localePath('/news')">
									{{ setting?.data?.news?.[locale] }}
								</NuxtLink>
							</li>
							<li class="hNav__item">
								<NuxtLink
									class="hNav__link"
									:to="localePath('/doctor')"
								>
									{{ setting?.data?.doctor?.[locale] }}
								</NuxtLink>
							</li>
							<li class="hNav__item">
								<NuxtLink
									class="hNav__link"
									:to="localePath('/department')"
								>
									{{ setting?.data?.service?.[locale] }}
								</NuxtLink>
							</li>
							<li class="hNav__item">
								<NuxtLink
									class="hNav__link"
									:to="localePath('/contact')"
								>
									{{ setting?.data?.contact?.[locale] }}
								</NuxtLink>
							</li>
						</ul>
					</nav>
				</Transition>
			</div>

			<!-- RIGHT -->
			<div class="h__right">
				<!-- Booking CTA -->
				<Btn
					class="h__cta"
					variant="primary"
					:data-text="$t('booking')"
					@click="openApply"
				>
					{{ $t("booking") }}
				</Btn>

				<!-- Search toggle -->
				<button
					class="h__iconBtn h__iconBtn--accent"
					@click="toggleSearch"
					:aria-label="searchOpen ? 'Close search' : 'Open search'"
				>
					<i :class="searchOpen ? 'ri-close-line' : 'ri-search-line'"></i>
				</button>

				<!-- ★ Cart button ★ -->
				<button
					class="h__iconBtn h__cartBtn"
					@click="openCart"
					aria-label="Korzinka"
				>
					<i class="ri-shopping-cart-2-line"></i>
					<Transition name="badge-pop">
						<span v-if="cartCount > 0" class="h__cartBadge">
							{{ cartCount > 99 ? "99+" : cartCount }}
						</span>
					</Transition>
				</button>

				<!-- Language -->
				<SectionHeaderLang>
					<template #="{ locale, locales }">
						<button class="hLang" aria-label="Language">
							<img
								class="hLang__flag"
								:src="`/flag/${locale}.png`"
								:alt="locale"
							/>
							<span class="hLang__text">
								{{
									locales.find((l) => l.code === locale)?.code ||
									locale
								}}
							</span>
							<i class="ri-arrow-down-s-line hLang__chev"></i>
						</button>
					</template>
				</SectionHeaderLang>

				<!-- Burger -->
				<button class="h__iconBtn" @click="openNavbar" aria-label="Menu">
					<i class="ri-menu-line"></i>
				</button>
			</div>
		</div>
	</header>

	<SectionHeaderApply ref="applyRef" />
	<SectionHeaderNavbar @apply="openApply" ref="navbarRef" />

	<!-- ★ Cart drawer ★ -->
	<SectionHeaderCart ref="cartRef" @booking="openApply" />
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

// ── Badge pop animation ────────────────────────────────────
@keyframes badge-bounce {
	0% {
		transform: scale(0.6);
		opacity: 0;
	}
	60% {
		transform: scale(1.2);
		opacity: 1;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

.badge-pop-enter-active {
	animation: badge-bounce 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.badge-pop-leave-active {
	transition:
		opacity 0.18s,
		transform 0.18s;
}
.badge-pop-leave-to {
	opacity: 0;
	transform: scale(0.5);
}

.h {
	position: sticky;
	top: 0;
	z-index: 50;
	background: #fff;
	border-bottom: 1px solid #ededed;

	&__row {
		height: 88px;
		display: flex;
		align-items: center;
		gap: 18px;
	}

	&__left {
		display: flex;
		align-items: center;
		gap: 44px;
		flex: 0 0 auto;
	}

	&__brand {
		display: flex;
		align-items: center;
		gap: 2px;
		text-decoration: none;
	}

	&__logo {
		width: 82px;
		height: 82px;
		border-radius: 12px;
		object-fit: cover;
		@include devices(sm) {
			width: 72px;
			height: 72px;
		}
	}

	&__brandText {
		font-size: 20px;
		font-weight: 700;
		line-height: 1.3;
		text-transform: uppercase;
		color: rgba(20, 63, 150, 0.92);
		white-space: nowrap;
		@include devices(sm) {
			font-size: 18px;
		}
	}

	&__center {
		flex: 1;
		min-width: 0;
	}

	&__right {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 0 0 auto;
	}

	&__cta {
		@include devices(md) {
			display: none;
		}
	}

	&__iconBtn {
		width: 46px;
		height: 46px;
		border-radius: 14px;
		border: 1px solid var(--blue-4);
		background: #fff;
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: 0.2s ease;
		color: var(--blue-4);
		position: relative;

		i {
			font-size: 22px;
			line-height: 1;
		}

		&:hover {
			border-color: #c7ceda;
			box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
		}

		&--accent {
			border-color: var(--blue-4);
			color: var(--blue-4);

			&:hover {
				border-color: var(--blue-4);
			}

			@include devices(md) {
				display: none;
			}
		}
	}

	// ★ Cart button specific ────────────────────────────────
	&__cartBtn {
		// always visible
	}

	&__cartBadge {
		position: absolute;
		top: -7px;
		right: -7px;
		min-width: 20px;
		height: 20px;
		padding: 0 5px;
		border-radius: 999px;
		background: #ef4444;
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid #fff;
		line-height: 1;
		pointer-events: none;
		box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
	}
}

// ── Nav ────────────────────────────────────────────────────
.hNav {
	width: 100%;

	&__list {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;

		@include devices(xl) {
			display: none;
		}
	}

	&__link {
		font-size: 16px;
		font-weight: 500;
		color: #0f172a;
		text-decoration: none;
		padding: 10px 0;
		position: relative;
		transition: 0.2s ease;

		&:hover {
			color: rgba(20, 63, 150, 0.92);
		}

		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 4px;
			width: 100%;
			height: 2px;
			background: rgba(20, 63, 150, 0.92);
			transform: scaleX(0);
			transform-origin: left;
			transition: 0.4s ease;
		}

		&:hover::after {
			transform: scaleX(1);
		}
	}
}

// ── Search ─────────────────────────────────────────────────
.hSearch {
	width: 100%;
	display: flex;
	justify-content: center;

	&__field {
		width: min(720px, 100%);
		height: 52px;
		border-radius: 999px;
		border: 1px solid var(--blue-4);
		background: #fff;
		display: flex;
		align-items: center;
		padding: 0 10px 0 18px;
		gap: 10px;
		box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
	}

	&__input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-size: 16px;
		color: #0f172a;
		min-width: 0;
	}

	&__btn {
		width: 42px;
		height: 42px;
		border-radius: 999px;
		border: 1px solid #dfe3e7;
		background: #f4f6f8;
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: 0.2s ease;
		color: var(--blue-4);

		i {
			font-size: 20px;
		}

		&:hover {
			background: #c6d4e1;
			transform: translateY(-1px);
		}
	}
}

// ── Lang ───────────────────────────────────────────────────
.hLang {
	height: 46px;
	border-radius: 14px;
	border: 1px solid var(--blue-4);
	background: #fff;
	padding: 0 12px;
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	transition: 0.2s ease;

	@include devices(sm) {
		display: none;
	}

	&:hover {
		box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
	}

	&__flag {
		width: 22px;
		height: 16px;
		border-radius: 4px;
		object-fit: cover;
	}

	&__text {
		font-size: 14px;
		font-weight: 600;
		color: #0f172a;
		white-space: nowrap;
		text-transform: uppercase;
	}

	&__chev {
		font-size: 18px;
		color: var(--blue-4);
		opacity: 0.7;
	}
}

// ── Transitions ────────────────────────────────────────────
.h-fade-enter-active,
.h-fade-leave-active {
	transition:
		opacity 0.18s ease,
		transform 0.18s ease;
}
.h-fade-enter-from,
.h-fade-leave-to {
	opacity: 0;
	transform: translateY(6px);
}
</style>
