<script setup>
const swiperOptions = {
  modules: [SwiperNavigation],
  slidesPerView: "auto",
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: `.gallery-nav .nav-next`,
    prevEl: `.gallery-nav .nav-prev`,
  },
  breakpoints: {
    1440: {
      spaceBetween: 24,
    },
    1200: {
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 3,
    },
    575: {
      spaceBetween: 16,
    },
    0: {
      spaceBetween: 16,
    },
  },
};

const { $api } = useNuxtApp();

const { data: gallery } = await useAsyncData("gallery_gallery", () =>
  $api("gallery", {
    params: {
      category: "gallery",
      limit: 20,
    },
  })
);
</script>
<template>
  <section class="section container pt-80">
    <div class="section-header">
      <h2 class="section-title">{{ $t("gallery") }}</h2>
      <Nav class="gallery-nav section-nav" />
    </div>
    <ClientOnly>
      <Swiper v-bind="swiperOptions">
        <SwiperSlide class="section-slide" v-for="item in gallery?.data ?? []">
          <a class="section-image" :href="item.image" data-fancybox>
            <img :src="item.image" :alt="item.title" />
          </a>
        </SwiperSlide>
      </Swiper>
      <template #fallback>
        <ARow :gutter="[16, 16]">
          <ACol :xl="8" :md="12" :xs="24" v-for="item in gallery?.data ?? []">
            <div class="section-image">
              <img :src="item.image" :alt="item.title" />
            </div>
          </ACol>
        </ARow>
      </template>
    </ClientOnly>
  </section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  &-slide {
    width: 362px;

    @include devices(xl) {
      width: 320px;
    }

    @include devices(lg) {
      width: 280px;
    }

    @include devices(md) {
      width: 240px;
    }

    @include devices(sm) {
      width: 200px;
    }

    @include devices(xs) {
      width: 160px;
    }
  }

  &-image {
    border-radius: 20px;
    aspect-ratio: 1.35;
    border: 1px solid #d3e0ea;
    overflow: hidden;

    img {
      @include image;
    }
  }
}
</style>
