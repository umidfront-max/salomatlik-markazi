<script setup>
import { Autoplay } from "swiper/modules";
const props = defineProps({
	isPage: {
		type: Boolean,
		default: false,
	},
	serviecId: {
		type: Number,
		default: 0,
	},
});
const localePath = useLocalePath();
const { list } = useDoctor();
const swiperOptions = {
	modules: [Autoplay],
	slidesPerView: props.isPage ? 4 : 5,
	spaceBetween: 24,
	speed: 1000,
	autoplay: {
		delay: 5000,
		disableOnInteraction: false,
	},
	breakpoints: {
		1440: {
			spaceBetween: 24,
			slidesPerView: 5,
		},
		1300: {
			spaceBetween: 16,
			slidesPerView: 3.7,
		},
		992: {
			spaceBetween: 16,
			slidesPerView: 3.4,
		},
		768: {
			spaceBetween: 16,
			slidesPerView: 2.7,
		},
		616: {
			spaceBetween: 16,
			slidesPerView: 2.3,
		},
		576: {
			spaceBetween: 10,
			slidesPerView: 2,
		},
		456: {
			spaceBetween: 10,
			slidesPerView: 1.7,
		},
		390: {
			spaceBetween: 10,
			slidesPerView: 1.4,
		},
		330: {
			spaceBetween: 10,
			slidesPerView: 1.2,
		},
		0: {
			spaceBetween: 10,
			slidesPerView: "auto",
		},
	},
};
const data = computed(() => {
	if (!props.isPage) {
		return list;
	} else {
		return list.filter((item) => item.service_id === props.serviecId);
	}
});
const gutter = { xs: 16, xl: 20, xxl: 24 };
</script>
<template>
	<section
		class="container section--xs-swiper-auto section pt-100"
		v-if="data?.length"
	>
		<div
			class="section-header"
			data-aos="zoom-in-up"
			data-aos-duration="300"
			data-aos-offset="300"
		>
			<h2 class="section-title">
				{{ $t("doctor.title") }}
			</h2>

			<NuxtLink class="section-link" :to="localePath('/doctor')">
				{{ $t("viewAll") }}
				<Icon class="section-link__icon" name="angle-right" />
			</NuxtLink>
		</div>
		<ClientOnly>
			<Swiper v-bind="swiperOptions">
				<SwiperSlide v-for="(item, index) in data" :key="index">
					<Card
						@click="$router.push(localePath(`/doctor/${item.slug}`))"
						:data="item"
						type="doctor"
						data-aos="flip-left"
						data-aos-duration="300"
						data-aos-offset="300"
						:data-aos-delay="(index + 0) * 150"
					/>
				</SwiperSlide>
			</Swiper>
			<template #fallback>
				<ARow :gutter="[gutter, gutter]">
					<ACol
						:xl="4"
						:lg="6"
						:md="12"
						:sm="12"
						:xs="24"
						v-for="(item, index) in data"
						:key="index"
					>
						<Card
							@click="$router.push(localePath(`/doctor/${item.slug}`))"
							:data="item"
							type="doctor"
						/>
					</ACol>
				</ARow>
			</template>
		</ClientOnly>
	</section>
</template>

<style lang="scss" scoped>
.section {
	::v-deep(.swiper) {
		margin: -8px;
		padding: 8px;
	}
}
</style>
