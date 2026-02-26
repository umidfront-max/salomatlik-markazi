<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
const { list: setting } = useSetting();
const { locale } = useI18n();

type Banner = {
	id: string;
	title?: Record<string, string>;
	description?: Record<string, string>;
	image?: string | null;
	imageMobile?: string | null;
	buttonText?: Record<string, string>;
	linkUrl?: string | null;
	linkTarget?: string | null;
	overlayOpacity?: string | number | null;
	isActive?: boolean;
};

const props = defineProps<{
	items: Banner[];
	lang: "uz" | "ru" | "en" | string;
}>();

const items = computed(() => props.items || []);

function pickLang(obj?: Record<string, string>, fallback = "") {
	if (!obj) return fallback;
	return obj[props.lang] || obj.uz || obj.ru || obj.en || fallback;
}

const slides = computed(() =>
	items.value.map((b) => ({
		id: b.id,
		bg: (b.imageMobile || b.image || "") as string,
		title: pickLang(b.title, ""),
		html: pickLang(b.description, ""),
		btn: pickLang(b.buttonText, ""),
		href: b.linkUrl || "#",
		target: b.linkTarget || "_black",
		overlay: Number(b.overlayOpacity ?? 0.3),
	})),
);

// nav refs
const prevEl = ref<HTMLElement | null>(null);
const nextEl = ref<HTMLElement | null>(null);

// swiper instance
const swiperIns = ref<any>(null);

const activeIndex = ref(0);

const total = computed(() => slides.value.length);
const current = computed(() => String(activeIndex.value + 1).padStart(2, "0"));
const totalStr = computed(() => String(total.value).padStart(2, "0"));

const modules = [Autoplay, EffectFade, Navigation];
const AUTOPLAY_DELAY = 6000;

const options = computed(() => ({
	loop: true,
	speed: 1000,
	effect: "fade",
	fadeEffect: { crossFade: true },
	slidesPerView: 1,
	autoplay: {
		delay: AUTOPLAY_DELAY,
		disableOnInteraction: false,
		pauseOnMouseEnter: true,
		waitForTransition: true,
	},
	// ✅ navigation ni configda berib qo'yamiz, keyin @swiper da elementlarni ulab init qilamiz
	navigation: {
		enabled: true,
		prevEl: null,
		nextEl: null,
	},
}));

function resetAutoplayTimer() {
	const s = swiperIns.value;
	if (!s?.autoplay) return;
	if (s.autoplay?.paused) return;
	try {
		s.autoplay.stop();
		s.autoplay.start();
	} catch (e) {}
}

/**
 * ✅ ENG MUHIM FIX:
 * Swiper instance kelgandan keyin (clientda) navigation elementlarni ulaymiz.
 * onBeforeInit kerak emas.
 */
async function onSwiper(s: any) {
	swiperIns.value = s;

	await nextTick();

	// DOM elementlar hali yo‘q bo‘lsa chiqib ketamiz
	if (!prevEl.value || !nextEl.value) return;

	// swiper params borligini tekshiramiz
	if (!s?.params) return;

	// navigation yo‘q bo‘lsa yaratib qo'yamiz
	s.params.navigation = s.params.navigation || {};
	s.params.navigation.prevEl = prevEl.value;
	s.params.navigation.nextEl = nextEl.value;

	// navigation modulini qayta init/update
	try {
		s.navigation?.destroy?.(); // eski init bo‘lsa tozalab
		s.navigation?.init?.();
		s.navigation?.update?.();
	} catch (e) {}
}

// overlay height auto
const titleEls = ref<HTMLElement[]>([]);
const overlayH = ref(120);
let ro: ResizeObserver | null = null;

function setTitleEl(el: HTMLElement | null, idx: number) {
	if (!el) return;
	titleEls.value[idx] = el;
}

async function recalcOverlayHeight() {
	await nextTick();
	const el = titleEls.value[activeIndex.value];
	if (!el) return;
	const h = el.getBoundingClientRect().height;
	overlayH.value = Math.ceil(h + 18);
}

onMounted(() => {
	recalcOverlayHeight();
	ro = new ResizeObserver(() => recalcOverlayHeight());
	nextTick(() => {
		const el = titleEls.value[activeIndex.value];
		if (el) ro?.observe(el);
	});
});

onBeforeUnmount(() => {
	ro?.disconnect();
	ro = null;
});

function onSlideChange(s: any) {
	// loop bo‘lsa realIndex eng to‘g‘risi
	activeIndex.value = Number.isFinite(s?.realIndex)
		? s.realIndex
		: s?.activeIndex || 0;

	nextTick(() => {
		ro?.disconnect();
		const el = titleEls.value[activeIndex.value];
		if (el) ro?.observe(el);
		recalcOverlayHeight();
	});
}

function onSlideChangeEnd() {
	resetAutoplayTimer();
}

function onNavClick() {
	nextTick(() => resetAutoplayTimer());
}
</script>

<template>
	<section class="main-slider-two" :style="{ '--overlayH': overlayH + 'px' }">
		<div class="container main-slider-two__inner">
			<div class="main-slider-two__carousel">
				<Swiper
					class="main-slider-two__swiper"
					:modules="modules"
					v-bind="options"
					@swiper="onSwiper"
					@slideChange="onSlideChange"
					@realIndexChange="onSlideChange"
					@slideChangeTransitionEnd="onSlideChangeEnd"
				>
					<SwiperSlide v-for="(s, i) in slides" :key="s.id || i">
						<div class="main-slider-two__wrapper">
							<div
								class="main-slider-two__bg"
								:style="`background-image:url(${s.bg})`"
							/>

							<div
								class="main-slider-two__shade"
								aria-hidden="true"
								:style="{ opacity: s.overlay }"
							/>

							<div class="main-slider-two__content">
								<!-- ✅ STATIK 24/7 -->
								<p class="main-slider-two__sub-title">
									{{ $t("hero.title_top") }}
								</p>

								<div class="title-wrap">
									<h2
										class="main-slider-two__title"
										:ref="(el) => setTitleEl(el as any, i)"
									>
										<span class="title-text">{{ s.title }}</span>
									</h2>

									<div class="title-overlay" aria-hidden="true">
										<div class="title-overlay__sweep"></div>
										<div class="title-overlay__segs">
											<span class="seg" v-for="n in 6" :key="n" />
										</div>
									</div>
								</div>

								<div class="main-slider-two__text" v-html="s.html" />

								<div class="main-slider-two__button-group">
									<!-- ✅ DYNAMIC button -->
									<div class="main-slider-two__button-1">
										<a
											class="mediox-btn"
											:href="s.href"
											:target="s.target"
											rel="noopener"
										>
											<span class="mediox-btn__label">{{
												s.btn
											}}</span>
											<span class="mediox-btn__icon">
												<i class="ri-arrow-right-up-line"></i>
											</span>
										</a>
									</div>

									<!-- ✅ STATIK Contact -->
									<div class="main-slider-two__button-2">
										<NuxtLink
											href="/contact"
											class="mediox-btn is-outline"
										>
											<span class="mediox-btn__label">{{
												$t("contact")
											}}</span>
											<span class="mediox-btn__icon">
												<i class="ri-arrow-right-up-line"></i>
											</span>
										</NuxtLink>
									</div>
								</div>
							</div>

							<!-- ✅ STATIK pastdagi ko'k blok -->
							<div class="main-slider-two__info">
								<div class="main-slider-two__info__inner">
									<div class="main-slider-two__call">
										<span class="main-slider-two__call__icon">
											<i class="ri-phone-fill"></i>
										</span>
										<div class="main-slider-two__call__content">
											<p class="main-slider-two__call__title">
												{{ $t("phone1") }}
											</p>
											<h4 class="main-slider-two__call__number">
												<a href="tel:+208-555-0112">{{
													setting.phone?.[locale]
												}}</a>
											</h4>
										</div>
									</div>

									<div class="main-slider-two__social">
										<h3 class="main-slider-two__social__title">
											{{ $t("social") }}
										</h3>
										<div class="main-slider-two__social__links">
											<a
												:href="setting?.youtube?.[locale]"
												aria-label="YouTube"
											>
												<i class="ri-telegram-fill"></i>
											</a>
											<a
												:href="setting?.facebook?.[locale]"
												aria-label="Facebook"
											>
												<i class="ri-facebook-fill"></i>
											</a>

											<a
												:href="setting?.instagram?.[locale]"
												aria-label="Instagram"
											>
												<i class="ri-instagram-fill"></i>
											</a>
											<a
												:href="setting?.youtube?.[locale]"
												aria-label="YouTube"
											>
												<i class="ri-youtube-fill"></i>
											</a>
										</div>
									</div>
								</div>
							</div>
							<!-- /info -->
						</div>
					</SwiperSlide>
				</Swiper>
			</div>
		</div>

		<div
			class="main-slider-two__counter"
			:key="activeIndex"
			aria-live="polite"
		>
			<span class="main-slider-two__counter__current">{{ current }}</span>
			<span class="main-slider-two__counter__sep">/</span>
			<span class="main-slider-two__counter__total">{{ totalStr }}</span>
		</div>

		<div class="main-slider-two__nav">
			<button
				ref="prevEl"
				class="main-slider-two__navBtn"
				type="button"
				aria-label="Prev"
				@click="onNavClick"
			>
				<i class="ri-arrow-left-line"></i>
			</button>
			<button
				ref="nextEl"
				class="main-slider-two__navBtn"
				type="button"
				aria-label="Next"
				@click="onNavClick"
			>
				<i class="ri-arrow-right-line"></i>
			</button>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.container {
	max-width: 1320px !important;

	width: 100%;
	margin: 0 auto;
	padding: 0 12px;
}

.main-slider-two {
	--base: #33c1ed;
	--deep: #143f96;
	--container: 1320px;
	--gutter: max(14px, calc((100vw - var(--container)) / 2));
	--overlayH: 120px;
	position: relative;
	padding-top: 20px;
	padding-bottom: 20px;
	background: #f8faff;
}

.main-slider-two__wrapper {
	position: relative;
	min-height: 610px;
	height: 610px;
	border-radius: 26px;
	overflow: hidden;
	@include devices(md) {
		min-height: 640px;
		height: 640px;
	}
}

/* bg */
.main-slider-two__bg {
	position: absolute;
	inset: 0;
	background-size: cover;
	background-position: center;
	transform: scale(1);
}

/* bg zoom (3s) */
:deep(.swiper-slide-active) .main-slider-two__bg {
	animation: bgZoom 3000ms linear forwards;
}
@keyframes bgZoom {
	from {
		transform: scale(1);
	}
	to {
		transform: scale(1.14);
	}
}

/* left shade */
.main-slider-two__shade {
	position: absolute;
	inset: 0;
	z-index: 1;
	background: linear-gradient(
		90deg,
		rgba(20, 63, 150, 0.9) 0%,
		rgba(20, 63, 150, 0.7) 40%,
		rgba(20, 63, 150, 0) 72%
	);
}

/* ✅ content items center (vertical center) */
.main-slider-two__content {
	position: relative;
	z-index: 2;
	padding: 100px 36px 110px;
	color: #fff;
	max-width: 760px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 520px;
}

/* TAG: top -> down 100px */
.main-slider-two__sub-title {
	margin: 0 0 12px;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 13px;
	color: #fff;
	opacity: 0;
	transform: translateY(-100px);
}
:deep(.swiper-slide-active) .main-slider-two__sub-title {
	animation: tagDown100 900ms ease forwards;
	animation-delay: 120ms;
}
@keyframes tagDown100 {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* title wrap max-width 600 */
.title-wrap {
	position: relative;
	display: inline-block;
	max-width: 600px;
}

/* title */
.main-slider-two__title {
	margin: 0;
	font-size: 64px;
	line-height: 1.05;
	font-weight: 800;
	color: #fff;
	max-width: 600px;
	position: relative;
}

/* ✅ TITLE+OVERLAY: right -> left 300px, sekinroq */
:deep(.swiper-slide-active) .title-wrap {
	animation: titleMove300 900ms cubic-bezier(0.22, 0.9, 0.22, 1) forwards;
	animation-delay: 240ms;
}
@keyframes titleMove300 {
	from {
		transform: translateX(300px);
	}
	to {
		transform: translateX(0px);
	}
}

/* title text overlay yurayotgan paytda ko‘rinmasin */
.title-text {
	position: relative;
	z-index: 3;
}
:deep(.swiper-slide-active) .title-text {
	animation: hideThenShow 1400ms ease forwards;
	animation-delay: 240ms;
}
@keyframes hideThenShow {
	0% {
		opacity: 0;
	}
	78% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

/* overlay area */
.title-overlay {
	position: absolute;
	left: 0;
	top: 0;
	width: min(600px, 100%);
	height: var(--overlayH);
	transform: translateY(6px);
	pointer-events: none;
	z-index: 2;
}

/* sweep (NO opacity) */
.title-overlay__sweep {
	position: absolute;
	inset: 0;
	background: var(--base);
	transform: translateX(300px);
	transform-origin: center;
}

/* segs */
.title-overlay__segs {
	position: absolute;
	inset: 0;
	display: grid;
	grid-template-columns: repeat(6, 1fr);
}

.seg {
	background: var(--base);
	transform: scaleY(1);
}

/* ✅ JUFT: pastga qarab kamayadi => origin TOP
   ✅ TOQ : yuqoriga qarab kamayadi => origin BOTTOM */
.seg:nth-child(even) {
	transform-origin: top;
} /* 2,4,6 */
.seg:nth-child(odd) {
	transform-origin: bottom;
} /* 1,3,5 */

/* sweep: 300px keladi, keyin scaleX bilan sekin yo‘qoladi (opacity yo‘q) */
:deep(.swiper-slide-active) .title-overlay__sweep {
	animation: sweep300InOut 1400ms cubic-bezier(0.22, 0.9, 0.22, 1) forwards;
	animation-delay: 240ms;
}
@keyframes sweep300InOut {
	0% {
		transform: translateX(300px) scaleX(1);
	}
	55% {
		transform: translateX(0px) scaleX(1);
	}
	100% {
		transform: translateX(0px) scaleX(0);
	} /* ✅ opacity yo‘q */
}

/* seg collapse (sekinroq, opacity yo‘q) */
:deep(.swiper-slide-active) .seg {
	animation: segCollapseSlow 1200ms ease forwards;
}

/* stagger (sekinroq) */
:deep(.swiper-slide-active) .seg:nth-child(1) {
	animation-delay: 1050ms;
}
:deep(.swiper-slide-active) .seg:nth-child(2) {
	animation-delay: 1150ms;
}
:deep(.swiper-slide-active) .seg:nth-child(3) {
	animation-delay: 1250ms;
}
:deep(.swiper-slide-active) .seg:nth-child(4) {
	animation-delay: 1350ms;
}
:deep(.swiper-slide-active) .seg:nth-child(5) {
	animation-delay: 1450ms;
}
:deep(.swiper-slide-active) .seg:nth-child(6) {
	animation-delay: 1550ms;
}

@keyframes segCollapseSlow {
	0% {
		transform: scaleY(1);
	}
	35% {
		transform: scaleY(1);
	}
	100% {
		transform: scaleY(0);
	} /* ✅ opacity yo‘q */
}

/* TEXT: left -> right 300px */
.main-slider-two__text {
	margin: 32px 0 0;
	max-width: 560px;
	font-size: 15px;
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.95);
	opacity: 0;
	transform: translateX(-300px);
}
:deep(.swiper-slide-active) .main-slider-two__text {
	animation: textLR300 1000ms ease forwards;
	animation-delay: 420ms;
}
@keyframes textLR300 {
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

/* buttons bottom -> top */
.main-slider-two__button-group {
	display: flex;
	gap: 16px;
	margin-top: 26px;
}
.main-slider-two__button-1,
.main-slider-two__button-2 {
	opacity: 0;
	transform: translateY(30px);
}
:deep(.swiper-slide-active) .main-slider-two__button-1 {
	animation: btnUp 900ms ease forwards;
	animation-delay: 560ms;
}
:deep(.swiper-slide-active) .main-slider-two__button-2 {
	animation: btnUp 900ms ease forwards;
	animation-delay: 680ms;
}
@keyframes btnUp {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* button hover */
.mediox-btn {
	--btn: var(--base);
	position: relative;
	overflow: hidden;
	display: inline-flex;
	align-items: center;
	gap: 10px;
	border-radius: 999px;
	padding: 12px 18px;
	font-weight: 700;
	text-decoration: none;
	border: 1px solid transparent;
	background: var(--btn);
	color: #fff;
	transition: 200ms ease;
}
.mediox-btn__label,
.mediox-btn__icon {
	position: relative;
	z-index: 2;
}
.mediox-btn__icon {
	display: inline-grid;
	place-items: center;
	width: 34px;
	height: 34px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.18);
}
.mediox-btn::before {
	content: "";
	position: absolute;
	inset: 0;
	background: rgba(255, 255, 255, 0.22);
	transform: scaleX(0);
	transform-origin: center;
	transition: transform 280ms ease;
}
.mediox-btn:hover::before {
	transform: scaleX(1);
}

.mediox-btn.is-outline {
	background: transparent;
	border-color: rgba(255, 255, 255, 0.55);
}
.mediox-btn.is-outline::before {
	background: var(--btn);
}
.mediox-btn.is-outline:hover {
	border-color: var(--btn);
}

/* info panel */
.main-slider-two__info {
	position: absolute;
	right: 20px;
	bottom: 18px;
	z-index: 3;
}
.main-slider-two__info__inner {
	display: flex;
	align-items: center;
	gap: 22px;
	background: rgba(20, 63, 150, 0.92);
	border-radius: 20px 0 20px 0;
	padding: 16px 18px;
	color: #fff;
	min-width: 360px;
}
.main-slider-two__call {
	display: flex;
	align-items: center;
	gap: 12px;
}
.main-slider-two__call__icon {
	position: relative;
	width: 42px;
	height: 42px;
	border-radius: 50%;
	display: grid;
	place-items: center;
	background: rgba(51, 193, 237, 0.2);
	color: var(--base);
	z-index: 1;
	overflow: visible;
}

/* 1-to‘lqin */
.main-slider-two__call__icon::before,
.main-slider-two__call__icon::after {
	content: "";
	position: absolute;
	inset: 0;
	border-radius: 50%;
	border: 2px solid var(--base);
	animation: phoneRipple 2.4s linear infinite;
	z-index: -1;
}

/* 2-to‘lqin kechikib chiqadi */
.main-slider-two__call__icon::after {
	animation-delay: 1.2s;
}

/* Animatsiya */
@keyframes phoneRipple {
	0% {
		transform: scale(1);
		opacity: 0.6;
	}
	70% {
		transform: scale(1.3);
		opacity: 0.3;
	}
	100% {
		transform: scale(1.5);
		opacity: 0;
	}
}

.main-slider-two__call__icon i {
	font-size: 20px;
	animation: phoneShake 2s ease-in-out infinite;
}

@keyframes phoneShake {
	0%,
	100% {
		transform: rotate(0);
	}
	20% {
		transform: rotate(-15deg);
	}
	40% {
		transform: rotate(15deg);
	}
	60% {
		transform: rotate(-10deg);
	}
	80% {
		transform: rotate(10deg);
	}
}

.main-slider-two__call__title {
	margin: 0;
	font-size: 12px;
	opacity: 0.9;
	font-weight: 600;
	text-transform: uppercase;
}
.main-slider-two__call__number {
	margin: 2px 0 0;
	font-size: 15px;
}
.main-slider-two__call__number a {
	color: #fff;
	text-decoration: none;
}
.main-slider-two__social__title {
	margin: 0 0 3px;
	color: #fff;
	font-size: 12px;
	text-transform: uppercase;
	opacity: 0.9;
}
.main-slider-two__social__links {
	display: flex;
	gap: 10px;
}
.main-slider-two__social__links a {
	color: #fff;
	transition: all 0.3s;
	opacity: 0.8;
	text-decoration: none;
	font-size: 18px;
	&:hover {
		opacity: 1;
		transform: scale(1.3);
	}
}

/* counter + nav outside */
.main-slider-two__counter {
	position: absolute;
	left: max(12px, calc(var(--gutter) - 66px));
	top: 50%;
	transform: translateY(-50%);
	z-index: 10;
	color: var(--base);
	display: flex;
	align-items: center;
	gap: 3px;
	font-weight: 800;
}
.main-slider-two__counter__current {
	font-size: 22px;
}
.main-slider-two__counter__sep,
.main-slider-two__counter__total {
	color: rgba(0, 0, 0, 0.4);
	font-weight: 700;
}

.main-slider-two__nav {
	position: absolute;
	right: max(12px, calc(var(--gutter) - 56px));
	top: 50%;
	transform: translateY(-50%);
	z-index: 10;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.main-slider-two__navBtn {
	width: 46px;
	height: 46px;
	border-radius: 999px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: rgba(255, 255, 255, 0.3);
	color: rgba(0, 0, 0, 0.5);
	display: grid;
	place-items: center;
	cursor: pointer;
	transition: 200ms ease;
}
.main-slider-two__navBtn i {
	font-size: 20px;
}
.main-slider-two__navBtn:hover {
	background: rgba(51, 193, 237, 0.9);
	border-color: rgba(51, 193, 237, 0.9);
}

/* responsive */
@media (max-width: 992px) {
	.main-slider-two__title {
		font-size: 44px;
	}
}
@media (max-width: 1340px) {
	.main-slider-two__counter {
		display: none;
	}
	.main-slider-two__nav {
		right: 10px;
	}
	.main-slider-two__wrapper {
		border-radius: 18px;
	}
	.main-slider-two__content {
		padding: 60px 18px 140px;
		min-height: 520px;
	}
	.main-slider-two__info {
		right: 10px;
		left: 10px;
		bottom: 10px;
	}
	.main-slider-two__info__inner {
		width: 100%;
		min-width: 0;
		justify-content: space-between;
	}
}
@media (max-width: 740px) {
	.main-slider-two__title {
		font-size: 40px;
		font-weight: 700;
	}
	.main-slider-two__content {
		min-height: 650px;
	}
	.main-slider-two__button-group {
		flex-direction: column;
	}
	.main-slider-two__info__inner {
		display: none;
	}
	.main-slider-two__nav {
		bottom: 0px;
		top: auto;
		flex-direction: row;
		right: auto;
		left: max(12px, calc(50% - 56px));
	}
}
</style>
