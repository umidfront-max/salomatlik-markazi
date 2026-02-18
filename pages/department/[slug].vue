<script setup>
const { locale } = useI18n();
const { list: services } = useService();
const { list: news } = useNews();
const { list: diseases } = useDiseases();
const { list: doctors } = useDoctor();
const { list: galery } = useGallery();

const route = useRoute();
const { $api } = useNuxtApp();
const localePath = useLocalePath();

const { data: department } = await useAsyncData(
	`department_${route.params.slug}`,
	() => $api(`/departments/${route.params.slug}`),
);

const filteredServices = computed(() =>
	services.filter((el) => el.department?.id == route.params.slug),
);
const filteredNews = computed(() =>
	news.filter((el) => el.department?.id == route.params.slug),
);
const filteredDiseases = computed(() =>
	diseases.filter((el) => el.department?.id == route.params.slug),
);
const filteredDoctors = computed(() =>
	doctors.filter((el) => el.department?.id == route.params.slug),
);
const filteredGallery = computed(() =>
	(galery ?? []).filter((el) => el.department?.id == route.params.slug),
);
</script>

<template>
	<section class="department">
		<!-- Decorative background elements -->
		<div class="bg-orb bg-orb--1" aria-hidden="true"></div>
		<div class="bg-orb bg-orb--2" aria-hidden="true"></div>
		<div class="bg-grid" aria-hidden="true"></div>

		<div class="container">
			<!-- ─── HERO ─── -->
			<div class="hero" data-aos="fade-up" data-aos-duration="700">
				<h1 class="hero__title">{{ department?.title?.[locale] }}</h1>
				<p class="hero__subtitle">{{ department?.subTitle?.[locale] }}</p>
			</div>

			<div
				class="hero__image-wrap"
				data-aos="zoom-in"
				data-aos-duration="800"
				data-aos-delay="150"
			>
				<div class="hero__image-glow"></div>
				<img
					:src="department?.image"
					:alt="department?.title?.[locale]"
					class="hero__image"
				/>
				<div class="hero__image-overlay"></div>
			</div>

			<div
				class="hero__desc prose"
				data-aos="fade-up"
				data-aos-duration="600"
				data-aos-delay="200"
			>
				<span v-html="department?.description?.[locale]"></span>
			</div>

			<!-- ─── SERVICES ─── -->
			<div
				class="section-header"
				data-aos="fade-right"
				data-aos-duration="600"
			>
				<h2 class="section-title">{{ $t("service.title3") }}</h2>
				<div class="section-line"></div>
			</div>
			<CardServicePrice :list="filteredServices" />
			<!-- <ARow class="service__grid" :gutter="[10, 10]">
				<ACol
					v-for="service in filteredServices"
					:key="service.id"
					class="col-5"
				>
				</ACol>
			</ARow> -->

			<!-- ─── NEWS ─── -->
			<div
				class="section-header"
				data-aos="fade-right"
				data-aos-duration="600"
			>
				<h2 class="section-title">{{ $t("news.title") }}</h2>
				<div class="section-line"></div>
			</div>
			<SectionNews :list="filteredNews" :has-header="false" />

			<!-- ─── DISEASES ─── -->
			<div
				class="section-header"
				data-aos="fade-right"
				data-aos-duration="600"
			>
				<h2 class="section-title">{{ $t("diseases") }}</h2>
				<div class="section-line"></div>
			</div>
			<SectionNews :list="filteredDiseases" :has-header="false" />

			<!-- ─── DOCTORS ─── -->
			<div
				class="section-header"
				data-aos="fade-right"
				data-aos-duration="600"
			>
				<h2 class="section-title">{{ $t("doctor.title") }}</h2>
				<div class="section-line"></div>
			</div>

			<ARow :gutter="[{ xxl: 24, xl: 20, sm: 16, xs: 12 }, 32]">
				<ACol
					v-for="(item, index) in filteredDoctors"
					:key="index"
					:xl="6"
					:md="8"
					:sm="12"
					:xs="24"
				>
					<div
						class="doctor-card-wrap"
						data-aos="fade-up"
						data-aos-duration="500"
						:data-aos-delay="index * 60"
					>
						<Card
							@click="$router.push(localePath(`/doctor/${item.id}`))"
							:data="item"
							type="doctor"
						/>
					</div>
				</ACol>
			</ARow>

			<!-- ─── GALLERY / VIDEO ─── -->
			<div
				class="section-header"
				data-aos="fade-right"
				data-aos-duration="600"
			>
				<h2 class="section-title">{{ $t("video.title") }}</h2>
				<div class="section-line"></div>
			</div>

			<ARow :gutter="[20, 20]">
				<ACol
					:xl="6"
					:lg="8"
					:sm="12"
					:xs="24"
					v-for="(item, index) in filteredGallery"
					:key="index"
					data-aos="zoom-in"
					data-aos-duration="500"
					:data-aos-delay="index * 60"
				>
					<div class="gallery-item">
						<SectionVideoDefault :data="item" />
					</div>
				</ACol>
			</ARow>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

/* ── CSS Variables ──────────────────────────────── */
:root {
	--clr-primary: #0a2241;
	--clr-accent: #1e6bff;
	--clr-accent-lt: #e8f1ff;
	--clr-text: #1e293b;
	--clr-muted: #64748b;
	--clr-bg: #f4f7ff;
	--clr-white: #ffffff;
	--radius-lg: 24px;
	--radius-md: 16px;
	--shadow-card: 0 8px 32px rgba(10, 34, 65, 0.1);
	--shadow-hover: 0 20px 60px rgba(30, 107, 255, 0.18);
	--transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Reset / Base ───────────────────────────────── */
.department {
	position: relative;
	padding: 80px 0 100px;
	background: var(--clr-bg);
	overflow: hidden;
	min-height: 100vh;
}

/* ── Background decorations ─────────────────────── */
.bg-orb {
	position: absolute;
	border-radius: 50%;
	filter: blur(90px);
	pointer-events: none;
	opacity: 0.55;
	animation: float 12s ease-in-out infinite alternate;

	&--1 {
		width: 520px;
		height: 520px;
		background: radial-gradient(circle, #c7d9ff 0%, transparent 70%);
		top: -180px;
		left: -150px;
	}
	&--2 {
		width: 420px;
		height: 420px;
		background: radial-gradient(circle, #d4eaff 0%, transparent 70%);
		bottom: 60px;
		right: -140px;
		animation-delay: -6s;
	}
}

.bg-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(30, 107, 255, 0.04) 1px, transparent 1px),
		linear-gradient(90deg, rgba(30, 107, 255, 0.04) 1px, transparent 1px);
	background-size: 48px 48px;
	pointer-events: none;
}

@keyframes float {
	from {
		transform: translateY(0px) scale(1);
	}
	to {
		transform: translateY(30px) scale(1.04);
	}
}

/* ── Container ──────────────────────────────────── */
.container {
	max-width: 1400px;
	width: 100%;
	padding: 0 24px;
	margin: 0 auto;
	position: relative;
	z-index: 1;
}

/* ── Hero ───────────────────────────────────────── */
.hero {
	margin-bottom: 48px;

	&__title {
		font-size: clamp(1.6rem, 3.5vw, 3rem) !important;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		margin-bottom: 20px;
		background-clip: text;
	}

	&__subtitle {
		font-size: clamp(1rem, 2vw, 1.2rem);
		max-width: 680px;
		margin: 0 auto;
		line-height: 1.75;
		position: relative;
		display: inline-block;
		background-clip: text;
		animation: subtitle-flow 6s ease infinite;
		font-weight: 500;
	}
}

@keyframes subtitle-flow {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

/* ── Hero Image ─────────────────────────────────── */
.hero__image-wrap {
	position: relative;
	margin-bottom: 56px;

	&::before {
		content: "";
		position: absolute;
		inset: -2px;
		border-radius: calc(var(--radius-lg) + 4px);
		background: linear-gradient(
			135deg,
			var(--clr-accent),
			#7bb8ff,
			var(--clr-accent)
		);
		background-size: 200% 200%;
		animation: gradient-border 4s ease infinite;
		z-index: 0;
		opacity: 0;
		transition: opacity var(--transition);
	}

	&:hover::before {
		opacity: 1;
	}
}

.hero__image-glow {
	position: absolute;
	inset: 20px;
	background: radial-gradient(
		ellipse,
		rgba(30, 107, 255, 0.2) 0%,
		transparent 70%
	);
	border-radius: var(--radius-lg);
	filter: blur(30px);
	pointer-events: none;
	z-index: 0;
}

.hero__image {
	position: relative;
	z-index: 1;
	width: 100%;
	max-width: 940px;
	display: block;
	margin: 0 auto;
	border-radius: var(--radius-lg);
	object-fit: cover;
	max-height: 500px;
	box-shadow: var(--shadow-card);
	transition:
		transform var(--transition),
		box-shadow var(--transition);
	border-radius: 10px;
	.hero__image-wrap:hover & {
		box-shadow: var(--shadow-hover);
	}

	@include devices(sm) {
		max-height: 240px;
		border-radius: var(--radius-md);
	}
}

.hero__image-overlay {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: min(940px, 100%);
	height: 120px;
	background: linear-gradient(to top, var(--clr-bg), transparent);
	border-radius: 0 0 var(--radius-lg) var(--radius-lg);
	pointer-events: none;
	z-index: 2;
}

@keyframes gradient-border {
	0%,
	100% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
}

/* ── Hero Description ───────────────────────────── */
.hero__desc {
	margin: 0 auto 34px;
	font-size: 1.05rem;
	line-height: 1.8;
	color: var(--clr-text);
	padding: 16px 0px;
	background: var(--clr-white);

	position: relative;
	overflow: hidden;

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 4px;
		height: 100%;
		background: linear-gradient(180deg, var(--clr-accent), #7bb8ff);
		border-radius: 4px 0 0 4px;
	}

	@include devices(sm) {
		padding: 4px 0px;
	}
}

/* ── Section Headers ────────────────────────────── */
.section-header {
	margin-top: 72px;
	margin-bottom: 36px;
	position: relative;
}

.section-title {
	font-size: clamp(1.6rem, 3.5vw, 3rem);
	font-weight: 700;
	color: var(--clr-primary);
	line-height: 1.15;
	letter-spacing: -0.02em;
	margin-bottom: 16px;
}

.section-line {
	width: 64px;
	height: 4px;
	background: linear-gradient(90deg, var(--clr-accent), #7bb8ff);
	border-radius: 4px;
	position: relative;
	overflow: hidden;

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.7),
			transparent
		);
		animation: shimmer 2s ease-in-out infinite;
	}
}

@keyframes shimmer {
	from {
		transform: translateX(-100%);
	}
	to {
		transform: translateX(200%);
	}
}

/* ── Service Grid ───────────────────────────────── */
.service__grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 10px;

	@media (max-width: 1200px) {
		grid-template-columns: repeat(4, 1fr);
	}

	@media (max-width: 992px) {
		grid-template-columns: repeat(3, 1fr);
	}

	@media (max-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 480px) {
		grid-template-columns: repeat(2, 1fr);
	}
}

.service-link {
	display: block;
	border-radius: var(--radius-md);
	transition: transform var(--transition);

	&:hover {
		transform: translateY(-6px);
	}
}

/* ── Doctor Card ────────────────────────────────── */
.doctor-card-wrap {
	border-radius: var(--radius-md);
	transition:
		transform var(--transition),
		box-shadow var(--transition);
	cursor: pointer;

	&:hover {
		transform: translateY(-8px);
		box-shadow: var(--shadow-hover);
	}
}

/* ── Gallery ────────────────────────────────────── */
.gallery-item {
	border-radius: var(--radius-md);
	overflow: hidden;
	transition:
		transform var(--transition),
		box-shadow var(--transition);

	&:hover {
		transform: scale(1.03);
		box-shadow: var(--shadow-hover);
	}
}
</style>
