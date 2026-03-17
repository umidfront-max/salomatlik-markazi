<script setup>
const router = useRouter();
const localePath = useLocalePath();
defineProps({
  isPage: {
    type: Boolean,
    default: false,
  },
});
const alphabet = {
  uz: [
    "A",
    "B",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "X",
    "Y",
    "Z",
    "Ch",
    "Sh",
    "Ng",
    "O‘",
    "G‘",
  ],
  oz: [
    "А",
    "Б",
    "В",
    "Г",
    "Ғ",
    "Д",
    "Е",
    "Ё",
    "Ж",
    "З",
    "И",
    "Й",
    "К",
    "Қ",
    "Л",
    "М",
    "Н",
    "О",
    "П",
    "Р",
    "С",
    "Т",
    "У",
    "Ў",
    "Ф",
    "Х",
    "Ц",
    "Ч",
    "Ш",
    "Ъ",
    "Э",
    "Ю",
    "Я",
    "Ҳ",
    "Қ",
    "Ў",
  ],
  ru: [
    "А",
    "Б",
    "В",
    "Г",
    "Д",
    "Е",
    "Ё",
    "Ж",
    "З",
    "И",
    "Й",
    "К",
    "Л",
    "М",
    "Н",
    "О",
    "П",
    "Р",
    "С",
    "Т",
    "У",
    "Ф",
    "Х",
    "Ц",
    "Ч",
    "Ш",
    "Щ",
    "Ъ",
    "Ы",
    "Ь",
    "Э",
    "Ю",
    "Я",
  ],
  en: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
};
</script>
<template>
  <section class="section container" :class="{ 'alphabet-page': isPage }">
    <h2 class="section-title section-title__center" v-if="!isPage" data-aos="zoom-in-up" data-aos-duration="300"
      data-aos-offset="300">
      {{ $t("searchByLetter") }}
    </h2>
    <div class="section-wrapper">
      <div class="section-search search" v-if="!isPage" data-aos="zoom-in-up" data-aos-duration="300"
        data-aos-offset="300">
        <AInput class="search-input" :placeholder="$t('search')" />
        <Icon class="search-icon" name="search" />
      </div>
      <div class="section-row">
        <div class="section-row__col" v-for="(letter, index) in alphabet[$i18n.locale]" :key="index">
          <button class="section-letter" :class="{ active: $route.query.letter === letter }" @click="
            router.push({
              path: localePath('/search'),
              query: {
                letter,
              },
            })
            ">
            {{ letter }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  &-search {
    margin: 0 auto var(--space-16) auto;
  }

  &-wrapper {
    padding: var(--space-20);
    border: 1px solid #e5edf4;
    border-radius: 12px;

    .wrapper-page & {
      padding: 0;
      border: none;
    }
  }

  &-row {
    display: flex;
    flex-wrap: wrap;
    row-gap: var(--space-20);
    margin: 0 calc(0px - (var(--space-20) / 2));

    @include devices(xl) {
      --space-20: 12px;
    }

    &__col {
      & {
        width: calc(100% / 17 * 1);
        padding: 0 calc(var(--space-20) / 2);
      }

      @include devices(lg) {
        width: calc(100% / 14 * 1);
      }

      @include devices(md) {
        width: calc(100% / 10 * 1);
      }

      @include devices(sm) {
        width: calc(100% / 8 * 1);
      }

      @include devices(xs) {
        width: calc(100% / 6 * 1);
      }
    }
  }

  &-letter {
    @include btn-default;
    aspect-ratio: 1.375;
    border: 1px solid #e5edf4;
    background: #f4f8fa;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    transition: all 0.3s ease-in-out;
    @include text(20, var(--black-1), 500, 140%);
    border-radius: 12px;

    &.active,
    &:hover {
      background-color: var(--primary-1);
      color: var(--white-1);
    }
  }
}
</style>
