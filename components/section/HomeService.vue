<script setup lang="ts">
const localePath = useLocalePath();
const { list } = useService();
</script>

<template>
	<section class="services-two">
		<div class="container">
			<div class="services-two__head">
				<h3 class="services-two__title">{{ $t("service.title2") }}</h3>
			</div>
			<div class="services-two__container">
				<CardServiceItem
					v-for="service in list"
					:key="service.id"
					:data="service"
					:to="localePath(`/service/${service.slug || service.id}`)"
				/>
			</div>

			<div class="services-two__bottom">
				<NuxtLink :to="localePath('/service')" class="mediox-btn">
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

.container {
	max-width: 1320px !important;
	width: 100%;
	margin: 0 auto;
	padding: 40px 20px;
}

.services-two {
	background: #f8faff;
	padding: 30px 0 20px;

	@include devices(sm) {
		padding: 10px 0;
	}

	&__head {
		padding: 18px 0;
		border-bottom: 1px solid rgba(217, 225, 235, 0.8);
		margin-bottom: 12px;
	}

	&__title {
		margin: 0;
		font-size: 50px;
		line-height: 1.12;
		font-weight: 600;
		color: #0a2241;

		@include devices(md) {
			font-size: 34px;
		}
		@include devices(sm) {
			font-size: 30px;
		}
	}

	&__container {
		padding: 20px 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 18px;

		@include devices(lg) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		@include devices(md) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		@include devices(sm) {
			grid-template-columns: 1fr;
			gap: 14px;
			padding: 10px 0;
		}
	}

	&__bottom {
		display: flex;
		justify-content: center;
		margin-top: 18px;
	}
}

/* ✅ VIEW ALL BUTTON (siz bergan example'dan 1:1) */
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
</style>
