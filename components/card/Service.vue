<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
const localePath = useLocalePath();

const colors = ["#3D4F7D", "#BFECF3", "#DDF0FF", "#DCDFF2"];
</script>
<template>
  <NuxtLink
    :to="localePath(`/service/${data.slug}`)"
    class="card"
    :class="{ 'card--dark': index === 0 }"
    :style="{
      '--local-bg': index === 0 ? colors[0] : colors[index % colors.length],
      '--card-bg-image': `url(${data.image})`,
    }"
  >
    <div class="card-icon">
      <IconWrapper v-if="data.icon" :icon="data.icon" />
      <Icon v-else name="whatsapp" />
    </div>
    <h3 class="card-title">
      {{ data.title }}
    </h3>
    <p class="card-text">
      {{ data.short_content }}
    </p>
    <button class="card-btn">
      {{ $t("more") }}
      <Icon name="arrow-right-1" />
    </button>
  </NuxtLink>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.card {
  padding: var(--space-40) var(--space-32);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(249, 249, 255, 0.9)
  );
  position: relative;
  height: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    border-color: transparent;
  }

  // Background image layer
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--card-bg-image);
    background-size: cover;
    background-position: center;
    opacity: 0;
    transform: scale(1.1);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
    border-radius: 12px;
  }

  // Gradient overlay - Medical theme
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(220, 38, 38, 0.9) 0%,
      rgba(185, 28, 28, 0.88) 50%,
      rgba(153, 27, 27, 0.92) 100%
    );
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    border-radius: 12px;
  }

  &:hover::before {
    opacity: 1;
    transform: scale(1);
  }

  &:hover::after {
    opacity: 1;
  }

  &:hover {
    .card-icon,
    .card-title,
    .card-text {
      color: var(--white-1);
    }

    .card-icon {
      background: rgba(255, 255, 255, 0.95);
      color: var(--red-1);
      --icon-color: var(--red-1);
      transform: translateY(-8px) rotate(5deg) scale(1.1);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }
  }

  &-icon {
    position: relative;
    z-index: 2;
    height: 88px;
    width: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(
      135deg,
      rgba(255, 240, 245, 1),
      rgba(255, 245, 250, 1)
    );
    color: var(--red-1);
    border-radius: 22px;
    margin-bottom: 32px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    --icon-color: var(--red-1);
    --icon-color: var(--red-1);

    @include devices(xs) {
      height: 76px;
      width: 76px;
      margin-bottom: 24px;
    }

    :deep(.icon-wrapper) {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.4s ease;
      --icon-size: 50px;
    }

    // :deep(svg) {
    //   width: 44px;
    //   height: 44px;
    //   fill: currentColor;
    //   color: var(--red-1);

    //   path {
    //     fill: currentColor;
    //   }

    //   @include devices(xs) {
    //     width: 38px;
    //     height: 38px;
    //   }
    // }
  }

  &-title {
    @include text(32, var(--black-1), 700, 130%);
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    @include devices(xs) {
      font-size: 26px;
    }
  }

  &-text {
    @include text(18, var(--black-1), 400, 165%);
    margin-bottom: auto;
    flex: 1;
    position: relative;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.9;

    @include slice(4);
  }

  &-btn {
    @include btn-default;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: rgba(255, 255, 255, 0.95);
    padding: 0;
    border: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    align-self: flex-start;
    margin-top: 16px;

    // Underline effect
    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1.5px;
      background: rgba(255, 255, 255, 0.9);
      transition: width 0.3s ease;
    }

    .card:hover & {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      transition-delay: 0.1s;
    }

    &:hover {
      gap: 10px;

      &::after {
        width: calc(100% - 24px);
      }

      :deep(.icon-wrapper) {
        transform: translateX(4px);
      }
    }

    :deep(.icon) {
      --icon-color: rgba(255, 255, 255, 0.95);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      font-size: 12px;

      svg path {
        fill: rgba(255, 255, 255, 0.95);
      }
    }
  }
}
</style>
