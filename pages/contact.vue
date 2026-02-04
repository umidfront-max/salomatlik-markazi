<script setup>
defineComponent({ name: "contact" });
import { toGetNumber } from "~/utilities/mixins";
const { data: setting } = useSetting();
const gutter = { xxl: 24, xl: 20, xs: 12, sm: 16 };
</script>
<template>
  <section class="section contact-section">
    <div class="section-map" v-html="setting.map"></div>
    <div class="container">
      <ARow :gutter="[gutter, gutter]">
        <ACol :xl="6" :xs="12">
          <div class="section-card">
            <Icon name="headphone" class="section-card-icon" />
            <span class="section-card-label">{{ $t("phone1") }}</span>
            <a :href="toGetNumber(setting.phone)" class="section-card-value">{{
              setting.phone
            }}</a>
          </div>
        </ACol>
        <ACol :xl="6" :xs="12">
          <div class="section-card">
            <Icon name="telephone" class="section-card-icon" />
            <span class="section-card-label">{{ $t("phone2") }}</span>
            <a :href="toGetNumber(setting.phone2)" class="section-card-value">{{
              setting.phone2
            }}</a>
          </div>
        </ACol>
        <ACol :xl="6" :xs="12">
          <div class="section-card">
            <Icon name="location" class="section-card-icon" />
            <span class="section-card-label">{{ $t("address") }}</span>
            <a href="" class="section-card-value">{{ setting.address }}</a>
          </div>
        </ACol>
        <ACol :xl="6" :xs="12">
          <div class="section-card">
            <Icon name="clock" class="section-card-icon" />
            <span class="section-card-label">{{ $t("workTime") }}</span>
            <a href="" class="section-card-value">{{ setting.work_time2 }} </a>
          </div>
        </ACol>
        <ACol span="24">
          <div class="section-card">
            <h3 class="section-card-title">{{ $t("formApplication") }}</h3>
            <FormApply />
          </div>
        </ACol>
      </ARow>
    </div>
  </section>
</template>
<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.contact-section {
  --width-container: 1440px;

  .section {
    &-map {
      margin-bottom: calc(0px - var(--space-48));
      margin-top: -80px;

      iframe {
        border: none;
        display: block;
        width: 100%;
        aspect-ratio: 4.27;

        @include devices(md) {
          aspect-ratio: 2.27;
        }

        @include devices(sm) {
          aspect-ratio: 1.5;
        }
      }
    }

    &-card {
      border: 1px solid #d3e0ea;
      background: #fff;
      box-shadow: 0px 4px 20px 0px rgba(3, 24, 43, 0.1);
      padding: var(--space-24);
      height: 100%;

      &-icon {
        margin-bottom: var(--space-20);
        --icon-color: var(--red-1);
      }

      &-title {
        @include text(32, var(--black-1), 700, 140%);
        margin-bottom: var(--space-40);
      }

      &-label {
        @include text(20, rgba(var(--black), 0.8), 400, normal);
        display: block;
        margin-bottom: 8px;
      }

      &-value {
        @include text(22, var(--black-1), 700, 140%);
      }

      .icon {}
    }
  }
}
</style>
