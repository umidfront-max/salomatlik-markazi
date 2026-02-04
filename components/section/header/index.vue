<script setup>
const { list: social } = useSocial();
const { list: menu } = useMenu();
const { data: setting } = useSetting()
const localePath = useLocalePath();
const router = useRouter();
const applyRef = ref();
const navbarRef = ref();
const searchQuery = ref('');

const emits = defineEmits(["on-click-apply", "on-click-navbar"]);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(localePath(`/search?word=${encodeURIComponent(searchQuery.value.trim())}`));
  }
};
</script>
<template>
  <section class="section">
    <div class="section-top">
      <div class="container section-top__wrapper">
        <div class="section-top__col">
          <button class="section-navbar" @click="navbarRef?.toOpen()">
            <Icon name="burger" />
          </button>
        </div>
        <div class="section-top__col">
          <div class="section-social">
            <a class="section-social__icon" target="_blank" :href="item.site_url" v-for="item in social">
              <Icon :name="item.icon" />
            </a>
          </div>
        </div>
        <div class="section-top__col section-top__right">
          <div class="section-search">
            <input class="section-search__input" type="text" :placeholder="$t('search')" v-model="searchQuery"
              @keyup.enter="handleSearch" />
            <Icon class="section-search__icon" name="search" @click="handleSearch" />
          </div>
          <Btn class="section-btn-mobile" variant="primary" :data-text="$t('booking')" @click="applyRef?.toOpen()">
            {{ $t("booking") }}
          </Btn>
          <SectionHeaderLang>
            <template #="{ locale, locales }">
              <button class="section-lang">
                <img class="section-lang__flag" :src="`/flag/${locale}.png`" :alt="locale" />
                <span class="section-lang__text">
                  {{locales.find(l => l.code === locale)?.name || locale}}
                </span>
                <Icon class="section-lang__icon" name="angle-bottom" />
              </button>
            </template>
          </SectionHeaderLang>
        </div>
      </div>
    </div>
    <div class="section-bottom">
      <div class="container section-bottom__container">
        <NuxtLink :to="localePath('/')" class="section-logo">
          <img src="/logo.png" alt="test" />
        </NuxtLink>
        <ul class="section-menu">
          <li class="section-menu__item" v-for="item in menu.filter((el) => el.show_header)">
            <NuxtLink class="section-menu__link" :to="localePath(item.page ? item.page : `/static/${item.slug}`)">
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
        <Btn class="section-btn" variant="primary" :data-text="$t('booking')" @click="applyRef?.toOpen()">
          {{ $t("booking") }}
        </Btn>
        <a class="section-info">
          <div class="section-info__icon">
            <Icon name="phone-fill" />
          </div>
          <div class="section-info__right">
            <span class="section-info__label">{{ $t("emergencyCalls") }}</span>
            <span class="section-info__value">{{ setting.phone }}</span>
          </div>
        </a>
      </div>
    </div>
  </section>
  <SectionHeaderApply ref="applyRef" />
  <SectionHeaderNavbar ref="navbarRef" />
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  position: sticky;
  left: 0;
  right: 0;
  top: 0px;
  z-index: 2;

  &-logo {
    flex: 0 0 auto;
    width: 100%;
    max-width: 200px;

    @include devices(xl) {
      margin-right: auto;
    }

    @include devices(xs) {
      max-width: 280px;
    }



    img {
      width: 100%;
      height: auto;
    }
  }

  &-top {
    background-color: white;
    position: relative;
    z-index: 999;

    &__wrapper {
      display: flex;
    }

    &__right {
      display: flex;
    }
  }

  &-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    line-height: 1.6;

    .icon {
      --icon-size: 20px;
      --icon-color: var(--red-1);
    }
  }

  &-top {
    &__wrapper {
      height: var(--height-header-part);
      display: flex;
      align-items: center;
    }

    &__col {

      &:nth-child(1),
      &:nth-child(3) {
        flex: 1;
      }

      &:nth-child(2) {}
    }
  }

  &-social {
    display: flex;
    align-items: center;
    gap: 12px;

    @include devices(sm) {
      display: none;
    }

    @include devices(lg) {
      margin-right: 24px;
    }

    &__icon {
      position: relative;
      background-color: var(--red-3);
      --icon-color: var(--red-1);
      width: 44px;
      height: 44px;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--border-color-one);
      border-radius: 100px;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: var(--red-1);
        --icon-color: var(--white-1);
      }
    }
  }

  &-search {
    min-height: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    border: 1px solid #d3d3d3;
    max-width: 250px;
    width: 100%;
    margin-left: auto;
    padding: 0 16px;
    gap: 8px;
    border-radius: 12px;

    @include devices(xs) {
      display: none;
    }

    &__input {
      border: none;
      outline: none;
      background-color: transparent;
      flex: 1;
    }

    &__icon {
      --icon-color: var(--red-1);
      cursor: pointer;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  &-bottom {
    padding: 8px;
    position: relative;
    z-index: 991;
    border-bottom: 1px solid #ededed;
    border-top: 1px solid #ededed;

    .wrapper-home &,
    .wrapper-detail & {
      border-bottom: transparent;
      border-top: transparent;
    }

    &__container {
      background-color: white;
      border-radius: 8px;
      height: var(--height-header-part);
      display: flex;
      align-items: center;
    }
  }

  &-menu {
    display: flex;
    align-items: center;
    gap: var(--space-40);
    margin: 0 auto;

    @include devices(xl) {
      display: none;
    }

    &__item {}

    &__link {
      display: block;
      font-size: 16px;
      font-weight: 500;
      color: var(--black-1);
      text-align: left;
      position: relative;
      text-transform: capitalize;
      padding: 25px 0px;
      transition: all 0.2s ease-in-out;

      &:hover {
        color: var(--red-1);
      }
    }
  }

  &-info {
    display: flex;
    align-items: center;
    gap: 8px;

    @include devices(sm) {
      display: none;
    }

    &__icon {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 46px;
      text-align: center;
      color: var(--white-color);
      background-color: var(--red-1);
      font-size: 16px;
      border-radius: 100%;
      display: -webkit-flex;
      display: -moz-flex;
      display: flex;
      -webkit-justify-content: center;
      -moz-justify-content: center;
      justify-content: center;
      -webkit-align-items: center;
      align-items: center;
      --icon-color: var(--white-1);
      z-index: 1;

      &::before,
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 100%;
        border: 3px solid var(--red-1);
        z-index: -1;
        animation: ripple 2.5s ease-out infinite;
      }

      &::after {
        animation-delay: 1.25s;
      }
    }

    &__right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    &__label {
      display: block;
      font-size: 14px;
      color: rgba(var(--black), 0.8);
      display: block;
    }

    &__value {
      font-size: 20px;
      color: var(--black-1);
    }
  }

  &-btn {
    margin-right: 24px;

    @include devices(sm) {
      margin-right: 0;
    }

    @include devices(xs) {
      display: none;
    }

    &-mobile {
      display: none;

      @include devices(xs) {
        display: flex;
        margin-left: auto;
        white-space: nowrap;
      }
    }
  }

  &-lang {
    min-height: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #d3d3d3;
    background-color: white;
    padding: 0 16px;
    margin-left: 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--black-1);
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    @include devices(xs) {
      display: none;
    }

    &:hover {
      border-color: var(--red-1);
      color: var(--red-1);
      background-color: var(--red-3);
    }

    &__flag {
      min-width: 24px;
      width: 24px;
      height: auto;
      border-radius: 4px;
    }

    &__text {
      line-height: 1;
      white-space: nowrap;
    }

    &__icon {
      --icon-size: 16px;
      --icon-color: currentColor;
      transition: transform 0.2s ease-in-out;
    }
  }

  &-navbar {
    min-height: 44px;
    height: 44px;
    min-width: 44px;
    width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d3d3d3;
    background-color: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    .icon {
      --icon-size: 22px;
      --icon-color: rgba(var(--black), 0.7);
      transition: color 0.2s ease-in-out;
    }

    &:hover {
      border-color: var(--red-1);
      background-color: var(--red-3);

      .icon {
        --icon-color: var(--red-1);
      }
    }
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
