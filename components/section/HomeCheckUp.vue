<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Autoplay, Navigation } from "swiper/modules";
const { list } = useCheckup();

const localePath = useLocalePath();

const prevEl = ref<HTMLElement | null>(null);
const nextEl = ref<HTMLElement | null>(null);

const swiperModules = [Autoplay, Navigation];

const swiperOptions = computed(() => {
	const len = list.value?.length || 0;

	return {
		loop: len > 1, // 0/1 bo‘lsa loop keremas
		loopAdditionalSlides: Math.max(2, len), // loop silliq bo‘lsin
		loopedSlides: len, // clone soni
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
			enabled: true,
			prevEl: null,
			nextEl: null,
		},
		breakpoints: {
			0: { slidesPerView: 1, spaceBetween: 10 },
			768: { slidesPerView: 2, spaceBetween: 30 },
			992: { slidesPerView: 3, spaceBetween: 30 },
			1400: { slidesPerView: 2.6, spaceBetween: 30 },
			1500: { slidesPerView: 2.7, spaceBetween: 20 },
		},
	};
});

// ✅ navigation refs ni to‘g‘ri ulash (cheksiz next/prev)
async function onSwiper(swiper: any) {
	await nextTick();

	if (!prevEl.value || !nextEl.value) return;

	swiper.params.navigation = swiper.params.navigation || {};
	swiper.params.navigation.prevEl = prevEl.value;
	swiper.params.navigation.nextEl = nextEl.value;

	try {
		swiper.navigation?.destroy?.();
		swiper.navigation?.init?.();
		swiper.navigation?.update?.();
	} catch (e) {}
}
</script>

<template>
	<section class="checkups-two">
		<div class="container">
			<div class="checkups-two__top">
				<div class="checkups-two__head">
					<div class="sec-title">
						<div class="sec-title__top">
							<span class="sec-title__icon" aria-hidden="true" />
							<h6 class="sec-title__tagline">
								{{ $t("checkup.badge") }}
							</h6>
						</div>
						<h3 class="sec-title__title">{{ $t("Tekshiruvlar") }}</h3>
					</div>

					<div class="checkups-two__navs">
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
			<div class="checkups-two__container">
				<Swiper
					:modules="swiperModules"
					v-bind="swiperOptions"
					@swiper="onSwiper"
					class="checkups-two__carousel"
				>
					<SwiperSlide v-for="checkup in list" :key="checkup.id">
						<NuxtLink
							:to="localePath(`/checkup/${checkup.slug || checkup.id}`)"
							class="slide-link"
						>
							<CardServiceCheckUp :data="checkup" />
						</NuxtLink>
					</SwiperSlide>
				</Swiper>
			</div>

			<div class="checkups-two__bottom">
				<NuxtLink :to="localePath('/checkup')" class="mediox-btn">
					<span class="mediox-btn__label">{{ $t("viewAll") }}</span>
					<span class="mediox-btn__icon" aria-hidden="true">
						<i class="ri-arrow-right-up-line"></i>
					</span>
				</NuxtLink>
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
.checkups-two {
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
		// background-image: url("@/assets/images/checkup.webp");
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
	.mediox-btn {
		--btn: #33c1ed; /* xohlasangiz global --base bilan almashtiring */
		position: relative;
		overflow: hidden;

		display: inline-flex;
		align-items: center;
		gap: 10px;

		border-radius: 999px;
		padding: 8px 8px 8px 20px;

		font-weight: 700;
		text-decoration: none;
		border: 1px solid transparent;

		background: var(--btn);
		color: #fff;

		transition: 200ms ease;
	}

	.mediox-btn__label,
	.mediox-btn__icon {
		position: relative;
		z-index: 2;
	}

	.mediox-btn__icon {
		display: inline-grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.18);
		border: 1px solid rgba(255, 255, 255, 0.18);

		i {
			font-size: 18px;
			line-height: 1;
		}
	}

	/* ✅ SHINE (o'rtadan rang o'tadi) */
	.mediox-btn::before {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.22);
		transform: scaleX(0);
		transform-origin: center; /* MUHIM */
		transition: transform 280ms ease;
	}

	.mediox-btn:hover::before {
		transform: scaleX(1);
	}

	.mediox-btn:active {
		transform: scale(0.99);
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
		transform: translateY(0px) scale(0.985);
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

		color: #7fe7ff;
		font-weight: 700;
		margin-left: 6px;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
}
</style>
