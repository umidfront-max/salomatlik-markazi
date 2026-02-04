<template>
  <div class="nav">
    <button class="nav-prev nav-btn">
      <Icon name="angle-left" class="nav-btn__icon" />
    </button>
    <button class="nav-next nav-btn">
      <Icon name="angle-right" class="nav-btn__icon" />
    </button>
  </div>
</template>
<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

.nav {
  display: flex;
  align-items: center;
  gap: 8px;

  &-btn {
    @include btn-default;
    width: var(--size-btn-48);
    height: var(--size-btn-48);
    border-radius: 12px;

    border: 1px solid var(--primary-1);
    background: var(--white-1);
    cursor: pointer;

    &.swiper-button-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
