<script setup>
const localePath = useLocalePath();
defineProps({
  data: {
    type: Object,
    required: true,
  },
})

</script>
<template>
  <NuxtLink :to="localePath(`/news/${data.slug}`)" class="news-horizontal">
    <ARow :gutter="[24, 24]">
      <ACol :md="8" :sm="12" :xs="24">
        <Image class="news-horizontal__image" :src="data.image" />
      </ACol>
      <ACol :md="16" :sm="12" :xs="24">
        <div class="news-horizontal__info">
          <h3 class="news-horizontal__title">
            {{ data.title }}
          </h3>
          <p class="news-horizontal__subtitle">
            {{ data.subtitle }}
          </p>
          <span class="news-horizontal__date">
            <Icon name="calendar" />
            {{ data.date }}
          </span>
        </div>
      </ACol>
    </ARow>
  </NuxtLink>
</template>
<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.news-horizontal {
  --image-width: 492px;
  padding-bottom: var(--space-32);
  margin-bottom: var(--space-32);
  border-bottom: 1px solid #d3e0ea;
  display: block;
  cursor: pointer;
  border-radius: 12px;


  &__image {
    --ratio: 1.64;
  }

  &__info {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%
  }

  &__title {
    @include text(28, var(--black-1), 700, 140%);
    margin-bottom: 12px;
  }

  &__subtitle {
    @include text(22, var(--black-1), 300, 150%);
    margin-bottom: var(--space-20);
  }

  &__date {
    display: flex;
    align-items: center;
    @include text(18, var(--black-1), 500, 150%);
    gap: 6px;
    margin-top: auto;
  }
}
</style>
