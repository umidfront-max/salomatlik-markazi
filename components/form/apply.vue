<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch, unref } from "vue";
import { generateRules } from "@/utilities/mixins";
import { vMaska } from "maska/vue";

const { t, locale } = useI18n();
const route = useRoute();
const { $api } = useNuxtApp();

const props = defineProps({
	open: { type: Boolean, default: false },
});
const emit = defineEmits(["success", "error"]);

const formRef = ref();

const { list: checkup } = useCheckup();
const { list: department } = useDepartment();
const { list: doctor } = useDoctor();

function asArray(maybe: any) {
	const v = unref(maybe);
	return Array.isArray(v) ? v : [];
}

const types = [
	{ title: t("program.title1"), label: t("program.title1") }, // checkup
	{ title: t("form.tab.service.title"), label: t("form.tab.service.label") }, // service
	{ title: t("form.tab.doctor.title"), label: t("form.tab.doctor.label") }, // doctor
];

const form = reactive({
	// UI
	type: 1,
	// ✅ tab bo‘yicha alohida selectionlar (tab almashtirganda yo‘qolmaydi)
	checkupPackageId: "" as string,
	serviceId: "" as string,
	doctorId: "" as string,
	department: "" as string,
	fullName: "",
	phone: "",
	preferredVisitAt: "",
	source: "CHECKUP_FORM",
	status: "NEW",
	responsibleId: "",
	nextFollowUpAt: "", // agar keyin qo‘shsangiz ham ISO bo‘lishi kerak
	message: "",
	externalSourceId: "",
	sourcePayload: {} as Record<string, any>,
	createdVia: null as any,
});

// ✅ tab bo‘yicha options
const options = computed<any[]>(() => {
	const lists = [asArray(checkup), asArray(department), asArray(doctor)];
	return lists[form.type - 1] ?? [];
});

// ✅ aktiv tabdagi v-model (tabga qarab qaysi id saqlanishini boshqaradi)
const activeSelectModel = computed({
	get() {
		if (form.type === 1) return form.checkupPackageId;
		if (form.type === 2) return form.serviceId;
		return form.doctorId;
	},
	set(v: string) {
		if (form.type === 1) form.checkupPackageId = v;
		else if (form.type === 2) form.serviceId = v;
		else form.doctorId = v;
	},
});

// ✅ tanlangan option label => backendga service(string)
const selectedLabel = computed(() => {
	const id = activeSelectModel.value;
	const opt = options.value.find((x: any) => String(x.id) === String(id));
	if (!opt) return "";
	return (
		// opt.name?.[locale.value] ||
		// opt.fullName?.[locale.value] ||
		// opt.title?.[locale.value] ||
		// opt.name?.ru ||
		// opt.fullName?.ru ||
		opt.id || ""
	);
});

// ✅ rules
const rules = generateRules(
	["fullName", "phone", "preferredVisitAt", "type"],
	t,
);

// open bo‘lganda doctor_id bo‘lsa
watch(
	() => props.open,
	(val) => {
		if (!val) return;
		if (route.query.doctor_id) {
			form.type = 3;
			form.doctorId = String(route.query.doctor_id);
		} else {
			form.type = 1;
		}
	},
);

onMounted(() => {
	if (route.query.doctor_id) {
		form.type = 3;
		form.doctorId = String(route.query.doctor_id);
	}
});

async function toSubmit() {
	await formRef.value?.validate();

	// ✅ preferredVisitAt ISO bo‘lib keladi
	const payload = {
		fullName: form.fullName,
		phone: form.phone,
		department: selectedLabel.value, // string
		preferredVisitAt: form.preferredVisitAt, // ISO 8601 ✅
		source: "CHECKUP_FORM",
		status: "NEW",
		responsibleId: form.responsibleId || null,
		nextFollowUpAt: form.nextFollowUpAt || null, // agar ishlatsangiz ISO yuboring
		message: form.message || null,
		externalSourceId: form.externalSourceId || null,
		sourcePayload: form.sourcePayload ?? {},
		createdVia: form.createdVia ?? null,

		// ✅ checkupPackageId faqat checkup tanlansa yuboriladi
		checkupPackageId: form.checkupPackageId || null,
	};

	await $api("leads", {
		method: "POST",
		body: payload,
		onRequest({ options }) {
			options.params = {};
		},
		onRequestError({ error }) {
			console.error(error);
			emit("error");
		},
		onResponseError({ error }) {
			console.error(error);
			emit("error");
		},
		onResponse() {
			emit("success");
			formRef.value?.resetFields();

			// reset
			form.type = 1;
			form.fullName = "";
			form.phone = "";
			form.preferredVisitAt = "";
			form.message = "";

			form.responsibleId = "";
			form.nextFollowUpAt = "";
			form.externalSourceId = "";
			form.sourcePayload = {};
			form.createdVia = null;

			form.checkupPackageId = "";
			form.serviceId = "";
			form.doctorId = "";
		},
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
				<AFormItem
					class="mini-input"
					:label="$t('form.name')"
					name="fullName"
				>
					<AInput
						:placeholder="$t('form.placeholder')"
						v-model:value="form.fullName"
						size="small"
					/>
				</AFormItem>
			</ACol>

			<ACol :sm="12" :xs="24">
				<AFormItem
					class="mini-input"
					:label="$t('form.phone')"
					name="phone"
				>
					<AInput
						:placeholder="$t('form.placeholder')"
						v-model:value="form.phone"
						v-maska
						data-maska="+998 ## ### ## ##"
					/>
				</AFormItem>
			</ACol>

			<ACol span="24">
				<!-- ✅ endi change eventda sub_type ni tozalash yo‘q -->
				<ATabs v-model:activeKey="form.type">
					<ATabPane
						:key="index + 1"
						:tab="item.title"
						v-for="(item, index) in types"
					/>
				</ATabs>
			</ACol>

			<ACol :sm="12" :xs="24">
				<AFormItem class="mini-input" :label="types[form.type - 1].label">
					<ASelect
						:showSearch="false"
						:placeholder="$t('form.select')"
						size="small"
						:options="
							options.map((o: any) => ({
								value: String(o.id),
								label:
									o.name?.[locale] ||
									o.fullName?.[locale] ||
									o.title?.[locale],
							}))
						"
						v-model:value="activeSelectModel"
					>
						<template #suffixIcon>
							<Icon name="angle-bottom" />
						</template>
					</ASelect>
				</AFormItem>
			</ACol>

			<ACol :sm="12" :xs="24">
				<AFormItem
					class="mini-input"
					:label="$t('form.date')"
					name="preferredVisitAt"
				>
					<!-- ✅ ISO 8601 -->
					<ADatePicker
						placeholder="YYYY-MM-DD"
						format="DD.MM.YYYY"
						valueFormat="YYYY-MM-DDTHH:mm:ssZ"
						v-model:value="form.preferredVisitAt"
					>
						<template #suffixIcon>
							<Icon name="calendar" />
						</template>
					</ADatePicker>
				</AFormItem>
			</ACol>

			<ACol span="24">
				<AFormItem :label="$t('form.comment')" name="message">
					<ATextarea
						:placeholder="$t('form.placeholder')"
						v-model:value="form.message"
						rows="2"
					/>
				</AFormItem>
			</ACol>

			<ACol>
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
</template>
<style scoped>
.mini-input :deep(.ant-input),
.mini-input :deep(.ant-select-selector),
.mini-input :deep(.ant-picker) {
	height: 48px !important;
}
</style>
