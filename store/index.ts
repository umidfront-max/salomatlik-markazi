export const toSetupStore = (key: string) => defineStore(key, (): any => {
    const dataset: any = reactive({
        data: {},
        list: [],
    })
    const toSet = (key: 'data' | 'list', value: any) => {
        if (key === 'list') {
            dataset['list'] = value ?? [];
        } else {
            dataset['data'] = value ?? {};
        }
    }
    return { toSet, ...toRefs(dataset) }
});

export const useSetting = toSetupStore('settings');
export const useDepartment = toSetupStore('departments');
export const useService = toSetupStore('services');
export const useCheckup = toSetupStore('checkup');
export const useProgram = toSetupStore('program');
export const useDoctor = toSetupStore('doctors');
export const useNews = toSetupStore('news');
export const useDiseases = toSetupStore('diseases');
export const useGallery = toSetupStore('gallery');
export const useMenu = toSetupStore('menu');
export const useSocial = toSetupStore('social');

