<script setup lang="ts">
// components/Loader.vue
//
// Ishlatish — app.vue (mavjud):
//   <Loader />   ← allaqachon bor, hech narsa o'zgarmaydi!
//
// Loader HTML sahifa ochilishi bilan darrov ko'rinadi (JS kutmaydi).
// Buning uchun nuxt.config.ts ga ham qo'shimcha yozing (pastdagi kommentga qarang).

// ── Dismiss logikasi ──────────────────────────────────────────────
const MIN_MS = 4000; // kamida necha ms ko'rinsin
const EXIT_MS = 760; // CSS panel transition (700ms) + buffer

onMounted(() => {
	const el = document.getElementById("al");
	if (!el) return;

	const start = performance.now();

	nextTick(() => {
		const elapsed = performance.now() - start;
		const waitLeft = Math.max(0, MIN_MS - elapsed);

		setTimeout(() => {
			// Exit animatsiya: content yo'qoladi, panel pastga tushadi
			el.classList.add("al-hide");

			// Animatsiya tugagach DOM dan to'liq o'chiramiz
			setTimeout(() => {
				el.remove();
				document.getElementById("al-css")?.remove();
			}, EXIT_MS);
		}, waitLeft);
	});
});
</script>

<!--
  Template bo'sh — loader HTML nuxt.config.ts orqali
  bodyOpen scriptida yaratiladi (quyida ko'rsatilgan).
  Bu komponent faqat dismiss logikasini boshqaradi.
-->
<template></template>
