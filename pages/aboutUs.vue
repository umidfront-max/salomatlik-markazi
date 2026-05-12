<script setup>
const { locale, t } = useI18n();
const { list: setting } = useSetting();

const pageTitle = computed(() => {
	const raw = setting?.aboutUs?.[locale.value] || t("aboutUs");
	return raw.replace(/<[^>]*>/g, "");
});

useHead({
	title: pageTitle,
	meta: [
		{ name: "description", content: computed(() => t("footer.aboutText")) },
	],
});

// Static stat cards
const stats = [
	{
		value: "15+",
		label: {
			uz: "yillik tajriba",
			ru: "лет опыта",
			en: "years of experience",
		},
	},
	{
		value: "50+",
		label: {
			uz: "mutaxassis shifokorlar",
			ru: "специалистов",
			en: "specialists",
		},
	},
	{
		value: "20+",
		label: {
			uz: "tibbiy yo'nalish",
			ru: "направлений",
			en: "medical fields",
		},
	},
	{
		value: "10k+",
		label: {
			uz: "mamnun bemorlar",
			ru: "довольных пациентов",
			en: "happy patients",
		},
	},
];

const values = [
	{
		icon: "check-circle",
		title: {
			uz: "Sifat va xavfsizlik",
			ru: "Качество и безопасность",
			en: "Quality & Safety",
		},
		text: {
			uz: "Zamonaviy uskunalar va tasdiqlangan standartlar asosida xizmat ko'rsatamiz.",
			ru: "Современное оборудование и проверенные стандарты обслуживания.",
			en: "Modern equipment and verified service standards.",
		},
	},
	{
		icon: "consultant",
		title: {
			uz: "Tajribali jamoa",
			ru: "Опытная команда",
			en: "Experienced Team",
		},
		text: {
			uz: "Yuqori malakali shifokorlar va tibbiy xodimlar.",
			ru: "Высококвалифицированные врачи и медперсонал.",
			en: "Highly qualified doctors and medical staff.",
		},
	},
	{
		icon: "star",
		title: {
			uz: "Individual yondashuv",
			ru: "Индивидуальный подход",
			en: "Personalized Care",
		},
		text: {
			uz: "Har bir bemorga shaxsiy davolash rejasi.",
			ru: "Персональный план лечения для каждого пациента.",
			en: "Personalized treatment plan for every patient.",
		},
	},
];
</script>

<template>
	<section class="about">
		<!-- ── HERO ─────────────────────────────────────────── -->
		<div class="container">
			<div class="about__hero-tex1t">
				<span
					v-if="setting?.aboutUs?.[locale]"
					v-html="setting.aboutUs[locale]"
				></span>
				<span v-else>{{ $t("aboutUs") }}</span>

			</div>

			<!-- <div class="about__hero-media">
				<div class="about__hero-orb" aria-hidden="true"></div>
				<img
					class="about__hero-img"
					src="/logo.jpg"
					:alt="pageTitle"
					loading="lazy"
				/>
			</div> -->
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

$primary: #33c1ed;
$primary-dk: rgba(15, 82, 159, 1);
$dark: #03182b;
$muted: #64748b;
$border: rgba(2, 10, 20, 0.08);

.about {
	// ─── Anti-overflow guard ───────────────────────────────
	width: 100%;
	max-width: 100vw;
	overflow-x: clip; // prevents horizontal scroll from any overflowing child

	@include devices(sm) {
		padding: 32px 0 60px;
	}

	.container {
		max-width: 1280px;
		width: 100%;
		padding: 0 20px;
		margin: 0 auto;
		box-sizing: border-box;

		@include devices(sm) {
			padding: 0 16px;
		}
	}

	// ═══ HERO ═══════════════════════════════════════════════
	&__hero {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 48px;
		align-items: center;
		margin-bottom: 64px;

		@include devices(md) {
			grid-template-columns: 1fr;
			gap: 32px;
			margin-bottom: 40px;
		}
	}

	&__hero-text {
		display: flex;
		flex-direction: column;
		gap: 18px;
		min-width: 0;
	}

	&__badge {
		display: inline-flex;
		align-items: center;
		background: rgba($primary, 0.12);
		color: $primary-dk;
		font-size: 12px;
		font-weight: 700;
		padding: 6px 16px;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		width: fit-content;
	}

	&__title {
		font-size: clamp(1.8rem, 4vw, 3rem);
		font-weight: 800;
		color: $dark;
		line-height: 1.1;
		margin: 0;
		letter-spacing: -0.01em;
		word-wrap: break-word;
		overflow-wrap: anywhere;

		:deep(p),
		:deep(h1),
		:deep(h2),
		:deep(h3),
		:deep(h4) {
			display: inline;
			margin: 0;
			padding: 0;
			font: inherit;
			color: inherit;
		}
		img {
			width: 100%;
		}
	}

	&__lead {
		font-size: clamp(0.95rem, 1.5vw, 1.05rem);
		color: $muted;
		line-height: 1.7;
		margin: 0;
		max-width: 60ch;
	}

	&__hero-media {
		position: relative;
		min-width: 0; // critical for grid item to shrink
		max-width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__hero-orb {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 50% 50%,
			rgba($primary, 0.22) 0%,
			transparent 65%
		);
		filter: blur(40px);
		z-index: 0;
		pointer-events: none;
	}

	&__hero-img {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 480px;
		height: auto;
		display: block;
		border-radius: 28px;
		object-fit: cover;
		aspect-ratio: 1;
		box-shadow: 0 24px 60px rgba($primary-dk, 0.18);
		border: 4px solid #fff;
	}

	// ═══ STATS ══════════════════════════════════════════════
	&__stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
		margin-bottom: 64px;

		@include devices(md) {
			grid-template-columns: repeat(2, 1fr);
			gap: 14px;
			margin-bottom: 40px;
		}
		@include devices(xs) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	&__stat {
		background: #fff;
		border: 1px solid $border;
		border-radius: 20px;
		padding: 28px 20px;
		text-align: center;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
		min-width: 0;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 16px 36px rgba($primary-dk, 0.12);
		}

		@include devices(xs) {
			padding: 20px 14px;
		}
	}

	&__stat-value {
		font-size: clamp(1.6rem, 3vw, 2.4rem);
		font-weight: 800;
		color: $primary-dk;
		line-height: 1;
		margin-bottom: 8px;
		background: linear-gradient(135deg, $primary-dk 0%, $primary 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	&__stat-label {
		font-size: 13px;
		font-weight: 500;
		color: $muted;
		line-height: 1.4;
	}

	// ═══ SECTION TITLE ══════════════════════════════════════
	&__section-title {
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 800;
		color: $dark;
		margin: 0 0 32px;
		text-align: center;
		position: relative;
		padding-bottom: 14px;

		&::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 64px;
			height: 3px;
			background: linear-gradient(90deg, $primary-dk, $primary);
			border-radius: 2px;
		}
	}

	// ═══ VALUES ═════════════════════════════════════════════
	&__values {
		margin-bottom: 64px;
		@include devices(sm) {
			margin-bottom: 40px;
		}
	}

	&__values-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;

		@include devices(md) {
			grid-template-columns: 1fr;
			gap: 14px;
		}
	}

	&__value-card {
		background: #fff;
		border: 1px solid $border;
		border-radius: 20px;
		padding: 28px 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease,
			border-color 0.25s ease;
		min-width: 0;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 16px 36px rgba($primary-dk, 0.1);
			border-color: rgba($primary, 0.3);
		}
	}

	&__value-icon {
		width: 52px;
		height: 52px;
		border-radius: 14px;
		background: linear-gradient(135deg, $primary-dk 0%, $primary 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-shadow: 0 8px 18px rgba($primary, 0.3);

		:deep(.icon),
		:deep(svg) {
			width: 24px;
			height: 24px;
			color: #fff;
			fill: #fff;
			stroke: #fff;
		}
		:deep(svg *) {
			fill: #fff !important;
			stroke: #fff !important;
		}
	}

	&__value-title {
		font-size: 18px;
		font-weight: 700;
		color: $dark;
		margin: 4px 0 0;
		line-height: 1.3;
	}

	&__value-text {
		font-size: 14px;
		color: $muted;
		line-height: 1.6;
		margin: 0;
	}

	// ═══ PLACEHOLDER ════════════════════════════════════════
	&__placeholder-card {
		background: #fff;
		border: 1.5px dashed rgba($primary, 0.4);
		border-radius: 20px;
		padding: 32px 24px;
		display: flex;
		align-items: center;
		gap: 16px;
		max-width: 720px;
		margin: 0 auto;

		@include devices(xs) {
			flex-direction: column;
			text-align: center;
			padding: 24px 18px;
		}

		p {
			margin: 0;
			color: $muted;
			font-size: 15px;
			line-height: 1.6;
		}
	}

	&__placeholder-icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		color: $primary;
	}

	// ─── Global image guard (any leaked <img>) ─────────────
	:deep(img) {
		max-width: 100%;
		height: auto;
	}
}
</style>
