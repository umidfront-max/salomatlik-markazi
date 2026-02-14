<template>
	<NuxtLink
		:to="to"
		class="service-pill"
		:class="{ 'is-cta': variant === 'cta' }"
	>
		<span class="service-pill__title">
			{{ data?.name?.[locale] ||  data?.title?.[locale]  || "" }}
		</span>

		<span class="service-pill__arrow" aria-hidden="true">
			<i class="ri-arrow-right-line"></i>
		</span>
	</NuxtLink>
</template>

<script setup lang="ts">
const { locale } = useI18n();

type Variant = "default" | "cta";

const props = defineProps<{
	data?: any;
	to: string;
	variant?: Variant;
}>();
</script>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

.service-pill {
	--bg: #ffffff;
	--text: #0a2241;

	--hover-bg: #33c1ed; /* ko'k */
	--hover-text: #ffffff;

	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;

	width: 100%;
	min-height: 74px;
	padding: 18px 18px 18px 24px;

	border-radius: 22px;
	background: var(--bg);
	color: var(--text);
	text-decoration: none;

	transition:
		transform 220ms ease,
		box-shadow 220ms ease,
		background 220ms ease,
		color 220ms ease;
	@include devices(sm) {
		padding: 10px;
		border-radius: 16px;
	}
	&__title {
		font-size: 16px;
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: 0.01em;
		@include devices(sm) {
			font-size: 14px;
		}
	}

	&__arrow {
		flex: 0 0 auto;
		width: 34px;
		height: 34px;
		border-radius: 999px;

		display: grid;
		place-items: center;

		background: rgba(10, 34, 65, 0.06);
		border: 1px solid rgba(10, 34, 65, 0.08);

		transition:
			background 220ms ease,
			border-color 220ms ease,
			transform 220ms ease;

		@include devices(sm) {
			width: 28px;
			height: 28px;
		}
		i {
			font-size: 18px;
			line-height: 1;
			color: var(--text);
			transition: color 220ms ease;
			@include devices(sm) {
				font-size: 16px;
			}
		}
	}

	&:hover {
		background: var(--hover-bg);
		color: var(--hover-text);
		box-shadow: 0 10px 26px rgba(10, 34, 65, 0.12);
		transform: translateY(-2px);

		.service-pill__arrow {
			background: rgba(255, 255, 255, 0.18);
			border-color: rgba(255, 255, 255, 0.22);
			transform: translateX(2px);

			i {
				color: #fff;
			}
		}
	}

	&.is-cta {
		background: var(--hover-bg);
		color: var(--hover-text);
		box-shadow: 0 10px 26px rgba(10, 34, 65, 0.12);

		.service-pill__arrow {
			background: rgba(255, 255, 255, 0.18);
			border-color: rgba(255, 255, 255, 0.22);

			i {
				color: #fff;
			}
		}
	}
}
</style>
