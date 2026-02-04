<script setup>
const { list } = useProgram();
const localePath = useLocalePath();

// Dynamic gradient colors for each card
const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

// Pattern shapes for background
const patterns = [
  "M20,10 L30,20 L20,30 L10,20 Z",
  "M25,5 L35,15 L25,25 L15,15 Z",
  "M15,10 Q20,5 25,10 T35,10",
  "M10,20 Q20,10 30,20 Q20,30 10,20",
];
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <h2 class="section-title">
          {{ $t("program.title") }}
        </h2>
        <NuxtLink class="section-link" :to="localePath('/program')">
          {{ $t("viewAll") }}
          <Icon class="section-link__icon" name="angle-right" />
        </NuxtLink>
      </div>

      <div class="program-grid">
        <NuxtLink
          v-for="(item, index) in list"
          :key="item.id"
          :to="localePath(`/program/${item.slug}`)"
          class="program-card"
          :style="`--card-gradient: ${gradients[index % gradients.length]}`"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <!-- Animated Background Pattern -->
          <div class="program-card__pattern">
            <svg class="pattern-svg" viewBox="0 0 200 200">
              <defs>
                <linearGradient :id="`grad-${index}`" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:rgba(255,255,255,0.3)" />
                  <stop offset="100%" style="stop-color:rgba(255,255,255,0.1)" />
                </linearGradient>
              </defs>
              <g class="pattern-group">
                <circle cx="50" cy="50" r="30" :fill="`url(#grad-${index})`" opacity="0.4" />
                <circle cx="150" cy="150" r="40" :fill="`url(#grad-${index})`" opacity="0.3" />
                <path :d="patterns[index % patterns.length]" :fill="`url(#grad-${index})`" opacity="0.5" transform="translate(100, 100)" />
                <circle cx="180" cy="30" r="20" :fill="`url(#grad-${index})`" opacity="0.35" />
              </g>
            </svg>
          </div>

          <!-- Gradient Background -->
          <div class="program-card__bg"></div>

          <!-- Image -->
          <div class="program-card__image">
            <img :src="item.image" :alt="item.title" />
          </div>

          <!-- Content -->
          <div class="program-card__content">
            <div class="program-card__top">
              <div class="program-card__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="program-card__number">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>

            <h3 class="program-card__title">{{ item.title }}</h3>

            <div class="program-card__footer">
              <span class="program-card__link">
                {{ $t("more") || "Batafsil" }}
              </span>
              <div class="program-card__arrow">
                <Icon name="arrow-right" />
              </div>
            </div>
          </div>

          <!-- Decorative Corner -->
          <div class="program-card__corner"></div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
  padding: var(--space-80) 0;
  background-color: #f8faff;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;

  @include devices(md) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @include devices(sm) {
    grid-template-columns: 1fr;
  }
}

.program-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);

  @include devices(sm) {
    min-height: 380px;
  }

  &__pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.5s ease;

    .pattern-svg {
      width: 100%;
      height: 100%;
    }

    .pattern-group {
      animation: float 20s ease-in-out infinite;
    }
  }

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--card-gradient);
    z-index: 2;
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.08;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(100%);
    }
  }

  &__content {
    position: relative;
    z-index: 3;
    padding: 36px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex: 1;

    @include devices(sm) {
      padding: 28px;
      gap: 20px;
    }
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    border: 1px solid rgba(102, 126, 234, 0.2);

    svg {
      width: 28px;
      height: 28px;
      color: var(--primary);
      transition: all 0.5s ease;
    }
  }

  &__number {
    @include text(20, var(--black-1), 700, 100%);
    font-variant-numeric: tabular-nums;
    opacity: 0.3;
    transition: all 0.4s ease;
    letter-spacing: 1px;
  }

  &__title {
    @include text(32, var(--black-1), 600, 140%);
    flex: 1;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

    @include devices(sm) {
      font-size: 26px;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  &__link {
    @include text(16, var(--black-1), 500, 100%);
    opacity: 0.6;
    transition: all 0.4s ease;
  }

  &__arrow {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--card-gradient);
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .icon {
      --icon-size: 22px;
      --icon-color: var(--black-1);
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      position: relative;
      z-index: 1;
    }
  }

  &__corner {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: var(--card-gradient);
    opacity: 0;
    clip-path: polygon(100% 0, 100% 100%, 0 0);
    transition: opacity 0.5s ease;
    z-index: 1;
  }

  // Hover Effects
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15);
    border-color: transparent;

    .program-card__pattern {
      opacity: 1;
    }

    .program-card__bg {
      opacity: 0.95;
    }

    .program-card__image {
      opacity: 0.15;
      transform: scale(1.1);

      img {
        filter: grayscale(0%);
      }
    }

    .program-card__icon {
      transform: scale(1.1) rotate(10deg);
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);

      svg {
        color: #fff;
        transform: scale(1.1);
      }
    }

    .program-card__number {
      opacity: 0.8;
      color: rgba(255, 255, 255, 0.9);
    }

    .program-card__title {
      color: #fff;
      transform: translateX(8px);
    }

    .program-card__link {
      color: rgba(255, 255, 255, 0.9);
      opacity: 1;
      transform: translateX(4px);
    }

    .program-card__arrow {
      transform: rotate(-45deg) scale(1.1);

      &::before {
        opacity: 1;
      }

      .icon {
        --icon-color: #fff;
        transform: rotate(45deg) scale(1.15);
      }
    }

    .program-card__corner {
      opacity: 0.3;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, -10px) rotate(5deg);
  }
  50% {
    transform: translate(-5px, 10px) rotate(-5deg);
  }
  75% {
    transform: translate(5px, 5px) rotate(3deg);
  }
}
</style>
