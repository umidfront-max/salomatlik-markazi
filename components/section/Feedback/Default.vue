<script setup>
defineProps({
  data: {
    type: Object,
    default: () => { },
  },
});
</script>
<template>
  <div class="card">
    <div class="card-bg-pattern"></div>
    <div class="card-quote-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H18.017V19H18.017C18.017 20.1046 17.1216 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 7.55228 5.01697 7V3H10.017C11.6738 3 13.017 4.34315 13.017 6V15C13.017 16.6569 11.6738 18 10.017 18H9.01697V19H9.01697C9.01697 20.1046 8.12154 21 7.01697 21H5.01697Z"
          fill="currentColor" />
      </svg>
    </div>
    <div class="card-header">
      <h3 class="card-title">
        {{ data.title }}
      </h3>
      <div class="card-rate">
        <Icon class="card-rate__icon" name="star" v-for="_ in +data.rating" />
        <Icon class="card-rate__icon non-active" name="star" v-for="_ in 5 - +data.rating" />
      </div>
    </div>
    <p class="card-text">{{ data.short_content }}</p>
  </div>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.card {
  position: relative;
  background: #fff;
  padding: 30px;
  height: 100%;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;

  /* Hover effects removed as per request */
  /* &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
    border-color: transparent;
  } */

  &-bg-pattern {
    position: absolute;
    bottom: -20px;
    left: -20px;
    width: 100px;
    height: 100px;
    background-image: radial-gradient(#e0e0e0 1.5px, transparent 1.5px);
    background-size: 12px 12px;
    opacity: 0.5;
    z-index: 0;
    border-radius: 50%;
  }

  &-quote-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    color: rgba(var(--primary), 0.08);
    z-index: 0;
    transform: scale(1.5);
  }

  &-header {
    position: relative;
    z-index: 1;
    margin-bottom: 16px;
  }

  &-title {
    @include text(24, var(--black-1), 700, 140%);
    /* Increased size and weight */
    margin-bottom: 8px;
  }

  &-text {
    position: relative;
    z-index: 1;
    @include text(18, #555, 400, 160%);
    /* Increased size */
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &-rate {
    display: flex;
    align-items: center;
    gap: 4px;

    &__icon {
      --icon-color: #f79440;
      --icon-size: 18px;
      /* Slightly larger stars */

      &.non-active {
        --icon-color: #eee;
      }
    }
  }
}
</style>
