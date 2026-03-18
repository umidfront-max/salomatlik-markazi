<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const { locale } = useI18n();
const { list: setting } = useSetting();

// Helper: strip <p> tags from HTML strings coming from admin
const strip = (html) => html?.replace(/<\/?p>/g, "")?.trim() ?? "-";

const cards = computed(() => [
	{
		key: "since",
		value: strip(setting?.["home.statistics.sinceTitle"]?.[locale.value]),
		sub: strip(setting?.["home.statistics.sinceSubTitle"]?.[locale.value]),
		accent: true,
		icon: "calendar",
	},
	{
		key: "employees",
		value: strip(setting?.["home.statistics.employeeTitle"]?.[locale.value]),
		sub: strip(setting?.["home.statistics.employeeSubTitle"]?.[locale.value]),
		accent: false,
		icon: "users",
	},
	{
		key: "branches",
		value: strip(setting?.["home.statistics.branchesTitle"]?.[locale.value]),
		sub: strip(setting?.["home.statistics.branchesSubTitle"]?.[locale.value]),
		accent: true,
		icon: "map",
	},
	{
		key: "clinics",
		value: strip(setting?.["home.statistics.clinicsTitle"]?.[locale.value]),
		sub: strip(setting?.["home.statistics.clinicsSubTitle"]?.[locale.value]),
		accent: false,
		icon: "clinic",
	},
	{
		key: "brands",
		value: strip(setting?.["home.statistics.brandsTitle"]?.[locale.value]),
		sub: strip(setting?.["home.statistics.brandsSubTitle"]?.[locale.value]),
		accent: true,
		icon: "brand",
	},
	{
		key: "conferences",
		value: strip(
			setting?.["home.statistics.conferencesTitle"]?.[locale.value],
		),
		sub: strip(
			setting?.["home.statistics.conferencesSubTitle"]?.[locale.value],
		),
		accent: false,
		icon: "mic",
	},
]);

// Intersection Observer for scroll-triggered animations
const sectionRef = ref(null);
const isVisible = ref(false);

let observer = null;
onMounted(() => {
	observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) isVisible.value = true;
		},
		{ threshold: 0.15 },
	);
	if (sectionRef.value) observer.observe(sectionRef.value);
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
	<section class="section stats" ref="sectionRef">
		<div class="container">
			<!-- Header -->
			<div class="stats-header" :class="{ 'is-visible': isVisible }">
				<div class="stats-header__left">
					<h2
						v-html="strip(setting?.['home.statistics.title']?.[locale])"
						class="section-title"
					></h2>
				</div>
				<div class="stats-header__right">
					<p
						class="stats-text"
						v-html="setting?.['home.statistics.text']?.[locale]"
					/>
					<p
						class="stats-text stats-text--muted"
						v-html="setting?.['home.statistics.subtext']?.[locale]"
					/>
				</div>
			</div>

			<!-- Cards Grid -->
			<div class="stats-grid" :class="{ 'is-visible': isVisible }">
				<div
					v-for="(card, i) in cards"
					:key="card.key"
					class="stats-card"
					:class="{ 'stats-card--accent': card.accent }"
					:style="{ '--delay': `${i * 90}ms` }"
				>
					<!-- Decorative blob -->
					<div class="stats-card__blob" aria-hidden="true" />

					<!-- Icon -->
					<div class="stats-card__icon">
						<svg
							v-if="card.icon === 'calendar'"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
						>
							<rect x="3" y="4" width="18" height="18" rx="3" />
							<path d="M3 9h18M8 2v4M16 2v4" />
						</svg>
						<svg
							v-if="card.icon === 'users'"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
						>
							<circle cx="9" cy="7" r="3" />
							<path d="M3 20a6 6 0 0 1 12 0" />
							<circle cx="18" cy="8" r="2.5" />
							<path d="M18 14c2.5 0 4.5 1.8 4.5 4" />
						</svg>
						<svg
							v-if="card.icon === 'map'"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
						>
							<path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" />
							<path d="M9 7v13M15 4v13" />
						</svg>
						<svg
							v-if="card.icon === 'clinic'"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
						>
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<path d="M10 14h4M12 12v4" />
						</svg>
						<svg
							v-if="card.icon === 'brand'"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5z" />
							<path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
						</svg>
						<svg
							v-if="card.icon === 'mic'"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
						>
							<rect x="9" y="2" width="6" height="11" rx="3" />
							<path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8" />
						</svg>
					</div>

					<div class="stats-card__body">
						<div class="stats-card__value">{{ card.value }}</div>
						<div class="stats-card__label">{{ card.sub }}</div>
					</div>

					<!-- Hover shine sweep -->
					<div class="stats-card__shine" aria-hidden="true" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

/* ─── Section ──────────────────────────────────── */
.section {
	padding: var(--space-80) 0;
	background: #f8faff;
}
.container {
	max-width: 1320px !important;
	width: 100%;
	margin: 0 auto;
	padding: 40px 20px;
}

/* ─── Header ───────────────────────────────────── */
.stats-header {
	display: flex;
	align-items: flex-start;
	gap: 60px;
	margin-bottom: 48px;
	opacity: 0;
	transform: translateY(36px);
	transition:
		opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
		transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);

	&.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	&__left {
		flex: 0 0 600px;
		max-width: 600px;

		@include devices(lg) {
			flex: 1;
			max-width: 100%;
		}
	}

	&__right {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 4px;
	}

	@include devices(lg) {
		flex-direction: column;
		gap: 24px;
	}
}

.stats-eyebrow {
	display: inline-block;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.13em;
	text-transform: uppercase;
	color: var(--blue-4);
	background: color-mix(in srgb, var(--blue-4) 10%, transparent);
	padding: 5px 14px;
	border-radius: 100px;
	margin-bottom: 16px;
}

.stats-title {
	@include text(38, var(--text-1), 700, 118%);
	letter-spacing: -0.025em;

	@include devices(lg) {
		font-size: 28px;
	}
}

.stats-text {
	@include text(15, var(--text-2), 400, 168%);

	&--muted {
		color: var(--text-3);
	}
}

/* ─── Grid ─────────────────────────────────────── */
.stats-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;

	@include devices(lg) {
		grid-template-columns: repeat(2, 1fr);
	}

	@include devices(sm) {
		grid-template-columns: 1fr;
	}

	&.is-visible .stats-card {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

/* ─── Card ─────────────────────────────────────── */
.stats-card {
	position: relative;
	background: #ffffff;
	border: 1px solid rgba(0, 0, 0, 0.07);
	border-radius: 20px;
	padding: 32px 28px 36px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	overflow: hidden;
	isolation: isolate;

	/* initial state */
	opacity: 0;
	transform: translateY(30px) scale(0.97);
	transition:
		opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms),
		transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms),
		box-shadow 0.3s ease,
		border-color 0.3s ease;
	@include devices(lg) {
		padding: 20px;
	}
	&:hover {
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
		border-color: rgba(0, 0, 0, 0.1);

		.stats-card__blob {
			transform: scale(1.2) rotate(10deg);
		}

		.stats-card__icon svg {
			transform: scale(1.1) rotate(-5deg);
		}

		.stats-card__shine {
			transform: translateX(200%) rotate(25deg);
		}
	}

	/* ── Accent ── */
	&--accent {
		background: var(--blue-4);
		border-color: transparent;

		.stats-card__icon {
			background: rgba(255, 255, 255, 0.15);
			color: #ffffff;
		}

		.stats-card__value {
			color: #ffffff;
		}

		.stats-card__label {
			color: rgba(255, 255, 255, 0.68);
		}

		.stats-card__blob {
			background: rgba(255, 255, 255, 0.07);
		}

		&:hover {
			box-shadow: 0 20px 56px
				color-mix(in srgb, var(--blue-4) 40%, transparent);
		}
	}
}

/* Blob decoration */
.stats-card__blob {
	position: absolute;
	top: -50px;
	right: -50px;
	width: 160px;
	height: 160px;
	border-radius: 50%;
	background: color-mix(in srgb, var(--blue-4) 6%, transparent);
	z-index: 0;
	transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
	pointer-events: none;
}

/* Shine sweep */
.stats-card__shine {
	position: absolute;
	top: 0;
	left: -100%;
	width: 60%;
	height: 100%;
	background: linear-gradient(
		120deg,
		transparent,
		rgba(255, 255, 255, 0.2) 50%,
		transparent
	);
	transform: translateX(0) rotate(25deg);
	transition: transform 0.65s ease;
	pointer-events: none;
	z-index: 1;
}

/* Icon */
.stats-card__icon {
	position: relative;
	z-index: 2;
	width: 50px;
	height: 50px;
	border-radius: 14px;
	background: color-mix(in srgb, var(--blue-4) 9%, transparent);
	color: var(--blue-4);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	svg {
		width: 22px;
		height: 22px;
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@include devices(lg) {
		width: 40px;
		height: 40px;
		svg {
			width: 18px;
			height: 18px;
		}
	}
}

/* Body */
.stats-card__body {
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.stats-card__value {
	@include text(28, var(--black), 600, 108%);
	letter-spacing: -0.03em;

	@include devices(lg) {
		font-size: 20px;
	}
}

.stats-card__label {
	@include text(14, var(--text-3), 400, 152%);
}
</style>
