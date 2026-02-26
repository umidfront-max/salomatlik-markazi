<script setup>
const localePath = useLocalePath();
const { $api } = useNuxtApp();
const { data } = await useAsyncData("video_home", () =>
	$api("gallery", {
		params: {
			limit: 8,
		},
	}),
);
const swiperOptions = {
	slidesPerView: 4,
	spaceBetween: 24,
	breakpoints: {
		1440: {
			spaceBetween: 24,
		},
		1200: {
			spaceBetween: 20,
		},
		992: {
			slidesPerView: 4,
			spaceBetween: 24,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 24,
		},
		576: {
			slidesPerView: 2,
			spaceBetween: 24,
		},
		0: {
			spaceBetween: 24,
			slidesPerView: "auto",
		},
	},
};
</script>
<template>
	<section
		v-if="data?.data?.length"
		class="section video container section--xs-swiper-auto"
	>
		<div
			class="section-header"
			data-aos="zoom-in-up"
			data-aos-duration="300"
			data-aos-offset="300"
		>
			<h2 class="section-title">
				{{ $t("video.title") }}
			</h2>
			<NuxtLink class="section-link" :to="localePath('/video')">
				{{ $t("viewAll") }}
				<Icon class="section-link__icon" name="angle-right" />
			</NuxtLink>
		</div>
		<ClientOnly>
			<Swiper v-bind="swiperOptions">
				<SwiperSlide v-for="(item, index) in data?.data ?? []" :key="index">
					<SectionVideoDefault
						:data="item"
						data-aos="fade-up"
						data-aos-duration="300"
						data-aos-offset="300"
						:data-aos-delay="index * 150"
					/>
				</SwiperSlide>
			</Swiper>
			<template #fallback>
				<ARow :gutter="[16, 16]">
					<ACol
						v-for="(item, index) in data?.data ?? []"
						:key="index"
						:lg="6"
						:md="8"
						:sm="12"
						:xs="24"
					>
						<SectionVideoDefault :data="item" :key="index" />
					</ACol>
				</ARow>
			</template>
		</ClientOnly>
	</section>
</template>
