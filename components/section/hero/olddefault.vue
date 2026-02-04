<script setup>
const localePath = useLocalePath();
defineProps({
  item: {
    type: Object,
    default: () => { },
  },
  index: {
    type: Number,
    default: 0,
  },
  activeIndex: {
    type: Number,
    default: 0,
  },
});
</script>
<template>
  <div class="section-item">
    <div class="section-item__image" :key="`image-${activeIndex}-${index}`">
      <img :src="item.image" :alt="item.title" />
    </div>

    <!-- Decorative Medical Cross Patterns -->
    <div class="section-item__decorations">
      <div class="medical-cross cross-1">
        <span class="cross-vertical"></span>
        <span class="cross-horizontal"></span>
      </div>
      <div class="medical-cross cross-2">
        <span class="cross-vertical"></span>
        <span class="cross-horizontal"></span>
      </div>
      <div class="medical-cross cross-3">
        <span class="cross-vertical"></span>
        <span class="cross-horizontal"></span>
      </div>

      <!-- Stars on the right side -->
      <div class="star star-1"></div>
      <div class="star star-2"></div>
      <div class="star star-3"></div>
      <div class="star star-4"></div>
    </div>

    <div class="container section-container">
      <div class="section-container__inner" :key="`slide-${activeIndex}-${index}`">
        <div class="section-item__label">{{ $t('hero.welcome') }}</div>
        <h2 class="section-item__title">
          {{ item.title }}
        </h2>
        <h3 class="section-item__subtitle">
          {{ item.short_content }}
          {{ item.short_content }}
        </h3>
        <div class="section-item__btns">
          <Btn variant="white" :data-text="$t('more')" @click="$router.push(localePath(`/static/${item.slug}`))">
            {{ $t('more') }}
          </Btn>
          <Btn variant="outline-white" :data-text="$t('hero.ourDoctors')" @click="$router.push(localePath(`/doctor`))">
            {{ $t('hero.ourDoctors') }}
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  &-item {
    height: 100vh;
    overflow: hidden;
    z-index: 1;
    position: relative;
    padding-top: calc(var(--height-header-part) * 2 + 8px * 2);

    &__label {
      display: inline-block;
      background-color: var(--white-1);
      color: var(--red-1);
      padding: 8px 16px;
      position: relative;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.4em;
      letter-spacing: 0.2px;
      text-transform: capitalize;
      border-radius: 8px;
      margin-bottom: var(--space-24);
      opacity: 0;
      transform: translateY(40px);
      filter: blur(10px);
      animation: slideUpFadeBlur 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
    }

    &__image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      animation: zoomIn 10s ease-in-out infinite;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(var(--red), 0.6);
      }

      img {
        @include image;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1);
      }
    }

    &__title {
      @include text(64, var(--white-1), 600, 110%);
      margin-bottom: var(--space-32);
      opacity: 0;
      transform: translateY(80px);
      filter: blur(10px);
      animation: slideUpFadeBlur 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
    }

    &__subtitle {
      @include text(16, rgba(var(--white), 1), 500, 160%);
      opacity: 0;
      transform: translateY(50px);
      filter: blur(8px);
      animation: slideUpFadeBlur 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
    }

    &__btns {
      display: flex;
      align-items: center;
      gap: var(--space-24);
      margin-top: 32px;
      opacity: 0;
      transform: translateY(30px) scale(0.95);
      filter: blur(5px);
      animation: slideUpFadeBlurScale 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;

      .btn {
        white-space: nowrap;

        ::v-deep(span) {
          white-space: unset;
        }
      }
    }

    &__decorations {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      overflow: hidden;

      .medical-cross {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: spinFloat 5s linear infinite;

        .cross-vertical,
        .cross-horizontal {
          position: absolute;
          background-color: var(--red-1);
          border-radius: 2px;
        }

        .cross-vertical {
          width: 30%;
          height: 100%;
        }

        .cross-horizontal {
          width: 100%;
          height: 30%;
        }

        &.cross-1 {
          left: 15%;
          top: 20%;
          width: 70px;
          height: 70px;
          opacity: 0.25;
          animation-duration: 6s;
          animation-delay: 0s;
        }

        &.cross-2 {
          left: 8%;
          top: 38%;
          width: 45px;
          height: 45px;
          opacity: 0.2;
          animation-duration: 7s;
          animation-delay: -2s;
        }

        &.cross-3 {
          left: 12%;
          top: 55%;
          width: 100px;
          height: 100px;
          opacity: 0.18;
          animation-duration: 8s;
          animation-delay: -4s;
        }
      }

      .star {
        position: absolute;
        background-color: var(--red-1);
        clip-path: polygon(50% 0%,
            60% 40%,
            100% 50%,
            60% 60%,
            50% 100%,
            40% 60%,
            0% 50%,
            40% 40%);
        animation: pulsate 3s ease-in-out infinite;

        &.star-1 {
          right: 8%;
          bottom: 35%;
          width: 65px;
          height: 65px;
          opacity: 0.3;
          animation-duration: 3s;
          animation-delay: 0s;
        }

        &.star-2 {
          right: 22%;
          bottom: 18%;
          width: 45px;
          height: 45px;
          opacity: 0.24;
          animation-duration: 3.5s;
          animation-delay: -1s;
        }

        &.star-3 {
          right: 5%;
          bottom: 10%;
          width: 75px;
          height: 75px;
          opacity: 0.35;
          animation-duration: 4s;
          animation-delay: -2s;
        }

        &.star-4 {
          right: 18%;
          bottom: 45%;
          width: 50px;
          height: 50px;
          opacity: 0.27;
          animation-duration: 3.2s;
          animation-delay: -1.5s;
        }
      }
    }
  }

  &-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    max-width: var(--width-mini-container);

    &__inner {
      width: 60%;

      @include devices(sm) {
        width: 100%;
      }
    }

    &__spacer {
      flex: 1;
    }
  }
}

// Zoom-in animation
@keyframes zoomIn {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}

// Slide up and fade in animation with blur
@keyframes slideUpFadeBlur {
  0% {
    opacity: 0;
    transform: translateY(var(--slide-distance, 60px));
    filter: blur(10px);
  }

  60% {
    opacity: 0.8;
    filter: blur(5px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

// Slide up fade blur with scale for buttons
@keyframes slideUpFadeBlurScale {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    filter: blur(5px);
  }

  60% {
    opacity: 0.8;
    filter: blur(2px);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

// Continuous spinning animation
@keyframes spinFloat {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// Pulsate animation for stars - small to big
@keyframes pulsate {
  0% {
    transform: scale(0.6);
    opacity: 0.15;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.35;
  }

  100% {
    transform: scale(0.6);
    opacity: 0.15;
  }
}
</style>
