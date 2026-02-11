<script setup>
const { locale } = useI18n();
const route = useRoute();
const { $api } = useNuxtApp();

const { data: detail = {} } = await useAsyncData(
	`menu_${route.params.slug}`,
	() => $api(`news/${route.params.slug}`),
);
const { data: news } = await useAsyncData(
	`news_similar_${route.params.slug}`,
	() =>
		$api("news", {
			params: {
				limit: 8,
			},
		}),
);
const { data: diseases } = await useAsyncData(
	`diseases_by_news_${route.params.slug}`,
	() =>
		$api("posts", {
			params: {
				limit: 8,
				category: "diseases",
				news_id: detail.value?.id,
			},
		}),
);
useCustomHead(detail.value || {});
</script>
<template>
	<div>
		<section class="section detail container pt-40">
			<div class="section-header">
				<div>
					<h1 class="section-title">
						{{ detail?.title?.[locale] }}
					</h1>
					<span class="section-date" v-if="detail?.createdAt">
						<Icon name="calendar" /> {{ detail?.createdAt }}
					</span>
				</div>
				<ShareSocial
					:title="detail?.title"
					:description="detail?.short_content"
				/>
			</div>
			<ClientOnly>
				<Slider :list="detail?.media_list ?? []" />
				<template #fallback>
					<div
						class="image"
						v-for="(item, ind) in detail?.media_list ?? []"
						:key="ind"
						style="aspect-ratio: 1.38"
					>
						<img :src="item.link" :alt="detail.title?.[locale]" />
					</div>
				</template>
			</ClientOnly>
			<div
				class="section-content"
				v-if="detail?.description?.[locale]"
				v-html="detail?.description?.[locale]"
			></div>
		</section>
		<SectionNews
			class="section-news"
			:list="diseases?.data ?? []"
			:is-diseases="true"
		/>
		<!-- <SectionNews
         :has-header="true"
         class="section-news"
         :list="(news?.data ?? []).filter((item) => item?.id !== detail?.id)"
      /> -->
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
.section {
	--width-container: 1440px;
	padding-bottom: var(--space-80);

	&-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: var(--space-20);

		@include devices(sm) {
			flex-direction: column;
		}
	}

	&-title {
		@include text(40, #03182b, 700, 130%);
		margin-bottom: var(--space-20);
	}

	&-date {
		display: flex;
		align-items: center;
		gap: 6px;
		@include text(18, #03182b, 500, 150%);
		margin-bottom: var(--space-20);
	}
	&-news {
		--width-container: 1800px;
		padding-bottom: var(--space-80);
	}
}
</style>
