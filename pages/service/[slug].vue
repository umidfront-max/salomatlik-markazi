<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const { data: detail } = await useAsyncData(
  `services_${route.params.slug}`,
  () => $api(`services/${route.params.slug}`)
);
const { data: stats } = await useAsyncData(
  `statistics_${route.params.slug}`,
  () =>
    $api(`statistics`, {
      params: {
        category: route.params.slug,
        limit: 4,
      },
    })
);

const { data: news } = await useAsyncData(
  `news_by_service_${detail.value.id}`,
  () =>
    $api("news", {
      params: {
        limit: 8,
        service_id: detail.value.id,
      },
    })
);
const { data: diseases } = await useAsyncData(
  `diseases_by_service_${detail.value.id}`,
  () =>
    $api("posts", {
      params: {
        limit: 8,
        category: "diseases",
        service_id: detail.value.id,
      },
    })
);
const gutter = { xxl: 24, xl: 20, xs: 12, sm: 16 };

useCustomHead(detail.value);
</script>
<template>
  <section class="section pb-100 pt-80 container">
    <h1 class="section-title">
      {{ detail.title }}
    </h1>
    <div class="section-content" style="margin-top: 0; margin-bottom: var(--space-32)">
      <p>{{ detail.short_content }}</p>
    </div>
    <ARow :gutter="[gutter, gutter]" justify="center">
      <ACol :md="18" :xs="24">
        <ClientOnly>
          <Slider :list="detail.media_list ?? []" :title="detail.title" />
          <template #fallback>
            <div class="image" v-for="item in detail.media_list ?? []" style="aspect-ratio: 1.38">
              <img :src="item.link" :alt="detail.title" />
            </div>
          </template>
        </ClientOnly>
      </ACol>
      <ACol :md="6" :xs="24" v-if="stats?.data?.length">
        <div class="section-statistics">
          <div class="section-statistics__item" v-for="item in stats.data ?? []">
            <span class="section-statistics__value">{{
              item.count + item.value
              }}</span>
            <small class="section-statistics__label">{{ item.title }}</small>
          </div>
        </div>
      </ACol>
    </ARow>
    <div class="section-content" v-html="detail.content"></div>
  </section>
  <SectionNews v-if="diseases?.data?.length" :is-page="true" :list="diseases?.data ?? []" :is-diseases="true"
    class="pb-80" />
  <SectionDoctor :is-page="true" :serviec-id="detail.id" class="pb-80" />
  <SectionNews v-if="news?.data?.length" :is-page="true" :list="news?.data ?? []" class="pb-80" />
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  --width-container: 1520px;

  ::v-deep(.slider) {
    margin-bottom: 0;
  }

  &-content {
    margin-top: var(--space-32);

    p {
      font-size: 22px;
      font-weight: 500;

      @include devices(sm) {
        font-size: 20px;
      }

      @include devices(xs) {
        font-size: 18px;
      }
    }
  }

  &-statistics {
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: var(--space-24);

    &__item {
      flex: 1;
      border: 1px solid #d3e0ea;
      background: #f4f8fa;
      padding: 8px var(--space-24);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__value {
      @include text(40, #03182b, 700, 130%);
      margin-bottom: 4px;
    }

    &__label {
      @include text(20, #03182b, 400, 140%);
      opacity: 0.6;
    }
  }
}
</style>
