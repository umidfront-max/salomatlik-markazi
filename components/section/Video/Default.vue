<script setup>
import { toGetYoutubeLink } from "~/utilities/mixins";
defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <a class="card" :href="toGetYoutubeLink(data.url_link)" data-fancybox>
    <div class="card-image">
      <img class="card-image__img" :src="data.image" :alt="data.title" />
      <i class="card-icon">
        <Icon name="play" class="card-icon__inner" />
      </i>
    </div>
    <div class="card-info">
      <h3 class="card-info__title">{{ data.title }}</h3>
      <h4 class="card-info__subtitle">{{ data.sub_title }}</h4>
    </div>
  </a>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.card {
  cursor: pointer;
  display: block;


  &-image {
    margin-bottom: var(--space-16);
    position: relative;
    aspect-ratio: 1.4333;
    border-radius: 12px;
    overflow: hidden;

    &__img {
      @include image;
    }
  }

  &-icon {
    @include middle;
    @include center;
    width: var(--size-btn-64);
    height: var(--size-btn-64);
    backdrop-filter: blur(10px);
    background-color: var(--red-1);
    border-radius: 8px;

    &__inner {
      --icon-color: var(--white-1);
      --icon-size: 24px;
    }
  }

  &-info {
    &__title {
      @include text(24, var(--black-1), 700, 140%);
      margin-bottom: 6px;
    }

    &__subtitle {
      @include text(20, rgba(var(--black), 0.6), 400, 140%);
    }
  }
}
</style>
