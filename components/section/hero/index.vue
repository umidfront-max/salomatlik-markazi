<script setup>
const { $api } = useNuxtApp()
const { locale } = useI18n()

const lang = computed(() => locale.value || 'uz')

const { data } = await useAsyncData('banners', () =>
  $api('banners', { params: { limit: 12 } })
)

const banners = computed(() => {
  const list = data?.value?.data || []
  return list
    .filter((x) => x?.isActive && x?.type === 'HERO')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
})

const multipliedData = computed(() => {
  const items = banners.value
  if (!items.length) return []
  return [...items] // siz xohlasangiz ko'paytirib qo'yasiz
})
</script>

<template>
  <section class="section">
    <ClientOnly>
      <SectionHeroDefault :items="multipliedData" :lang="lang" />

      <template #fallback>
        <!-- ✅ fallback ham xuddi shuni olsin -->
        <SectionHeroDefault :items="banners" :lang="lang" />
      </template>
    </ClientOnly>
  </section>
</template>
