export default defineNuxtPlugin((nuxtApp: any) => {
    const locale = nuxtApp.$i18n?.locale?.value || 'en';
    const config = useRuntimeConfig();
    const api = $fetch.create({
        baseURL: config.public.apiURL,
        onRequest({ options }) {
            options.headers = { 'Accept-Language': locale };
            options.params = {
                limit: 500,
                ...options.params,
            }
        },
        onResponseError(e) {
            if (import.meta.dev) console.error('[API Response Error]', e)
        },
        onRequestError(e) {
            if (import.meta.dev) console.error('[API Request Error]', e)
        }
    })
    return {
        provide: {
            api
        }
    }
})