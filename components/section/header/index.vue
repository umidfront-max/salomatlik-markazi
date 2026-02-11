<script setup>
const { list: social } = useSocial();
const { list: menu } = useMenu();

const { data: setting } = await useAsyncData("settings", () =>
	$api("settings"),
);

const localePath = useLocalePath();
const router = useRouter();

const applyRef = ref();
const navbarRef = ref();

const searchQuery = ref("");
const searchOpen = ref(false);
const searchInputRef = ref(null);

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

const normalizeLink = (value, type) => {
	if (!value) return "#";
	const v = String(value).trim();

	// allaqachon url bo‘lsa
	if (/^https?:\/\//i.test(v)) return v;

	// telegram uchun @username bo‘lsa
	if (type === "telegram") {
		const username = v.replace(/^@/, "");
		// t.me link
		if (/^t\.me\//i.test(username)) return `https://${username}`;
		return `https://t.me/${username}`;
	}

	// qolganlari uchun domain yozib qo‘yilgan bo‘lsa
	// masalan: instagram.com/xxx
	if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(v)) return `https://${v}`;

	return v; // fallback
};
</script>

<template>
	<header class="h">
		<div class="container h__row">
			<!-- LEFT: burger + logo -->
			<div class="h__left">
				<NuxtLink :to="localePath('/')" class="h__brand">
					<img class="h__logo" src="/logo.jpg" alt="Logo" />
					<span class="h__brandText"
						>Salomatlik <br />
						maskani</span
					>
				</NuxtLink>
				<div class="hContact">
					<a
						class="hPhone"
						:href="`tel:${(setting?.phone || '').replace(/\s/g, '')}`"
					>
						<i class="ri-phone-line"></i>
						<span class="hPhone__text">{{ setting?.phone }}</span>
					</a>
					<div class="hSocial" v-if="setting">
						<a
							v-if="setting?.telegram"
							class="hSocial__item"
							:href="normalizeLink(setting.telegram, 'telegram')"
							target="_blank"
							rel="noopener"
							aria-label="Telegram"
							title="Telegram"
						>
							<i class="ri-telegram-line"></i>
						</a>

						<a
							v-if="setting?.instagram"
							class="hSocial__item"
							:href="normalizeLink(setting.instagram, 'instagram')"
							target="_blank"
							rel="noopener"
							aria-label="Instagram"
							title="Instagram"
						>
							<i class="ri-instagram-line"></i>
						</a>

						<a
							v-if="setting?.facebook"
							class="hSocial__item"
							:href="normalizeLink(setting.facebook, 'facebook')"
							target="_blank"
							rel="noopener"
							aria-label="Facebook"
							title="Facebook"
						>
							<i class="ri-facebook-fill"></i>
						</a>

						<a
							v-if="setting?.youtube"
							class="hSocial__item hSocial__item--yt"
							:href="normalizeLink(setting.youtube, 'youtube')"
							target="_blank"
							rel="noopener"
							aria-label="YouTube"
							title="YouTube"
						>
							<i class="ri-youtube-fill"></i>
						</a>
					</div>
				</div>
			</div>

			<!-- CENTER: nav OR search (like image #2) -->
			<div class="h__center">
				<Transition name="h-fade" mode="out-in">
					<!-- SEARCH BAR (open) -->
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

					<!-- MENU (closed) -->
					<nav v-else class="hNav" key="nav">
						<ul class="hNav__list">
							<!-- <li
								class="hNav__item"
								v-for="(value, key) in setting"
								:key="key"
							>
								<NuxtLink class="hNav__link" :to="localePath(key)">
									{{ value }}
								</NuxtLink>
							</li>	 -->
							<li class="hNav__item">
								<NuxtLink class="hNav__link" :to="localePath('/news')">
									{{ setting.news }}
								</NuxtLink>
							</li>
							<li class="hNav__item">
								<NuxtLink
									class="hNav__link"
									:to="localePath('/doctor')"
								>
									{{ setting.doctor }}
								</NuxtLink>
							</li>
							<li class="hNav__item">
								<NuxtLink
									class="hNav__link"
									:to="localePath('/service')"
								>
									{{ setting.service }}
								</NuxtLink>
							</li>
						</ul>
					</nav>
				</Transition>
			</div>

			<!-- RIGHT: phone + booking + search icon + lang -->
			<div class="h__right">
				<Btn
					class="h__cta"
					variant="primary"
					:data-text="$t('booking')"
					@click="applyRef?.toOpen()"
				>
					{{ $t("booking") }}
				</Btn>

				<button
					class="h__iconBtn h__iconBtn--accent"
					@click="toggleSearch"
					:aria-label="searchOpen ? 'Close search' : 'Open search'"
				>
					<i :class="searchOpen ? 'ri-close-line' : 'ri-search-line'"></i>
				</button>

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
				<button
					class="h__iconBtn"
					@click="navbarRef?.toOpen()"
					aria-label="Menu"
				>
					<i class="ri-menu-line"></i>
				</button>
			</div>
		</div>
	</header>

	<SectionHeaderApply ref="applyRef" />
	<SectionHeaderNavbar ref="navbarRef" />
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.h {
	position: sticky;
	top: 0;
	z-index: 50;
	background: #fff;
	border-bottom: 1px solid #ededed;
	.hContact {
		// display: flex;
		// align-items: center;

		gap: 12px;

		@include devices(md) {
			gap: 10px;
		}
	}

	.hSocial {
		display: flex;
		align-items: center;
		gap: 8px;
		// padding-right: 12px;
		// margin-right: 12px;
		// border-right: 1px solid #e7eaf0;

		@include devices(md) {
			padding-right: 10px;
			margin-right: 10px;
		}

		@include devices(sm) {
			display: none; // xohlasang olib tashla
		}

		&__item {
			width: 32px;
			height: 32px;
			border-radius: 14px;
			border: 1px solid #d8dde6;
			background: #fff;
			display: grid;
			place-items: center;
			text-decoration: none;
			color: var(--blue-4);
			transition: 0.2s ease;
			box-shadow: 0 10px 22px rgba(15, 23, 42, 0.04);

			i {
				font-size: 20px;
				line-height: 1;
				opacity: 0.9;
			}

			&:hover {
				box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
				border-color: rgba(220, 38, 38, 0.35);
				color: white;
				background: var(--blue-4);
			}

			&:active {
				transform: translateY(0px);
			}

			&--yt:hover {
				border-color: rgba(220, 38, 38, 0.45);
			}
		}
	}

	&__row {
		height: 88px; // 1-rasmga yaqin
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
	}

	&__brandText {
		font-size: 20px;
		font-weight: 700;
		line-height: 1.3;
		text-transform: uppercase;
		color: #0f172a;
		white-space: nowrap;
		color: rgba(20, 63, 150, 0.92);
		@include devices(sm) {
			display: none;
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
		@include devices(sm) {
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
		}
	}
}

.hNav {
	width: 100%;

	&__list {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		margin: 0;
		padding: 0;
		list-style: none;

		@include devices(xl) {
			display: none;
		}
	}

	&__link {
		font-size: 16px;
		font-weight: 600;
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
			transition: 0.2s ease;
		}

		&:hover::after {
			transform: scaleX(1);
		}
	}
}

/* 2-rasm: search ochilganda o‘rtada uzun input */
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

.hPhone {
	display: flex;
	align-items: center;
	gap: 8px;
	text-decoration: none;
	color: rgba(20, 63, 150, 0.92);
	font-weight: 700;

	i {
		font-size: 20px;
		color: rgba(20, 63, 150, 0.92);
		opacity: 0.9;
	}

	&__text {
		white-space: nowrap;
		font-size: 16px;
		@include devices(md) {
			display: none;
		}
	}
}

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

		@include devices(sm) {
			display: none;
		}
	}

	&__chev {
		font-size: 18px;
		color: var(--blue-4);;
		opacity: 0.7;
	}
}

/* transition (nav <-> search) */
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
