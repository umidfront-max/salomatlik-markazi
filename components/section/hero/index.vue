<script setup>
const { $api } = useNuxtApp();

const { data } = await useAsyncData("banner", () =>
	$api("posts", {
		params: {
			category: "banner",
			per_page: 12,
		},
	}),
);

// Temporary: Multiply the list for testing
const multipliedData = computed(() => {
	if (!data.value?.result || data.value.result.length === 0) return [];

	const items = data.value.result;
	// Repeat items 4 times
	return [...items, ...items, ...items, ...items];
});

const activeSlideIndex = ref(0);

const onSlideChange = (swiper) => {
	activeSlideIndex.value = swiper.activeIndex;
};

// Swiper options object
const swiperOptions = {
	slidesPerView: 1,
	spaceBetween: 24,
	autoplay: {
		delay: 6000, // Longer delay to enjoy the animation
		disableOnInteraction: false,
	},
	speed: 1200, // Slower, smoother transition
	effect: "fade", // Added fade effect
	fadeEffect: {
		crossFade: true,
	},
	modules: [SwiperAutoplay, SwiperEffectFade],
};
</script>

<template>
	<section class="section">
		<ClientOnly>
			<Swiper v-bind="swiperOptions" @slideChange="onSlideChange">
				<SwiperSlide
					v-for="(item, index) in multipliedData"
					:key="`${item.id}-${index}`"
				>
					<SectionHeroDefault
						:item="item"
						:index="index"
						:active-index="activeSlideIndex"
					/>
				</SwiperSlide>
			</Swiper>
			<SectionHeroBannerBottom />
			<template #fallback>
				<SectionHeroDefault v-for="item in data?.result" :item="item" />
			</template>
		</ClientOnly>
	</section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
.section {
	position: relative;
	&::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(238, 240, 242, 0.65);
		z-index: -1;
	}
}
</style>
