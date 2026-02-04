<script setup>
const { $api } = useNuxtApp();
const { data: about } = await useAsyncData("menu_about", () =>
  $api(`menu/o-nas`, {
    params: {
      per_page: undefined,
    },
  })
);
</script>
<template>
  <section class="section container pb-100">
    <h2 class="section-title">
      {{ about.short_content }}
    </h2>
    <Image :src="about.image || ''" class="section-image" />
    <div class="section-content" v-if="about.content" v-html="about.content"></div>
  </section>
</template>
<style lang="scss" scoped>
.section {
  &-image {
    --ratio: 2.6667;
    margin-bottom: var(--space-20);
  }
}
</style>
