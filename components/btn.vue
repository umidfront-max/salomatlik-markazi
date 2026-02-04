<script setup>
const emits = defineEmits(["click"]);
const props = defineProps({
  variant: {
    type: String,
    default: "primary", // primary, white, outline-white
  },
  dataText: {
    type: String,
    default: "",
  },
});

function toHandleClick(event) {
  emits("click", event);
}
</script>
<template>
  <button class="btn" :class="`btn--${variant}`" :data-text="dataText" @click="toHandleClick">
    <span>
      <slot></slot>
    </span>
    <Icon class="btn__icon" name="arrow-right-1" />
  </button>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: "Tilda Sans", sans-serif;
  font-weight: 500;
  line-height: 140%;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  border-radius: 8px;

  // Primary variant (red button with animation from header)
  &--primary {
    background-color: var(--red-1);
    height: 48px;
    padding: 0 20px;
    font-size: 16px;
    color: white;
    gap: 8px;

    &::before {
      content: attr(data-text);
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      padding: 0 20px;
      height: 100%;
      color: white;
      font-size: 16px;
      font-weight: 500;
      transition: transform 0.3s ease-in-out;
    }

    span {
      display: block;
      transition: transform 0.3s ease-in-out;
    }

    &:hover {
      background-color: var(--red-2);

      &::before {
        transform: translateY(-100%);
      }

      span {
        transform: translateY(-48px);
      }
    }

    .btn__icon {
      --icon-color: var(--white-1);
    }
  }

  // White variant (for hero section)
  &--white {
    background-color: var(--white-1);
    height: var(--size-btn-56);
    padding: 0 var(--space-32);
    font-size: var(--size-text-20);
    color: var(--red-1);
    gap: 8px;

    &::before {
      content: attr(data-text);
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      padding: 0 var(--space-32);
      height: var(--size-btn-56);
      color: white;
      font-size: var(--size-text-20);
      font-weight: 500;
      transition: transform 0.3s ease-in-out;
    }

    span {
      display: block;
      transition: transform 0.3s ease-in-out;
    }

    &:hover {
      background-color: var(--red-1);
      color: white;

      &::before {
        transform: translateY(-100%);
      }

      span {
        transform: translateY(-56px);
      }

      .btn__icon {
        --icon-color: var(--white-1);
      }
    }

    .btn__icon {
      --icon-color: var(--red-1);
    }
  }

  // Outline white variant (for hero section)
  &--outline-white {
    background-color: transparent;
    border: 2px solid var(--white-1);
    height: var(--size-btn-56);
    padding: 0 var(--space-32);
    font-size: var(--size-text-20);
    color: var(--white-1);
    gap: 8px;

    &::before {
      content: attr(data-text);
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      padding: 0 var(--space-32);
      height: var(--size-btn-56);
      color: var(--red-1);
      font-size: var(--size-text-20);
      font-weight: 500;
      transition: transform 0.3s ease-in-out;
    }

    span {
      display: block;
      transition: transform 0.3s ease-in-out;
    }

    &:hover {
      background-color: var(--white-1);
      color: var(--red-1);

      &::before {
        transform: translateY(-100%);
      }

      span {
        transform: translateY(-56px);
      }

      .btn__icon {
        --icon-color: var(--red-1);
      }
    }

    .btn__icon {
      --icon-color: var(--white-1);
    }
  }

  &__icon {
    transform: rotate(-45deg);
    transition: all 0.2s ease-in-out;
    position: relative;
    z-index: 1;

    .btn:hover & {
      transform: rotate(0deg);
    }
  }
}
</style>
