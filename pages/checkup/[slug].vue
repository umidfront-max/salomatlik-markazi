<script setup>
const { locale } = useI18n()
const route = useRoute()
const { $api } = useNuxtApp()

const { data: checkup } = await useAsyncData(
  `checkup_${route.params.slug}`,
  () => $api(`checkup/${route.params.slug}`)
)

useHead({
  title: computed(() => checkup.value?.metaTitle?.[locale.value] || checkup.value?.name?.[locale.value]),
  meta: [
    { name: 'description', content: computed(() => checkup.value?.metaDescription?.[locale.value]) },
    { property: 'og:title', content: computed(() => checkup.value?.metaTitle?.[locale.value] || checkup.value?.name?.[locale.value]) },
    { property: 'og:description', content: computed(() => checkup.value?.metaDescription?.[locale.value]) },
    { property: 'og:image', content: computed(() => checkup.value?.image) },
  ]
})

const hasDiscount = computed(() =>
  checkup.value?.oldPrice && checkup.value.oldPrice > checkup.value.price
)

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round(
    ((checkup.value.oldPrice - checkup.value.price) / checkup.value.oldPrice) * 100
  )
})

const durationText = computed(() => {
  if (checkup.value?.durationText) return checkup.value.durationText
  if (checkup.value?.durationMinutes) return `${checkup.value.durationMinutes} min`
  if (checkup.value?.durationHours) return `${checkup.value.durationHours} soat`
  if (checkup.value?.durationDays) return `${checkup.value.durationDays} kun`
  return ''
})
</script>

<template>
  <div class="ck-page" v-if="checkup">
    <div class="ck-page__container container">

      <!-- ── HERO GRID ── -->
      <div class="ck-hero">

        <!-- IMAGE -->
        <div class="ck-hero__media">
          <div class="ck-hero__img-wrap">
            <img
              :src="checkup.image"
              :alt="checkup.name?.[locale]"
              class="ck-hero__img"
            />
            <div class="ck-hero__img-overlay" aria-hidden="true"></div>
            <div v-if="hasDiscount" class="ck-hero__badge">
              −{{ discountPercent }}%
            </div>
          </div>
        </div>

        <!-- INFO -->
        <div class="ck-hero__info">

          <!-- Department tag -->
          <span
            v-if="checkup.department?.title?.[locale]"
            class="ck-tag"
          >
            {{ checkup.department.title[locale] }}
          </span>

          <!-- Title -->
          <h1 class="ck-hero__title">{{ checkup.name?.[locale] }}</h1>

          <!-- Meta chips -->
          <div class="ck-chips">
            <span v-if="durationText" class="ck-chip">
              <Icon name="clock" class="ck-chip__icon" />
              {{ durationText }}
            </span>
            <span v-if="checkup.gender" class="ck-chip">
              <Icon name="consultant" class="ck-chip__icon" />
              {{ checkup.gender }}
            </span>
            <span v-if="checkup.items?.length" class="ck-chip ck-chip--accent">
              {{ checkup.items.length }} {{ $t('checTitle') }}
            </span>
          </div>

          <!-- Description -->
          <div
            v-if="checkup.description?.[locale]"
            class="ck-hero__desc prose"
            v-html="checkup.description[locale]"
          />

          <!-- Features -->
          <ul v-if="checkup.features?.length" class="ck-features">
            <li v-for="f in checkup.features" :key="f" class="ck-features__item">
              <Icon name="check-circle" class="ck-features__icon" />
              {{ f }}
            </li>
          </ul>

          <!-- Price card -->
          <div class="ck-price">
            <div class="ck-price__left">
              <span v-if="hasDiscount" class="ck-price__old">
                {{ checkup.oldPrice.toLocaleString() }} {{ $t('service.sum') }}
              </span>
              <span class="ck-price__current">
                {{ checkup.price?.toLocaleString() }} {{ $t('service.sum') }}
              </span>
            </div>
            <button class="ck-btn">{{ $t('apply.title') }}</button>
          </div>

        </div>
      </div>

      <!-- ── INCLUDED SERVICES ── -->
      <div v-if="checkup.items?.length" class="ck-included">
        <h2 class="ck-included__title">{{ $t('checTitle') }}</h2>
        <div class="ck-included__grid">
          <div
            v-for="item in checkup.items"
            :key="item.id"
            class="ck-card"
          >
            <div class="ck-card__img-wrap">
              <img
                v-if="item.service?.image"
                :src="item.service.image"
                :alt="item.name?.[locale]"
                class="ck-card__img"
              />
              <div v-else class="ck-card__img-placeholder">
                <Icon name="apply" />
              </div>
            </div>
            <div class="ck-card__body">
              <h3 class="ck-card__name">{{ item.name?.[locale] }}</h3>
              <span v-if="item.service?.durationMinutes" class="ck-card__meta">
                <Icon name="clock" />
                {{ item.service.durationMinutes }} {{ $t('service.minut') }}
              </span>
            </div>
            <span class="ck-card__price">
              {{ item.price?.toLocaleString() }} {{ $t('service.sum') }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

// ── Tokens ────────────────────────────────────────
$accent:    #2563eb;
$accent-lt: #e8f2ff;
$green:     #16a34a;
$green-lt:  #dcfce7;
$red:       #ef4444;
$border:    rgba(2, 10, 20, 0.08);
$shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.06);
$shadow-md: 0 10px 40px rgba(0, 0, 0, 0.1);

// ── Page wrapper ──────────────────────────────────
.ck-page {
  padding: 48px 0 100px;
  background: #f8fafc;

  @include devices(sm) {
    padding: 24px 0 60px;
  }
}

// ── Hero grid ─────────────────────────────────────
.ck-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;

  @include devices(lg) {
    gap: 32px;
  }

  @include devices(md) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  // ── Image side ──
  &__media {
    position: sticky;
    top: 24px;

    @include devices(md) {
      position: static;
    }
  }

  &__img-wrap {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: $shadow-md;
  }

  &__img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    object-position: center;
    display: block;

    @include devices(xs) {
      aspect-ratio: 16 / 9;
    }
  }

  &__img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.18) 0%,
      transparent 50%
    );
    pointer-events: none;
  }

  &__badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: $red;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba($red, 0.4);
    letter-spacing: 0.02em;
  }

  // ── Info side ──
  &__info {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 800;
    line-height: 1.2;
    color: #0b2239;
    margin: 0;
  }

  &__desc {
    color: #475569;
    line-height: 1.75;

    :deep(p) { margin-bottom: 10px; }
    :deep(ul), :deep(ol) { padding-left: 18px; margin-bottom: 10px; }
    :deep(li) { margin-bottom: 4px; }
    :deep(strong) { color: #0b2239; }
  }
}

// ── Tag ───────────────────────────────────────────
.ck-tag {
  display: inline-block;
  background: $accent-lt;
  color: $accent;
  font-size: 13px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 999px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

// ── Chips ─────────────────────────────────────────
.ck-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ck-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid $border;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  box-shadow: $shadow-sm;

  &__icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  &--accent {
    background: $accent-lt;
    border-color: rgba($accent, 0.2);
    color: $accent;
  }
}

// ── Features ──────────────────────────────────────
.ck-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 500;
    color: #1e293b;
  }

  &__icon {
    color: $green;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }
}

// ── Price card ────────────────────────────────────
.ck-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 18px;
  border: 1px solid $border;
  box-shadow: $shadow-sm;

  @include devices(xs) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 16px;
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__old {
    font-size: 15px;
    color: #94a3b8;
    text-decoration: line-through;
  }

  &__current {
    font-size: clamp(1.3rem, 2.5vw, 1.8rem);
    font-weight: 800;
    color: #0b2239;
  }
}

// ── CTA button ────────────────────────────────────
.ck-btn {
  flex-shrink: 0;
  background: $accent;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: darken($accent, 8%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($accent, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  @include devices(xs) {
    width: 100%;
    text-align: center;
  }
}

// ── Included section ──────────────────────────────
.ck-included {
  margin-top: 72px;

  @include devices(sm) {
    margin-top: 48px;
  }

  &__title {
    font-size: clamp(1.2rem, 2.5vw, 1.6rem);
    font-weight: 700;
    color: #0b2239;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid $accent-lt;
  }

  &__grid {
    display: grid;
    gap: 14px;
  }
}

// ── Included card ─────────────────────────────────
.ck-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid $border;
  border-radius: 16px;
  box-shadow: $shadow-sm;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.09);
    transform: translateY(-1px);
  }

  @include devices(xs) {
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px 16px;
  }

  &__img-wrap {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 12px;
    overflow: hidden;
    background: $accent-lt;
    display: flex;
    align-items: center;
    justify-content: center;

    @include devices(xs) {
      width: 52px;
      height: 52px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $accent;
    opacity: 0.6;
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__name {
    font-size: 15px;
    font-weight: 700;
    color: #0b2239;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include devices(xs) {
      white-space: normal;
    }
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: #94a3b8;

    :deep(.icon) {
      width: 13px;
      height: 13px;
    }
  }

  &__price {
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 800;
    color: $accent;
    white-space: nowrap;

    @include devices(xs) {
      width: 100%;
      text-align: right;
    }
  }
}
</style>
