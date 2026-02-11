<script setup>
const { locale } = useI18n();
const route = useRoute();
const { $api } = useNuxtApp();

const { data: service } = await useAsyncData(
	`service_${route.params.slug}`,
	() => $api(`/medical-services/${route.params.slug}`),
);
</script>

<template>
	<section class="service container">
		<div class="service__grid">
			<!-- LEFT: IMAGE -->
			<div class="service__image">
				<img :src="service?.image" :alt="service?.name?.[locale]" />
			</div>

			<!-- RIGHT: INFO -->
			<div class="service__info">
				<span class="service__department">
					{{ service?.department?.title?.[locale] }}
				</span>

				<h1 class="service__title">
					{{ service?.name?.[locale] }}
				</h1>

				<div class="service__meta">
					<div class="meta-item">⏱ {{ service?.durationMinutes }} min</div>
					<div class="meta-item">
						🏥 {{ service?.department?.title?.[locale] }}
					</div>
				</div>

				<div
					class="service__desc"
					v-html="service?.description?.[locale]"
				/>

				<!-- PRICE CARD -->
				<div class="price-card">
					<div class="price-card__left">
						<div v-if="service?.hasDiscount" class="old-price">
							{{ service?.price }}$
						</div>
						<div class="current-price">
							{{ service?.discountedPrice }} so'm
						</div>
					</div>

					<button class="btn-primary">Qabulga yozilish</button>
				</div>
			</div>
		</div>
	</section>
</template>
<style scoped lang="scss">
.service {
	padding: 60px 0;

	&__grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;

		@media (max-width: 992px) {
			grid-template-columns: 1fr;
		}
	}

	&__image img {
		width: 100%;
		border-radius: 20px;
		object-fit: cover;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
	}

	&__department {
		display: inline-block;
		background: #e8f2ff;
		color: #1d4ed8;
		padding: 6px 14px;
		border-radius: 999px;
		font-weight: 600;
		font-size: 14px;
		margin-bottom: 16px;
	}

	&__title {
		font-size: 40px;
		font-weight: 700;
		margin-bottom: 16px;
		color: #0f172a;
	}

	&__meta {
		display: flex;
		gap: 20px;
		margin-bottom: 24px;
		color: #64748b;
		font-weight: 500;
	}

	&__desc {
		font-size: 18px;
		line-height: 1.7;
		color: #334155;
		margin-bottom: 32px;
	}
}

.price-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f8fafc;
	padding: 20px 24px;
	border-radius: 16px;
	border: 1px solid #e2e8f0;

	.old-price {
		text-decoration: line-through;
		color: #94a3b8;
		font-size: 16px;
	}

	.current-price {
		font-size: 28px;
		font-weight: 700;
		color: #0f172a;
	}
}

.btn-primary {
	background: #2563eb;
	color: white;
	border: none;
	padding: 14px 26px;
	border-radius: 12px;
	font-weight: 600;
	cursor: pointer;
	transition: 0.2s;

	&:hover {
		background: #1d4ed8;
		transform: translateY(-2px);
	}
}
</style>
