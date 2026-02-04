<script setup>
defineProps({
    data: {
        type: Object,
        default: {}
    },
    hasText: {
        type: Boolean,
        default: false
    }
})
</script>
<template>
    <div class="card">
        <p class="card-text" v-if="hasText">{{ data.text }}</p>
        <template v-else>
            <span class="card-count">{{ data.count }}{{ data.value }}</span>
            <small class="card-label">{{ data.title }}</small>
        </template>
    </div>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
.card {
    background-color: var(--local-color);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-24);
    height: 100%;
    &-text {
        @include text(22, var(--black-1), 500, 140%);
    }
    &-count {
        @include text(40, var(--black-1), 700, 130%);
    }

    &-label {
        @include text(20, var(--black-1), 400, 140%);
    }
}
</style>