<script setup>
const config = useRuntimeConfig();
const isActive = ref(true);
onMounted(() => {
  setTimeout(() => {
    isActive.value = false;
  }, config.public.loaderDuration || 500);
});
</script>
<template>
  <div class="loader" :class="[{ 'loader-active': isActive }, (config.public.subname || '')]">
    <div class="loader-content">
      <div class="loader-ripple"></div>
      <div class="loader-ripple loader-ripple--2"></div>
      <div class="loader-logo">
        <img src="/logo.png" alt="logo">
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.loader {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s ease-in-out;

  &-active {
    opacity: 1;
    visibility: visible;
  }

  &-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-logo {
    position: relative;
    z-index: 2;
    width: 200px;
    animation: pulse 2s infinite;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &-ripple {
    position: absolute;
    border: 2px solid rgba(var(--red), 0.3);
    border-radius: 50%;
    animation: ripple 2s infinite;
    opacity: 0;
    z-index: 1;

    &--2 {
      animation-delay: 0.5s;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.05);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes ripple {
    0% {
      width: 200px;
      height: 200px;
      opacity: 0.5;
      border-width: 2px;
    }

    100% {
      width: 500px;
      height: 500px;
      opacity: 0;
      border-width: 0px;
    }
  }
}
</style>
