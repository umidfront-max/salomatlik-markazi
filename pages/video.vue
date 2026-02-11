<script setup>
defineComponent({ name: "video" });
const route = useRoute();
const { $api } = useNuxtApp();
const { data } = useAsyncData("video", () =>
  $api("video", {
    params: {
      limit: 4,
      page: route.query.page,
    },
  })
);
const gutter = { xxl: 24, xl: 20, xs: 12, sm: 16 };
</script>
<template>
  <section class="section container pb-100">
    <ARow :gutter="[gutter, gutter]">
      <ACol
        :xl="6"
        :lg="8"
        :xs="12"
        v-for="(item, index) in data?.data ?? []"
        :key="index"
      >
        <LazyCardVideo
          :data="item"
          data-aos="fade-up"
          data-aos-duration="450"
          :data-aos-delay="index * 50"
        />
      </ACol>
    </ARow>
    <Pagination module="video" :pagination="data?.pagination ?? {}" />
  </section>
</template>
<style lang="scss" scoped>
.section {
  --width-container: 1520px;
}
</style>
