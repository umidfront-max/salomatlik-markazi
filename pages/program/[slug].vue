<script setup>
const { $api } = useNuxtApp();
const route = useRoute();
const { data: detail } = await useAsyncData(
	`program_${route.params.slug}`,
	() => $api(`posts/${route.params.slug}`),
);
useCustomHead(detail.value);

const { data: news } = await useAsyncData(
	`news_by_doctor_${detail.value.id}`,
	() =>
		$api("news", {
			params: {
				limit: 8,
				program_id: detail.value.id,
			},
		}),
);
</script>
<template>
	<!-- <SectionBreadcrumbs :title="detail.title" /> -->
	<section class="section pt-80 container">
		<h1 class="section-title">
			{{ detail.title }}
		</h1>
		<ClientOnly>
			<Slider :list="detail.media_list ?? []" />
			<template #fallback>
				<div
					class="image"
					v-for="item in detail.media_list ?? []"
					style="aspect-ratio: 1.38"
				>
					<img
						:src="item.link"
						style="--ratio: 1.38"
						:alt="detail.title"
					/>
				</div>
			</template>
		</ClientOnly>
		<div
			class="section-content"
			v-html="detail.content"
			v-if="detail.content"
		></div>
	</section>
	<SectionNews
		class="pb-100 pt-100"
		:is-page="true"
		:list="news?.data ?? []"
	/>
</template>
<style lang="scss" scoped>
.section {
	--width-container: 1440px !important;
}
</style>
