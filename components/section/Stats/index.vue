<script setup>
const { $api } = useNuxtApp();
const { data: setting } = useSetting();
const { data } = await useAsyncData("statistics_home", () =>
  $api("statistics", {
    params: {
      category: "home",
      per_page: 4,
    },
  })
);
</script>
<template>
  <section class="section stats">
    <div class="container">
      <div class="stats-wrapper" data-aos="fade-up" data-aos-duration="500">
        <div class="stats-header">
          <h2 class="stats-title">
            {{ setting["stats-title"] || "-" }}
          </h2>
          <p class="stats-text">
            {{ setting["stats-text"] || "-" }}
          </p>
        </div>
        <div class="stats-grid">
          <div class="stats-item" v-for="(item, index) in data.result ?? []" :key="index">
            <div class="stats-item__value">{{ item.value }}{{ item.count }}</div>
            <div class="stats-item__label">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  padding: var(--space-80) 0;
}

.stats-wrapper {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 24px;
  padding: var(--space-60);
  color: #c62828;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  @include devices(lg) {
    flex-direction: column;
    align-items: flex-start;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c62828' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
    mask-image: linear-gradient(to left, black, transparent);
  }
}

.stats-header {
  position: relative;
  z-index: 1;
  max-width: 400px;
  flex-shrink: 0;

  @include devices(lg) {
    max-width: 100%;
  }
}

.stats-title {
  @include text(32, #c62828, 700, 130%);
  margin-bottom: 16px;
}

.stats-text {
  @include text(18, rgba(198, 40, 40, 0.7), 400, 150%);
}

.stats-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  flex-grow: 1;
  width: 100%;

  @include devices(sm) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.stats-item {
  &__value {
    @include text(48, #b71c1c, 700, 120%);
    margin-bottom: 8px;
  }

  &__label {
    @include text(18, rgba(198, 40, 40, 0.8), 500, 140%);
  }
}
</style>
