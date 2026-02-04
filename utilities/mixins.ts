export const toGetNumber = (value?: string) => {
    if (!value) return "";
    return `tel:${value.split('-').join('').split(' ').join('')}`;
}
export const toGetYoutubeLink = (value?: string) => {
    if (!value) return "https://www.instagram.com/tohirusenov";
    const youtubeURL = "https://www.youtube.com/embed/";
    return youtubeURL + value.split("?v=")[1];
}

export const generateRules = (rules = [], $t: Function) => {
    const map: any = {};
    for (let item of rules) {
        map[item] = {
            required: true,
            message: $t("form.validation"),
        };
    }
    return map;
}