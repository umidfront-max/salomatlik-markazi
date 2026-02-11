<script setup>
const { $api } = useNuxtApp();
defineComponent({ name: "home" });
const { data: news } = await useAsyncData("news_home", () =>
	$api("news", {
		params: {
			limit: 5,
			is_visible_home: true,
		},
	}),
);
const { data: diseases } = await useAsyncData("diseases_home", () =>
	$api("diseases", {
		params: {
			limit: 5,
			category: "diseases",
			is_visible_home: true,
		},
	}),
);
</script>
<template>
   <div>
      <SectionHero />
      <!-- <YandexMap /> -->
      <SectionHomeService class="pt-80" />
      <SectionHomeCheckUp class="pt-80" />
      <SectionVideo class="pt-100" />
      <SectionStats class="pt-100 pb-100" />
      <SectionAlphabet class="pb-100" />
      <!-- <SectionProgram class="pb-100" /> -->
      <SectionDoctor class="pb-100" />
      <SectionNews :list="news?.data ?? []" />
      <SectionEquipment class="pb-100" />
      <SectionNews :list="diseases?.data ?? []" :is-diseases="true" />
      <SectionFeedback />
      <SectionPartner class="pt-100" />
   </div>
</template>
