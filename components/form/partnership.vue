<script setup>
import { generateRules } from "~/utilities/mixins";
import { vMaska } from "maska/vue";

const emit = defineEmits(["success", "error"]);

const formRef = ref();
const { $api } = useNuxtApp();
const { t } = useI18n();
const form = reactive({
  name: "",
  comment: "",
  status: 1,
  status_main: true,
  place: "",
  phone: "",
  company: "-",
});
const rules = generateRules(["name", "phone", "place", "comment"], t);
const toSubmit = async () => {
  await formRef.value?.validate().then(async () => {
    await $api("contacts", {
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
        // Reset form after successful submission
        formRef.value?.resetFields();
        Object.keys(form).forEach((key) => {
          form[key] = undefined;
        });
        form.status = 1;
        form.status_main = true;
        form.company = "-";
      },
    });
  });
};
</script>
<template>
  <AForm layout="vertical" :model="form" ref="formRef" :rules="rules">
    <ARow
      :gutter="[
        { xl: 20, xs: 12, sm: 16 },
        { xl: 20, xs: 24, sm: 24 },
      ]"
    >
      <ACol :sm="8" :xs="24">
        <AFormItem :label="$t('form.name')" name="name">
          <AInput
            :placeholder="$t('form.placeholder')"
            v-model:value="form.name"
          >
          </AInput>
        </AFormItem>
      </ACol>
      <ACol :sm="8" :xs="24">
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
      <!-- <ACol :sm="12" :xs="24">
        <AFormItem :label="$t('form.company')" name="company">
          <AInput
            :placeholder="$t('form.placeholder')"
            v-model:value="form.company"
          ></AInput>
        </AFormItem>
      </ACol> -->
      <ACol :sm="8" :xs="24">
        <AFormItem :label="$t('form.place')" name="place">
          <AInput
            :placeholder="$t('form.placeholder')"
            v-model:value="form.place"
          ></AInput>
        </AFormItem>
      </ACol>
      <ACol span="24">
        <AFormItem :label="$t('form.comment')" name="comment">
          <ATextarea
            :placeholder="$t('form.placeholder')"
            v-model:value="form.comment"
          ></ATextarea>
        </AFormItem>
      </ACol>

      <ACol>
        <Btn
          type-button="button"
          @click="toSubmit"
          color="red-1"
          :data-text="$t('submitApplication')"
          >{{ $t("submitApplication") }}
        </Btn>
      </ACol>
    </ARow>
  </AForm>
</template>
