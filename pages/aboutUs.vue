<script setup>
const { locale, t } = useI18n();
const { list: setting } = useSetting();

useHead({
	title: computed(() => t("aboutUs")),
});
</script>

<template>
	<div>
		<SectionBreadcrumbs />
		<section class="about">
		<div class="container about__inner">
			<div
				v-if="setting?.aboutUs?.[locale]"
				class="about__content"
				v-html="setting.aboutUs[locale]"
			></div>
			<p v-else class="about__placeholder">
				{{ $t("aboutUs") }}
			</p>
			</div>
		</section>
	</div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

.about {
	padding: 0 0 80px;

	@include devices(sm) {
		padding: 0 0 40px;
	}

	&__inner {
		max-width: 960px;
		margin: 0 auto;
	}

	&__content {
		font-size: 16px;
		line-height: 1.75;
		color: #1e293b;

		:deep(p) {
			margin: 0 0 14px;
		}

		:deep(h1),
		:deep(h2),
		:deep(h3),
		:deep(h4) {
			color: #03182b;
			font-weight: 700;
			margin: 24px 0 12px;
			line-height: 1.3;
		}

		:deep(h1) { font-size: clamp(1.6rem, 3vw, 2.2rem); }
		:deep(h2) { font-size: clamp(1.4rem, 2.5vw, 1.8rem); }
		:deep(h3) { font-size: clamp(1.2rem, 2vw, 1.4rem); }

		:deep(ul),
		:deep(ol) {
			padding-left: 22px;
			margin: 0 0 14px;
		}

		:deep(li) {
			margin-bottom: 6px;
		}

		:deep(img) {
			max-width: 100%;
			height: auto;
			border-radius: 16px;
			display: block;
			margin: 16px auto;
		}

		:deep(a) {
			color: rgba(15, 82, 159, 1);
			text-decoration: underline;
		}
	}

	&__placeholder {
		text-align: center;
		color: #64748b;
		font-size: 16px;
		padding: 32px 0;
	}
}
</style>
