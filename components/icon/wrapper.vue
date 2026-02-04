<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <i class="icon-wrapper" v-html="icon"></i>
</template>
<style lang="scss">
.icon-wrapper {
  --icon-wrapper-size: 32px;
  --icon-size: 100%;
  width: var(--icon-wrapper-size);
  min-width: var(--icon-wrapper-size);
  max-width: var(--icon-wrapper-size);
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: var(--icon-color);
    width: var(--icon-size);
    height: var(--icon-size);
    flex: 0 0 auto;

    path {
      fill: var(--icon-color);
    }
  }
}
</style>
