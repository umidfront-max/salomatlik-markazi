<script setup>
const { locale } = useI18n();
const route = useRoute();
const { $api } = useNuxtApp();
const isHome = computed(
	() => route.path === `/${locale.value}` || route.path === "/",
);

onMounted(async () => {
	const { Fancybox } = await import("@fancyapps/ui");
	await import("@fancyapps/ui/dist/fancybox/fancybox.css");
	Fancybox.bind("[data-fancybox]");
});

const excluded = ["search"];

const isVisibleBreadcrumbs = computed(() => {
	const isSearchPage = excluded.includes(
		(route.name?.toString() ?? "").split("___")[0],
	);
	const isDetailPage = !!route.params.slug;
	return !isSearchPage && !isDetailPage && !isHome.value;
});

const toSetStore = (store, data, key = "list") => {
	const { toSet } = store();
	toSet(key, data.value?.data);
};

// Barcha API so'rovlarni PARALLEL yuborish (ketma-ket emas)
const [
	{ data: service },
	{ data: checkUp },
	{ data: program },
	{ data: doctor },
	{ data: gallery },
	{ data: diseases },
	{ data: news },
	{ data: setting },
	{ data: department },
	{ data: social },
] = await Promise.all([
	useAsyncData("service", () => $api("medical-services")),
	useAsyncData("checkUp", () => $api("checkup")),
	useAsyncData("program", () =>
		$api("posts", { params: { category: "program" } }),
	),
	useAsyncData("doctor", () =>
		$api("doctors", { params: { limit: 500, is_visible_home: false } }),
	),
	useAsyncData("gallery", () =>
		$api("gallery", { params: { limit: 500, is_visible_home: false } }),
	),
	useAsyncData("diseases", () => $api("diseases")),
	useAsyncData("news", () => $api("news")),
	useAsyncData("settings", () => $api("settings")),
	useAsyncData("departments", () => $api("departments")),
	useAsyncData("social", () => $api("social")),
]);

toSetStore(useService, service);
toSetStore(useCheckup, checkUp);
toSetStore(useProgram, program);
toSetStore(useDoctor, doctor);
toSetStore(useGallery, gallery);
toSetStore(useDiseases, diseases);
toSetStore(useNews, news);
toSetStore(useSetting, setting);
toSetStore(useMenu, setting); // settings va menu bir xil endpoint
toSetStore(useDepartment, department);
toSetStore(useSocial, social);
</script>
<template>
	<div
		class="wrapper"
		:class="[
			{
				'wrapper-home': isHome,
				'wrapper-page': !isHome,
				'wrapper-detail': isVisibleBreadcrumbs,
			},
		]"
	>
		<Loader />
		<SectionHeader />
		<SectionBreadcrumbs v-if="isVisibleBreadcrumbs" />

		<NuxtPage />

		<SectionConnect />
		<SectionFooter />
	
		<Widget />
	</div>
</template>

<style lang="scss">
body {
	font-family: "Tilda Sans", sans-serif;
}

.wrapper-home {
	padding-top: 0;
}
</style>
