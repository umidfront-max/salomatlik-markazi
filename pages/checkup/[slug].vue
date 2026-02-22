<script setup>
const { locale } = useI18n()
const route = useRoute()
const { $api } = useNuxtApp()

const { data: checkup } = await useAsyncData(
  `checkup_${route.params.slug}`,
  () => $api(`checkup/${route.params.slug}`)
)

const hasDiscount = computed(() => {
  return checkup.value?.oldPrice && checkup.value.oldPrice > checkup.value.price
})

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
  <section class="checkup container" v-if="checkup">
    <div class="checkup__grid">

      <!-- IMAGE -->
      <div class="checkup__image">
        <img :src="checkup.image" :alt="checkup.name?.[locale]" />

        <div v-if="hasDiscount" class="discount-badge">
          -{{ discountPercent }}%
        </div>
      </div>

      <!-- INFO -->
      <div class="checkup__info">
        <span class="checkup__department">
          {{ checkup.department?.title?.[locale] }}
        </span>

        <h1 class="checkup__title">
          {{ checkup.name?.[locale] }}
        </h1>

        <div class="checkup__meta">
          <div class="meta-item">⏱ {{ durationText }}</div>
          <div class="meta-item">👥 {{ checkup.gender }}</div>
        </div>

        <div
          class="checkup__desc"
          v-html="checkup.description?.[locale]"
        />

        <!-- FEATURES -->
        <ul v-if="checkup.features?.length" class="features">
          <li v-for="f in checkup.features" :key="f">✔ {{ f }}</li>
        </ul>

        <!-- PRICE CARD -->
        <div class="price-card">
          <div>
            <div v-if="hasDiscount" class="old-price">
              {{ checkup.oldPrice.toLocaleString() }} {{ $t('service.sum') }}
            </div>
            <div class="current-price">
              {{ checkup.price.toLocaleString() }} {{ $t('service.sum') }}
            </div>
          </div>

          <button class="btn-primary">{{ $t('apply.title') }}</button>
        </div>
      </div>
    </div>

    <!-- INCLUDED SERVICES -->
    <div v-if="checkup.items?.length" class="included">
      <h2>{{ $t('checTitle') }}</h2>
      <div class="included__grid">
        <div v-for="item in checkup.items" :key="item.id" class="included-card">
          <img :src="item.service?.image" />
          <div>
            <h3>{{ item.name?.[locale] }}</h3>
            <p>{{ item.service?.durationMinutes }} {{ $t('service.minut') }}</p>
          </div>
          <span class="included-price">
            {{ item.price.toLocaleString() }} {{ $t('service.sum') }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.checkup {
  padding: 60px 0;

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  &__image {
    position: relative;

    img {
      width: 100%;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    }
  }

  &__department {
    background: #e8f2ff;
    color: #1d4ed8;
    padding: 6px 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
  }

  &__title {
    font-size: 38px;
    font-weight: 700;
    margin: 16px 0;
  }

  &__meta {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    color: #64748b;
  }

  &__desc {
    margin-bottom: 24px;
    line-height: 1.7;
  }
}

.discount-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #ef4444;
  color: white;
  padding: 8px 14px;
  border-radius: 12px;
  font-weight: 700;
}

.features {
  margin: 20px 0;
  padding-left: 0;
  list-style: none;

  li {
    margin-bottom: 6px;
    color: #16a34a;
    font-weight: 500;
  }
}

.price-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 20px 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;

  .old-price {
    text-decoration: line-through;
    color: #94a3b8;
  }

  .current-price {
    font-size: 28px;
    font-weight: 700;
  }
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 14px 26px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.included {
  margin-top: 70px;

  h2 {
    font-size: 26px;
    margin-bottom: 20px;
  }

  &__grid {
    display: grid;
    gap: 16px;
  }
}

.included-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;

  img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
  }

  h3 {
    margin: 0;
    font-size: 16px;
  }

  .included-price {
    margin-left: auto;
    font-weight: 600;
  }
}
</style>
