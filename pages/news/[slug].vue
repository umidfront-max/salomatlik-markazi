<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const { data: detail = {} } = await useAsyncData(
  `menu_${route.params.slug}`,
  () => $api(`news/${route.params.slug}`)
);
const { data: news } = await useAsyncData(
  `news_similar_${route.params.slug}`,
  () =>
    $api("news", {
      params: {
        limit: 8,
      },
    })
);
const { data: diseases } = await useAsyncData(
  `diseases_by_news_${route.params.id}`,
  () =>
    $api("posts", {
      params: {
        limit: 8,
        category: "diseases",
        news_id: detail.value.id,
      },
    })
);
useCustomHead(detail.value || {});
</script>
<template>
  <section class="section detail container pt-40">
    <div class="section-header">
      <div>
        <h1 class="section-title">
          {{ detail.title }}
        </h1>
        <span class="section-date" v-if="detail.date">
          <Icon name="calendar" /> {{ detail.date }}
        </span>
      </div>
      <ShareSocial :title="detail.title" :description="detail.short_content" />
    </div>
    <ClientOnly>
      <Slider :list="detail.media_list ?? []" />
      <template #fallback>
        <div
          class="image"
          v-for="item in detail.media_list ?? []"
          style="aspect-ratio: 1.38"
        >
          <img :src="item.link" :alt="detail.title" />
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
    class="section-news"
    :list="diseases?.data ?? []"
    :is-diseases="true"
  />
  <SectionNews
    :has-header="true"
    class="section-news"
    :list="(news?.data ?? []).filter((item) => item.id !== detail.id)"
  />
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
