<script setup>
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
const { locale } = useI18n();
const route = useRoute();
const { $api } = useNuxtApp();
const isHome = computed(() => {
  if (route.path === `/${locale.value}` || route.path === "/") {
    return true;
  } else {
    return false;
  }
});

onMounted(async () => {
  await nextTick();
  Fancybox.bind("[data-fancybox]");
});
const excluded = ["search"];

const isVisibleBreadcrumbs = computed(() => {
  const isSearchPage = excluded.includes(
    (route.name?.toString() ?? "").split("___")[0]
  );
  const isDetailPage = !!route.params.slug;
  return !isSearchPage && !isDetailPage && !isHome.value;
});

const toSetStore = (store, data, key = "list") => {
  const { toSet } = store();
  if (key === "list") {
    toSet(key, data.value?.result);
  } else {
    toSet(key, data.value?.data);
  }
};

// #region setting
const { data: setting } = await useAsyncData("settings", () =>
  $api("settings")
);
toSetStore(useSetting, setting, "data");

useSeoMeta({
  title: setting.value?.data?.site_name || "-",
  ogTitle: setting.value?.data?.site_name || "-",
  description: setting.value?.data?.site_description || "-",
  ogDescription: setting.value?.data?.site_description || "-",
});
// #endregion setting
// #region service
const { data: service } = await useAsyncData("service", () => $api("services"));
toSetStore(useService, service);
// #endregion service

// #region program
const { data: program } = await useAsyncData("program", () =>
  $api("posts", {
    params: {
      category: "program",
    },
  })
);
toSetStore(useProgram, program);
// #endregion program

// #region doctors
const { data: doctor } = await useAsyncData("doctor", () =>
  $api("doctors", { params: { per_page: 500, is_visible_home: false } })
);
toSetStore(useDoctor, doctor);
// #endregion doctors

// #region menu
const { data: menu } = await useAsyncData("menu", () => $api("menu"));
toSetStore(useMenu, menu);
// #endregion menu

// #region social
const { data: social } = await useAsyncData("social", () => $api("social"));
toSetStore(useSocial, social);
// #endregion menu
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
    <SectionHeader />
    <SectionBreadcrumbs v-if="isVisibleBreadcrumbs" />

    <NuxtPage></NuxtPage>

    <SectionConnect />
    <SectionFooter />
    <Loader />
    <Widget />
  </div>
</template>

<style lang="scss">
.wrapper-page {
  padding-top: 160px; // Header height compensation (80px top + 80px bottom sections)
}

.wrapper-home {
  padding-top: 0;
}
</style>
