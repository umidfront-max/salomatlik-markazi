<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const { data: detail } = await useAsyncData(`posts_${route.params.slug}`, () =>
  $api(`posts/${route.params.slug}`)
);
useCustomHead(detail.value);

const { data: news } = await useAsyncData(
  `news_by_banner_${detail.value.id}`,
  () =>
    $api("news", {
      params: {
        limit: 8,
        banner_id: detail.value.id,
      },
    })
);
</script>
<template>
  <SectionBreadcrumbs :title="detail.title" class="section-breadcrumbs" />
  <section class="section pb-100 container">
    <div class="section-header">
      <span class="section-date" v-if="detail.date">
        <Icon name="calendar" /> {{ detail.date }}
      </span>
      <ShareSocial :title="detail.title" :description="detail.short_content" />
    </div>
    <ClientOnly>
      <Slider :list="detail.media_list ?? []" />
      <template #fallback>
        <div class="image" v-for="item in detail.media_list ?? []" style="aspect-ratio: 1.38">
          <img :src="item.link" :alt="detail.title" />
        </div>
      </template>
    </ClientOnly>
    <div class="section-content" v-html="detail.content" v-if="detail.content"></div>
  </section>
  <SectionNews v-if="detail.category === 'banner'" :is-page="true" :list="news?.data ?? []" />
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  &:not(.section-breadcrumbs) {
    --width-container: 1520px;
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: var(--space-20);

    @include devices(sm) {
      flex-direction: column;
      align-items: flex-start;
    }

    .share-social {
      margin-left: auto;
    }
  }

  &-date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 18px;
    font-weight: 500;
    color: #03182b;

    .icon {
      --icon-size: 20px;
      --icon-color: #03182b;
    }
  }
}
</style>
