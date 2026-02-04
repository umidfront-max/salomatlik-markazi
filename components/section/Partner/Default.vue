<script setup>
defineProps({
  item: {
    type: Object,
    default: () => { },
  },
});
</script>
<template>
  <a :href="item.url_link" target="_blank" class="section-item__wrapper">
    <img :src="item.image" alt="partner" />
  </a>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  &-item {
    &__wrapper {
      width: calc(100% - var(--width-space) + 12px);
      margin: 0 auto;
      aspect-ratio: 1/1;
      display: block;

      img {
        @include image(contain);
      }
    }
  }
}
</style>
