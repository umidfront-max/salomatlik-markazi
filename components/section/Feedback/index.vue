<script setup>
const { $api } = useNuxtApp();
const { data } = await useAsyncData("reviews", () =>
	$api("reviews", {
		params: {
			limit: 20,
			is_visible_home: true,
		},
	}),
);

const swiperOptions = {
	slidesPerView: 3,
	spaceBetween: 24,
	autoplay: {
		delay: 3500,
		disableOnInteraction: false,
	},
	speed: 800,
	modules: [SwiperAutoplay],
	breakpoints: {
		992: { slidesPerView: 3, spaceBetween: 24 },
		575: { slidesPerView: 2, spaceBetween: 16 },
		0: { slidesPerView: "auto", spaceBetween: 16 },
	},
};
</script>

<template>
	<section v-if="data?.data?.length" class="section">
		<div class="container">
			<div
				class="section-header"
				data-aos="fade-up"
				data-aos-duration="500"
				data-aos-offset="200"
			>
				<h2 class="section-title">{{ $t("feedback.title") }}</h2>
			</div>

			<ClientOnly>
				<Swiper v-bind="swiperOptions" class="reviews-swiper">
					<SwiperSlide
						v-for="(item, index) in data?.data ?? []"
						:key="item.id"
					>
						<SectionFeedbackDefault
							:data="item"
							data-aos="fade-up"
							data-aos-duration="500"
							data-aos-offset="150"
							:data-aos-delay="index * 100"
						/>
					</SwiperSlide>
				</Swiper>

				<template #fallback>
					<div class="reviews-grid">
						<div
							v-for="item in data?.data ?? []"
							:key="item.id"
							class="reviews-grid__col"
						>
							<SectionFeedbackDefault :data="item" />
						</div>
					</div>
				</template>
			</ClientOnly>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
	position: relative;
	padding-bottom: 80px;
	padding-top: 40px;
	&::before {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			transparent 0%,
			rgba(108, 99, 255, 0.03) 40%,
			rgba(72, 191, 227, 0.04) 100%
		);
		pointer-events: none;
	}
}

.section-header {
	text-align: center;
	margin-bottom: 10px;
}

.section-subtitle {
	font-size: 16px;
	color: #888;
	max-width: 480px;
	margin: 0 auto;
	line-height: 1.6;
}

.reviews-swiper {
	padding: 10px;
	:deep(.swiper-slide) {
		height: auto;
	}
}

/* SSR fallback grid */
.reviews-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 24px;

	&__col {
		flex: 1 1 300px;
		min-width: 0;
	}
}
</style>
