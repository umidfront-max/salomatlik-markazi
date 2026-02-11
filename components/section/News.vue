<script setup>
const { locale } = useI18n();
const props = defineProps({
	list: {
		type: Array,
		default: () => [],
	},
	isDiseases: {
		type: Boolean,
		default: false,
	},
	hasHeader: {
		type: Boolean,
		default: true,
	},
});
const localePath = useLocalePath();
</script>
<template>
	<section class="section section--xs-swiper-auto">
		<div class="container">
			<div
				v-if="hasHeader"
				class="section-header"
				data-aos="zoom-in-up"
				data-aos-duration="300"
				data-aos-offset="300"
			>
				<h2 class="section-title">
					{{ !isDiseases ? $t("news.title") : $t("diseases") }}
				</h2>
				<NuxtLink
					class="section-link"
					:to="localePath('news')"
					v-if="!isDiseases"
				>
					{{ $t("viewAll") }}
					<Icon class="section-link__icon" name="angle-right" />
				</NuxtLink>
			</div>
			<div class="cards">
				<NuxtLink
					class="card"
					v-for="(item, index) in list"
					:key="index"
					:class="{ active: index === 1 }"
					:to="
						localePath(`/${isDiseases ? 'static' : 'news'}/${item.id}`)
					"
				>
					<div class="card-image" v-show="index === 0">
						<div class="card-image__inner">
							<img :src="item.image" :alt="item.title?.[locale]" />
						</div>
					</div>
					<div class="card-info">
						<h3
							v-html="item.title?.[locale]"
							class="card-info__title"
						></h3>
						<p
							v-html="item.description?.[locale]"
							class="card-info__subtitle"
						></p>
						<div class="card-info__bottom">
							<span class="card-info__date" v-if="item.createdAt">
								<Icon name="calendar" />
								{{ item.createdAt?.substring(0, 10) }}
							</span>
							<Btn :size="48" color="red-1" :data-text="$t('more')">
								{{ $t("more") }}
							</Btn>
						</div>
					</div>
				</NuxtLink>
			</div>
		</div>
	</section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
	position: relative;
}

.cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(4, 1fr);
	grid-column-gap: var(--space-24);
	grid-row-gap: var(--space-24);

	@include devices(sm) {
		display: flex;
		flex-direction: column;
		row-gap: 12px;
	}
}

.card {
	box-shadow: 0 2px 30px #26364b1a;
	background: var(--white-1);
	display: flex;
	flex-direction: column;
	padding: var(--space-20);
	border-radius: 12px;

	&-image {
		margin-bottom: var(--space-20);

		&__inner {
			aspect-ratio: 1.89;

			img {
				@include image;
				border-radius: var(--space-20);
			}
		}
	}

	&-info {
		display: flex;
		flex-direction: column;
		flex: 1;

		&__title {
			@include text(24, var(--black-1), 700, 140%);
			@include slice(2);
			margin-bottom: 12px;
		}

		&__subtitle {
			@include text(20, var(--black-1), 300, 150%);
			@include slice(3);
			margin-bottom: var(--space-20);
		}

		&__bottom {
			display: flex;
			align-items: flex-end;
			margin-top: auto;
			flex-wrap: wrap;
			row-gap: 4px;
		}

		&__date {
			@include text(18, var(--black-1), 500, 150%);
			display: flex;
			align-items: center;
			gap: 6px;
			margin-right: auto;

			.icon {
				--icon-size: 20px;
				--icon-color: var(--black-1);
			}
		}
	}

	&:nth-child(1) {
		grid-area: 1 / 2 / 5 / 4;
	}

	&:nth-child(2) {
		grid-area: 1 / 1 / 3 / 2;
	}

	&:nth-child(3) {
		grid-area: 1 / 4 / 3 / 5;
	}

	&:nth-child(4) {
		grid-area: 3 / 1 / 5 / 2;
	}

	&:nth-child(5) {
		grid-area: 3 / 4 / 5 / 5;
	}
}
</style>
