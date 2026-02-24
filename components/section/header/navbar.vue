<!-- components/SectionHeaderNavbar.vue -->
<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
const emits = defineEmits("apply");
const { list: menu } = useMenu();
const { list: social } = useSocial();
const { list: setting } = useSetting();

const localePath = useLocalePath();
const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const open = ref(false);

/* close on route change */
watch(
	() => route.path,
	() => {
		toClose();
	},
);

/* expose open/close to parent */
function toOpen() {
	if (open.value) return;
	open.value = true;
	document?.body?.classList?.add?.("no-scroll");
}
function toClose() {
	if (!open.value) return;
	open.value = false;
	document?.body?.classList?.remove?.("no-scroll");
}
defineExpose({ toOpen, toClose });

/* mobile search */
const searchQuery = ref("");
const handleSearch = () => {
	const q = searchQuery.value.trim();
	if (!q) return;
	router.push(localePath(`/search?word=${encodeURIComponent(q)}`));
	toClose();
};

/* keyboard ESC to close */
function onKeydown(e) {
	if (e.key === "Escape" && open.value) toClose();
}
onMounted(() => {
	document.addEventListener("keydown", onKeydown);
});
onBeforeUnmount(() => {
	document.removeEventListener("keydown", onKeydown);
});
function bookingFn() {
	toClose();
	emits("apply");
}
</script>

<template>
	<div
		class="menu"
		:class="{ active: open }"
		role="dialog"
		aria-modal="true"
		:aria-hidden="!open"
		@click.self="toClose"
	>
		<div class="menu-top">
			<div class="container menu-top__wrapper">
				<div class="menu-top__left">
					<!-- language (left) -->
					<SectionHeaderLang>
						<template #="{ locale: loc, locales }">
							<button class="menu-lang" aria-label="Language">
								<img
									class="menu-lang__flag"
									:src="`/flag/${loc}.png`"
									:alt="loc"
								/>
								<span class="menu-lang__text">{{
									locales.find((l) => l.code === loc)?.code || loc
								}}</span>
								<Icon class="menu-lang__icon" name="angle-bottom" />
							</button>
						</template>
					</SectionHeaderLang>
				</div>

				<div class="menu-top__center"></div>

				<div class="menu-top__right">
					<!-- close button -->
					<button
						class="menu-close"
						@click="toClose"
						aria-label="Close menu"
					>
						<Icon name="close" />
					</button>
				</div>
			</div>
		</div>

		<div class="menu-container container">
			<div class="menu-mobile">
				<!-- menu-search parent reacts to :focus-within -->
				<div
					class="menu-search"
					:class="{ 'is-visible': open }"
					aria-hidden="false"
				>
					<input
						v-model="searchQuery"
						class="menu-search__input"
						type="text"
						:placeholder="$t('search')"
						@keyup.enter="handleSearch"
						aria-label="Search"
					/>
					<button
						class="menu-search__btn"
						@click="handleSearch"
						aria-label="Search"
					>
						<Icon name="search" />
					</button>
				</div>

				<Btn class="menu-booking" @click="bookingFn">
					{{ $t("booking") }}
				</Btn>
			</div>

			<ul class="menu-menu" role="menu">
				<li
					class="menu-menu__item"
					v-for="(item, idx) in [
						{ to: '/news', title: setting?.news?.[locale] },
						{ to: '/doctor', title: setting?.doctor?.[locale] },
						{ to: '/department', title: setting?.service?.[locale] },
						{ to: '/contact', title: setting?.contact?.[locale] },
					]"
					:key="idx"
				>
					<NuxtLink
						class="menu-menu__link"
						:to="localePath(item.to)"
						role="menuitem"
						@click="toClose"
						>{{ item.title }}</NuxtLink
					>
				</li>
			</ul>

			<ul class="menu-contact">
				<li class="menu-contact__item phones">
					<div class="menu-contact__item address">
						<span class="menu-contact__label">{{ $t("phone1") }}</span>
						<a
							class="menu-contact__value"
							:href="`tel:${(setting?.phone?.[locale] || '').replace(/\s/g, '')}`"
						>
							{{ setting?.phone?.[locale] }}
						</a>
					</div>
					<div class="menu-contact__item address">
						<span class="menu-contact__label">{{ $t("phone2") }}</span>
						<a
							class="menu-contact__value"
							:href="`tel:${(setting?.phone2?.[locale] || '').replace(/\s/g, '')}`"
						>
							{{ setting?.phone2?.[locale] }}
						</a>
					</div>
				</li>

				<li class="menu-contact__item address">
					<span class="menu-contact__label">{{ $t("address") }}</span>
					<a class="menu-contact__value">{{
						setting?.address?.[locale]
					}}</a>
				</li>

				<li class="menu-contact__item worktime">
					<span class="menu-contact__label">{{ $t("workTime") }}</span>
					<a class="menu-contact__value">{{
						setting?.workTime?.[locale]
					}}</a>
				</li>
			</ul>
		</div>

		<!-- decorative blurred background image -->
		<div class="menu-bg" aria-hidden="true"></div>

		<!-- decorative lines -->
		<div class="menu-lines" aria-hidden="true">
			<span></span><span></span><span></span><span></span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

/* ensure popper/dropdown appears above menu */
:global(.v-popper__popper),
:global(.header-lang__dropdown),
:global(.vs__dropdown-menu),
:global(.vue-select-dropdown),
:global(.ant-dropdown),
:global(.v-select__dropdown) {
	z-index: 999999 !important;
}

/* body lock */
:global(body.no-scroll) {
	overflow: hidden;
}

/* main menu wrapper */
.menu {
	position: fixed;
	inset: 0;
	z-index: 13000;
	display: flex;
	flex-direction: column;
	background: rgba(255, 255, 255, 0.92);
	backdrop-filter: blur(10px);
	overflow: hidden;
	padding: 14px 20px;
	visibility: hidden;
	opacity: 0;
	transform: translateY(-6%);
	transition:
		opacity 360ms cubic-bezier(0.22, 0.9, 0.39, 1),
		transform 420ms cubic-bezier(0.22, 0.9, 0.39, 1),
		visibility 0s linear 420ms;
}

/* open state */
.menu.active {
	visibility: visible;
	opacity: 1;
	transform: translateY(0);
	transition-delay: 0s;
}

/* subtle bg image kept */
.menu-bg {
	position: absolute;
	inset: 0;
	z-index: 0;
	background-image: url("/images/menu-bg.jpg");
	background-size: cover;
	background-position: center;
	opacity: 0.06;
	pointer-events: none;
	transition: opacity 360ms ease;
}
.menu.active .menu-bg {
	opacity: 0.12;
}

/* top row */
.menu-top {
	z-index: 3;
	margin-bottom: 12px;
}
.container.menu-top__wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: var(--height-header-part);
	padding: 0;
}

/* language button (left) */
.menu-top__left {
	display: flex;
	align-items: center;
	gap: 8px;
	z-index: 4;
}
.menu-lang {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	background: #fff;
	border: 1px solid #173a8a;
	padding: 14px 12px;
	border-radius: 10px;
	font-weight: 600;
	color: rgba(8, 18, 58, 0.95);
	transition:
		transform 150ms ease,
		box-shadow 150ms ease;
	position: relative;
}
.menu-lang:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 30px rgba(8, 18, 58, 0.06);
}
.menu-lang__flag {
	width: 22px;
	border-radius: 4px;
	display: block;
}
.menu-lang__text {
	font-size: 13px;
	font-weight: 700;
	text-transform: uppercase;
}
.menu-lang__icon {
	--icon-size: 16px;
	opacity: 0.9;
}

/* close button (right) */
.menu-top__right {
	display: flex;
	align-items: center;
	gap: 8px;
	z-index: 4;
}
.menu-close {
	height: 44px;
	width: 44px;
	border-radius: 10px;
	border: 1px solid #173a8a;
	background: #fff;
	display: grid;
	place-items: center;
	cursor: pointer;
	transition:
		transform 150ms ease,
		box-shadow 150ms ease;
}
.menu-close:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 30px rgba(8, 18, 58, 0.06);
}
.menu-close svg {
	width: 22px;
	height: 22px;
	fill: #173a8a;
}

/* content container */
.menu-container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	z-index: 3;
   height: 100%;
	position: relative;
}

/* SEARCH block: slides from right -> left when menu opens */
.menu-mobile {
	display: block;
}
.menu-search {
	width: min(720px, 100%);
	display: none;
	align-items: center;
	gap: 12px;
	background: #fff;
	border-radius: 999px;
	padding: 12px;
	border: 1px solid rgba(15, 23, 42, 0.06);
	box-shadow: 0 18px 40px rgba(8, 18, 58, 0.06);
	position: relative;
	overflow: visible;
	transform: translateX(30%);
	opacity: 0;
	transition:
		transform 520ms cubic-bezier(0.22, 0.9, 0.39, 1),
		opacity 420ms ease,
		background-color 280ms ease,
		border-color 280ms ease;
	z-index: 3;
	@include devices(sm) {
		display: flex;
	}
}

/* menu open brings it in */
.menu.active .menu-search {
	transform: translateX(0);
	opacity: 1;
}

/* when input or children focused, change parent bg and border (focus-within) */
.menu-search:focus-within,
.menu-search.is-visible:focus-within,
.menu-search:has(input:focus) {
	background-color: rgba(23, 58, 138, 0.06);
	border-color: rgba(23, 58, 138, 0.18);
	box-shadow: 0 20px 48px rgba(23, 58, 138, 0.06);
}

/* input */
.menu-search__input {
	flex: 1;
	border: none;
	outline: none;
	background: transparent;
	font-size: 16px;
	color: rgba(8, 18, 58, 0.95);
	padding: 6px 12px;
	border-radius: 999px;
	transition:
		transform 220ms ease,
		color 200ms ease;
}

/* button: default */
.menu-search__btn {
	width: 48px;
	height: 48px;
	border-radius: 999px;
	border: none;
	display: grid;
	place-items: center;
	cursor: pointer;
	background: #fff;
	box-shadow: 0 6px 18px rgba(8, 18, 58, 0.06);
	transition:
		transform 260ms cubic-bezier(0.22, 0.9, 0.39, 1),
		box-shadow 160ms ease;
}

/* button movement opposite to input: when input focused, move left (o'ngdan chapga) */
.menu-search:focus-within .menu-search__btn,
.menu-search:has(input:focus) .menu-search__btn {
	transform: translateX(-10px) scale(1.02);
	box-shadow: 0 14px 36px rgba(23, 58, 138, 0.08);
}

/* subtle hover */
.menu-search__btn:hover {
	transform: translateY(-3px);
}

/* booking button inside menu (below input) kept as Btn element; style to animate in opposite direction (right->left) */
.menu-booking {
	width: 100% !important;
	margin-top: 10px;
	display: none;
	padding: 10px 16px;
	height: 56px;
	border-radius: 24px;
	background: #173a8a;
	color: #fff;
	font-weight: 700;
	width: fit-content;
	box-shadow: 0 10px 26px rgba(23, 58, 138, 0.12);
	transform: translateX(18px);
	opacity: 0;
	transition:
		transform 520ms cubic-bezier(0.22, 0.9, 0.39, 1),
		opacity 420ms ease;
	@include devices(sm) {
		display: flex;
	}
}

/* when menu open, animate booking into place after input */
.menu.active .menu-booking {
	transform: translateX(0);
	opacity: 1;
	transition-delay: 0.28s;
}

/* menu links (no gradient, plain blue), staggered vertical reveal */
.menu-menu {
	display: grid;
	grid-template-columns: 1fr;
	gap: 18px;
	margin-top: 6px;
}
.menu-menu__item {
	list-style: none;
}
.menu-menu__link {
	display: inline-block;
	font-weight: 700;
	font-size: clamp(20px, 4.2vw, 34px);
	color: #173a8a;
	text-decoration: none;
	transform: translateY(18px);
	opacity: 0;
	transition:
		transform 420ms cubic-bezier(0.22, 0.9, 0.39, 1),
		opacity 420ms cubic-bezier(0.22, 0.9, 0.39, 1);
	z-index: 3;
}

/* links appear with stagger */
.menu.active .menu-menu__item:nth-child(1) .menu-menu__link {
	transform: translateY(0);
	opacity: 1;
	transition-delay: 0.34s;
}
.menu.active .menu-menu__item:nth-child(2) .menu-menu__link {
	transform: translateY(0);
	opacity: 1;
	transition-delay: 0.4s;
}
.menu.active .menu-menu__item:nth-child(3) .menu-menu__link {
	transform: translateY(0);
	opacity: 1;
	transition-delay: 0.46s;
}
.menu.active .menu-menu__item:nth-child(4) .menu-menu__link {
	transform: translateY(0);
	opacity: 1;
	transition-delay: 0.52s;
}

/* contact block & address animations (phones side-by-side) */
.menu-contact {
	display: grid;
	gap: 18px;
	grid-template-columns: 1fr;
	margin-top: 12px;
	z-index: 3;
}
.menu-contact__item {
	display: flex;
	flex-direction: column;
	opacity: 0;
	transform: translateY(18px);
	transition:
		transform 420ms cubic-bezier(0.22, 0.9, 0.39, 1),
		opacity 360ms ease;
}

/* phones row */
.menu-contact .phones {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
	align-items: start;
}
.menu-contact__label {
	font-size: 22px;
	color: rgba(8, 18, 58, 0.7);
	margin-bottom: 6px;
	@include devices(sm) {
		font-size: 14px;
	}
}
.menu-contact__value {
	font-size: 22px;

	font-weight: 700;
	color: rgba(8, 18, 58, 0.95);
	@include devices(sm) {
		font-size: 14px;
	}
}

/* staggered reveal for contact items when menu active */
.menu.active .menu-contact__item.phones {
	transform: translateY(0);
	opacity: 1;
	transition-delay: 0.64s;
}
.menu.active .menu-contact__item.address {
	transform: translateY(0);
	opacity: 1;
	transition-delay: 0.76s;
}
.menu.active .menu-contact__item.worktime {
	transform: translateY(0);
	opacity: 1;
	transition-delay: 0.88s;
}

/* decorative lines behind content */
.menu-lines {
	position: absolute;
	left: 50%;
	top: 0;
	transform: translateX(-50%);
	width: 100%;
	height: 100%;
	z-index: 0;
	display: flex;
	opacity: 0.06;
	pointer-events: none;
}
.menu-lines span {
	flex: 1;
	border-left: 1px solid rgba(8, 18, 58, 0.03);
}

/* before/after plus signs kept inside menu-container — use container pseudo elements */
.menu-container::before {
	content: "+";
	position: absolute;
	font-size: 300px;
	color: var(--red-1, #b71c1c);
	opacity: 0.03;
	top: 50%;
	left: 15%;
	transform: translateY(-50%);
	font-weight: 300;
	line-height: 1;
	z-index: 0;
	animation: rotate 20s linear infinite;
}
.menu-container::after {
	content: "+";
	position: absolute;
	font-size: 200px;
	color: var(--red-1, #b71c1c);
	opacity: 0.04;
	top: 20%;
	right: 10%;
	font-weight: 300;
	line-height: 1;
	z-index: 0;
	animation: rotate 15s linear infinite reverse;
}

/* responsive tweaks */
@include devices(sm) {
	.menu {
		padding: 10px 12px;
	}
	.menu-search {
		padding: 8px;
	}
	.menu-menu__link {
		font-size: 20px;
	}
	.menu-lang__text {
		font-size: 12px;
	}
}

/* helper animations */
@keyframes rotate {
	from {
		transform: translateY(-50%) rotate(0deg);
	}
	to {
		transform: translateY(-50%) rotate(360deg);
	}
}
</style>
