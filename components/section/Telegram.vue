<script setup>
const { t } = useI18n();
</script>

<template>
    <section class="section">
        <div class="container section-container">
            <div class="section-content">
                <div class="section-icon">
                    <Icon name="telegram" />
                </div>
                <div class="section-info">
                    <h3 class="section-title">
                        {{ $t("telegram.title") }}
                    </h3>
                    <p class="section-text">
                        {{ $t("telegram.text") }}
                    </p>
                </div>
            </div>
            <a href="https://t.me/carenix_uz" target="_blank" class="section-btn">
                <Btn color="white-1" text-color="blue-1" :size="48" :data-text="$t('telegram.btn')">
                    {{ $t("telegram.btn") }}
                </Btn>
            </a>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
    padding: var(--space-40);
    background-color: #229ed9;
    /* Telegram Blue */
    position: relative;
    z-index: 1;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.3;
        z-index: -1;
    }

    &-container {
        display: flex;
        align-items: center;
        justify-content: space-between;

        @include devices(xs) {
            flex-wrap: wrap;
            row-gap: 20px;
            justify-content: center;
            text-align: center;
        }
    }

    &-content {
        display: flex;
        align-items: center;
        gap: 24px;

        @include devices(xs) {
            flex-direction: column;
            gap: 16px;
        }
    }

    &-icon {
        width: 64px;
        height: 64px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-1);
        font-size: 32px;
        flex-shrink: 0;
    }

    &-info {
        display: flex;
        flex-direction: column;
    }

    &-title {
        @include text(28, var(--white-1), 700, 130%);
        margin-bottom: 8px;
    }

    &-text {
        @include text(18, rgba(var(--white), 0.9), 500, 140%);
        max-width: 600px;
    }

    &-btn {
        text-decoration: none;
        white-space: nowrap;

        @include devices(xs) {
            width: 100%;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
