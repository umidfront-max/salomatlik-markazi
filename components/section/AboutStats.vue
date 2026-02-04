<script setup>
const { $api } = useNuxtApp();
const { data: statsData } = await useAsyncData("statistics_about", () =>
  $api("statistics", {
    params: {
      category: "about",
      per_page: 4,
    },
  })
);
const gutter = { xxl: 24, xl: 20, xs: 16 };
</script>
<template>
  <section class="section container">
    <ARow :gutter="[gutter, gutter]">
      <ACol :xl="6" :xs="12" v-for="item in statsData.result">
        <div class="section-stats">
          <span class="section-stats__value">
            {{ item.count }}{{ item.value }}
          </span>
          <h4 class="section-stats__label">
            {{ item.title }}
          </h4>
        </div>
      </ACol>
    </ARow>
  </section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  &-stats {
    background: linear-gradient(0deg, #f2f5f9, #f2f5f9),
      linear-gradient(98deg, #d5ecfe 1.32%, #bfecf2 97.46%);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--space-40);

    &__value {
      @include text(48, var(--black-1), 700, normal);
      text-align: center;
    }

    &__label {
      @include text(20, var(--black-1), 300, normal);
      text-align: center;
    }
  }
}
</style>
