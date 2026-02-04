<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "success", // 'success' or 'error'
  },
});

const emit = defineEmits(["update:visible"]);

const close = () => {
  emit("update:visible", false);
};
</script>

<template>
  <AModal
    :visible="props.visible"
    @cancel="close"
    :footer="null"
    :width="400"
    :centered="true"
  >
    <div class="message-modal">
      <div
        class="message-modal__icon"
        :class="props.type === 'success' ? 'success' : 'error'"
      >
        <Icon
          :name="
            props.type === 'success' ? 'check-circle' : 'exclamation-circle'
          "
        />
      </div>
      <h3 class="message-modal__title">
        {{
          props.type === "success"
            ? $t("modal.success.title")
            : $t("modal.error.title")
        }}
      </h3>
      <p class="message-modal__text">
        {{
          props.type === "success"
            ? $t("modal.success.text")
            : $t("modal.error.text")
        }}
      </p>
      <Btn
        type-button="button"
        @click="close"
        color="red-1"
        :data-text="$t('modal.close')"
      >
        {{ $t("modal.close") }}
      </Btn>
    </div>
  </AModal>
</template>

<style lang="scss" scoped>
.message-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 0;

  &__icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;

    &.success {
      background: rgba(34, 197, 94, 0.1);

      :deep(.icon) {
        --icon-size: 48px;
        --icon-color: #22c55e;
      }
    }

    &.error {
      background: rgba(239, 68, 68, 0.1);

      :deep(.icon) {
        --icon-size: 48px;
        --icon-color: #ef4444;
      }
    }
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  &__text {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 24px;
    line-height: 1.5;
  }
}
</style>
