<script setup>
import { SITE } from "@/utilities/enum";
const localePath = useLocalePath();
const config = useRuntimeConfig();
const props = defineProps({
  type: {
    type: String,
    default: "dark",
  },
});
const src = computed(() => {
  const name = config.public.name;
  const subname = config.public.subname || "default";
  if (name === SITE.KOKAND) {
    return `/logo/${name}-${subname}-${props.type}.png`;
  } else if (name === SITE.SBJ) {
    return `/logo/${name}-${props.type}.svg`;
  } else if (name === SITE.IRIS) {
    return `/logo/${name}.png`;
  }
  return "/logo/default.png"; // fallback
});
</script>
<template>
  <NuxtLink class="logo" :to="localePath('/')">
    <img :src="src" :alt="config.public.name" />
  </NuxtLink>
</template>
<style lang="scss">
.logo {
  max-width: var(--logo-width);
  width: 100%;
  display: block;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
  }
}
</style>
