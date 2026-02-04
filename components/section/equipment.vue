<script setup>
const localePath = useLocalePath();
const { $api } = useNuxtApp();
const { data } = await useAsyncData("equipment_home", () =>
  $api("equipment", {
    params: {
      per_page: 8,
    },
  })
);
const swiperOptions = {
  slidesPerView: 5,
  spaceBetween: 24,
  breakpoints: {
    1440: {
      spaceBetween: 24,
      slidesPerView: 5,
    },
    1200: {
      spaceBetween: 20,
      slidesPerView: 5,
    },
    992: {
      spaceBetween: 16,
      slidesPerView: 4,
    },
    768: {
      spaceBetween: 16,
      slidesPerView: 3,
    },
    576: {
      spaceBetween: 16,
      slidesPerView: 2,
    },
    0: {
      spaceBetween: 16,
      slidesPerView: "auto",
    },
  },
};
</script>
<template>
  <section class="section container section--xs-swiper-auto pt-100">
    <div class="section-header">
      <h2 class="section-title">{{ $t("equipment") }}</h2>
      <NuxtLink class="section-link" :to="localePath('/equipment')">
        {{ $t("viewAll") }}
        <Icon class="section-link__icon" name="angle-right" />
      </NuxtLink>
    </div>
    <ClientOnly>
      <Swiper v-bind="swiperOptions">
        <SwiperSlide v-for="(item, index) in data.result">
          <Card
            @click="$router.push(localePath(`/equipment/${item.slug}`))"
            :data="item"
            type="equipment"
            data-aos="flip-right"
            data-aos-duration="300"
            data-aos-offset="300"
            :data-aos-delay="(index + 1) * 150"
          />
        </SwiperSlide>
      </Swiper>
      <template #fallback>
        <ARow :gutter="[16, 16]">
          <ACol :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="(item, index) in data.result" :key="index">
            <Card
              @click="$router.push(localePath(`/equipment/${item.slug}`))"
              :data="item"
              type="equipment"
            />
          </ACol>
        </ARow>
      </template>
    </ClientOnly>
  </section>
</template>
