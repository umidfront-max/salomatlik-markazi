<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const { data } = await useAsyncData("news", () =>
  $api("news", {
    params: {
      limit: 30,
      page: route.query.page,
    },
  })
);
</script>
<template>
  <div>
    <SectionBreadcrumbs />
    <section class="section container">
      <SectionNews :list="data.data || []" :has-header="false" />
      <Pagination module="news" :pagination="data ?? {}" />
    </section>
  </div>
</template>
<style lang="scss" scoped>
.container {
  max-width: 1520px !important;
}
</style>
