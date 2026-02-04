<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type Feature = {
	icon: string; // sizdagi icon font class
	title: string;
	text: string;
	accent?: "base" | "deep"; // xohlasangiz 1-tasi ko‘k, boshqasi to‘q ko‘k
};

const features: Feature[] = [
	{
		icon: "ri-stethoscope-fill",
		title: "Experience Doctor",
		text: "Our team of skilled nurses, and special patients",
		accent: "base",
	},
	{
		icon: "ri-tooth-fill",
		title: "Painless Treatment",
		text: "Wiggle room increase the resolution, scale it up",
		accent: "base",
	},
	{
		icon: "ri-wheelchair-fill",
		title: "Top Dental Equipment",
		text: "Product launch quarterly sales are at an all-time",
		accent: "base",
	},
	{
		icon: "ri-24-hours-fill",
		title: "24/7 Advance Care",
		text: "Good optics translating our vision of having",
		accent: "base",
	},
];

// scroll anim (IntersectionObserver)
const sectionEl = ref<HTMLElement | null>(null);
const inView = ref(false);
let io: IntersectionObserver | null = null;

onMounted(() => {
	if (!sectionEl.value) return;

	io = new IntersectionObserver(
		(entries) => {
			const e = entries[0];
			if (e?.isIntersecting) {
				inView.value = true;
				io?.disconnect(); // bir marta ishlasin
			}
		},
		{ threshold: 0.18 },
	);

	io.observe(sectionEl.value);
});

onBeforeUnmount(() => {
	io?.disconnect();
	io = null;
});
</script>

<template>
	<section
		ref="sectionEl"
		class="features-one section-space-bottom"
		:class="{ 'is-in': inView }"
	>
		<div class="features-one__bg" style=""></div>

		<div class="container">
			<div class="row">
				<div
					v-for="(f, idx) in features"
					:key="idx"
					class="col-xl-3 col-md-6 features-one__col"
					:style="{ '--d': `${idx * 120}ms` }"
				>
					<div class="features-one__card" tabindex="0">
						<div class="features-one__card__content">
							<span
								class="features-one__card__icon"
								:class="[`is-${f.accent ?? 'base'}`]"
							>
								<i class="text-3xl" :class="f.icon"></i>
							</span>

							<h3 class="features-one__card__title">{{ f.title }}</h3>
							<p class="features-one__card__text">{{ f.text }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.container {
	max-width: 1200px;
	margin: 0px auto;
}
.row {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 30px; /* xohlasang */
}
.features-one {
	--base: #33c1ed;
	--deep: #2c51a3;
	--ink: #0b214a;
	--bg: #eaf0f4;
	margin-top: -200px;
	position: relative;
	padding: 300px 0 80px;
	background-color: var(--bg);
	overflow: hidden;

	&__bg {
		background-image: url("@/assets/images/banner.webp");
		position: absolute;
		inset: 0;
		background-repeat: repeat;
		background-size: 520px auto;
		opacity: 0.45;
		pointer-events: none;
		filter: contrast(1.02);
	}
}

.container {
	position: relative;
	z-index: 1;
}

/* ===== entrance animation (scrollga kirganda) ===== */
.features-one__col {
	opacity: 0;
	transform: translateY(22px);
}

.features-one.is-in .features-one__col {
	animation: fUp 900ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
	animation-delay: var(--d);
}

@keyframes fUp {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* ===== card ===== */
.features-one__card {
	height: 100%;
	background: #fff;
	border-radius: 10px;
	padding: 26px 22px 22px;
	box-shadow: 0 10px 30px rgba(11, 33, 74, 0.08);
	border: 1px solid rgba(11, 33, 74, 0.06);
	position: relative;

	transform: translateY(0);
	transition:
		transform 260ms ease,
		box-shadow 260ms ease,
		border-color 260ms ease;

	&:hover,
	&:focus-visible {
		transform: translateY(-8px);
		box-shadow: 0 18px 45px rgba(11, 33, 74, 0.14);
		border-color: rgba(51, 193, 237, 0.35);
		outline: none;
	}
}

.features-one__card__content {
	text-align: center;
}

/* icon badge */
/* icon badge */
.features-one__card__icon {
	width: 56px;
	height: 56px;
	border-radius: 10px;
	display: grid;
	place-items: center;
	margin: -50px auto 14px;
	color: #fff;

	box-shadow: 0 10px 22px rgba(51, 193, 237, 0.35);
	transition:
		transform 260ms ease,
		box-shadow 260ms ease,
		background-color 260ms ease;

	background-color: var(--base); // default fallback

	&.is-base {
		background-color: var(--base);
		box-shadow: 0 10px 22px rgba(51, 193, 237, 0.35);
	}

	&.is-deep {
		background-color: var(--deep);
		box-shadow: 0 10px 22px rgba(44, 81, 163, 0.32);
	}

	i {
		font-size: 28px;
		line-height: 1;
	}
}

/* ✅ HOVER: icon div ko‘k bo‘lsin + tepaga chiqsin */
.features-one__card:hover,
.features-one__card:focus-visible {
	.features-one__card__icon {
		// background-color: var(--base); // ✅ hammasi ko‘k
		transform: translateY(-4px); // ✅ tepaga chiqsin (ozroq)
		box-shadow: 0 18px 34px rgba(51, 193, 237, 0.45);
		background-color: var(--deep);
		box-shadow: 0 10px 22px rgba(44, 81, 163, 0.32);
	}
}

// .features-one__card:hover .features-one__card__icon,
// .features-one__card:focus-visible .features-one__card__icon {
// 	transform: translateY(-2px) scale(1.04);
// 	box-shadow: 0 16px 28px rgba(51, 193, 237, 0.42);
// }
// .features-one__card:hover .features-one__card__icon.is-deep,
// .features-one__card:focus-visible .features-one__card__icon.is-deep {
// 	box-shadow: 0 16px 28px rgba(44, 81, 163, 0.38);
// }

/* title + text */
.features-one__card__title {
	margin: 0 0 8px;
	font-size: 16px;
	font-weight: 800;
	color: var(--ink);
}

.features-one__card__text {
	margin: 0;
	font-size: 13px;
	line-height: 1.6;
	color: rgba(11, 33, 74, 0.65);
}

@media (max-width: 768px) {
	.features-one__card {
		padding: 22px 18px 18px;
	}
	.features-one__card__icon {
		width: 52px;
		height: 52px;
	}
}
</style>
