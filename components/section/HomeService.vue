<script setup lang="ts">
import { Autoplay, Navigation } from "swiper/modules";

const localePath = useLocalePath();
const { list } = useService();

// custom nav button refs
const prevEl = ref<HTMLElement | null>(null);
const nextEl = ref<HTMLElement | null>(null);

const swiperModules = [Autoplay, Navigation];

const swiperOptions = computed(() => ({
	loop: true,
	speed: 700,
	centeredSlides: false,
	slidesPerView: 1,
	spaceBetween: 10,
	autoplay: {
		delay: 4000,
		disableOnInteraction: false,
		pauseOnMouseEnter: true,
	},
	navigation: {
		prevEl: prevEl.value,
		nextEl: nextEl.value,
	},
	breakpoints: {
		0: { slidesPerView: 1, spaceBetween: 10 },
		768: { slidesPerView: 2, spaceBetween: 30 },
		992: { slidesPerView: 3, spaceBetween: 30 },
		// 1200: { slidesPerView: 2.05, spaceBetween: 30 },
		// 1300: { slidesPerView: 2.85, spaceBetween: 30 },
		1400: { slidesPerView: 2.6, spaceBetween: 30 },
		1500: { slidesPerView: 2.7, spaceBetween: 20 },
	},
}));
</script>

<template>
	<section class="services-two">
		<!-- <div class="services-two__bg"></div> -->
		<div class="container">
			<div class="">
				<div class="services-two__top">
					<div class="services-two__head">
						<div class="sec-title">
							<div class="sec-title__top">
								<span class="sec-title__icon" aria-hidden="true" />
								<h6 class="sec-title__tagline">
									{{ $t("service.badge") }}
								</h6>
							</div>
							<h3 class="sec-title__title">
								{{ $t("service.title2") }}
							</h3>
						</div>

						<div class="services-two__navs">
							<button
								ref="prevEl"
								class="nav-btn"
								type="button"
								aria-label="Prev"
							>
								<i class="ri-arrow-left-long-line"></i>
							</button>
							<button
								ref="nextEl"
								class="nav-btn"
								type="button"
								aria-label="Next"
							>
								<i class="ri-arrow-right-long-line"></i>
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="services-two__container">
				<Swiper
					:modules="swiperModules"
					v-bind="swiperOptions"
					:onBeforeInit="
						(swiper: any) => {
							// nav refs Swiper init paytida set bo‘lsin
							swiper.params.navigation.prevEl = prevEl;
							swiper.params.navigation.nextEl = nextEl;
						}
					"
					class="services-two__carousel"
				>
					<SwiperSlide v-for="service in list" :key="service.id">
						<NuxtLink
							:to="localePath(`/service/${service.slug || service.id}`)"
							class="slide-link"
						>
							<CardServiceNew
								:title="service.title"
								:image="service.image"
							/>
						</NuxtLink>
					</SwiperSlide>
				</Swiper>
			</div>

			<div class="">
				<div class="services-two__bottom">
					<p class="services-two__bottom__text">
						{{ $t("service.bottomText") }}
						<NuxtLink :to="localePath('/service')">
							{{ $t("service.viewAllLink") }}
						</NuxtLink>
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;
.slide-link {
	display: block;
	height: 100%;
	text-decoration: none;
}

.container {
	position: relative;
	z-index: 2;
	padding: 40px 20px;
	max-width: 1320px !important;
	width: 100%;
	margin: 0px auto;
}
.services-two {
	position: relative;
	padding: 60px 0 50px;
	overflow: hidden;
	// ko‘k fon + blur shapes
	background-color: #2c51a3;
	@include devices(sm) {
		padding: 10px 0;
	}

	&__bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
		// opacity: 0.22;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		// background-image: url("@/assets/images/service.webp");
	}

	&__top {
		position: relative;
		z-index: 2;
		margin-bottom: 26px;
	}

	&__head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
		border-bottom: 1px solid rgb(217, 225, 235, 0.4);
		padding: 20px 0;
		@media (max-width: 1200px) {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
		}
	}

	&__navs {
		display: flex;
		gap: 14px;
		padding-bottom: 10px;
		@media (max-width: 1200px) {
			width: 100%;
			justify-content: flex-end;
		}
	}

	.nav-btn {
		width: 44px;
		height: 44px;
		border-radius: 999px;
		border: 0;
		background: #ffffff;
		color: #0b214a;
		font-size: 18px;
		display: grid;
		place-items: center;

		cursor: pointer;
		transition: all 0.4s ease;

		&:active {
			transform: scale(1.1);
		}
		&:hover {
			background: #33c1ed;
			i {
				color: white;
			}
		}
	}

	.sec-title {
		color: #fff;

		&__top {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 10px;
			opacity: 0.95;
		}

		&__icon {
			width: 18px;
			height: 18px;
			border-radius: 6px;
			background: rgba(255, 255, 255, 0.25);
			display: inline-block;
			transform: rotate(45deg);
		}

		&__tagline {
			font-size: 16px;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			margin: 0;
			color: white;
		}

		&__title {
			font-size: 50px;
			line-height: 1.12;
			font-weight: 600;
			margin: 0;
			color: white;

			@include devices(md) {
				font-size: 34px;
			}
			@include devices(sm) {
				font-size: 30px;
			}
		}
	}
	&__container {
		padding: 20px 0px;
		max-width: 1320px !important;
		width: 100%;
		@include devices(sm) {
			padding: 5px 0px;
		}
		// margin: 0px auto;
	}

	:deep(.swiper) {
		overflow: hidden; // qisman ko‘rinadigan slide effekti
	}
	:deep(.swiper-wrapper) {
		padding: 10px 0;
	}
	// SLIDE animation (owl wow fadeInUp ga o‘xshash)
	:deep(.swiper-slide) {
		opacity: 0.95;
		transform: translateY(10px) scale(0.985);
		transition:
			transform 350ms ease,
			opacity 350ms ease;
	}

	:deep(.swiper-slide-active),
	:deep(.swiper-slide-next) {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	.slide-link {
		display: block;
	}

	&__bottom {
		position: relative;
		z-index: 2;
		margin-top: 26px;
		display: flex;
		justify-content: center;
	}

	&__bottom__text {
		margin: 0;
		padding: 10px 16px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.9);
		font-size: 14px;
		text-align: center;

		a {
			color: #7fe7ff;
			font-weight: 700;
			margin-left: 6px;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>
