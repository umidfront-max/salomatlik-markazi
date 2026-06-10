<script setup>
const { locale, t } = useI18n();
const { $api } = useNuxtApp();

const [{ data: about }, { data: teamRaw }] = await Promise.all([
	useAsyncData("about-us", () => $api("about-us")),
	useAsyncData("team-members", () => $api("team-members")),
]);

// Normalize team list (handles {data: []} or raw array, sorts by orderIndex)
const API_BASE = "https://api-his.wemard.uz";
const isValidUrl = (u) =>
	typeof u === "string" && u.length > 0 && u !== "[object Object]" &&
	(u.startsWith("http") || u.startsWith("/"));

const team = computed(() => {
	const raw = Array.isArray(teamRaw.value) ? teamRaw.value : teamRaw.value?.data ?? [];
	return raw
		.filter((m) => m.isActive !== false)
		.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
		.map((m) => ({
			...m,
			imageUrl: isValidUrl(m.imageUrl)
				? (m.imageUrl.startsWith("http") ? m.imageUrl : API_BASE + m.imageUrl)
				: null,
		}));
});

// Localized fields
const title    = computed(() => about.value?.title?.[locale.value] || t("aboutUs"));
const subtitle = computed(() => about.value?.subtitle?.[locale.value] || "");
const description = computed(() => about.value?.description?.[locale.value] || "");
const hasDescription = computed(() => description.value.replace(/<[^>]*>/g, "").trim().length > 0);

// Sorted images (by orderIndex)
const images = computed(() =>
	[...(about.value?.images ?? [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
);
const mainImage = computed(() => images.value[0]?.url);
const galleryImages = computed(() => images.value.slice(1));

// SEO
useHead({
	title: computed(() => about.value?.metaTitle?.[locale.value] || title.value),
	meta: [
		{ name: "description", content: computed(() => about.value?.metaDescription?.[locale.value] || "") },
		{ property: "og:title", content: computed(() => about.value?.metaTitle?.[locale.value] || title.value) },
		{ property: "og:description", content: computed(() => about.value?.metaDescription?.[locale.value] || "") },
		{ property: "og:image", content: computed(() => mainImage.value || "") },
	],
});

// Static value cards (the brand promise — supplements API data)
const values = [
	{
		icon: "check-circle",
		title: { uz: "Sifat va xavfsizlik", ru: "Качество и безопасность", en: "Quality & Safety" },
		text:  { uz: "Zamonaviy uskunalar va sertifikatlangan standartlar.",
		         ru: "Современное оборудование и сертифицированные стандарты.",
		         en: "Modern equipment and certified standards." },
	},
	{
		icon: "consultant",
		title: { uz: "Tajribali jamoa", ru: "Опытная команда", en: "Experienced Team" },
		text:  { uz: "Yuqori malakali shifokorlar va xodimlar.",
		         ru: "Высококвалифицированные врачи и сотрудники.",
		         en: "Highly qualified doctors and staff." },
	},
	{
		icon: "star",
		title: { uz: "Individual yondashuv", ru: "Индивидуальный подход", en: "Personalized Care" },
		text:  { uz: "Har bir bemorga shaxsiy davolash rejasi.",
		         ru: "Персональный план лечения для каждого пациента.",
		         en: "Personalized treatment plan for every patient." },
	},
];
</script>

<template>
	<div>
		<SectionBreadcrumbs />

		<section class="about" v-if="about">
			<div class="container about__inner">

				<!-- ── HERO ─────────────────────────────────────── -->
				<div class="about__hero">
					<div class="about__hero-text">
						<span class="about__badge">{{ $t("aboutUs") }}</span>
						<h1 class="about__title">{{ title }}</h1>
						<p v-if="subtitle" class="about__subtitle">{{ subtitle }}</p>
					</div>

					<div v-if="mainImage" class="about__hero-media">
						<div class="about__hero-orb" aria-hidden="true"></div>
						<img
							:src="mainImage"
							:alt="title"
							class="about__hero-img"
							loading="lazy"
						/>
					</div>
				</div>

				<!-- ── VALUES (static) ─────────────────────────── -->
				<div class="about__values">
					<div
						v-for="(v, i) in values"
						:key="i"
						class="about__value"
					>
						<div class="about__value-icon">
							<Icon :name="v.icon" />
						</div>
						<h3 class="about__value-title">{{ v.title[locale] }}</h3>
						<p class="about__value-text">{{ v.text[locale] }}</p>
					</div>
				</div>

				<!-- ── DESCRIPTION (API HTML) ──────────────────── -->
				<div v-if="hasDescription" class="about__content" v-html="description" />

				<!-- ── GALLERY (extra images) ──────────────────── -->
				<div v-if="galleryImages.length" class="about__gallery">
					<h2 class="about__section-title">
						{{ locale === "ru" ? "Галерея"
						 : locale === "en" ? "Gallery"
						 : "Galereya" }}
					</h2>
					<div class="about__gallery-grid">
						<a
							v-for="img in galleryImages"
							:key="img.id"
							:href="img.url"
							data-fancybox="about-gallery"
							class="about__gallery-item"
						>
							<img :src="img.url" :alt="title" loading="lazy" />
						</a>
					</div>
				</div>

				<!-- ── TEAM MEMBERS ────────────────────────────── -->
				<div v-if="team.length" class="about__team">
					<h2 class="about__section-title">{{ $t("team.title") }}</h2>
					<p class="about__team-sub">
						{{ locale === "ru" ? "Профессионалы, которым вы можете доверять"
						 : locale === "en" ? "Professionals you can trust"
						 : "Sizning ishonchingizga arzigulik mutaxassislar" }}
					</p>

					<div class="about__team-grid">
						<div
							v-for="(m, i) in team"
							:key="m.id"
							class="team-card"
							:style="{ '--i': i }"
						>
							<div class="team-card__img-wrap">
								<img
									v-if="m.imageUrl"
									:src="m.imageUrl"
									:alt="m.name?.[locale]"
									class="team-card__img"
									loading="lazy"
								/>
								<div v-else class="team-card__img-placeholder">
									<Icon name="consultant" />
								</div>

								<div v-if="m.linkedinUrl || m.instagramUrl" class="team-card__social">
									<a
										v-if="m.linkedinUrl"
										:href="m.linkedinUrl"
										target="_blank"
										rel="noopener"
										class="team-card__social-link"
										aria-label="LinkedIn"
									>
										<Icon name="linkedin" />
									</a>
									<a
										v-if="m.instagramUrl"
										:href="m.instagramUrl"
										target="_blank"
										rel="noopener"
										class="team-card__social-link"
										aria-label="Instagram"
									>
										<Icon name="instagram" />
									</a>
								</div>
							</div>

							<div class="team-card__body">
								<h3 class="team-card__name">{{ m.name?.[locale] }}</h3>
								<span v-if="m.role?.[locale]" class="team-card__role">
									{{ m.role[locale] }}
								</span>
								<div
									v-if="m.bio?.[locale]"
									class="team-card__bio"
									v-html="m.bio[locale]"
								></div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</section>
	</div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

$primary:    #33c1ed;
$primary-dk: rgba(15, 82, 159, 1);
$dark:       #03182b;
$muted:      #64748b;
$border:     rgba(2, 10, 20, 0.08);

.about {
	padding: 0 0 80px;

	@include devices(sm) { padding: 0 0 48px; }

	&__inner {
		--width-container: 1280px;
		max-width: 1280px;
	}

	// ═══ HERO ═══════════════════════════════════════════════
	&__hero {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 48px;
		align-items: center;
		margin-bottom: 72px;

		@include devices(md) {
			grid-template-columns: 1fr;
			gap: 32px;
			margin-bottom: 48px;
		}
	}

	&__hero-text {
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-width: 0;
		animation: fadeUp 0.6s ease-out;
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
	}

	&__subtitle {
		font-size: clamp(0.95rem, 1.5vw, 1.1rem);
		color: $muted;
		line-height: 1.7;
		margin: 0;
		max-width: 60ch;
	}

	&__hero-media {
		position: relative;
		min-width: 0;
		max-width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeUp 0.6s ease-out 0.15s backwards;
	}

	&__hero-orb {
		position: absolute;
		inset: -20px;
		background: radial-gradient(
			circle at 50% 50%,
			rgba($primary, 0.25) 0%,
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
		max-width: 520px;
		height: auto;
		display: block;
		border-radius: 28px;
		object-fit: cover;
		aspect-ratio: 4 / 3;
		box-shadow: 0 24px 60px rgba($primary-dk, 0.18);
		border: 4px solid #fff;
		transition: transform 0.4s ease;

		&:hover { transform: scale(1.02); }
	}

	// ═══ VALUES ═════════════════════════════════════════════
	&__values {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin-bottom: 64px;

		@include devices(md) { grid-template-columns: 1fr; gap: 14px; margin-bottom: 48px; }
	}

	&__value {
		background: #fff;
		border: 1px solid $border;
		border-radius: 20px;
		padding: 28px 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
		animation: fadeUp 0.55s ease-out backwards;
		min-width: 0;

		&:nth-child(1) { animation-delay: 0.1s; }
		&:nth-child(2) { animation-delay: 0.2s; }
		&:nth-child(3) { animation-delay: 0.3s; }

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
		:deep(svg *) { fill: #fff !important; stroke: #fff !important; }
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

	// ═══ DESCRIPTION (API HTML) ═══════════════════════════
	&__content {
		background: #fff;
		border: 1px solid $border;
		border-radius: 20px;
		padding: 36px 40px;
		font-size: 16px;
		line-height: 1.75;
		color: #1e293b;
		margin-bottom: 56px;

		@include devices(sm) { padding: 24px 20px; margin-bottom: 40px; }

		:deep(p) { margin: 0 0 14px; }
		:deep(p:last-child) { margin-bottom: 0; }

		:deep(h1), :deep(h2), :deep(h3), :deep(h4) {
			color: $dark;
			font-weight: 700;
			margin: 24px 0 12px;
			line-height: 1.3;
		}
		:deep(h1) { font-size: clamp(1.6rem, 3vw, 2.2rem); }
		:deep(h2) { font-size: clamp(1.4rem, 2.5vw, 1.8rem); }
		:deep(h3) { font-size: clamp(1.2rem, 2vw, 1.4rem); }
		:deep(h4) { font-size: 1.1rem; }

		:deep(ul), :deep(ol) { padding-left: 22px; margin: 0 0 14px; }
		:deep(li) { margin-bottom: 6px; }

		:deep(strong) { color: $dark; }

		:deep(blockquote) {
			border-left: 4px solid $primary;
			background: rgba($primary, 0.05);
			padding: 14px 18px;
			margin: 18px 0;
			border-radius: 0 10px 10px 0;
			font-style: italic;
		}

		:deep(img) {
			max-width: 100%;
			height: auto;
			border-radius: 14px;
			display: block;
			margin: 18px auto;
		}

		:deep(a) {
			color: $primary-dk;
			text-decoration: underline;
		}
	}

	// ═══ SECTION TITLE ═════════════════════════════════════
	&__section-title {
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 800;
		color: $dark;
		margin: 0 0 28px;
		text-align: center;
		position: relative;
		padding-bottom: 14px;

		&::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 56px;
			height: 3px;
			background: linear-gradient(90deg, $primary-dk, $primary);
			border-radius: 2px;
		}
	}

	// ═══ GALLERY ═══════════════════════════════════════════
	&__gallery {
		margin-top: 16px;
	}

	&__gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;

		@include devices(md) { grid-template-columns: repeat(2, 1fr); }
		@include devices(xs) { grid-template-columns: 1fr; }
	}

	&__gallery-item {
		display: block;
		border-radius: 16px;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		background: #f5f8fb;
		cursor: zoom-in;
		transition: transform 0.3s ease, box-shadow 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 16px 32px rgba($primary-dk, 0.18);
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 0.4s ease;
		}

		&:hover img { transform: scale(1.06); }
	}
}

// ══════════════════════════════════════════════════════════════
//  TEAM MEMBERS
// ══════════════════════════════════════════════════════════════
.about__team {
	margin-top: 64px;

	@include devices(sm) { margin-top: 40px; }
}

.about__team-sub {
	font-size: 14.5px;
	color: $muted;
	text-align: center;
	margin: -18px 0 28px;
}

.about__team-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 22px;

	@include devices(lg) { gap: 16px; }
	@include devices(md) { grid-template-columns: repeat(2, 1fr); }
	@include devices(xs) { grid-template-columns: 1fr; gap: 14px; }
}

.team-card {
	background: #fff;
	border: 1px solid $border;
	border-radius: 20px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	animation: fadeUp 0.55s ease-out backwards;
	animation-delay: calc(var(--i, 0) * 0.08s);

	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 20px 48px rgba($primary-dk, 0.14);
		border-color: rgba($primary, 0.4);

		.team-card__img { transform: scale(1.06); }
		.team-card__social { opacity: 1; transform: translateY(0); }
	}

	&__img-wrap {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 5;
		overflow: hidden;
		background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary-dk, 0.08));
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
		display: block;
		transition: transform 0.5s ease;
	}

	&__img-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba($primary-dk, 0.3);

		:deep(svg) { width: 56px; height: 56px; }
	}

	// Social overlay (slides up on hover)
	&__social {
		position: absolute;
		bottom: 14px;
		left: 14px;
		right: 14px;
		display: flex;
		gap: 10px;
		justify-content: center;
		opacity: 0;
		transform: translateY(12px);
		transition: opacity 0.3s ease, transform 0.3s ease;
	}

	&__social-link {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		color: $primary-dk;
		text-decoration: none;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
		transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;

		&:hover {
			background: $primary-dk;
			color: #fff;
			transform: translateY(-3px) scale(1.05);

			:deep(svg) { color: #fff; fill: #fff; stroke: #fff; }
		}

		:deep(svg) {
			width: 18px;
			height: 18px;
			color: currentColor;
			fill: currentColor;
			stroke: currentColor;
		}
	}

	&__body {
		padding: 20px 22px 24px;
		display: flex;
		flex-direction: column;
		gap: 4px;

		@include devices(xs) { padding: 16px 18px 20px; }
	}

	&__name {
		font-size: 18px;
		font-weight: 800;
		color: $dark;
		margin: 0;
		line-height: 1.3;
	}

	&__role {
		font-size: 13px;
		font-weight: 600;
		color: $primary-dk;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	&__bio {
		font-size: 13.5px;
		color: $muted;
		line-height: 1.6;
		margin: 6px 0 0;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;

		// Render bio HTML as plain inline text
		:deep(p),
		:deep(div),
		:deep(span) {
			display: inline;
			margin: 0;
			padding: 0;
			font: inherit;
			color: inherit;
			line-height: inherit;
		}
		:deep(br) { display: none; }
	}
}

@keyframes fadeUp {
	from { opacity: 0; transform: translateY(18px); }
	to   { opacity: 1; transform: translateY(0); }
}
</style>
