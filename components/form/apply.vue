
<script setup>
import { watch } from "vue";
import { generateRules } from "@/utilities/mixins";
import { vMaska } from "maska/vue";
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["success", "error"]);

const { t } = useI18n();
const formRef = ref();
const { $api } = useNuxtApp();
const { list: program } = useProgram();
const { list: service } = useService();
const { list: doctor } = useDoctor();
const options = computed(() => [program, service, doctor][form.type - 1] ?? []);
const route = useRoute();
const types = [
  { title: t("form.tab.program.title"), label: t("form.tab.program.label") },
  { title: t("form.tab.service.title"), label: t("form.tab.service.label") },
  { title: t("form.tab.doctor.title"), label: t("form.tab.doctor.label") },
];
const rules = generateRules(["name", "phone", "date", "sub_type", "type"], t);
const form = reactive({
  type: 1,
  name: "",
  date: "",
  comment: "-",
  status: 1,
  status_main: true,
  sub_type: undefined,
  phone: "",
});
watch(
  () => props.open,
  (value) => {
    if (value) {
      if (route.query.doctor_id) {
        form.type = 3;
        form.sub_type = +route.query.doctor_id;
      } else {
        form.type = 1;
        form.sub_type = undefined;
      }
    }
  }
);
onMounted(() => {
  if (route.query.doctor_id) {
    form.type = 3;
    form.sub_type = +route.query.doctor_id;
  }
});

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
        // Reset form after successful submission
        formRef.value?.resetFields();
        Object.keys(form).forEach((key) => {
          form[key] = undefined;
        });
        form.type = 1;
        form.status = 1;
        form.status_main = true;
      },
    });
  });
}
</script>
<template>
  <AForm layout="vertical" :model="form" ref="formRef" :rules="rules">
    <ARow
      :gutter="[
        { xl: 20, xs: 12, sm: 16 },
        { xl: 20, xs: 24, sm: 24 },
      ]"
    >
      <ACol :sm="12" :xs="24">
        <AFormItem :label="$t('form.name')" name="name">
          <AInput
            :placeholder="$t('form.placeholder')"
            v-model:value="form.name"
          >
          </AInput>
        </AFormItem>
      </ACol>
      <ACol :sm="12" :xs="24">
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
      <ACol span="24">
        <ATabs
          v-model:activeKey="form.type"
          @change="() => (form.sub_type = undefined)"
        >
          <ATabPane
            :key="index + 1"
            :tab="item.title"
            v-for="(item, index) in types"
          >
          </ATabPane>
        </ATabs>
      </ACol>
      <ACol :sm="12" :xs="24">
        <AFormItem :label="types[form.type - 1].label" name="sub_type">
          <ASelect
            :showSearch="false"
            :placeholder="$t('form.select')"
            :options="
              options.map((option) => ({
                value: option.id,
                label: option.title,
              }))
            "
            v-model:value="form.sub_type"
          >
            <template #suffixIcon>
              <Icon name="angle-bottom" />
            </template>
          </ASelect>
        </AFormItem>
      </ACol>
      <ACol :sm="12" :xs="24">
        <AFormItem :label="$t('form.date')" name="date">
          <ADatePicker
            placeholder="mm/dd/yyyy"
            valueFormat="DD.MM.YYYY"
            format="DD.MM.YYYY"
            v-model:value="form.date"
          >
            <template #suffixIcon>
              <Icon name="calendar" />
            </template>
          </ADatePicker>
        </AFormItem>
      </ACol>
      <ACol span="24" v-if="false">
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
          >{{ $t("submitApplication") }}</Btn
        >
      </ACol>
    </ARow>
  </AForm>
</template>
