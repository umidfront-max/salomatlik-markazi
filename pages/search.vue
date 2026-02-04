<script setup>
defineComponent({ name: "search" });
const route = useRoute();
const localePath = useLocalePath();
const { $api } = useNuxtApp();
const { data } = await useAsyncData(`diseases`, () =>
  $api("posts", {
    params: {
      search: route.query.word,
      letter: route.query.letter,
      per_page: 16,
      category: "diseases"
    },
  })
);
watch(
  () => route.query,
  () => {
    refreshNuxtData("diseases");
  },
  { deep: true }
);
</script>
<template>
  <SectionBreadcrumbs title="Qidiruv" class="section-breadcrumbs" />
  <LazySectionAlphabet :is-page="true" class="pb-40" />
  <section class="section container pb-100">
    <h3 class="section-title" v-if="$route.query.letter">
      {{ $t('letter') }}: <span>{{ $route.query.letter }}</span>
    </h3>
    <h3 class="section-title" v-else-if="$route.query.word">
      {{ $t('search') }}: <span>{{ $route.query.word }}</span>
    </h3>
    <ARow :gutter="[{ xxl: 24, xl: 20, xs: 12, sm: 16 }, 32]">
      <ACol :lg="6" :sm="12" :xs="12" v-for="item in data.result ?? []" :key="item.id">
        <NuxtLink :to="localePath(`/static/${item.slug}`)" class="section-link">{{ item.title }}</NuxtLink>
      </ACol>
    </ARow>
    <Pagination module="diseases" :pagination="data.pagination" />
  </section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
.section {
  --width-container: 1520px;
  &-breadcrumbs {
    --width-container: 1800px;
  }
  &-title {
    @include text(32, #03182b, 700, 140%);
    margin-bottom: var(--space-32);

    span {
      color: var(--primary-1);
    }
  }

  &-link {
    @include text(20, #03182b, 400, 150%);
  }
}
</style>
