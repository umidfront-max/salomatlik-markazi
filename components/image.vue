<script setup>
defineProps({
	src: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		default: "image",
	},
});
</script>
<template>
	<a class="image" data-fancybox :href="src">
		<img :src="src" :alt="title" />
	</a>
</template>
<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.image {
	--ratio: 1/1;
	--radius: 12px;
	border-radius: var(--radius);
	aspect-ratio: var(--ratio);
	overflow: hidden;
	display: block;

	img {
		@include image;
	}
}
</style>
