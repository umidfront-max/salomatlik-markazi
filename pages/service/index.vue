<script setup>
const { list } = useService();
</script>
<template>
  <section class="section container">
    <ARow :gutter="[16, 16]">
      <ACol :lg="6" :md="8" :sm="12" :xs="24" v-for="(item, index) in list" :key="index">
        <CardService :data="item" :key="item.id" :index data-aos="fade-up" data-aos-duration="150"
          data-aos-anchor=".card" :data-aos-delay="index * 50" />
      </ACol>
    </ARow>
  </section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  --width-container: 1800px !important;
}
</style>
