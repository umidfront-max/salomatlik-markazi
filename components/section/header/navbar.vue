<!-- navbar.vue (SectionHeaderNavbar) FULL -->
<script setup>
const { list: menu } = useMenu();
const { list: social } = useSocial();
const { list: setting } = useSetting();

const localePath = useLocalePath();
const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const open = ref(false);

watch(
	() => route.path,
	() => {
		toClose();
	},
);

function toOpen() {
	open.value = true;
	document?.body?.classList?.add?.("no-scroll");
}
function toClose() {
	open.value = false;
	document?.body?.classList?.remove?.("no-scroll");
}

defineExpose({ toOpen, toClose });

/* ✅ mobile search */
const searchQuery = ref("");
const handleSearch = () => {
	const q = searchQuery.value.trim();
	if (!q) return;
	router.push(localePath(`/search?word=${encodeURIComponent(q)}`));
	toClose();
};
</script>

<template>
	<div class="menu" :class="{ active: open }">
		<div class="menu-top">
			<div class="container menu-top__wrapper">
				<button class="menu-close" @click="toClose">
					<Icon name="close" />
				</button>

				<div class="menu-top__right">
					<SectionHeaderLang>
						<template #="{ locale, locales }">
							<button class="menu-lang" aria-label="Language">
								<img
									class="menu-lang__flag"
									:src="`/flag/${locale}.png`"
									:alt="locale"
								/>
								<span class="menu-lang__text">
									{{
										locales.find((l) => l.code === locale)?.code ||
										locale
									}}
								</span>
								<Icon class="menu-lang__icon" name="angle-bottom" />
							</button>
						</template>
					</SectionHeaderLang>
				</div>
			</div>
		</div>

		<div class="menu-container container">
			<!-- ✅ MOBILE EXTRA: Search + Booking + Phone -->
			<div class="menu-mobile">
				<div class="menu-search">
					<input
						v-model="searchQuery"
						class="menu-search__input"
						type="text"
						:placeholder="$t('search')"
						@keyup.enter="handleSearch"
					/>
					<button
						class="menu-search__btn"
						@click="handleSearch"
						aria-label="Search"
					>
						<Icon name="search" />
					</button>
				</div>

				<NuxtLink
					class="menu-booking"
					:to="localePath('/contact')"
					@click="toClose"
				>
					{{ $t("booking") }}
				</NuxtLink>

				<a
					v-if="setting?.phone?.[locale]"
					class="menu-phone"
					:href="`tel:${(setting?.phone?.[locale] || '').replace(/\s/g, '')}`"
				>
					{{ setting?.phone?.[locale] }}
				</a>
			</div>

			<!-- <ul class="menu-menu">
				<li class="menu-menu__item" v-for="item in menu" :key="item.id">
					<NuxtLink
						class="menu-menu__link"
						:to="localePath(`/service/${item.id}`)"
					>
						{{ item.title }}
					</NuxtLink>
				</li>
			</ul> -->

			<ul class="menu-menu">
				<li class="menu-menu__item">
					<NuxtLink
						class="menu-menu__link"
						:to="localePath('/news')"
						@click="toClose"
					>
						{{ setting?.news?.[locale] }}
					</NuxtLink>
				</li>
				<li class="menu-menu__item">
					<NuxtLink
						class="menu-menu__link"
						:to="localePath('/doctor')"
						@click="toClose"
					>
						{{ setting?.doctor?.[locale] }}
					</NuxtLink>
				</li>
				<li class="menu-menu__item">
					<NuxtLink
						class="menu-menu__link"
						:to="localePath('/service')"
						@click="toClose"
					>
						{{ setting?.service?.[locale] }}
					</NuxtLink>
				</li>
				<li class="menu-menu__item">
					<NuxtLink
						class="menu-menu__link"
						:to="localePath('/contact')"
						@click="toClose"
					>
						{{ setting?.contact?.[locale] }}
					</NuxtLink>
				</li>
			</ul>

			<!-- ✅ Contact: desktopda 4 col, mobile’da 1 col ko‘rinadi -->
			<ul class="menu-contact">
				<li class="menu-contact__item">
					<span class="menu-contact__label">{{ $t("phone1") }}</span>
					<a
						class="menu-contact__value"
						:href="`tel:${(setting?.phone?.[locale] || '').replace(/\s/g, '')}`"
					>
						{{ setting?.phone?.[locale] }}
					</a>
				</li>

				<li class="menu-contact__item">
					<span class="menu-contact__label">{{ $t("phone2") }}</span>
					<a
						class="menu-contact__value"
						:href="`tel:${(setting?.phone2?.[locale] || '').replace(/\s/g, '')}`"
					>
						{{ setting?.phone2?.[locale] }}
					</a>
				</li>

				<li class="menu-contact__item">
					<span class="menu-contact__label">{{ $t("address") }}</span>
					<a class="menu-contact__value">
						{{ setting?.address?.[locale] }}
					</a>
				</li>

				<li class="menu-contact__item">
					<span class="menu-contact__label">{{ $t("workTime") }}</span>
					<a class="menu-contact__value">
						{{ setting?.workTime?.[locale] }}
					</a>
				</li>
			</ul>

			<div class="menu-social">
				<a
					class="menu-social__icon"
					target="_blank"
					:href="item.site_url"
					v-for="item in social"
					:key="item.id"
				>
					<Icon :name="item.icon" />
				</a>
			</div>
		</div>

		<div class="menu-lines">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
:global(.v-popper__popper) {
	z-index: 10000020 !important;
}
:global(.header-lang__dropdown) {
	z-index: 10000020 !important;
	position: relative;
}

/* ✅ body scroll lock */
:global(body.no-scroll) {
	overflow: hidden;
}

.menu {
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(20px);
	position: fixed;
	left: 0;
	top: 0;
	z-index: 99;
	overflow: visible;
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	transform: translateY(-100%);
	opacity: 0;
	transition:
		transform 0.3s ease-in-out,
		opacity 0.2s ease-in-out;
	overflow: hidden;
	padding-bottom: 80px;

	@include devices(md) {
		padding-bottom: 24px;
	}

	&::before {
		content: "";
		position: absolute;
		top: -100px;
		right: -100px;
		width: 400px;
		height: 400px;
		background: var(--red-3);
		opacity: 0.3;
		border-radius: 50%;
		z-index: 0;
		animation: pulse 8s ease-in-out infinite;
	}

	&::after {
		content: "";
		position: absolute;
		bottom: -150px;
		left: -150px;
		width: 500px;
		height: 500px;
		background: var(--red-3);
		opacity: 0.2;
		border-radius: 50%;
		z-index: 0;
		animation: pulse 10s ease-in-out infinite;
		animation-delay: 1s;
	}

	&-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: flex-start;
		flex: 1;
		position: relative;
		z-index: 1;

		&::before {
			content: "+";
			position: absolute;
			font-size: 300px;
			color: var(--red-1);
			opacity: 0.03;
			top: 50%;
			left: 15%;
			transform: translateY(-50%);
			font-weight: 300;
			line-height: 1;
			z-index: 0;
			animation: rotate 20s linear infinite;
		}

		&::after {
			content: "+";
			position: absolute;
			font-size: 200px;
			color: var(--red-1);
			opacity: 0.04;
			top: 20%;
			right: 10%;
			font-weight: 300;
			line-height: 1;
			z-index: 0;
			animation: rotate 15s linear infinite reverse;
		}

		@include devices(md) {
			height: 0px;
		}
	}

	&.active {
		opacity: 1;
		transform: translateY(0);
	}

	&-top {
		width: 100%;
		position: relative;
		z-index: 2;
		margin-bottom: 40px;
		overflow: visible;
		@include devices(md) {
			margin-bottom: 18px;
		}

		&__wrapper {
			height: var(--height-header-part);
			display: flex;
			overflow: visible;
			align-items: center;
			justify-content: space-between;
		}

		&__right {
			display: none;
			position: relative;
			z-index: 10000010;
			@include devices(md) {
				display: flex;
				align-items: center;
				gap: 12px;
			}
		}
	}

	&-close {
		height: 44px;
		width: 44px;
		border-radius: 12px;
		border: 1px solid #d3d3d3;
		padding: 0;
		outline: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		background-color: transparent;

		.icon {
			--icon-size: 22px;
			--icon-color: rgba(var(--black), 0.7);
			transition: color 0.2s ease-in-out;
		}

		&:hover {
			border-color: var(--red-1);
			background-color: var(--red-3);

			.icon {
				--icon-color: var(--red-1);
			}
		}
	}

	&-social {
		display: none;

		@include devices(md) {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 16px;
			position: relative;
			z-index: 1;
			margin-top: auto;
		}

		&__icon {
			position: relative;
			background: linear-gradient(135deg, var(--red-1) 0%, #b71c1c 100%);
			--icon-color: var(--white-1);
			width: 52px;
			height: 52px;
			display: flex;
			justify-content: center;
			align-items: center;
			border: none;
			border-radius: 50%;
			transition: all 0.3s ease-in-out;
			box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);

			.icon {
				--icon-size: 22px;
			}

			&:hover {
				background: linear-gradient(135deg, #b71c1c 0%, var(--red-1) 100%);
				transform: translateY(-4px);
				box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
			}
		}
	}

	&-lang {
		min-height: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		background-color: transparent;
		padding: 0 16px;
		border-radius: 12px;
		font-size: 14px;
		font-weight: 500;
		color: var(--black-1);
		cursor: pointer;
		transition: all 0.2s ease-in-out;

		&:hover {
			border-color: var(--red-1);
			color: var(--red-1);
			background-color: rgba(220, 38, 38, 0.05);
		}

		&__flag {
			min-width: 24px;
			width: 24px;
			height: auto;
			border-radius: 4px;
		}

		&__text {
			line-height: 1;
			white-space: nowrap;
			text-transform: uppercase;
		}

		&__icon {
			--icon-size: 16px;
			--icon-color: currentColor;
			transition: transform 0.2s ease-in-out;
		}
	}

	&-menu {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-60) var(--space-40);
		align-content: flex-start;
		flex: 1;
		position: relative;
		z-index: 1;

		@include devices(md) {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		&__item {
			display: flex;

			@include devices(md) {
				width: 100%;
			}
		}

		&__link {
			@include text(40, var(--black-1), 400, normal);
			transition: color 0.3s ease-in-out;

			@include devices(md) {
				font-size: 20px;
			}

			&:hover {
				color: var(--red-1);
			}
		}
	}

	&-lines {
		height: 100%;
		width: 100%;
		max-width: var(--width-container);
		display: flex;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 0;
		z-index: -1;

		@include devices(md) {
			display: none;
		}

		span {
			width: 25%;
			border-left: 1px solid rgba(var(--primary), 0.1);
		}
	}

	&-contact {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(4, 1fr);
		margin-top: auto;
		position: relative;
		z-index: 1;

		/* ✅ oldin md’da display:none edi — endi ko‘rinadi */
		@include devices(md) {
			grid-template-columns: 1fr;
			gap: 14px;
			margin-top: 18px;
		}

		&__item {
			display: flex;
			flex-direction: column;
		}

		&__label {
			@include text(16, var(--black-1), 400, normal);
			margin-bottom: 4px;
			display: block;
		}

		&__value {
			@include text(22, var(--primary-1), 700, normal);
			display: block;
			transition: color 0.3s ease-in-out;
			cursor: pointer;

			@include devices(md) {
				font-size: 18px;
			}

			&:hover {
				color: var(--red-1);
			}
		}
	}
}

/* ✅ MOBILE block */
.menu-mobile {
	display: none;

	@include devices(md) {
		display: grid;
		gap: 14px;
		margin-bottom: 22px;
		position: relative;
		z-index: 2;
	}
}

.menu-search {
	display: none;

	@include devices(md) {
		display: flex;
		align-items: center;
		gap: 10px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 14px;
		padding: 10px 12px;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
	}

	&__input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-size: 16px;
		min-width: 0;
	}

	&__btn {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		border: 1px solid rgba(0, 0, 0, 0.12);
		background: transparent;
		display: grid;
		place-items: center;
		cursor: pointer;
	}
}

.menu-booking {
	display: none;

	@include devices(md) {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 46px;
		border-radius: 14px;
		text-decoration: none;
		color: var(--white-1);
		background: linear-gradient(135deg, var(--red-1) 0%, #b71c1c 100%);
		font-weight: 600;
		box-shadow: 0 10px 22px rgba(220, 38, 38, 0.25);
	}
}

.menu-phone {
	display: none;

	@include devices(md) {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 46px;
		border-radius: 14px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		text-decoration: none;
		color: var(--primary-1);
		font-weight: 700;
		background: rgba(255, 255, 255, 0.85);
	}
}

@keyframes rotate {
	from {
		transform: translateY(-50%) rotate(0deg);
	}
	to {
		transform: translateY(-50%) rotate(360deg);
	}
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
		opacity: 0.3;
	}
	50% {
		transform: scale(1.2);
		opacity: 0.15;
	}
}
</style>
