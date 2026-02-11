<script setup>
const route = useRoute();
const { locale } = useI18n()
const { $api } = useNuxtApp();
const { data: doctors } = await useAsyncData(
	`doctor_${route.params.slug}`,
	() =>
		$api(`doctors/${route.params.slug}`, {
			params: {
				category: "banner",
				limit: 12,
			},
		}),
);
// const { data: education } = await useAsyncData(
//   `education_${route.params.slug}`,
//   () =>
//     $api("posts", {
//       params: {
//         category: route.params.slug.toString(),
//         limit: 12,
//       },
//     })
// );
// const { data: news } = await useAsyncData(
//   `news_by_doctor_${detail.value.id}`,
//   () =>
//     $api("news", {
//       params: {
//         limit: 8,
//         doctor_id: detail.value.id,
//       },
//     })
// );

const swiperOptions = {
	modules: [SwiperNavigation],
	slidesPerView: "auto",
	spaceBetween: 24,
	loop: true,
	navigation: {
		nextEl: `.gallery-nav .nav-next`,
		prevEl: `.gallery-nav .nav-prev`,
	},
};

// useCustomHead(detail.value);
</script>
<template>
	<section class="section pb-100 container">
		<DoctorDetailCard type="doctor" :data="doctors" class="doctor-detail" />
		<h3 class="section-subtitle">{{ $t("doctor.about") }}</h3>
		<div
			class="section-content"
			v-html="doctors.description?.[locale]"
			v-if="doctors.description?.[locale]"
		></div>
		<h3 class="section-subtitle">{{ $t("doctor.education") }}</h3>
		<div class="section-education">
			<div
				class="section-education__item"
				v-for="(item, ind) in doctors?.educations ?? []"
				:key="ind"
			>
				<i class="section-education__circle"></i>
				<span class="section-education__year">{{ item.degree?.[locale]}}</span>
				<span class="section-education__title">{{
					item.institution?.[locale]
				}}</span>
				<p class="section-education__title">{{ item.title?.[locale] }}</p>
			</div>
		</div>
	</section>
	<!-- <SectionNews :is-page="true" :list="news?.data ?? []" class="pb-80" />
	<section class="section container pt-80">
		<div class="section-header">
			<h2 class="section-title">{{ $t("gallery") }}</h2>
			<Nav class="gallery-nav section-nav" />
		</div>
		<ClientOnly>
			<Swiper v-bind="swiperOptions">
				<SwiperSlide
					class="section-slide"
					v-for="item in detail.media_list ?? []"
				>
					<Image :src="item.link ?? ''" />
				</SwiperSlide>
			</Swiper>
			<template #fallback>
				<div
					class="image"
					v-for="item in detail.media_list ?? []"
					style="aspect-ratio: 1.38"
				>
					<img :src="item.link" :alt="detail.title" />
				</div>
			</template>
		</ClientOnly>
	</section> -->
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
	--width-container: 1520px;
	padding-top: var(--space-40);

	&-slide {
		width: 400px;

		:deep(.image img) {
			object-position: top center;
			border-radius: 12px;
		}
	}

	&-subtitle {
		@include text(32, #03182b, 700, 140%);
		margin-bottom: var(--space-16);
		margin-top: var(--space-80);
	}

	&-education {
		--items-space: var(--space-40);
		--square-size: 32px;

		&__item {
			display: flex;
			flex-direction: column;
			position: relative;
			padding-left: calc(var(--square-size) + var(--space-16));

			&:not(:last-child) {
				&::after {
					content: "";
					position: absolute;
					left: calc(var(--square-size) / 2);
					top: var(--square-size);
					bottom: calc(0px - var(--items-space));
					border-right: 1px dashed #848d9f;
				}
			}

			&:not(:last-child) {
				margin-bottom: var(--items-space);
			}
		}

		&__circle {
			width: var(--square-size);
			height: var(--square-size);
			position: absolute;
			top: 0;
			left: 0;
			border: 1px dashed #848d9f;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;

			&::after {
				content: "";
				width: calc(100% - 12px);
				height: calc(100% - 12px);
				background-color: var(--primary-1);
				border-radius: 6px;
			}
		}

		&__year {
			@include text(24, #03182b, 700, 150%);
			margin-bottom: 2px;
		}

		&__title {
			@include text(20, #03182b, 400, 150%);
		}
	}
}
</style>
