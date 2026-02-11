<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const { data } = await useAsyncData("news", () =>
  $api("news", {
    params: {
      limit: 5,
      page: route.query.page,
    },
  })
);
</script>
<template>
  <section class="section container">
    <SectionNews :list="data.data || []" :has-header="false" />
    <Pagination module="news" :pagination="data ?? {}" />
  </section>
</template>
<style lang="scss" scoped>
.container {
  max-width: 1520px !important;
}
</style>
