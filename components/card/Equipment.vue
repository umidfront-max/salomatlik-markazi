<script setup>
const localePath = useLocalePath();
const { locale } = useI18n();
const router = useRouter();

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

const goToDoctor = (id) => {
	router.push(localePath(`/doctor/${id}`));
};

</script>

<template>
	<div class="card" :class="[`card-${type}`]">
		<!-- ───────── EQUIPMENT CARD ───────── -->
		<template v-if="type === 'equipment'">
			<div class="eq-card">
				<!-- Image area -->
				<div class="eq-card__media">
					<div class="eq-card__overlay" />
					<div class="eq-card__shimmer" />
					<Image :src="'https://api-his.irismed.uz' + data.images?.[0]" class="eq-card__img" />

					<div class="eq-card__badge" v-if="data.manufacturer?.[locale]">
						{{ data.manufacturer?.[locale] }}
					</div>

					<!-- title revealed on hover over image -->
					<div class="eq-card__hover-title">
						<p>{{ data.title?.[locale] }}</p>
					</div>
				</div>

				<!-- Body -->
				<div class="eq-card__body">
					<div class="eq-card__body-inner">
						<p class="eq-card__title">{{ data.title?.[locale] }}</p>
						<p
							class="eq-card__desc"
							v-if="data.shortDescription?.[locale]"
						>
							{{ data.shortDescription?.[locale] }}
						</p>
					</div>

					<div class="eq-card__footer">
						<div class="eq-card__line" />
						<span class="eq-card__link">
							{{ $t("moreDetails") ?? "Batafsil" }}
							<svg
								class="eq-card__arrow"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<path
									d="M2.5 8H13.5M9.5 4L13.5 8L9.5 12"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
					</div>
				</div>

				<div class="eq-card__border-glow" />
			</div>
		</template>

		<!-- ───────── DOCTOR CARD ───────── -->
		<template v-else>
			<div class="card-box">
				<div class="card-image">
					<Image :src="data.image" />
				</div>
				<div class="card-box__title">
					<p class="card-info__title">{{ data.fullName?.[locale] }}</p>
				</div>
			</div>
			<div class="card-info">
				<span class="card-info__subtitle">{{
					data.specialization?.[locale]
				}}</span>
				<ul class="card-tag">
					<li class="card-tag__item">
						<Icon name="star" /><b>{{ data.rating }}</b>
					</li>
					<li class="card-tag__item">
						<span>{{ $t("patient") }}: </span>
						<b>{{
							(data.experiences ?? []).reduce(
								(a, c) => a + Number(c.patientsCount ?? 0),
								0,
							)
						}}</b>
					</li>
					<li class="card-tag__item">
						<span>{{ $t("reviews") }}: </span>
						<b>{{ data.count_reviews }}</b>
					</li>
					<li class="card-tag__item">
						<span>{{ $t("doctor.practicesPerformed") }}: </span>
						<b>{{
							(data.experiences ?? []).reduce(
								(a, c) => a + Number(c.operationsCount ?? 0),
								0,
							)
						}}</b>
					</li>
				</ul>
				<div class="card-info__actions">
					<Btn
						class="card-info__button"
						:data-text="$t('booking')"
						@click.stop="
							router.push(localePath({ query: { doctor_id: data.id } }))
						"
					>
						{{ $t("booking1") }}
					</Btn>
					<button
						class="card-info__button card-info__button--secondary"
						@click.stop="goToDoctor(data.id)"
					>
						{{ $t("moreDetails") }}
					</button>
				</div>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

$accent: #33c1ed;
$accent-2: #0ea8d8;
$navy: #0b2239;

/* ═══════════════════════════════════════════
   EQUIPMENT CARD
═══════════════════════════════════════════ */
.eq-card {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	border-radius: 22px;
	overflow: hidden;
	cursor: pointer;
	background: #fff;
	box-shadow:
		0 1px 3px rgba($navy, 0.06),
		0 0 0 1.5px rgba($accent, 0.18);
	transition:
		transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
		box-shadow 0.4s ease;

	/* ── HOVER ── */
	&:hover {
		transform: translateY(-4px) scale(1.018);
		box-shadow:
			0 12px 12px rgba($accent, 0.28),
			0 10px 12px rgba($navy, 0.14),
			0 0 0 2px $accent;

		.eq-card__overlay {
			opacity: 1;
		}
		.eq-card__shimmer {
			transform: translateX(200%) skewX(-20deg);
		}
		.eq-card__img {
			transform: scale(1.08);
			filter: brightness(0.65);
		}
		.eq-card__hover-title {
			opacity: 1;
			transform: translateY(0);
		}
		.eq-card__badge {
			background: $accent;
			color: #fff;
			border-color: transparent;
		}
		.eq-card__title {
			color: $accent-2;
		}
		.eq-card__line {
			width: 100%;
			background: $accent;
		}
		.eq-card__link {
			color: $accent;
			letter-spacing: 0.05em;
		}
		.eq-card__arrow {
			transform: translateX(6px);
		}
		.eq-card__border-glow {
			opacity: 1;
		}
	}

	/* ─── MEDIA ─── */
	&__media {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: #ddf0f8;
		border-radius: 22px 22px 0 0;
	}

	&__overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		opacity: 0;
		background: linear-gradient(
			to top,
			rgba($navy, 0.88) 0%,
			rgba($navy, 0.35) 55%,
			transparent 100%
		);
		transition: opacity 0.38s ease;
	}

	&__shimmer {
		position: absolute;
		inset: 0;
		z-index: 2;
		width: 50%;
		background: linear-gradient(
			110deg,
			transparent 38%,
			rgba(255, 255, 255, 0.22) 50%,
			transparent 62%
		);
		transform: translateX(-120%) skewX(-20deg);
		transition: transform 0.6s ease;
		pointer-events: none;
	}

	&__img {
		width: 100%;
		height: 100%;
		display: block;
		transition:
			transform 0.48s ease,
			filter 0.48s ease;
		:deep(img) {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
		}
	}

	&__badge {
		position: absolute;
		top: 14px;
		left: 14px;
		z-index: 3;
		padding: 5px 13px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border: 1px solid rgba($accent, 0.35);
		font-size: 11px;
		font-weight: 800;
		color: $accent-2;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		transition:
			background 0.3s ease,
			color 0.3s ease,
			border-color 0.3s ease;
	}

	&__hover-title {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 3;
		padding: 22px 18px 18px;
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.35s ease,
			transform 0.35s ease;
		p {
			margin: 0;
			font-size: 17px;
			font-weight: 700;
			color: #fff;
			line-height: 1.35;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			text-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
		}
	}

	/* ─── BODY ─── */
	&__body {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 18px 18px 16px;
		gap: 12px;
	}

	&__body-inner {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__title {
		margin: 0;
		font-size: 17px;
		font-weight: 700;
		line-height: 1.35;
		color: $navy;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		transition: color 0.3s ease;
	}

	&__desc {
		margin: 0;
		font-size: 13.5px;
		line-height: 1.6;
		color: rgba($navy, 0.48);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	/* ─── FOOTER ─── */
	&__footer {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__line {
		height: 2px;
		width: 32px;
		background: rgba($accent, 0.28);
		border-radius: 2px;
		transition:
			width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
			background 0.3s ease;
	}

	&__link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 800;
		color: rgba($navy, 0.38);
		letter-spacing: 0.02em;
		text-transform: uppercase;
		transition:
			color 0.3s ease,
			letter-spacing 0.3s ease;
	}

	&__arrow {
		flex-shrink: 0;
		transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	/* ambient glow behind card */
	&__border-glow {
		position: absolute;
		inset: -3px;
		border-radius: 25px;
		background: linear-gradient(135deg, rgba($accent, 0.6), transparent 60%);
		z-index: -1;
		opacity: 0;
		transition: opacity 0.4s ease;
		filter: blur(10px);
		pointer-events: none;
	}
}

/* ═══════════════════════════════════════════
   DOCTOR CARD
═══════════════════════════════════════════ */
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
		box-shadow: 0 8px 15px rgba(0, 0, 0, 0.18);
		border-color: rgba($accent, 0.55);
	}

	&-box {
		position: relative;
	}
	&-image {
		width: 100%;
		display: block;
		.image {
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

	&-box__title {
		position: absolute;
		right: 70px;
		bottom: 14px;
		transform: rotate(90deg);
		transform-origin: bottom right;
		width: fit-content;
		max-width: 240px;
		padding: 14px 18px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
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

	&-info__title {
		margin: 0;
		font-size: 20px;
		font-weight: 400;
		line-height: 1.3;
		color: #0b2239;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		transition: color 0.25s ease;
		@include devices(md) {
			font-size: 16px;
		}
	}

	&:hover &-box__title {
		background: $accent;
		border-color: rgba(255, 255, 255, 0.22);
		transform: rotate(90deg) translateX(-2px);
	}
	&:hover &-info__title {
		color: #fff;
	}

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

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 10px 16px rgba(51, 193, 237, 0.35);
			}
			&:active {
				transform: translateY(0);
				box-shadow: 0 6px 11px rgba(51, 193, 237, 0.25);
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
				&:hover,
				&:active {
					background-color: transparent;
					color: var(--blue-4);
					transform: none;
					box-shadow: none;
				}
			}
		}
	}

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
}
</style>
