<script setup>
const swiperOptions = {
  modules: [SwiperNavigation],
  slidesPerView: 3,
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: `.certificate-nav .nav-next`,
    prevEl: `.certificate-nav .nav-prev`,
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

const { data: certificate } = await useAsyncData("gallery_certificate", () =>
  $api("gallery", {
    params: {
      category: "certificate",
      per_page: 20,
    },
  })
);
</script>
<template>
  <section class="section container pt-80">
    <div class="section-header">
      <h2 class="section-title">
        {{ $t("certificate") }}
      </h2>
      <Nav class="certificate-nav section-nav" />
    </div>
    <ClientOnly>
      <Swiper v-bind="swiperOptions">
        <SwiperSlide v-for="item in certificate.result ?? []">
          <a class="section-image" data-fancybox :href="item.image">
            <img :src="item.image" :alt="item.title || 'no-title'" />
          </a>
        </SwiperSlide>
      </Swiper>
      <template #fallback>
        <ARow :gutter="[16, 16]">
          <ACol
            :xl="8"
            :md="12"
            :xs="24"
            v-for="item in certificate.result ?? []"
          >
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
  &-image {
    display: block;
    img {
      @include image(contain);
    }
  }
}
</style>
