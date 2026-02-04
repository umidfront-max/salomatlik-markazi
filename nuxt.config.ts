// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";
export default defineNuxtConfig({
   compatibilityDate: "2025-07-28",
   devtools: { enabled: true },
   modules: [
      "nuxt-swiper",
      "@nuxtjs/i18n",
      "@pinia/nuxt",
      "nuxt-aos",
      "@nuxtjs/sitemap",
   ],
   app: {
      head: {
         bodyAttrs: {
            class: process.env.SITE_NAME,
         },
         link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
         meta: [
            {
               name: "google-site-verification",
               content: "sRh1VoGKprDmSVJeuh-R3hFEAJBy9A1uYPzh7IS8PxA",
            },
            {
               name: "og-type",
               content: "article",
            },
            {
               name: "og-image-width",
               content: 200,
            },
            {
               name: "og-image-height",
               content: 200,
            },
            {
               name: "og-url",
               content: process.env.SITE_BASE_URL,
            },
         ],
      },
   },
   i18n: {
      locales: [
         {
            code: "uz",
            name: "O'zbekcha",
            file: "uz.ts",
         },
         {
            code: "en",
            name: "English",
            file: "en.ts",
         },
         {
            code: "ru",
            name: "Русский",
            file: "ru.ts",
         },
      ],
      defaultLocale: "uz",
      langDir: "constants/locales/",
      strategy: "prefix_and_default",
      detectBrowserLanguage: false,
      trailingSlash: false,

   },
   sitemap: {
      urls: [],
      autoI18n: true,
      sources: ["/api/sitemap/dynamic"],
   },
   site: {
      url: process.env.SITE_BASE_URL,
      name: process.env.SITE_NAME,
   },
   css: [
      "ant-design-vue/dist/antd.css",
      'remixicon/fonts/remixicon.css',
      "swiper/css",
      "~/assets/font/stylesheet.css",
      "~/assets/scss/main.scss",
   ],
   plugins: ["~/plugins/ant-design.ts", "~/plugins/api.ts"],

   pinia: {
      storesDirs: ["./store/**"],
   },
   aos: {
      once: true,
   },

   vite: {
      plugins: [
         svgLoader({
            svgoConfig: {
               multipass: true,
            },
         }),
      ],
   },
   runtimeConfig: {
      public: {
         baseURL: process.env.SITE_BASE_URL,
         apiURL: process.env.SITE_API_URL,
         name: process.env.SITE_NAME,
         loaderDuration: 1500,
      },
   },
});
