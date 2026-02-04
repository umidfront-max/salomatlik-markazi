<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const { data: detail } = await useAsyncData(
  `equipment_${route.params.slug}`,
  () => $api(`equipment/${route.params.slug}`)
);
useCustomHead(detail.value);
</script>
<template>
  <!-- <SectionBreadcrumbs :title="detail.title" /> -->
  <section class="section pb-100 pt-80 container">
    <h1 class="section-title">
      {{ detail.title }}
    </h1>
    <ClientOnly>
      <Slider :list="detail.media_list ?? []" :has-pagination="true" />
    </ClientOnly>
    <ARow :gutter="[
      { xxl: 24, xl: 20, xs: 12, sm: 16 },
      { xxl: 24, xl: 20, xs: 12, sm: 16 },
    ]">
      <ACol :sm="12" :xs="24">
        <div class="section-item">
          <small class="section-item__label">{{ $t('moreDescription') }}:</small>
          <span class="section-item__value">{{ detail.sub_title }}</span>
        </div>
      </ACol>
      <ACol :sm="12" :xs="24">
        <div class="section-item">
          <small class="section-item__label">{{ $t('manufacturer') }}:</small>
          <span class="section-item__value">{{ detail.short_content }}</span>
        </div>
      </ACol>
    </ARow>
    <div class="section-content" v-html="detail.content" v-if="detail.content"></div>
  </section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
.section {
  --width-container: 1120px;
  &-content {
    margin-top: var(--space-24);
  }
  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-20);
    border: 1px solid #D3E0EA;
    background: #F4F8FA;

    &__label {
      @include text(20, #03182B, 300, 150%);
      margin-bottom: 8px;
    }

    &__value {
      @include text(24, #03182B, 700, normal);
    }
  }
}
</style>
