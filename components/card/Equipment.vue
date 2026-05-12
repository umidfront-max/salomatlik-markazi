<script setup>
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
	<!-- ───────── EQUIPMENT CARD ───────── -->
	<template v-if="type === 'equipment'">
		<div class="eq-card">
         
			<div class="eq-card__media">
				<Image
					:src="data.images?.[0]?.url"
					class="eq-card__img"
				/>
			</div>
			<div class="eq-card__body">
				<p class="eq-card__title">{{ data.title?.[$i18n.locale] }}</p>
				<p class="eq-card__model" v-html="data.shortDescription?.[$i18n.locale]" v-if="data.shortDescription?.[$i18n.locale]"></p>
				<p class="eq-card__manufacturer" v-if="data.manufacturer?.[$i18n.locale]">
					{{ $t("manufacturer") }}:
					<span>{{ data.manufacturer?.[$i18n.locale] }}</span>
				</p>
			</div>
		</div>
	</template>

	<!-- ───────── DOCTOR CARD ───────── -->
	<template v-else>
		<div class="card">
			<div class="card-image">
				<Image :src="data.image" />
			</div>
			<div class="card-body">
				<p class="card-body__name">{{ data.fullName?.[$i18n.locale] }}</p>
				<span class="card-body__spec">{{ data.specialization?.[$i18n.locale] }}</span>
				<ul class="card-tags">
					<li class="card-tags__item">
						<Icon name="star" /><b>{{ data.rating }}</b>
					</li>
					<li class="card-tags__item">
						<span>{{ $t("patient") }}: </span>
						<b>{{
							(data.experiences ?? []).reduce(
								(a, c) => a + Number(c.patientsCount ?? 0),
								0,
							)
						}}</b>
					</li>
					<li class="card-tags__item">
						<span>{{ $t("reviews") }}: </span>
						<b>{{ data.count_reviews }}</b>
					</li>
				</ul>
				<div class="card-body__actions">
					<Btn
						class="card-body__btn"
						:data-text="$t('booking')"
						@click.stop="router.push(localePath({ query: { doctor_id: data.id } }))"
					>
						{{ $t("booking1") }}
					</Btn>
					<button
						class="card-body__btn card-body__btn--outline"
						@click.stop="router.push(localePath(`/doctor/${data.id}`))"
					>
						{{ $t("moreDetails") }}
					</button>
				</div>
			</div>
		</div>
	</template>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

$blue: #33c1ed;
$blue-dark: #0ea8d8;
$navy: #0b2239;

/* ═══════════════════════════════════════════
   EQUIPMENT CARD
═══════════════════════════════════════════ */
.eq-card {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #fff;
	border-radius: 16px;
	border: 1.5px solid #eef2f6;
	overflow: hidden;
	cursor: pointer;
	transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;

	&:hover {
		border-color: rgba($blue, 0.5);
		box-shadow: 0 8px 24px rgba($navy, 0.08);
		transform: translateY(-3px);

		.eq-card__img {
			transform: scale(1.04);
		}
	}

	&__media {
		width: 100%;
		aspect-ratio: 4 / 3;
		background: #f5f8fb;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	&__img {
		width: 100%;
		height: 100%;
		display: block;
		transition: transform 0.35s ease;

		:deep(img) {
			width: 100%;
			height: 100%;
			object-fit: contain;
			object-position: center;
			padding: 12px;
		}
	}

	&__body {
		padding: 14px 16px 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-top: 1.5px solid #eef2f6;
	}

	&__title {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		line-height: 1.4;
		color: $navy;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	&__model {
		margin: 0;
		font-size: 13px;
		color: rgba($navy, 0.45);
		font-weight: 400;
	}

	&__manufacturer {
		margin: 2px 0 0;
		font-size: 13px;
		color: rgba($navy, 0.5);
		font-weight: 400;

		span {
			color: $blue-dark;
			font-weight: 500;
		}
	}
}

/* ═══════════════════════════════════════════
   DOCTOR CARD
═══════════════════════════════════════════ */
.card {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #fff;
	border-radius: 16px;
	border: 1.5px solid #eef2f6;
	overflow: hidden;
	cursor: pointer;
	transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;

	&:hover {
		border-color: rgba($blue, 0.5);
		box-shadow: 0 8px 24px rgba($navy, 0.08);
		transform: translateY(-3px);
	}

	&-image {
		width: 100%;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		background: #f5f8fb;

		:deep(img) {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center top;
		}
	}

	&-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 14px 16px 16px;
		gap: 6px;
		border-top: 1.5px solid #eef2f6;

		&__name {
			margin: 0;
			font-size: 16px;
			font-weight: 600;
			color: $navy;
			line-height: 1.35;
		}

		&__spec {
			font-size: 13.5px;
			color: rgba($navy, 0.55);
			font-weight: 400;
		}

		&__actions {
			display: flex;
			gap: 10px;
			margin-top: auto;
			padding-top: 12px;
		}

		&__btn {
			height: 42px;
			border: none;
			outline: none;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0 16px !important;
			border-radius: 10px;
			background: $blue;
			font-size: 14px;
			font-weight: 500;
			color: #fff;
			cursor: pointer;
			transition: background 0.2s ease;
			white-space: nowrap;

			&:hover {
				background: $blue-dark;
			}

			&--outline {
				background: transparent;
				color: $blue-dark;
				border: 1.5px solid rgba($blue, 0.4);
				flex: 1;

				&:hover {
					background: rgba($blue, 0.06);
					border-color: $blue;
				}
			}
		}
	}

	&-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 4px;

		&__item {
			display: inline-flex;
			align-items: center;
			gap: 5px;
			padding: 5px 10px;
			border-radius: 8px;
			background: rgba($blue, 0.07);
			border: 1px solid rgba($blue, 0.18);
			font-size: 13px;

			:deep(.icon),
			:deep(svg) {
				color: #f79440;
				fill: currentColor;
				stroke: currentColor;
				width: 14px;
				height: 14px;
			}

			b { color: $navy; font-weight: 700; }
			span { color: rgba($navy, 0.55); }
		}
	}
}
</style>