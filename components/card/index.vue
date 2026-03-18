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

			<!-- rotated ribbon title -->
			<div class="card-box__title">
				<p class="card-info__title">
					{{ data.fullName?.[locale] }}
				</p>
			</div>
		</div>

		<div class="card-info">
			<template v-if="type === 'doctor'">
				<span class="card-info__subtitle">
					{{ data.specialization?.[locale] }}
				</span>

				<ul class="card-tag">
					<li class="card-tag__item">
						<Icon name="star" />
						<b>{{ data.rating }}</b>
					</li>
					<li class="card-tag__item">
						<span> {{ $t("patient") }}: </span>
						<b>{{
							(data.experiences ?? []).reduce(
								(acc, cur) => acc + Number(cur.patientsCount ?? 0),
								0,
							)
						}}</b>
					</li>
					<li class="card-tag__item">
						<span> {{ $t("reviews") }}: </span>
						<b>{{ data.count_reviews }}</b>
					</li>
					<li class="card-tag__item">
						<span> {{ $t("doctor.practicesPerformed") }}: </span>
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

	/* ✅ IMG heightlari bir xil bo'lishi uchun: fixed ratio */
	&-image {
		width: 100%;
		display: block;

		.image {
			/* ⭐ hamma kartada bir xil balandlik */
			--ratio: 0.93;
			width: 100%;
			display: block;

			:deep(img) {
				width: 100%;
				height: 100%;
				display: block;
				object-fit: cover;
				object-position: center top;
			}
		}
	}

	/* ✅ TITLE: width ism uzunligiga qarab auto (max-content) */
	&-box__title {
		position: absolute;
		right: 70px;
		bottom: 14px;
		transform: rotate(90deg);
		transform-origin: bottom right;
		width: fit-content; /* ⭐ auto width */
		max-width: 240px; /* uzun bo'lsa cheklansin */
		padding: 14px 18px;

		border-radius: 12px;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16);
		backdrop-filter: blur(8px);

		transition:
			background 0.25s ease,
			border-color 0.25s ease,
			transform 0.25s ease;
		@include devices(md) {
			right: 65px;
			bottom: 14px;
			max-width: 210px;
			padding: 10px 14px;
		}
	}

	/* ✅ TEXT max 2 qator */
	&-info__title {
		margin: 0;
		font-size: 20px;
		font-weight: 400;
		line-height: 1.3;
		color: #0b2239;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* ⭐ 2 qator */
		overflow: hidden;
		transition: color 0.25s ease;
		@include devices(md) {
			font-size: 16px;
		}
	}

	/* ✅ IMG hover bo'lganda: title bg = accent, text = white */
	&:hover &-box__title {
		background: $accent;
		border-color: rgba(255, 255, 255, 0.22);
		transform: rotate(90deg) translateX(-2px);
	}

	&:hover &-info__title {
		color: #fff;
	}

	/* CONTENT */
	&-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: var(--space-16);
		background: #fff;

		&__subtitle {
			@include text(20, rgba(var(--black), 0.6), 400, 150%);
			margin-bottom: var(--space-16);
		}

		&__actions {
			display: flex;
			gap: 12px;
			margin-top: var(--space-20);
		}

		&__button {
			height: var(--size-btn-52);
			border: none;
			outline: none;
			display: flex;
			align-items: center;
			justify-content: space-between;
			transition: all 0.25s ease;

			background-color: var(--blue-4);
			border-radius: 12px;
			text-align: center;
			padding: 0 12px !important;
			cursor: pointer;

			@include text(16, var(--white-1), 500, 150%);
			white-space: nowrap;
			gap: 12px !important;
			flex: 0 0 auto;

			&::before {
				padding-right: 36px;
				padding-left: 12px;
				font-size: 16px;
			}

			&:hover {
				// background-color: darken((--blue-4), 10%);
				transform: translateY(-2px);
				box-shadow: 0 10px 26px rgba(51, 193, 237, 0.35);
			}

			&:active {
				transform: translateY(0);
				box-shadow: 0 6px 18px rgba(51, 193, 237, 0.25);
			}

			&--secondary {
				background-color: transparent;
				color: var(--blue-4);
				flex: 1;
				text-decoration: underline;
				text-underline-offset: 4px;
				padding: 0 !important;

				@include text(16, --blue-4, 500, 150%);
				text-align: center;
				justify-content: center;

				&:hover {
					background-color: transparent;
					color: var(--blue-4);
					transform: none;
					box-shadow: none;
				}

				&:active {
					transform: none;
					box-shadow: none;
				}
			}
		}
	}

	/* TAGS */
	&-tag {
		margin-top: auto;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		&__item {
			padding: 7px 10px;
			display: flex;
			align-items: center;
			gap: 6px;

			border: 1px solid rgba(51, 193, 237, 0.22);
			background: rgba(51, 193, 237, 0.08);
			border-radius: 10px;

			:deep(.icon),
			:deep(svg) {
				color: #f79440;
				fill: currentColor;
				stroke: currentColor;
			}

			b {
				@include text(18, #0b2239, 700, 150%);
			}

			span {
				@include text(18, #26364b, 400, 150%);
			}
			@include devices(md) {
				padding: 3px 5px;
				span {
					@include text(14, #26364b, 400, 150%);
				}
				b {
					@include text(14, #0b2239, 700, 150%);
				}
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
