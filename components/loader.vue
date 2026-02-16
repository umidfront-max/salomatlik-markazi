<script setup>
import { ref, onMounted } from "vue";

let config = { public: { loaderDuration: 700, subname: "" } };
try {
	if (typeof useRuntimeConfig === "function") {
		config = useRuntimeConfig();
	}
} catch (e) {
	// fallback
}

const duration = Number(config?.public?.loaderDuration ?? 700); // ms

// DOM visibility + active class
const visible = ref(true); // v-show: element DOMda bo'ladi, shuning uchun anim darrov boshlanadi
const isActive = ref(true);

// logo preload / fallback
const logoLoaded = ref(false);

// text for letters
const text = "Salomatlik maskani".split("");

// staggers
const letterDelay = 0.1; // s

// Preload image but don't block UI; use inline SVG fallback while loading

// hide loader (fade out + remove from DOM after CSS transition)
function hideLoader() {
	isActive.value = false;
	// transition time in CSS is 450ms; match here before removing from DOM
	setTimeout(() => {
		visible.value = false;
	}, 480);
}

onMounted(() => {
	// preload logo immediately

	// start hide timer (after duration). animation starts instantly because v-show and loader-active class are present.
	setTimeout(() => {
		hideLoader();
	}, duration);
});
</script>

<template>
	<div
		v-show="visible"
		:class="['modern-loader', { 'loader-active': isActive }]"
	>
		<!-- blue panel sliding up -->
		<div class="panel"></div>

		<!-- subtle particles / gradient overlays -->
		<div class="overlay-shimmer" aria-hidden="true"></div>
		<div class="overlay-blobs" aria-hidden="true"></div>

		<!-- content: logo + letters -->
		<div class="content">
			<div class="logo-area" aria-hidden="true">
				<!-- fallback inline SVG circle while actual logo loads -->
				<div class="logo-fallback" v-if="!logoLoaded" aria-hidden="true">
					<!-- simple SVG (initials) — o'zgartiring xohlasangiz -->
					<svg
						width="72"
						height="72"
						viewBox="0 0 72 72"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<defs>
							<linearGradient id="g" x1="0" x2="1">
								<stop offset="0" stop-color="#60a5fa" />
								<stop offset="1" stop-color="#0369a1" />
							</linearGradient>
						</defs>
						<rect width="72" height="72" rx="14" fill="url(#g)" />
						<text
							x="50%"
							y="52%"
							text-anchor="middle"
							fill="white"
							font-size="28"
							font-family="Inter, system-ui, sans-serif"
							font-weight="700"
						>
							SM
						</text>
					</svg>
				</div>

				<!-- real image will swap in when loaded -->
			</div>

			<div class="letters" aria-hidden="true">
				<span
					v-for="(ch, i) in text"
					:key="i"
					class="letter"
					:style="{ animationDelay: i * letterDelay + 's' }"
					>{{ ch === " " ? "\u00A0" : ch }}</span
				>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
/* ---------- variables ---------- */
$panel-duration: 530ms;
$letter-duration: 800ms;
$bg-gradient-start: #60a5fa;
$bg-gradient-end: #0369a1;

/* ---------- layout ---------- */
.modern-loader {
	position: fixed;
	inset: 0;
	z-index: 9999;
	overflow: hidden;
	pointer-events: none; /* sahifa elementlar bloklanmasin; agar kerak bo'lsa auto */
	transform: translateZ(0);

	/* visible transition */
	opacity: 0;
	visibility: hidden;
	transition:
		opacity 360ms ease,
		visibility 360ms ease;

	&.loader-active {
		opacity: 1;
		visibility: visible;
	}
}

/* PANEL: ko'k fon pastdan tepaga ko'tariladi */
.panel {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100%;
	background: linear-gradient(
		180deg,
		$bg-gradient-start 0%,
		$bg-gradient-end 100%
	);
	transform: translateY(100%);
	transition: transform $panel-duration cubic-bezier(0.22, 0.8, 0.36, 1);
	will-change: transform;
	z-index: 1000;
}

/* panel visible when loader-active */
.loader-active .panel {
	transform: translateY(0%);
}

/* Panel exit: when loader-active removed, translate up */
.modern-loader:not(.loader-active) .panel {
	transform: translateY(-100%);
}

/* overlay shimmer light sweep */
.overlay-shimmer {
	position: absolute;
	inset: 0;
	z-index: 1010;
	background-image: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 0.03) 40%,
		rgba(255, 255, 255, 0.06) 50%,
		rgba(255, 255, 255, 0.03) 60%,
		rgba(255, 255, 255, 0) 100%
	);
	mix-blend-mode: overlay;
	opacity: 0.6;
	transform: translateX(-40%);
	animation: shimmer 2200ms linear infinite;
	pointer-events: none;
}

@keyframes shimmer {
	0% {
		transform: translateX(-40%);
	}
	100% {
		transform: translateX(100%);
	}
}

/* soft blobs for depth */
.overlay-blobs {
	position: absolute;
	inset: 0;
	z-index: 1005;
	background-image:
		radial-gradient(
			circle at 10% 20%,
			rgba(255, 255, 255, 0.035),
			transparent 12%
		),
		radial-gradient(
			circle at 85% 80%,
			rgba(255, 255, 255, 0.03),
			transparent 10%
		),
		radial-gradient(circle at 60% 25%, rgba(0, 0, 0, 0.03), transparent 14%);
	filter: blur(12px);
	pointer-events: none;
}

/* content (logo + letters) */
.content {
	position: absolute;
	inset: 0;
	z-index: 1100;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 14px;
	pointer-events: none;
	padding: 20px;
}

/* logo area */
.logo-area {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 96px;
	height: 96px;
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.06);
	backdrop-filter: blur(6px);
	-webkit-backdrop-filter: blur(6px);
	box-shadow: 0 10px 30px rgba(2, 6, 23, 0.22);
	transform-origin: center;
	animation: logoPop 520ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
	z-index: 1110;
}

/* fallback SVG fits inside */
.logo-fallback svg {
	display: block;
	width: 72px;
	height: 72px;
}

/* real logo image */
.logo-img {
	width: 72px;
	height: 72px;
	border-radius: 12px;
	display: block;
	object-fit: cover;
	box-shadow: 0 6px 18px rgba(2, 6, 23, 0.16);
}

/* logo pop animation */
@keyframes logoPop {
	0% {
		transform: scale(0.78);
		opacity: 0;
	}
	60% {
		transform: scale(1.08);
		opacity: 1;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

/* letters */
.letters {
	display: flex;
	gap: 4px;
	align-items: baseline;
	justify-content: center;
	color: #ffffff;
	font-weight: 700;
	font-size: clamp(22px, 4.5vw, 36px);
	z-index: 1110;
	pointer-events: none;
}

/* each letter: much deeper start (pastdan) */
.letter {
	display: inline-block;
	transform: translateY(260%); /* CHANGED: ko'proq pastdan boshlaydi */
	opacity: 0;
	animation-name: letterRise;
	animation-duration: $letter-duration;
	animation-fill-mode: forwards;
	animation-timing-function: cubic-bezier(0.18, 0.86, 0.25, 1);
}

/* strong overshoot for "springy" feel */
@keyframes letterRise {
	0% {
		transform: translateY(260%);
		opacity: 0;
	}
	55% {
		transform: translateY(-12%);
		opacity: 1;
	}
	80% {
		transform: translateY(4%);
		opacity: 1;
	}
	100% {
		transform: translateY(0%);
		opacity: 1;
	}
}

/* small underline animation under letters for modern feel */
.letters::after {
	content: "";
	display: block;
	height: 3px;
	width: 60%;
	margin: 8px auto 0;
	border-radius: 6px;
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0.25),
		rgba(255, 255, 255, 0.12)
	);
	opacity: 0.9;
	transform: scaleX(0);
	transform-origin: left center;
	animation: underlineIn 700ms cubic-bezier(0.22, 0.8, 0.36, 1) 0.25s both;
}
@keyframes underlineIn {
	to {
		transform: scaleX(1);
	}
}

/* responsive tweaks */
@media (max-width: 520px) {
	.logo-area {
		width: 72px;
		height: 72px;
		border-radius: 14px;
	}
	.logo-fallback svg,
	.logo-img {
		width: 58px;
		height: 58px;
	}
	.letters {
		gap: 3px;
		font-size: 24px;
	}
}

/* Accessibility: if prefers-reduced-motion, disable motion and show static fallback */
@media (prefers-reduced-motion: reduce) {
	.overlay-shimmer,
	.overlay-blobs,
	.logo-area,
	.letter,
	.letters::after {
		animation: none !important;
		transition: none !important;
	}
	.panel {
		transition: none !important;
		transform: translateY(0%) !important;
	}
}
</style>
