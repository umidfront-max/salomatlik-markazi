<script setup>
const localePath = useLocalePath();
const { locale } = useI18n();
defineProps({
	data: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<section class="doctor-detail">
		<!-- LEFT: photo -->
		<div class="doctor-detail__media">
			<div class="doctor-detail__img">
				<Image :src="data.image" />
			</div>
		</div>

		<!-- RIGHT: content -->
		<div class="doctor-detail__content">
			<h1 class="doctor-detail__name">
				{{ data.fullName?.[locale] }}
			</h1>

			<p v-if="data.sub_title" class="doctor-detail__role">
				{{ data.specialization?.[locale] }}
			</p>

			<ul class="doctor-detail__chips">
				<li class="doctor-detail__chip doctor-detail__chip--rating">
					<Icon name="star" />
					<b>{{ data.rating }}</b>
				</li>

				<li class="doctor-detail__chip">
					<span>{{ $t("patient") }}:</span>
					<b>{{
						(data.experiences ?? []).reduce(
							(acc, cur) => acc + Number(cur.patientsCount ?? 0),
							0,
						)
					}}</b>
				</li>

				<li class="doctor-detail__chip">
					<span>{{ $t("reviews") }}:</span>
					<b>{{ data.count_reviews }}</b>
				</li>

				<li class="doctor-detail__chip">
					<span>{{ $t("doctor.practicesPerformed") }}:</span>
					<b>{{
						(data.experiences ?? []).reduce(
							(acc, cur) => acc + Number(cur.operationsCount ?? 0),
							0,
						)
					}}</b>
				</li>
			</ul>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

$accent: #33c1ed;

.doctor-detail {
	display: grid;
	grid-template-columns: 260px 1fr;
	gap: 28px;

	padding: 22px;
	border-radius: 18px;
	background: #fff;
	border: 1px solid rgba(2, 10, 20, 0.08);

	/* chap rasm */
	&__media {
		display: flex;
	}

	&__img {
		width: 100%;
		border-radius: 16px;
		overflow: hidden;

		background: rgba(51, 193, 237, 0.08);
		border: 1px solid rgba(51, 193, 237, 0.18);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

		.image {
			--ratio: 1; /* kvadrat */
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

	/* content */
	&__content {
		min-width: 0;
		padding-top: 6px;
	}

	&__name {
		margin: 0 0 10px;
		font-size: 40px;
		font-weight: 800;
		line-height: 1.15;
		color: #0b2239;

		/* max 2 qator */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	&__role {
		margin: 0 0 18px;
		font-size: 18px;
		font-weight: 600;
		color: rgba(11, 34, 57, 0.72);
	}

	/* chips */
	&__chips {
		list-style: none;
		padding: 0;
		margin: 0;

		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	&__chip {
		display: inline-flex;
		align-items: center;
		gap: 10px;

		padding: 10px 14px;
		border-radius: 12px;

		background: rgba(51, 193, 237, 0.1);
		border: 1px solid rgba(51, 193, 237, 0.25);

		span {
			font-size: 16px;
			font-weight: 600;
			color: rgba(11, 34, 57, 0.72);
		}

		b {
			font-size: 18px;
			font-weight: 800;
			color: #0b2239;
		}

		:deep(.icon),
		:deep(svg) {
			color: #ff9b3f;
			fill: currentColor;
			stroke: currentColor;
		}

		&--wide {
			flex: 1 1 280px; /* uzun chip */
			justify-content: space-between;
		}

		&--rating {
			background: rgba(51, 193, 237, 0.12);
		}
	}

	/* actions */
	&__actions {
		margin-top: 18px;
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	&__btn {
		height: var(--size-btn-52);
		border: none;
		cursor: pointer;
		border-radius: 12px;
		padding: 0 16px;

		background: $accent;
		color: #fff;
		font-weight: 700;

		transition: 0.25s ease;

		&:hover {
			background: darken($accent, 10%);
			transform: translateY(-2px);
			box-shadow: 0 10px 26px rgba(51, 193, 237, 0.35);
		}

		&:active {
			transform: translateY(0);
			box-shadow: 0 6px 18px rgba(51, 193, 237, 0.25);
		}

		&--ghost {
			background: transparent;
			color: $accent;
			border: 1px solid rgba(51, 193, 237, 0.35);
			box-shadow: none;

			&:hover {
				background: rgba(51, 193, 237, 0.08);
				transform: translateY(-2px);
			}
		}
	}

	/* responsive */
	@include devices(xs) {
		grid-template-columns: 1fr;
		gap: 18px;
		padding: 16px;

		&__img {
			.image {
				--ratio: 0.72;
			}
		}

		&__name {
			font-size: 28px;
		}
	}
}
</style>
