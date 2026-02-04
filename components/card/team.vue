<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="card-team">
    <div class="card-team__image">
      <Image :src="data.image" />
    </div>
    <div class="card-team__info">
      <h3 class="card-team__title">
        {{ data.title }}
      </h3>
      <span class="card-team__subtitle">
        {{ data.sub_title }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.card-team {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  padding: var(--space-20);
  border-radius: 12px;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--red-1);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
  }

  &__image {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: var(--space-16);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    @include text(20, #03182b, 600, 130%);
    margin: 0;

    @include devices(sm) {
      @include text(18, #03182b, 600, 130%);
    }
  }

  &__subtitle {
    @include text(16, #6b7280, 400, 150%);

    @include devices(sm) {
      @include text(14, #6b7280, 400, 150%);
    }
  }
}
</style>
