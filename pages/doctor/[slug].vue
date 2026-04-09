<script setup>
const route = useRoute();
const { locale } = useI18n()
const localePath = useLocalePath();
const { $api } = useNuxtApp();
const { data: doctors } = await useAsyncData(
	`doctor_${route.params.slug}`,
	() =>
		$api(`doctors/${route.params.slug}`, {
			params: {
				category: "banner",
				limit: 12,
			},
		}),
);

useHead({
	title: computed(() => doctors.value?.metaTitle?.[locale.value] || doctors.value?.fullName?.[locale.value]),
	meta: [
		{ name: 'description', content: computed(() => doctors.value?.metaDescription?.[locale.value]) },
		{ property: 'og:type', content: 'profile' },
		{ property: 'og:title', content: computed(() => doctors.value?.metaTitle?.[locale.value] || doctors.value?.fullName?.[locale.value]) },
		{ property: 'og:description', content: computed(() => doctors.value?.metaDescription?.[locale.value]) },
		{ property: 'og:image', content: computed(() => doctors.value?.image) },
	]
});

const formatYear = (dateStr) => {
	if (!dateStr) return '';
	return new Date(dateStr).getFullYear();
};
</script>
<template>
	<section class="section pb-100 container">
		<DoctorDetailCard type="doctor" :data="doctors" class="doctor-detail" />

		<!-- About -->
		<template v-if="doctors.description?.[locale]">
			<h3 class="section-subtitle">{{ $t("doctor.about") }}</h3>
			<div class="section-content" v-html="doctors.description[locale]"></div>
		</template>

		<!-- Experience -->
		<template v-if="doctors?.experiences?.length">
			<h3 class="section-subtitle">{{ $t("doctor.experience") }}</h3>
			<div class="section-timeline">
				<div
					class="section-timeline__item"
					v-for="(item, ind) in doctors.experiences"
					:key="ind"
				>
					<i class="section-timeline__circle"></i>
					<div class="section-timeline__head">
						<span class="section-timeline__period">
							{{ formatYear(item.startDate) }}
							–
							{{ item.endDate ? formatYear(item.endDate) : $t("doctor.present") }}
						</span>
						<span
							v-if="item.specialization?.[locale]"
							class="section-timeline__role"
						>
							{{ item.specialization[locale] }}
						</span>
					</div>
					<p v-if="item.workplace?.[locale]" class="section-timeline__workplace">
						{{ item.workplace[locale] }}
					</p>
					<div
						v-if="item.patientsCount || item.operationsCount"
						class="section-timeline__stats"
					>
						<span v-if="item.patientsCount" class="section-timeline__stat">
							<b>{{ Number(item.patientsCount).toLocaleString() }}</b>
							{{ $t("doctor.patients") }}
						</span>
						<span v-if="item.operationsCount" class="section-timeline__stat">
							<b>{{ Number(item.operationsCount).toLocaleString() }}</b>
							{{ $t("doctor.operations") }}
						</span>
					</div>
				</div>
			</div>
		</template>

		<!-- Education -->
		<template v-if="doctors?.educations?.length">
			<h3 class="section-subtitle">{{ $t("doctor.education") }}</h3>
			<div class="section-education">
				<div
					class="section-education__item"
					v-for="(item, ind) in doctors.educations"
					:key="ind"
				>
					<i class="section-education__circle"></i>
					<div class="section-education__head">
						<span class="section-education__year">{{ item.degree?.[locale] }}</span>
						<span
							v-if="item.startDate || item.endDate"
							class="section-education__period"
						>
							{{ formatYear(item.startDate) }}
							<template v-if="item.endDate"> – {{ formatYear(item.endDate) }}</template>
						</span>
					</div>
					<span class="section-education__title">{{ item.institution?.[locale] }}</span>
					<p
						v-if="item.title?.[locale] && item.title[locale] !== '-'"
						class="section-education__subtitle"
					>
						{{ item.title[locale] }}
					</p>
				</div>
			</div>
		</template>

		<!-- Departments -->
		<template v-if="doctors?.departments?.length">
			<h3 class="section-subtitle">{{ $t("doctor.departments") }}</h3>
			<div class="section-departments">
				<NuxtLink
					v-for="dep in doctors.departments"
					:key="dep.id"
					:to="localePath(`/department/${dep.id}`)"
					class="section-department"
				>
					<div v-if="dep.image" class="section-department__img">
						<Image :src="dep.image" />
					</div>
					<div class="section-department__body">
						<h4 class="section-department__title">{{ dep.title?.[locale] }}</h4>
						<p v-if="dep.subTitle?.[locale]" class="section-department__sub">
							{{ dep.subTitle[locale] }}
						</p>
					</div>
				</NuxtLink>
			</div>
		</template>
	</section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
	--width-container: 1520px;
	padding-top: var(--space-40);

	&-subtitle {
		@include text(32, #03182b, 700, 140%);
		margin-bottom: var(--space-16);
		margin-top: var(--space-80);

		@include devices(xs) {
			font-size: 22px;
			margin-top: var(--space-40);
		}
	}

	&-content {
		:deep(p) { margin-bottom: 12px; line-height: 1.7; }
		:deep(h4) { font-size: 18px; font-weight: 700; margin: 20px 0 8px; }
		:deep(ul), :deep(ol) { padding-left: 20px; margin-bottom: 12px; }
		:deep(li) { margin-bottom: 6px; line-height: 1.6; }
		:deep(blockquote) {
			border-left: 3px solid var(--primary-1);
			padding: 10px 16px;
			margin: 16px 0;
			background: rgba(51, 193, 237, 0.06);
			border-radius: 0 8px 8px 0;
			font-style: italic;
		}
	}

	/* ─── Timeline (Experience) ─── */
	&-timeline {
		--items-space: var(--space-40);
		--square-size: 32px;
		display: flex;
		flex-direction: column;
		gap: var(--items-space);

		&__item {
			display: flex;
			flex-direction: column;
			position: relative;
			padding-left: calc(var(--square-size) + var(--space-16));

			&:not(:last-child)::after {
				content: "";
				position: absolute;
				left: calc(var(--square-size) / 2);
				top: var(--square-size);
				bottom: calc(0px - var(--items-space));
				border-right: 1px dashed #848d9f;
			}
		}

		&__circle {
			width: var(--square-size);
			height: var(--square-size);
			position: absolute;
			top: 0;
			left: 0;
			border: 1px dashed #848d9f;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;

			&::after {
				content: "";
				width: calc(100% - 12px);
				height: calc(100% - 12px);
				background-color: var(--primary-1);
				border-radius: 6px;
			}
		}

		&__head {
			display: flex;
			align-items: center;
			gap: 12px;
			flex-wrap: wrap;
			margin-bottom: 4px;
		}

		&__period {
			@include text(14, #848d9f, 500, 140%);
			background: rgba(132, 141, 159, 0.08);
			border: 1px solid rgba(132, 141, 159, 0.2);
			border-radius: 6px;
			padding: 2px 8px;
		}

		&__role {
			@include text(16, var(--primary-1), 600, 140%);
		}

		&__workplace {
			@include text(22, #03182b, 700, 150%);
			margin: 0 0 10px;
		}

		&__stats {
			display: flex;
			gap: 12px;
			flex-wrap: wrap;
		}

		&__stat {
			@include text(15, #848d9f, 400, 140%);
			display: inline-flex;
			align-items: center;
			gap: 5px;
			background: rgba(51, 193, 237, 0.06);
			border: 1px solid rgba(51, 193, 237, 0.18);
			border-radius: 8px;
			padding: 4px 12px;

			b {
				@include text(16, #03182b, 700, 140%);
			}
		}
	}

	/* ─── Education ─── */
	&-education {
		--items-space: var(--space-40);
		--square-size: 32px;

		&__item {
			display: flex;
			flex-direction: column;
			position: relative;
			padding-left: calc(var(--square-size) + var(--space-16));

			&:not(:last-child) {
				&::after {
					content: "";
					position: absolute;
					left: calc(var(--square-size) / 2);
					top: var(--square-size);
					bottom: calc(0px - var(--items-space));
					border-right: 1px dashed #848d9f;
				}
				margin-bottom: var(--items-space);
			}
		}

		&__circle {
			width: var(--square-size);
			height: var(--square-size);
			position: absolute;
			top: 0;
			left: 0;
			border: 1px dashed #848d9f;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;

			&::after {
				content: "";
				width: calc(100% - 12px);
				height: calc(100% - 12px);
				background-color: var(--primary-1);
				border-radius: 6px;
			}
		}

		&__head {
			display: flex;
			align-items: center;
			gap: 12px;
			flex-wrap: wrap;
			margin-bottom: 2px;
		}

		&__year {
			@include text(22, #03182b, 700, 150%);
		}

		&__period {
			@include text(14, #848d9f, 500, 140%);
			background: rgba(132, 141, 159, 0.08);
			border: 1px solid rgba(132, 141, 159, 0.2);
			border-radius: 6px;
			padding: 2px 8px;
		}

		&__title {
			@include text(20, #03182b, 400, 150%);
		}

		&__subtitle {
			@include text(16, #848d9f, 400, 150%);
			margin: 2px 0 0;
		}
	}

	/* ─── Departments ─── */
	&-departments {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 20px;

		@include devices(xs) {
			grid-template-columns: 1fr;
		}
	}

	&-department {
		display: flex;
		gap: 16px;
		padding: 20px;
		border-radius: 16px;
		background: #fff;
		border: 1px solid rgba(2, 10, 20, 0.08);
		text-decoration: none;
		transition: box-shadow 0.2s ease, transform 0.2s ease;

		&:hover {
			box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
			transform: translateY(-2px);
		}

		&__img {
			flex-shrink: 0;
			width: 72px;
			height: 72px;
			border-radius: 12px;
			overflow: hidden;

			.image {
				--ratio: 1;
				width: 100%;
				height: 100%;

				:deep(img) {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}

		&__body {
			min-width: 0;
			display: flex;
			flex-direction: column;
			gap: 6px;
		}

		&__title {
			@include text(18, #03182b, 700, 140%);
			margin: 0;
		}

		&__sub {
			@include text(14, #848d9f, 400, 150%);
			margin: 0;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			overflow: hidden;
		}
	}
}
</style>
