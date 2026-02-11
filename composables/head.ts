export const useCustomHead = (detail: any) => {
    // const config = useRuntimeConfig();
    const route = useRoute();
    const config = useRuntimeConfig()
    useHead({
        title: detail?.title,
        meta: [
            {
                property: "og:type",
                content: "article",
            },
            {
                property: "og:title",
                content: detail?.title,
            },
            {
                property: "og:description",
                content: detail?.short_content || detail?.sub_title || detail.content?.replace(/<[^>]*>?/gm, "") || detail.title,
            },
            {
                property: "og:image",
                content: detail?.image,
            },
            {
                property: "og:image:secure_url",
                content: detail?.image,
            },
            {
                property: "og:url",
                content: config.public.baseURL + route.fullPath,
            },
        ],
    });
}