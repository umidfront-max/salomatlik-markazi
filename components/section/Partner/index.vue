<script setup>
const { $api } = useNuxtApp();
const { data } = await useAsyncData("partners", () =>
  $api("posts", {
    params: {
      category: "partners",
      per_page: 12,
    },
  })
);
const swiperOptions = {
  slidesPerView: 6,
  spaceBetween: 24,
  breakpoints: {
    1440: {
      spaceBetween: 24,
      slidesPerView: 6,
    },
    1200: {
      spaceBetween: 20,
      slidesPerView: 6,
    },
    992: {
      spaceBetween: 16,
      slidesPerView: 5,
    },
    768: {
      spaceBetween: 16,
      slidesPerView: 4,
    },
    576: {
      spaceBetween: 16,
      slidesPerView: 3,
    },
    0: {
      spaceBetween: 16,
      slidesPerView: 2,
    },
  },
};
const gutter = { xxl: 24, xl: 20, xs: 16 };
</script>
<template>
  <section class="section">
    <div class="container">
      <div class="section-header" data-aos="zoom-in-up" data-aos-duration="300" data-aos-offset="300">
        <h2 class="section-title">
          {{ $t("partner.title") }}
        </h2>
      </div>
      <ClientOnly>
        <Swiper v-bind="swiperOptions">
          <SwiperSlide v-for="(item, index) in data?.result ?? []" class="section-item" :key="index">
            <SectionPartnerDefault :item="item" data-aos="fade-up" data-aos-duration="300" data-aos-offset="300"
              :data-aos-delay="index * 150" />
          </SwiperSlide>
        </Swiper>
        <template #fallback>
          <ARow :gutter="[gutter, gutter]" :max-cols="10">
            <ACol :xl="4" :lg="6" :md="8" :sm="12" :xs="12" v-for="(item, index) in data?.result ?? []" :key="index">
              <SectionPartnerDefault :item="item" />
            </ACol>
          </ARow>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  --width-space: 72px;
  padding-bottom: var(--space-40);
  max-width: 100%;
  overflow: hidden;
  background-color: transparent;

  :deep(.swiper) {
    overflow: unset;
  }

  &-item {
    background: #fff;
    box-shadow: 0 2px 30px #26364b1a;
    border-radius: 12px;


  }
}
</style>
