<script setup>
const { list: setting } = useSetting();
const { t } = useI18n();
const { locale } = useI18n();
const applyRef = ref({});
</script>

<template>
    <section class="section-connect">
        <div class="connect-wrapper">
            <!-- Apply Side -->
            <div class="connect-block connect-block--apply" data-aos="fade-right">
                <div class="connect-content">
                    <div class="connect-icon">
                        <Icon name="to-sign" />
                    </div>
                    <div class="connect-info">
                        <h3 class="connect-title">
                            {{ $t("apply.title") }}
                        </h3>
                        <p class="connect-text">
                            {{ $t("apply.text") }}
                        </p>
                    </div>
                    <Btn @click="applyRef.toOpen(true)" color="white-1" text-color="red-1" :size="52"
                        class="connect-btn" :data-text="$t('sendApplication')">
                        {{ $t("sendApplication") }}
                    </Btn>
                </div>
                <div class="connect-bg"></div>
            </div>

            <!-- Telegram Side -->
            <div class="connect-block connect-block--telegram" data-aos="fade-left">
                <div class="connect-content">
                    <div class="connect-icon">
                        <Icon name="telegram" />
                    </div>
                    <div class="connect-info">
                        <h3 class="connect-title">
                            {{ $t("telegram.title") }}
                        </h3>
                        <p class="connect-text">
                            {{ $t("telegram.text") }}
                        </p>
                    </div>
                    <a :href="setting?.telegram?.[locale]" target="_blank" class="connect-link">
                        <Btn color="white-1" text-color="blue-1" :size="52" class="connect-btn"
                            :data-text="$t('telegram.btn')">
                            {{ $t("telegram.btn") }}
                        </Btn>
                    </a>
                </div>
                <div class="connect-bg"></div>
            </div>
        </div>
    </section>
    <ClientOnly>
        <SectionHeaderApply ref="applyRef" />
    </ClientOnly>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section-connect {
    padding: 0;
    overflow: hidden;
    margin-top: 80px;
}

.connect-wrapper {
    display: flex;
    width: 100%;
    min-height: 300px;

    @include devices(md) {
        flex-direction: column;
    }
}

.connect-block {
    position: relative;
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
        .connect-bg {
            transform: scale(1.05);
        }
    }

    &--apply {
        width: 55%;
        background-color: var(--red-2);
        color: var(--white-1);
        z-index: 2;
        clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
        padding-right: 10%;
        /* Compensate for slant */

        @include devices(md) {
            width: 100%;
            clip-path: none;
            padding-right: 40px;
        }

        .connect-bg {
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
    }

    &--telegram {
        width: 55%;
        /* Overlap */
        margin-left: -10%;
        /* Pull behind */
        background-color: #229ed9;
        color: var(--white-1);
        z-index: 1;
        padding-left: 12%;
        /* Compensate for overlap */

        @include devices(md) {
            width: 100%;
            margin-left: 0;
            padding-left: 40px;
        }

        .connect-bg {
            background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
        }
    }
}

.connect-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: center;
    transition: transform 0.5s ease;
    z-index: 1;
}

.connect-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    max-width: 800px;
    margin: 0 auto;

    @include devices(lg) {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }
}

.connect-icon {
    width: 80px;
    height: 80px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    flex-shrink: 0;
    backdrop-filter: blur(5px);
    animation: pulse 2s infinite;
    --icon-color: var(--white-1);
    --icon-size: 28px;
}

.connect-info {
    display: flex;
    flex-direction: column;
}

.connect-title {
    @include text(32, inherit, 700, 120%);
    margin-bottom: 8px;
}

.connect-text {
    @include text(18, rgba(255, 255, 255, 0.9), 400, 150%);
    max-width: 400px;
}

.connect-btn {
    flex-shrink: 0;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    white-space: nowrap;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
}

.connect-link {
    text-decoration: none;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }

    70% {
        box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
}
</style>
