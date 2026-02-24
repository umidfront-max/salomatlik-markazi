<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { vMaska } from "maska/vue";

const props = defineProps({
	selectedLabel: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["success", "error"]);

const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const { $api } = useNuxtApp();
const { t } = useI18n();

const open = ref(false);
const formRef = ref(null);
const loading = ref(false);
const messageModalVisible = ref(false);
const messageModalType = ref("success");

const form = reactive({
	fullName: "",
	phone: "",
	preferredVisitAt: null,
});

const rules = {
	fullName: [
		{
			required: true,
			message:
				t("form.validations.fullName") ||
				"Iltimos, to'liq ismingizni kiriting",
			trigger: "submit",
		},
	],
	phone: [
		{
			required: true,
			validator: (_, value) => {
				// Faqat +998 yozilgan, raqam yo'q
				const pattern = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
				if (!value || value.trim() === "+998") {
					return Promise.reject(t("form.validations.phone"));
				}
				// To'liq format: +998 XX XXX XX XX
				else if (!pattern.test(value)) {
					return Promise.reject(t("form.validations.phoneFormat"));
				}
				return Promise.resolve();
			},
			trigger: "blur",
		},
	],
	preferredVisitAt: [
		{
			required: true,
			message: t("form.validations.date"),
			trigger: "submit",
		},
	],
};

watch(
	() => route.query.doctor_id,
	(value) => {
		if (value) open.value = true;
	},
);

onMounted(() => {
	if (route.query.doctor_id) open.value = true;
});

function toOpen() {
	open.value = true;
}

function toClose() {
	open.value = false;
	formRef.value?.resetFields();
	Object.assign(form, { fullName: "", phone: "", preferredVisitAt: null });
	router.push(localePath({ query: { doctor_id: undefined } }));
}

// Fokus: +998 avtomatik yoziladi
function onPhoneFocus() {
	if (!form.phone) {
		form.phone = "+998 ";
	}
}

// Blur: faqat +998 qolsa — tozalaymiz (validatsiya ishlashi uchun)
function onPhoneBlur() {
	if (form.phone === "+998 ") {
		form.phone = "";
	}
}

async function toSubmit() {
	try {
		await formRef.value?.validate();
	} catch {
		return;
	}

	loading.value = true;
	const arr = JSON.parse(localStorage.getItem("clinic_cart") || "[]");

	try {
		await $api("leads", {
			method: "POST",
			body: {
				fullName: form.fullName,
				phone: form.phone,
				services: arr.map((el) => el.id),
				preferredVisitAt: form.preferredVisitAt,
			},
		});

		toClose();
		messageModalType.value = "success";
		messageModalVisible.value = true;
		emit("success");
	} catch (error) {
		console.error(error);
		toClose();
		messageModalType.value = "error";
		messageModalVisible.value = true;
		emit("error");
	} finally {
		loading.value = false;
	}
}

defineExpose({ toOpen });
</script>

<template>
	<AModal
		v-model:visible="open"
		:title="$t('formApplication')"
		:footer="null"
		width="560px"
		:forceRender="true"
		class="appointment-modal"
		@cancel="toClose"
	>
		<AForm
			ref="formRef"
			layout="vertical"
			:model="form"
			:rules="rules"
			class="appointment-form"
		>
			<ARow :gutter="[16, 0]">
				<!-- Full Name -->
				<ACol :span="24">
					<AFormItem :label="$t('form.fullName')" name="fullName">
						<AInput
							v-model:value="form.fullName"
							:placeholder="$t('form.fullName') || 'Ism Familiya'"
							allow-clear
						/>
					</AFormItem>
				</ACol>

				<!-- Phone -->
				<ACol :span="24">
					<AFormItem :label="$t('form.phone')" name="phone">
						<AInput
							v-model:value="form.phone"
							v-maska
							data-maska="+998 ## ### ## ##"
							placeholder="+998 __ ___ __ __"
							@focus="onPhoneFocus"
							@blur="onPhoneBlur"
						/>
					</AFormItem>
				</ACol>

				<!-- Date -->
				<ACol :span="24">
					<AFormItem :label="$t('form.date')" name="preferredVisitAt">
						<ADatePicker
							v-model:value="form.preferredVisitAt"
							format="DD.MM.YYYY"
							valueFormat="YYYY-MM-DDTHH:mm:ssZ"
							placeholder="KK.OO.YYYY"
							:disabled-date="
								(d) => d && d.valueOf() < Date.now() - 86400000
							"
						>
							<template #suffixIcon>
								<Icon name="calendar" />
							</template>
						</ADatePicker>
					</AFormItem>
				</ACol>

				<!-- Submit -->
				<ACol :span="24">
					<AButton
						type="primary"
						block
						:loading="loading"
						class="submit-btn"
						@click="toSubmit"
					>
						{{ $t("submitApplication") }}
					</AButton>
				</ACol>
			</ARow>
		</AForm>
	</AModal>

	<!-- Result Modal -->
	<ModalMessage
		v-model:visible="messageModalVisible"
		:type="messageModalType"
	/>
</template>

<style scoped>
.appointment-modal :deep(.ant-modal-header) {
	padding: 24px 28px 16px;
	border-bottom: 1px solid #f0f0f0;
}

.appointment-modal :deep(.ant-modal-title) {
	font-size: 18px;
	font-weight: 600;
	color: #1a1a2e;
}

.appointment-modal :deep(.ant-modal-body) {
	padding: 24px 28px 28px;
}

.appointment-modal :deep(.ant-modal-close) {
	top: 20px;
	right: 20px;
}

.appointment-form :deep(.ant-form-item-label > label) {
	font-size: 13px;
	font-weight: 500;
	color: #4a5568;
}

/* ✅ Barcha inputlar bir xil height va style */
.appointment-form :deep(.ant-input),
.appointment-form :deep(.ant-input-affix-wrapper),
.appointment-form :deep(.ant-picker) {
	height: 44px;
	width: 100%;
	border-radius: 10px;
	border-color: #e2e8f0;
	font-size: 14px;
	transition:
		border-color 0.2s,
		box-shadow 0.2s;
}

/* affix-wrapper ichidagi input height ni override qilmasin */
.appointment-form :deep(.ant-input-affix-wrapper .ant-input) {
	height: auto;
}

/* Hover */
.appointment-form :deep(.ant-input:hover),
.appointment-form :deep(.ant-input-affix-wrapper:hover),
.appointment-form :deep(.ant-picker:hover) {
	border-color: #a0aec0;
}

/* Focus */
.appointment-form :deep(.ant-input:focus),
.appointment-form :deep(.ant-input-affix-wrapper-focused),
.appointment-form :deep(.ant-picker-focused) {
	border-color: var(--blue-4, #e53e3e);
	box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.appointment-form :deep(.ant-form-item) {
	margin-bottom: 18px;
}

/* Submit tugmasi */
.submit-btn {
	background: var(--blue-4, #e53e3e);
	border-color: var(--blue-4, #e53e3e);
	border-radius: 10px;
	height: 48px;
	font-size: 15px;
	font-weight: 600;
	letter-spacing: 0.3px;
	margin-top: 6px;
	transition:
		background 0.2s,
		transform 0.1s;
}

.submit-btn:hover {
	opacity: 0.9;
	transform: translateY(-1px);
}

.submit-btn:active {
	transform: translateY(0);
}
</style>
