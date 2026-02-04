<script setup>
defineProps({
  list: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "Image",
  },
  hasPagination: {
    type: Boolean,
    default: false
  }
})
const activeIndex = ref(0);
const onSlideChange = (value) => {
  activeIndex.value = value.realIndex;
};

const swiper = ref();
const onSwiper = (value) => {
  swiper.value = value;
};
const options = {
  modules: [SwiperPagination, SwiperEffectCreative, SwiperAutoplay],
  onSlideChange: onSlideChange,
  onSwiper: onSwiper,
  speed: 1000,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  grabCursor: true,
  effect: 'creative',
  creativeEffect: {
    prev: {
      shadow: true,
      translate: ['-20%', 0, -1]
    },
    next: {
      translate: ['100%', 0, 0]
    }
  }
}
</script>
<template>
  <Swiper class="slider" v-bind="options">
    <SwiperSlide v-for="(item, index) in list" :key="index">
      <div class="slider-image" :style="`background-image: url(${item.link})`">
        <img :src="item.link" :alt="title" />
      </div>
    </SwiperSlide>
  </Swiper>
  <div class="slider-pagination" v-if="hasPagination">
    <ARow justify="center" :gutter="[{ xxl: 24, xl: 20, xs: 12, sm: 16 }, { xxl: 24, xl: 20, xs: 12, sm: 16 }]">
      <ACol span="4" v-for="(item, index) in list" :key="index">
        <div class="slider-pagination__item" :class="{ 'active': activeIndex === index }"
          @click="swiper?.slideTo(index)">
          <img :src="item.link" :alt="title" />
        </div>
      </ACol>
    </ARow>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.slider {
  margin-bottom: var(--space-20);
  &-pagination {
    margin-bottom: var(--space-32);
    &__item {
      border: 1px solid rgba(228, 33, 31, 0.25);
      cursor: pointer;
      aspect-ratio: 1.38;
      position: relative;
      transition: all 0.2s ease-in-out;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.4);
        transition: all 0.2s ease-in-out;
      }

      img {
        @include image;
      }

      &.active {
        border-color: rgba(228, 33, 31, 1);

        &::after {
          background-color: rgba(255, 255, 255, 0)
        }
      }
    }
  }

  &-image {
    height: 600px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    cursor: pointer;

    @include devices(xl) {
      height: 500px;
    }

    @include devices(md) {
      height: 440px;
    }

    @include devices(sm) {
      height: 360px;
    }

    @include devices(xs) {
      height: 280px;
    }

    img {
      @include image(contain);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
  }
}
</style>