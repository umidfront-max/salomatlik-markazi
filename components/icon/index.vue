<template>
  <component class="icon" :is="icon" @click="toHandleClick" />
</template>
<script setup>
const emits = defineEmits(["click"]);
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: undefined,
  },
});
const icon = defineAsyncComponent(() =>
  import(`../../assets/svg/${props.name}.svg`)
);

function toHandleClick(event) {
  emits("click", event);
}
</script>

<style lang="scss">
.icon {
  display: block;
  fill: var(--icon-color, var(--primary-1));
  width: var(--icon-size, var(--size-icon-24));
  height: var(--icon-size, var(--size-icon-24));
  min-width: var(--icon-size, var(--size-icon-24));
  transition: all 0.2s ease-in-out;
}
</style>
