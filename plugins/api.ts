export default defineNuxtPlugin((nuxtApp: any) => {
    const locale = nuxtApp.$i18n?.locale?.value || 'en';
    const config = useRuntimeConfig();
    const api = $fetch.create({
        baseURL: config.public.apiURL,
        onRequest({ options }) {
            options.headers = { 'Accept-Language': locale };
            options.params = {
                per_page: 500,
                ...options.params,
            }
        },
        onResponseError(e) {
            console.log(e)
        },
        onRequestError(e) {
            console.error(`bu error: ${e}`)
        }
    })
    return {
        provide: {
            api
        }
    }
})