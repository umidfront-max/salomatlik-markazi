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

// ── Computed helpers ────────────────────────────────────────────
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
  const c = checkup.value
  if (!c) return ''
  if (c.durationText)    return c.durationText
  if (c.durationMinutes) return `${c.durationMinutes} min`
  if (c.durationHours)   return `${c.durationHours} soat`
  if (c.durationDays)    return `${c.durationDays} kun`
  return ''
})

// Gender localization
const genderLabel = computed(() => {
  const map = {
    CHILD:  { uz: 'Bolalar', ru: 'Дети',     en: 'Children' },
    MALE:   { uz: 'Erkaklar', ru: 'Мужчины', en: 'Male'     },
    FEMALE: { uz: 'Ayollar',  ru: 'Женщины', en: 'Female'   },
    ALL:    { uz: 'Hammaga',  ru: 'Для всех', en: 'For all'  },
  }
  const g = checkup.value?.gender
  return g && map[g] ? map[g][locale.value] ?? g : g ?? ''
})

// Age text
const ageLabel = computed(() => {
  const c = checkup.value
  if (!c) return ''
  if (c.ageText) return c.ageText
  if (c.minAge && c.maxAge) return `${c.minAge}–${c.maxAge} yosh`
  if (c.minAge) return `${c.minAge}+ yosh`
  return ''
})

// Discount validity
const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const discountPeriod = computed(() => {
  const c = checkup.value
  if (!c?.discountFrom) return ''
  if (c.discountTo) return `${formatDate(c.discountFrom)} – ${formatDate(c.discountTo)}`
  return `${formatDate(c.discountFrom)}`
})

// Hero image (main from entityImages, fallback to image)
const heroImage = computed(() => {
  const imgs = checkup.value?.entityImages ?? []
  const main = imgs.find(i => i.isMain) || imgs[0]
  return main?.url || checkup.value?.image || ''
})

// Items split for hero panel (max 10, 2 cols)
const itemsLeft  = computed(() => (checkup.value?.items ?? []).slice(0, 5))
const itemsRight = computed(() => (checkup.value?.items ?? []).slice(5, 10))

// Items grouped by category
const categoryLabels = {
  CONSULTATION: { uz: 'Konsultatsiyalar', ru: 'Консультации',  en: 'Consultations' },
  ANALYSIS:     { uz: 'Tahlillar',        ru: 'Анализы',       en: 'Lab Tests'     },
  DIAGNOSIS:    { uz: 'Diagnostika',      ru: 'Диагностика',   en: 'Diagnostics'   },
  PROCEDURE:    { uz: 'Protseduralar',    ru: 'Процедуры',     en: 'Procedures'    },
}

const groupedItems = computed(() => {
  const items = checkup.value?.items ?? []
  const groups = {}
  for (const item of items) {
    const cat = item.category || 'OTHER'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }
  return Object.entries(groups).map(([cat, list]) => ({
    category: cat,
    label: categoryLabels[cat]?.[locale.value] || cat,
    items: list,
  }))
})

// Modal
const applyRef = ref()
const openModal = () => applyRef.value?.toOpen()
</script>

<template>
  <div class="ck-page" v-if="checkup">
    <div class="container ck-page__inner">

      <!-- ══════════════════ MAIN TWO-PANEL ══════════════════ -->
      <div class="ck-layout">

        <!-- ── LEFT: Hero image ─────────────────────────── -->
        <div class="ck-panel">
          <img :src="heroImage" :alt="checkup.name?.[locale]" class="ck-panel__bg" />
          <div class="ck-panel__overlay" aria-hidden="true"></div>

          <!-- Bottom info -->
          <div class="ck-panel__bottom">
            <div class="ck-panel__top-row">
              <span class="ck-panel__badge">
                {{ checkup.department?.title?.[locale] || 'Premium Package' }}
              </span>
              <span v-if="genderLabel" class="ck-panel__gender">{{ genderLabel }}</span>
            </div>
            <h1 class="ck-panel__title">{{ checkup.name?.[locale] }}</h1>
            <p v-if="ageLabel" class="ck-panel__subtitle">{{ ageLabel }}</p>
            <Btn
              class="ck-panel__btn"
              variant="primary"
              :data-text="$t('apply.title')"
              @click="openModal"
            >
              {{ $t('apply.title') }}
            </Btn>
          </div>
        </div>

        <!-- ── RIGHT: Info card ─────────────────────────── -->
        <div class="ck-card">
          <div class="ck-card__header">
            <h2 class="ck-card__title">{{ checkup.name?.[locale] }}</h2>
          </div>

          <!-- Features from API + computed -->
          <div class="ck-card__features">
            <!-- Items count -->
            <div v-if="checkup.items?.length" class="ck-feat">
              <div class="ck-feat__icon"><Icon name="check-circle" /></div>
              <div class="ck-feat__body">
                <b>{{ checkup.items.length }} {{ $t('checTitle') }}</b>
                <span>{{ $t('service.prescriptionSupport') }}</span>
              </div>
            </div>

            <!-- Duration -->
            <div v-if="durationText" class="ck-feat">
              <div class="ck-feat__icon"><Icon name="clock" /></div>
              <div class="ck-feat__body">
                <b>{{ durationText }}</b>
                <span>{{ $t('service.followUp') }}</span>
              </div>
            </div>

            <!-- Gender -->
            <div v-if="genderLabel" class="ck-feat">
              <div class="ck-feat__icon"><Icon name="consultant" /></div>
              <div class="ck-feat__body">
                <b>{{ genderLabel }}</b>
                <span v-if="ageLabel">{{ ageLabel }}</span>
              </div>
            </div>

            <!-- API features array -->
            <template v-if="checkup.features?.length">
              <div
                v-for="(feat, i) in checkup.features"
                :key="i"
                class="ck-feat ck-feat--light"
              >
                <div class="ck-feat__icon"><Icon name="star" /></div>
                <div class="ck-feat__body">
                  <b>{{ feat }}</b>
                </div>
              </div>
            </template>
          </div>

          <!-- Price block -->
          <div class="ck-card__price-block">
            <div class="ck-card__price-label">{{ $t('service.PRICE') }}</div>
            <div class="ck-card__price-row">
              <div class="ck-card__price-nums">
                <span class="ck-card__current">
                  {{ checkup.price?.toLocaleString() }}
                  <small>{{ $t('service.sum') }}</small>
                </span>
                <span v-if="hasDiscount" class="ck-card__old">
                  {{ checkup.oldPrice.toLocaleString() }} {{ $t('service.sum') }}
                </span>
              </div>
              <span v-if="hasDiscount" class="ck-card__discount-badge">
                −{{ discountPercent }}%
              </span>
            </div>

            <!-- Discount period -->
            <p v-if="discountPeriod" class="ck-card__discount-period">
              <Icon name="calendar" />
              {{ discountPeriod }}
            </p>

            <Btn
              class="ck-card__btn"
              variant="primary"
              :data-text="$t('apply.title')"
              @click="openModal"
            >
              {{ $t('apply.title') }}
            </Btn>
          </div>
        </div>
      </div>

      <!-- ══════════════════ TARKIBGA KIRADI ══════════════════ -->
      <div v-if="groupedItems.length" class="ck-included">
        <h2 class="ck-included__title">{{ $t('checTitle') }}</h2>

        <!-- Grouped by category -->
        <div
          v-for="group in groupedItems"
          :key="group.category"
          class="ck-group"
        >
          <h3 class="ck-group__label">{{ group.label }}</h3>
          <div class="ck-group__grid">
            <div
              v-for="item in group.items"
              :key="item.id"
              class="ck-item"
            >
              <div class="ck-item__img-wrap">
                <img
                  v-if="item.service?.image"
                  :src="item.service.image"
                  :alt="item.name?.[locale]"
                  class="ck-item__img"
                />
                <div v-else class="ck-item__img-placeholder">
                  <Icon name="apply" />
                </div>
              </div>

              <div class="ck-item__body">
                <h4 class="ck-item__name">{{ item.name?.[locale] }}</h4>
                <span v-if="item.service?.durationMinutes" class="ck-item__meta">
                  <Icon name="clock" />
                  {{ item.service.durationMinutes }} {{ $t('service.minut') }}
                </span>
              </div>

              <!-- Price: discounted if available -->
              <div class="ck-item__price-wrap">
                <template v-if="item.service?.hasDiscount">
                  <span class="ck-item__price ck-item__price--new">
                    {{ item.service.discountedPrice?.toLocaleString() }} {{ $t('service.sum') }}
                  </span>
                  <span class="ck-item__price ck-item__price--old">
                    {{ item.price?.toLocaleString() }} {{ $t('service.sum') }}
                  </span>
                </template>
                <span v-else class="ck-item__price">
                  {{ item.price?.toLocaleString() }} {{ $t('service.sum') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal -->
    <SectionHeaderApply ref="applyRef" />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

$primary:    #33c1ed;
$primary-dk: rgba(15, 82, 159, 1);
$primary-lt: rgba(51, 193, 237, 0.12);
$red:        #ef4444;
$green:      #16a34a;
$border:     rgba(2, 10, 20, 0.08);
$dark:       #03182b;
$muted:      #64748b;
$shadow-md:  0 12px 48px rgba(0, 0, 0, 0.14);
$shadow-sm:  0 4px 18px rgba(0, 0, 0, 0.07);

// ── Page ─────────────────────────────────────────────────────
.ck-page {
  padding: 48px 0 100px;
  background: #f0f6ff;
  @include devices(sm) { padding: 20px 0 60px; }
  &__inner { --width-container: 1400px; }
}

// ── Two-panel layout ──────────────────────────────────────────
.ck-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: $shadow-md;
  min-height: 600px;

  @include devices(lg) { min-height: 520px; }
  @include devices(md) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}

// ── LEFT PANEL (image) ────────────────────────────────────────
.ck-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; // ← text goes to bottom
  min-height: 600px;
  overflow: hidden;
  order: 1; // mobile: image first

  @include devices(lg) { min-height: 540px; }
  @include devices(md) { min-height: 420px; }
  @include devices(xs) { min-height: 340px; }

  // Subtle hover zoom
  &:hover &__bg { transform: scale(1.04); }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
    transition: transform 1.2s ease;
  }

  // Stronger gradient at bottom for readable text
  &__overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to top,
        rgba($dark, 0.95) 0%,
        rgba($dark, 0.7)  30%,
        rgba($dark, 0.25) 60%,
        rgba($dark, 0)    100%);
    z-index: 1;
  }

  // ── Bottom info block (now actually at bottom)
  &__bottom {
    position: relative;
    z-index: 2;
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    gap: 14px;

    @include devices(md) { padding: 28px 24px; }
    @include devices(xs) { padding: 22px 20px; gap: 10px; }
  }

  &__top-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    background: linear-gradient(135deg, $primary 0%, #4dd6ff 100%);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 999px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    box-shadow: 0 6px 18px rgba($primary, 0.45);
  }

  &__gender {
    display: inline-flex;
    align-items: center;
    background: rgba(255,255,255,0.14);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 999px;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.25);
  }

  &__title {
    font-size: clamp(1.5rem, 3vw, 2.4rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.12;
    margin: 0;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 20px rgba(0,0,0,0.4);
  }

  &__subtitle {
    font-size: 15px;
    color: rgba(255,255,255,0.78);
    margin: 0;
    line-height: 1.5;
  }

  &__btn {
    margin-top: 8px;
    align-self: flex-start;

    @include devices(xs) {
      align-self: stretch;
      width: 100%;
    }
  }
}

// ── RIGHT CARD ────────────────────────────────────────────────
.ck-card {
  position: relative;
  background: linear-gradient(145deg, $primary-dk 0%, #1e6ed8 60%, #2986e8 100%);
  display: flex;
  flex-direction: column;
  padding: 36px 32px;
  order: 2; // mobile: info card second (below image)
  overflow: hidden;

  // Decorative orb (top-right)
  &::before {
    content: '';
    position: absolute;
    top: -120px;
    right: -120px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($primary, 0.35) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  // Decorative orb (bottom-left)
  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -80px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  > * { position: relative; z-index: 1; }

  @include devices(lg)  { padding: 28px 24px; }
  @include devices(md)  { padding: 28px 24px; }
  @include devices(xs)  { padding: 22px 18px; }

  &__header { margin-bottom: 22px; }

  &__title {
    font-size: clamp(1.15rem, 2.2vw, 1.5rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.3;
    margin: 0 0 10px;
    letter-spacing: -0.01em;
  }

  &__desc {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    line-height: 1.65;
    margin: 0;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    margin-bottom: 22px;
  }

  // White price block
  &__price-block {
    background: #fff;
    border-radius: 18px;
    padding: 18px 20px;
    margin-top: auto;
    @include devices(xs) { padding: 14px 16px; }
  }

  &__price-label {
    font-size: 11px;
    font-weight: 600;
    color: $muted;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  &__price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  &__price-nums {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__current {
    font-size: clamp(1.3rem, 2.5vw, 1.8rem);
    font-weight: 800;
    color: $dark;
    small { font-size: 13px; font-weight: 600; color: $muted; }
  }

  &__old {
    font-size: 13px;
    color: #94a3b8;
    text-decoration: line-through;
  }

  &__discount-badge {
    flex-shrink: 0;
    background: $red;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 8px;
    box-shadow: 0 3px 8px rgba($red, 0.35);
  }

  &__discount-period {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: $primary-dk;
    background: rgba($primary, 0.08);
    border: 1px solid rgba($primary, 0.18);
    padding: 5px 10px;
    border-radius: 8px;
    margin: 0 0 14px;

    :deep(.icon), :deep(svg) {
      width: 13px;
      height: 13px;
      color: $primary-dk;
      fill: $primary-dk;
      stroke: $primary-dk;
    }
  }

  &__btn {
    width: 100%;
    margin-top: 4px;
  }
}

// ── Feature row ───────────────────────────────────────────────
.ck-feat {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255,255,255,0.09);
  border-radius: 14px;
  padding: 12px 16px;
  border: 1px solid rgba(255,255,255,0.14);
  backdrop-filter: blur(8px);
  transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.14);
    border-color: rgba(255,255,255,0.25);
    transform: translateX(2px);
  }

  &--light {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
  }

  &__icon {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.14) 100%);
    border: 1px solid rgba(255,255,255,0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.25);

    // Force white icons regardless of SVG attrs
    :deep(.icon),
    :deep(svg) {
      width: 18px;
      height: 18px;
      color: #fff;
      fill: #fff;
      stroke: #fff;
    }
    :deep(svg *) {
      fill: #fff !important;
      stroke: #fff !important;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    b    { font-size: 13.5px; font-weight: 700; color: #fff; line-height: 1.3; letter-spacing: 0.01em; }
    span { font-size: 12px; color: rgba(255,255,255,0.65); }
  }
}

// ══════════════════════════════════════════════════════════════
//  TARKIBGA KIRADI
// ══════════════════════════════════════════════════════════════
.ck-included {
  margin-top: 48px;
  @include devices(sm) { margin-top: 32px; }

  &__title {
    font-size: clamp(1.2rem, 2.5vw, 1.6rem);
    font-weight: 700;
    color: $dark;
    margin-bottom: 24px;
    padding-bottom: 12px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: $border;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 2px;
      background: $primary;
      border-radius: 2px;
      z-index: 1;
    }
  }
}

// ── Category group ────────────────────────────────────────────
.ck-group {
  &:not(:last-child) { margin-bottom: 32px; }

  &__label {
    font-size: 14px;
    font-weight: 700;
    color: $primary-dk;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $primary;
      flex-shrink: 0;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    @include devices(md) { grid-template-columns: 1fr; }
  }
}

// ── Included item card ────────────────────────────────────────
.ck-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid $border;
  border-radius: 16px;
  box-shadow: $shadow-sm;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.09);
    transform: translateY(-1px);
  }

  @include devices(xs) {
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px 14px;
  }

  &__img-wrap {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;
    background: $primary-lt;
    display: flex;
    align-items: center;
    justify-content: center;
    @include devices(xs) { width: 46px; height: 46px; }
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
    color: $primary;
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
    font-size: 14px;
    font-weight: 700;
    color: $dark;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @include devices(xs) { white-space: normal; }
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #94a3b8;
    :deep(.icon), :deep(svg) { width: 12px; height: 12px; }
  }

  &__price-wrap {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    @include devices(xs) { width: 100%; align-items: flex-start; }
  }

  &__price {
    font-size: 14px;
    font-weight: 800;
    color: $primary-dk;
    white-space: nowrap;

    &--new {
      color: $green;
    }
    &--old {
      font-size: 12px;
      font-weight: 400;
      color: #94a3b8;
      text-decoration: line-through;
    }
  }
}
</style>
