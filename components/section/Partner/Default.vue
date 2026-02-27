<script setup>
defineProps({
	item: {
		type: Object,
		default: () => {},
	},
});
const { locale } = useI18n();
</script>
<template>
	<a :href="item.websiteUrl" target="_blank" class="section-item__wrapper">
		<img :src="'https://api-his.irismed.uz' + item.logo" alt="partner" />
		<p class="text-center">{{ item?.name?.[locale] }}</p>
	</a>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
	&-item {
		&__wrapper {
			width: calc(100% - var(--width-space) + 12px);
			margin: 0 auto;
			aspect-ratio: 1/1;
			display: block;
			padding: 10px;
			img {
				@include image(contain);
			}
			.text-center {
				text-align: center;
				margin-top: 5px;
			}
		}
	}
}
</style>
