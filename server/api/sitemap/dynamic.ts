// server/api/sitemap/dynamic.ts
import { defineSitemapEventHandler } from '#imports'

interface RequestConfig {
  name: string;
  api: string;
  params: Record<string, any>;
  route?: string; // Custom route pattern, default: name
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

interface ApiResponse {
  data: Array<{
    slug: string;
    created_at?: Date;
    updated_at?: Date;
  }>;
}

export default defineSitemapEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

    const allUrls: any[] = [];

    // Helper function: Relative URL yaratish
    // Nuxt sitemap moduli avtomatik ravishda locale prefix qo'shadi
    const createUrl = (
      path: string,
      priority: number,
      changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
      lastmod?: string
    ) => {
      return {
        loc: path, // Faqat relative path, Nuxt avtomatik locale qo'shadi
        lastmod: lastmod || new Date().toISOString(),
        changefreq,
        priority,
        _i18nTransform: true, // Barcha locale'lar uchun URL yaratish
      };
    };

    // 1. STATIC SAHIFALAR
    const staticPages = [
      { path: "/", priority: 1.0, changefreq: "daily" },
      { path: "/about", priority: 0.8, changefreq: "monthly" },
      { path: "/contact", priority: 0.7, changefreq: "monthly" },
      { path: "/partnership", priority: 0.7, changefreq: "monthly" },
      { path: "/video", priority: 0.6, changefreq: "weekly" },
      { path: "/search", priority: 0.5, changefreq: "daily" },
    ];

    // Faqat joriy locale uchun static sahifalarni qo'shish
    staticPages.forEach((page) => {
      allUrls.push(createUrl(page.path, page.priority, page.changefreq as any));
    });

    // 2. INDEX SAHIFALAR (Listing pages)
    const indexPages = [
      { path: "/doctor", priority: 0.9, changefreq: "weekly" },
      { path: "/equipment", priority: 0.8, changefreq: "weekly" },
      { path: "/news", priority: 0.8, changefreq: "daily" },
      { path: "/program", priority: 0.8, changefreq: "weekly" },
      { path: "/service", priority: 0.7, changefreq: "weekly" },
    ];

    // Faqat joriy locale uchun index sahifalarni qo'shish
    indexPages.forEach((page) => {
      allUrls.push(createUrl(page.path, page.priority, page.changefreq as any));
    });

    // 3. DYNAMIC SAHIFALAR (API'dan)
    const dynamicRequests: RequestConfig[] = [
      {
        name: "doctor",
        api: "doctors",
        params: { limit: 10000 },
        priority: 0.9,
        changefreq: "weekly",
      },
      {
        name: "equipment",
        api: "equipment",
        params: { limit: 10000 },
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        name: "news",
        api: "news",
        params: { limit: 10000 },
        priority: 0.7,
        changefreq: "daily",
      },
      {
        name: "program",
        api: "posts",
        params: { limit: 10000, category: "program" },
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        name: "static",
        api: "posts",
        params: { limit: 10000, category: "diseases" },
        priority: 0.8,
        changefreq: "monthly",
      },
      {
        name: "static",
        api: "posts",
        params: { limit: 10000, category: "banner" },
        priority: 0.6,
        changefreq: "monthly",
      },
      {
        name: "service",
        api: "services",
        params: { limit: 10000 },
        priority: 0.7,
        changefreq: "weekly",
      },
    ];

    // Har bir request uchun parallel ravishda ma'lumot olish
    const promises = dynamicRequests.map(async (requestConfig) => {
      try {
        // Query parametrlarini URL ga qo'shish
        const queryString = new URLSearchParams(
          requestConfig.params
        ).toString();
        const apiUrl = `${config.public.apiURL}${requestConfig.api}?${queryString}`;
        const response = (await $fetch(apiUrl)) as ApiResponse;

        if (!response?.data || !Array.isArray(response.data)) {
          console.warn(
            `API'dan ma'lumot olinmadi: ${requestConfig.api}`,
            response
          );
          return [];
        }

        // Har bir item uchun faqat joriy locale bo'yicha URL yaratish
        const urlsForLocale: any[] = [];

        response.data.forEach((item) => {
          const routePath = requestConfig.route || requestConfig.name;
          const path = `/${routePath}/${item.slug}`;

          const lastmod = item.updated_at
            ? new Date(item.updated_at).toISOString()
            : item.created_at
              ? new Date(item.created_at).toISOString()
              : undefined;

          urlsForLocale.push(
            createUrl(
              path,
              requestConfig.priority || 0.8,
              requestConfig.changefreq || "weekly",
              lastmod
            )
          );
        });

        return urlsForLocale;
      } catch (error) {
        console.error(
          `Sitemap generatsiyasida xatolik (${requestConfig.api}):`,
          error
        );
        return [];
      }
    });

    // Barcha promise larni kutish
    const results = await Promise.all(promises);

    // Natijalarni birlashtirib qaytarish
    results.forEach((urls) => allUrls.push(...urls));

    console.log(
      `Sitemap generatsiya qilindi: ${allUrls.length} ta URL`
    );

    return allUrls;
  } catch (error) {
    console.error("Sitemap generatsiyasida umumiy xatolik:", error);
    return [];
  }
});

