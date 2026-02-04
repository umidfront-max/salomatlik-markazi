<script setup>
import { ref, computed } from "vue";
import { message } from "ant-design-vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

const { t } = useI18n();
const isOpen = ref(false);
const route = useRoute();

const currentUrl = computed(() => {
  if (process.client) {
    return window.location.href;
  }
  return "";
});

const shareLinks = computed(() => [
  {
    name: "Facebook",
    icon: "facebook",
    color: "#1877F2",
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`,
  },
  {
    name: "Twitter",
    icon: "twitter",
    color: "#1DA1F2",
    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl.value)}&text=${encodeURIComponent(props.title)}`,
  },
  {
    name: "Telegram",
    icon: "telegram",
    color: "#0088cc",
    url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl.value)}&text=${encodeURIComponent(props.title)}`,
  },
  {
    name: "WhatsApp",
    icon: "whatsapp",
    color: "#25D366",
    url: `https://api.whatsapp.com/send?text=${encodeURIComponent(props.title + " " + currentUrl.value)}`,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    color: "#0A66C2",
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl.value)}`,
  },
]);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function shareOn(platform) {
  if (platform.name === "Copy") {
    copyLink();
  } else {
    window.open(platform.url, "_blank", "width=600,height=400");
    isOpen.value = false;
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    message.success(t("share.linkCopied"));
    isOpen.value = false;
  } catch (err) {
    message.error(t("share.copyError"));
  }
}

// Close dropdown when clicking outside
if (process.client) {
  document.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".share-social");
    if (dropdown && !dropdown.contains(e.target)) {
      isOpen.value = false;
    }
  });
}
</script>

<template>
  <div class="share-social" @click.stop>
    <button class="share-button" @click="toggleDropdown" :class="{ active: isOpen }">
      <Icon name="share" class="share-button__icon" />
      <span class="share-button__text">{{ $t("share.title") }}</span>
      <Icon name="angle-bottom" class="share-button__arrow" />
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="share-dropdown">
        <div class="share-dropdown__header">
          <span>{{ $t("share.shareOn") }}</span>
        </div>
        <div class="share-dropdown__list">
          <button
            v-for="platform in shareLinks"
            :key="platform.name"
            class="share-item"
            @click="shareOn(platform)"
            :style="`--platform-color: ${platform.color}`"
          >
            <div class="share-item__icon">
              <Icon :name="platform.icon" />
            </div>
            <span class="share-item__name">{{ platform.name }}</span>
          </button>
          <button class="share-item" @click="copyLink" style="--platform-color: #6B7280">
            <div class="share-item__icon">
              <Icon name="copy" />
            </div>
            <span class="share-item__name">{{ $t("share.copyLink") }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.share-social {
  position: relative;
  display: inline-block;
}

.share-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--red-1) 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);

  &__icon {
    --icon-size: 20px;
    --icon-color: white;
  }

  &__text {
    line-height: 1;
  }

  &__arrow {
    --icon-size: 16px;
    --icon-color: white;
    transition: transform 0.3s ease;
  }

  &.active &__arrow {
    transform: rotate(180deg);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.share-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 8px;
  min-width: 280px;
  z-index: 1000;
  border: 1px solid rgba(0, 0, 0, 0.06);

  &__header {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }

  &__list {
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}

.share-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--platform-color);
    transition: all 0.2s ease;
    flex-shrink: 0;

    .icon {
      --icon-size: 18px;
      --icon-color: white;
    }
  }

  &__name {
    font-size: 15px;
    font-weight: 500;
    color: #374151;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);

    .share-item__icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

// Dropdown animation
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
