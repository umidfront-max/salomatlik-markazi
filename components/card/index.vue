<script setup>
const localePath = useLocalePath();
const { locale } = useI18n();
const router = useRouter();
const applyRef = ref();

const goToDoctor = (id) => {
	router.push(localePath(`/doctor/${id}`));
};

defineProps({
	data: {
		type: Object,
		required: true,
	},
	type: {
		type: String,
		default: "doctor",
	},
});
</script>

<template>
	<div class="card" :class="[`card-${type}`]">
		<div class="card-box">
			<div class="card-image">
				<Image :src="data.image" />
			</div>
		</div>

		<div class="card-info">
			<template v-if="type === 'doctor'">
				<p class="card-info__name">
					{{ data.fullName?.[locale] }}
				</p>
				<span class="card-info__subtitle">
					{{ data.specialization?.[locale] }}
				</span>

				<ul class="card-tag">
					<li class="card-tag__item card-tag__item--rating">
						<Icon name="star" />
						<b>{{ data.rating ?? 0 }}</b>
					</li>
					<li class="card-tag__item">
						<span>{{ $t("patient") }}:</span>
						<b>{{
							(data.experiences ?? []).reduce(
								(acc, cur) => acc + Number(cur.patientsCount ?? 0),
								0,
							)
						}}</b>
					</li>
					<li class="card-tag__item">
						<span>{{ $t("reviews") }}:</span>
						<b>{{ data.count_reviews ?? 0 }}</b>
					</li>
					<li class="card-tag__item card-tag__item--full">
						<span>{{ $t("doctor.practicesPerformed") }}:</span>
						<b>{{
							(data.experiences ?? []).reduce(
								(acc, cur) => acc + Number(cur.operationsCount ?? 0),
								0,
							)
						}}</b>
					</li>
				</ul>

				<div class="card-info__actions">
					<Btn
						class="card-info__button"
						:data-text="$t('booking')"
						@click.stop="applyRef.toOpen()"
					>
						{{ $t("booking") }}
					</Btn>

					<button
						class="card-info__button card-info__button--secondary"
						@click.stop="goToDoctor(data.id)"
					>
						{{ $t("moreDetails") }}
					</button>
				</div>
			</template>

			<ul class="card-items" v-else>
				<li class="card-items__item">
					<span class="_1">{{ $t("manufacturer") }}:</span>
					<span class="_2">{{ data.short_content }}</span>
				</li>
				<li class="card-items__item">
					<span class="_1">{{ data.sub_title }}</span>
				</li>
			</ul>
		</div>

		<SectionHeaderApply :doctorId="data.id" ref="applyRef" />
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

$accent: #33c1ed;

.container {
	max-width: 1320px !important;
	width: 100%;
	margin: 0 auto;
	padding: 40px 20px;
}
.card {
	height: 100%;
	display: flex;
	flex-direction: column;
	cursor: pointer;
	border-radius: 18px;
	overflow: hidden;
	background: #fff;
	border: 1px solid rgba(2, 10, 20, 0.08);
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease,
		border-color 0.25s ease;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 18px 55px rgba(0, 0, 0, 0.18);
		border-color: rgba($accent, 0.55);
	}

	/* TOP BOX */
	&-box {
		position: relative;
	}

	/* ✅ IMG: kichikroq, ramkali, optimal o'lcham */
	&-image {
		width: 100%;
		display: block;
		padding: 12px 12px 0;
		box-sizing: border-box;

		.image {
			--ratio: 1; /* kvadrat — kichikroq va simmetrik */
			width: 100%;
			display: block;
			border-radius: 14px;
			overflow: hidden;
			border: 1px solid rgba(2, 10, 20, 0.08);
			background: #f5f8fb;

			:deep(img) {
				width: 100%;
				height: 100%;
				display: block;
				object-fit: cover;
				object-position: center top;
				transition: transform 0.35s ease;
			}
		}

		@include devices(md) {
			padding: 10px 10px 0;
			.image { --ratio: 1; border-radius: 12px; }
		}
	}

	/* Hover'da rasm engil zoom */
	&:hover &-image .image :deep(img) {
		transform: scale(1.03);
	}

	/* Doctor name hover'da accent rang bo'ladi */
	&:hover &-info__name {
		color: $accent;
	}

	/* CONTENT */
	&-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 14px 16px 16px;
		background: #fff;
		gap: 4px;

		&__name {
			margin: 0;
			font-size: 16px;
			font-weight: 700;
			color: #0b2239;
			line-height: 1.35;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			overflow: hidden;
		}

		&__subtitle {
			font-size: 13.5px;
			font-weight: 400;
			color: rgba(11, 34, 57, 0.55);
			margin-bottom: 10px;
			line-height: 1.4;
		}

		&__actions {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-top: 12px;
		}

		&__button {
			height: 40px;
			border: none;
			outline: none;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			transition: all 0.25s ease;
			background-color: var(--blue-4);
			border-radius: 10px;
			padding: 0 14px !important;
			cursor: pointer;
			font-size: 13.5px;
			font-weight: 600;
			color: #fff;
			white-space: nowrap;
			gap: 8px !important;
			flex: 0 0 auto;

			&::before {
				padding-right: 28px;
				padding-left: 8px;
				font-size: 13.5px;
			}

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 18px rgba(20, 63, 150, 0.28);
			}

			&:active {
				transform: translateY(0);
			}

			&--secondary {
				background-color: transparent;
				color: var(--blue-4);
				flex: 1;
				text-decoration: underline;
				text-underline-offset: 4px;
				padding: 0 !important;
				font-size: 13.5px;
				font-weight: 500;
				justify-content: center;
				height: auto;

				&:hover {
					background-color: transparent;
					color: var(--blue-4);
					transform: none;
					box-shadow: none;
				}
			}
		}
	}

	/* TAGS */
	&-tag {
		margin-top: auto;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;

		&__item {
			padding: 5px 10px;
			display: inline-flex;
			align-items: center;
			gap: 5px;

			border: 1px solid rgba(51, 193, 237, 0.22);
			background: rgba(51, 193, 237, 0.08);
			border-radius: 8px;
			line-height: 1;

			:deep(.icon),
			:deep(svg) {
				color: #f79440;
				fill: currentColor;
				stroke: currentColor;
				width: 14px;
				height: 14px;
				flex-shrink: 0;
			}

			b {
				font-size: 14px;
				font-weight: 700;
				color: #0b2239;
			}

			span {
				font-size: 13px;
				font-weight: 400;
				color: #26364b;
			}

			/* Rating pill — accent fon */
			&--rating {
				background: rgba(247, 148, 64, 0.1);
				border-color: rgba(247, 148, 64, 0.3);
			}

			/* Long pill — to'liq qator */
			&--full {
				width: 100%;
				justify-content: flex-start;
			}

			@include devices(md) {
				padding: 4px 8px;
				gap: 4px;
				b { font-size: 13px; }
				span { font-size: 12px; }
			}
		}
	}

	/* EQUIPMENT LIST */
	&-items {
		margin-top: auto;

		.card-equipment & {
			margin-top: 0;
		}

		&__item {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 6px;
			row-gap: 4px;

			&:last-child {
				@include slice(2);
			}

			&:not(:last-child) {
				margin-bottom: 6px;
			}

			span {
				&._1 {
					@include text(18, var(--black-1), 300, 150%);
				}

				&._2 {
					@include text(18, $accent, 600, 150%);
				}
			}
		}
	}

	/* doctor-detail qoladi (seniki) */
	&.doctor-detail {
		flex-direction: row;

		@include devices(xs) {
			flex-wrap: wrap;
		}

		.card {
			&-wrapper {
				align-items: flex-start;
			}

			&-image {
				flex: 0 0 233px;
				max-width: 233px;
				margin-right: var(--space-24);

				@include devices(xs) {
					flex: 0 0 100%;
					max-width: 100%;
					margin-right: 0;
				}

				.image {
					--ratio: 1;
				}
			}

			&-info {
				&__title {
					@include text(40, #03182b, 700, 130%);
					margin-bottom: 12px;
				}

				&__subtitle {
					@include text(22, #26364b, 400, 150%);
					margin-bottom: var(--space-20);
				}

				&__button {
					padding: 12px var(--space-20);
					background-color: $accent;
					color: var(--white-1);
					width: max-content;
				}
			}

			&-tag {
				margin-top: 0px;
			}
		}
	}
}
</style>
