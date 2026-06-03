<script setup>
const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const { $api } = useNuxtApp();
const { data } = useAsyncData("equipment", () =>
  $api("equipment", {
    params: {
      limit: 8,
      page: route.query.page,
    },
  })
);
</script>
<template>
  <div>
    <SectionBreadcrumbs />
    <section class="section container pb-100">
      <ARow :gutter="[{ xxl: 24, xl: 20, xs: 12, sm: 16 }, 40]">
        <ACol
          span="6"
          :xl="6"
          :lg="8"
          :sm="12"
          :xs="24"
          :key="index"
          v-for="(item, index) in data?.data ?? []"
        >
          <CardEquipment
            @click="router.push(localePath(`/equipment/${item.slug|| item.id}`))"
            :data="item"
            type="equipment"
            data-aos="fade-up"
            data-aos-duration="450"
            :data-aos-delay="index * 50"
          />
        </ACol>
      </ARow>
      <Pagination module="equipment" :pagination="data?.pagination ?? {}" />
    </section>
  </div>
</template>
<style lang="scss" scoped>
.section {
  --width-container: 1520px;
}
</style>
