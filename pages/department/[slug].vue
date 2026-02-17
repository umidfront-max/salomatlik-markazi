<script setup>
const { locale } = useI18n();
const { list: services } = useService();
const { list: news } = useNews();
const { list: diseases } = useDiseases();
const { list: doctors } = useDoctor();
const { list: galery } = useGallery();

const route = useRoute();
const { $api } = useNuxtApp();
const localePath = useLocalePath();

const { data: department } = await useAsyncData(
	`department_${route.params.slug}`,
	() => $api(`/department/${route.params.slug}`),
);
</script>

<template>
	<section class="department">
		<div class="container">
			<div class="department__grid">
				<!-- LEFT: IMAGE -->
				<div class="department__image">
					<img
						:src="department?.image"
						:alt="department?.name?.[locale]"
					/>
				</div>

				<!-- RIGHT: INFO -->
				<div class="department__info">
					<span class="department__department">
						{{ department?.department?.title?.[locale] }}
					</span>

					<h1 class="department__title">
						{{ department?.name?.[locale] }}
					</h1>

					<div class="department__meta">
						<div class="meta-item">
							⏱ {{ department?.durationMinutes }} min
						</div>
						<div class="meta-item">
							🏥 {{ department?.department?.title?.[locale] }}
						</div>
					</div>

					<div
						class="department__desc"
						v-html="department?.description?.[locale]"
					/>

					<!-- PRICE CARD -->
					<div class="price-card">
						<div class="price-card__left">
							<div v-if="department?.hasDiscount" class="old-price">
								{{ department?.price }}$
							</div>
							<div class="current-price">
								{{ department?.discountedPrice }} so'm
							</div>
						</div>

						<button class="btn-primary">Qabulga yozilish</button>
					</div>
				</div>
			</div>
			<h3 class="services_title">{{ $t("service.title3") }}</h3>
			<ARow class="service__item" :gutter="[20, 20]">
				<ACol
					v-for="service in services.filter(
						(el) => el.department?.id == route.params.slug,
					)"
					:key="service.id"
					:xs="24"
					:sm="12"
					:md="12"
					:lg="6"
				>
					<NuxtLink class="service-link">
						<CardServicePrice :data="service" />
					</NuxtLink>
				</ACol>
			</ARow>
			<h3 class="services_title">{{ $t("news.title") }}</h3>
			<SectionNews
				:list="news.filter((el) => el.department?.id == route.params.slug)"
				:has-header="false"
			/>
			<h3 class="services_title">{{ $t("diseases") }}</h3>
			<SectionNews
				:list="
					diseases.filter((el) => el.department?.id == route.params.slug)
				"
				:has-header="false"
			/>
			<h3 class="services_title">{{ $t("doctor.title") }}</h3>
			<ARow :gutter="[{ xxl: 24, xl: 20, sm: 16, xs: 12 }, 32]">
				<ACol
					v-for="(item, index) in doctors.filter(
						(el) => el.department?.id == route.params.slug,
					)"
					:key="index"
					:xl="6"
					:md="8"
					:sm="12"
					:xs="24"
				>
					<Card
						@click="$router.push(localePath(`/doctor/${item.id}`))"
						:data="item"
						type="doctor"
						data-aos="fade-up"
						data-aos-duration="450"
						:data-aos-delay="index * 50"
					/>
				</ACol>
			</ARow>
			<h3 class="services_title">{{ $t("video.title") }}</h3>

			<ARow :gutter="[gutter, gutter]">
				<ACol
					:xl="6"
					:lg="8"
					:xs="12"
					v-for="(item, index) in galery?.filter(
						(el) => el.department?.id == route.params.slug,
					) ?? []"
					:key="index"
				>
					<SectionVideoDefault
						:data="item"
						data-aos="fade-up"
						data-aos-duration="450"
						:data-aos-delay="index * 50"
					/>
				</ACol>
			</ARow>
		</div>
	</section>
</template>
<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

.container {
	max-width: 1400px;
	width: 100%;
	padding: 0px 24px;
	margin: 0px auto;
}
.service__item {
	margin-top: 40px;
}
.services_title {
	margin-top: 40px;
	margin-bottom: 40px;
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
.department {
	padding: 60px 0;
	background: #f8faff;
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
