<script setup>
import { computed, watch } from "vue";

const localePath = useLocalePath();
const route = useRoute();
const { locale } = useI18n();
const { list: setting } = useSetting();
const { t } = useI18n();
const props = defineProps({
	title: {
		type: String,
		default: undefined,
	},
});

const menus = computed(() => [
	{
		page: "news",
		to: "/news",
		title: setting?.news?.[locale.value],
	},
	{
		page: "checkup",
		to: "/checkup",
		title: t("program.title1"),
   },
   {
		page: "video",
		to: "/video",
		title: t("video.title"),
   },
   {
		page: "equipment",
		to: "/equipment",
		title: t("equipment"),
	},
	{
		page: "doctor",
		to: "/doctor",
		title: setting?.doctor?.[locale.value],
	},
	{
		page: "department",
		to: "/department",
		title: setting?.service?.[locale.value],
	},
	{
		page: "contact",
		to: "/contact",
		title: setting?.contact?.[locale.value],
	},
	{
		page: "aboutUs",
		to: "/aboutUs",
		title: t("aboutUs"),
	},
]);

// strip HTML tags for plain-text breadcrumbs / page title
const stripHtml = (s) =>
	typeof s === "string" ? s.replace(/<[^>]*>/g, "").trim() : s;

const breadcrumbs = computed(() => {
	const result = [];

	const routeName = route.name?.toString() ?? "";
	if (!routeName) return result;

	const name = routeName.split("___")[0];

	menus.value.forEach((item) => {
		if (name.includes(item.page)) {
			result.push(item);
		}
	});

	return result;
});

const activeTitle = computed(() => {
	if (props.title) return props.title;
	return breadcrumbs.value?.[breadcrumbs.value.length - 1]?.title || "-";
});

watch(
	() => route.path,
	() => {
		// only set head title when there is an actual breadcrumb match
		if (!props.title && breadcrumbs.value.length) {
			useHead({
				title: stripHtml(activeTitle.value),
			});
		}
	},
	{ immediate: true },
);
</script>

<template>
	<section class="section section-breadcrumbs">
		<div class="section-bg">
			<div class="section-pattern">
				<svg
					class="pattern-svg"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
				>
					<defs>
						<linearGradient
							id="breadcrumb-grad"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop
								offset="0%"
								style="stop-color: rgba(255, 255, 255, 0.1)"
							/>
							<stop
								offset="100%"
								style="stop-color: rgba(255, 255, 255, 0.05)"
							/>
						</linearGradient>
					</defs>

					<circle
						cx="10"
						cy="20"
						r="15"
						fill="url(#breadcrumb-grad)"
						opacity="0.3"
					/>
					<circle
						cx="90"
						cy="80"
						r="20"
						fill="url(#breadcrumb-grad)"
						opacity="0.2"
					/>
					<circle
						cx="70"
						cy="30"
						r="12"
						fill="url(#breadcrumb-grad)"
						opacity="0.25"
					/>

					<path
						d="M20,50 Q40,30 60,50 T100,50"
						stroke="rgba(255,255,255,0.1)"
						fill="none"
						stroke-width="2"
					/>
				</svg>
			</div>

			<div class="section-shapes">
				<div class="shape shape-1"></div>
				<div class="shape shape-2"></div>
				<div class="shape shape-3"></div>
			</div>
		</div>

		<div class="container section-container">
			<ul class="section-list">
				<li class="section-list__item">
					<NuxtLink :to="localePath('/')" class="section-list__link">
						{{ $t("home") }}
					</NuxtLink>
				</li>

				<li
					class="section-list__item"
					v-for="item in breadcrumbs"
					:key="item.page"
				>
					<Icon name="angle-right" class="section-list__separator" />

					<span v-if="!$props.title" class="section-list__text">
						{{ stripHtml(item.title) }}
					</span>

					<NuxtLink
						v-else
						:to="localePath(item.to)"
						class="section-list__link"
					>
						{{ stripHtml(item.title) }}
					</NuxtLink>
				</li>

				<li class="section-list__item" v-if="$props.title">
					<Icon name="angle-right" class="section-list__separator" />
					<span class="section-list__text">
						{{ stripHtml($props.title) }}
					</span>
				</li>
			</ul>

			<h1 class="section-label">
				{{ stripHtml(activeTitle) }}
			</h1>
		</div>
	</section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
	position: relative;
	padding: 80px 0 60px;
	background: linear-gradient(135deg, var(--blue-2) 0%, var(--blue-1) 100%);
	overflow: hidden;
	isolation: isolate;
	margin-bottom: 80px;

	@include devices(md) {
		padding: 48px 0 40px;
		margin-bottom: 48px;
	}

	&-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}

	&-pattern {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.6;

		.pattern-svg {
			width: 100%;
			height: 100%;
		}
	}

	&-shapes {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		.shape {
			position: absolute;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.08);
			backdrop-filter: blur(20px);
			animation: float-shape 20s ease-in-out infinite;

			&-1 {
				width: 300px;
				height: 300px;
				top: -100px;
				right: -50px;
				animation-delay: 0s;
			}

			&-2 {
				width: 200px;
				height: 200px;
				bottom: -50px;
				left: 10%;
				animation-delay: 5s;
			}

			&-3 {
				width: 150px;
				height: 150px;
				top: 50%;
				left: -75px;
				animation-delay: 10s;
			}
		}
	}

	&-container {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	&-list {
		margin-bottom: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 4px;
		padding: 14px 28px;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 100px;
		border: 1px solid rgba(255, 255, 255, 0.2);

		@include devices(sm) {
			padding: 10px 20px;
		}

		&__item {
			display: inline-flex;
			align-items: center;
			gap: 8px;
		}

		&__separator {
			--icon-size: 16px;
			--icon-color: rgba(255, 255, 255, 0.4);
			margin: 0 4px;
		}

		&__icon {
			--icon-size: 18px;
			--icon-color: rgba(255, 255, 255, 0.9);
		}

		&__link {
			@include text(18, rgba(255, 255, 255, 0.85), 500, 140%);
			transition: all 0.3s ease;
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 6px 10px;
			border-radius: 6px;

			&:hover {
				color: var(--white-1);
				background: rgba(255, 255, 255, 0.15);
			}

			@include devices(sm) {
				font-size: 16px;
			}
		}

		&__text {
			@include text(18, var(--white-1), 600, 140%);
			padding: 6px 10px;

			@include devices(sm) {
				font-size: 16px;
			}
		}
	}

	&-label {
		@include text(64, var(--white-1), 700, 120%);
		letter-spacing: -0.02em;
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
		animation: fadeInUp 0.6s ease-out;

		@include devices(md) {
			font-size: 48px;
		}

		@include devices(sm) {
			font-size: 36px;
		}
	}
}

@keyframes float-shape {
	0%,
	100% {
		transform: translate(0, 0) scale(1);
	}

	33% {
		transform: translate(30px, -30px) scale(1.1);
	}

	66% {
		transform: translate(-20px, 20px) scale(0.9);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
