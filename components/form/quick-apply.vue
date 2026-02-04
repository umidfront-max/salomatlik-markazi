<script setup>
import { generateRules } from "@/utilities/mixins";
import { vMaska } from "maska/vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:visible", "success", "error"]);

const { t } = useI18n();
const formRef = ref();
const { $api } = useNuxtApp();

// Bugungi sanani DD-MM-YYYY formatida olish
const getTodayDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

const rules = generateRules(["name", "phone"], t);
const form = reactive({
  type: 1,
  name: "",
  phone: "",
  date: getTodayDate(),
  comment: "-",
  sub_type: 1,
  status: 1,
  status_main: true,
});

const handleClose = () => {
  emit("update:visible", false);
  formRef.value?.resetFields();
};

async function toSubmit() {
  await formRef.value?.validate().then(async () => {
    await $api("application", {
      method: "POST",
      body: form,
      onRequestError({ error }) {
        console.error("On request something wrong: " + error);
        emit("error");
      },
      onRequest({ options }) {
        options.params = {};
      },
      onResponseError({ error }) {
        console.error("On response something wrong: " + error);
        emit("error");
      },
      onResponse() {
        emit("success");
        handleClose();
      },
    });
  });
}
</script>

<template>
  <AModal
    :visible="props.visible"
    :title="$t('widget.quickApplication')"
    @cancel="handleClose"
    :footer="null"
    :width="480"
  >
    <AForm layout="vertical" :model="form" ref="formRef" :rules="rules">
      <ARow :gutter="[12, 24]" justify="end">
        <ACol span="24">
          <AFormItem :label="$t('form.name')" name="name">
            <AInput
              :placeholder="$t('form.placeholder')"
              v-model:value="form.name"
            >
            </AInput>
          </AFormItem>
        </ACol>
        <ACol span="24">
          <AFormItem :label="$t('form.phone')" name="phone">
            <AInput
              :placeholder="$t('form.placeholder')"
              v-model:value="form.phone"
              v-maska
              data-maska="+998 ## ### ## ##"
            >
            </AInput>
          </AFormItem>
        </ACol>
        <ACol span="auto">
          <Btn
            type-button="button"
            @click="toSubmit"
            color="red-1"
            :data-text="$t('submitApplication')"
          >
            {{ $t("submitApplication") }}
          </Btn>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>
