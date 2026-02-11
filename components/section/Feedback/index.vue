<script setup>
const { $api } = useNuxtApp();
const { data } = await useAsyncData("reviews", () =>
  $api("reviews", {
    params: {
      limit: 6,
      is_visible_home: true,
    },
  })
);
const swiperOptions = {
  slidesPerView: 3,
  spaceBetween: 24,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 3000,
  modules: [SwiperAutoplay],
  breakpoints: {
    1440: {
      spaceBetween: 24,
    },
    1200: {
      spaceBetween: 20,
    },
    992: {
      spaceBetween: 16,
      slidesPerView: 3,
    },
    575: {
      slidesPerView: 2,
      spaceBetween: 16,
    },
    0: {
      slidesPerView: "auto",
      spaceBetween: 16,
    },
  },
};
</script>
<template>
  <section class="section section--xs-swiper-auto pt-100">
    <div class="container">
      <div class="section-header" data-aos="zoom-in-up" data-aos-duration="300" data-aos-offset="300">
        <h2 class="section-title">
          {{ $t("feedback.title") }}
        </h2>
      </div>
      <ClientOnly>
        <Swiper v-bind="swiperOptions">
          <SwiperSlide v-for="(item, index) in data?.data ?? []" :key="index">
            <SectionFeedbackDefault :data="item" data-aos="fade-up" data-aos-duration="300" data-aos-offset="300"
              :data-aos-delay="index * 150" />
          </SwiperSlide>
        </Swiper>
        <template #fallback>
          <ARow :gutter="[16, 16]">
            <ACol :xl="8" :md="12" :xs="24" v-for="(item, index) in data?.data ?? []" :key="index">
              <SectionFeedbackDefault :data="item" />
            </ACol>
          </ARow>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: var(--space-100);
    bottom: 0;
    right: 0;
    background-color: var(--primary-3);

  }
}
</style>
