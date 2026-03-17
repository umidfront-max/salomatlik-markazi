<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
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
const { t, locale } = useI18n();

const open = ref(false);
const formRef = ref(null);
const loading = ref(false);
const messageModalVisible = ref(false);
const messageModalType = ref("success");

// ── Cart ──────────────────────────────────────────────────
const CART_KEY = "clinic_cart";
const cartItems = ref([]);

function readCart() {
	try {
		cartItems.value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
	} catch {
		cartItems.value = [];
	}
}

function itemName(item) {
	if (typeof item.name === "object") return item.name?.[locale?.value] || "";
	return item.name || "";
}

function formatPrice(p) {
	return Number(p || 0).toLocaleString("ru-RU");
}

const cartTotal = computed(() =>
	cartItems.value.reduce(
		(sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
		0,
	),
);

// ── Form ──────────────────────────────────────────────────
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
				const pattern = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
				if (!value || value.trim() === "+998") {
					return Promise.reject(t("form.validations.phone"));
				} else if (!pattern.test(value)) {
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


function toOpen() {
	readCart();
	open.value = true;
}

function toClose() {
	open.value = false;
	formRef.value?.resetFields();
	Object.assign(form, { fullName: "", phone: "", preferredVisitAt: null });
	router.push(localePath({ query: { doctor_id: undefined } }));
}

function onPhoneFocus() {
	if (!form.phone) {
		form.phone = "+998 ";
	}
}

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
		localStorage.setItem("clinic_cart", JSON.stringify([]));
		window.dispatchEvent(new CustomEvent("cart-updated", { detail: [] }));
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

				<!-- Cart List -->
				<ACol v-if="cartItems.length > 0" :span="24">
					<div class="cart-summary">
						<p class="cart-summary__title">{{ $t("cart.title") }}</p>
						<ul class="cart-summary__list">
							<li
								v-for="item in cartItems"
								:key="item.id"
								class="cart-summary__item"
							>
								<span class="cart-summary__name">{{
									itemName(item)
								}}</span>
								<span class="cart-summary__price">
									{{ formatPrice(item.price) }}
									{{ $t("cart.currency") }}
								</span>
							</li>
						</ul>
						<div class="cart-summary__total">
							<span>{{ $t("cart.total") }}</span>
							<span
								>{{ formatPrice(cartTotal) }}
								{{ $t("cart.currency") }}</span
							>
						</div>
					</div>
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

.appointment-form :deep(.ant-input),
.appointment-form :deep(.ant-input-affix-wrapper),
.appointment-form :deep(.ant-picker),
:deep(.ant-picker-input) input {
	height: 44px;
	width: 100%;
	border-radius: 10px;
	border-color: #e2e8f0;
	font-size: 14px;
	transition:
		border-color 0.2s,
		box-shadow 0.2s;
}

.appointment-form :deep(.ant-input-affix-wrapper .ant-input) {
	height: auto;
}

.appointment-form :deep(.ant-input:hover),
.appointment-form :deep(.ant-input-affix-wrapper:hover),
.appointment-form :deep(.ant-picker:hover) {
	border-color: #a0aec0;
}

.appointment-form :deep(.ant-input:focus),
.appointment-form :deep(.ant-input-affix-wrapper-focused),
.appointment-form :deep(.ant-picker-focused) {
	border-color: var(--blue-4, #e53e3e);
	box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.appointment-form :deep(.ant-form-item) {
	margin-bottom: 18px;
}

/* ── Cart Summary ──────────────────────────────── */
.cart-summary {
	background: #f8fafc;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	padding: 14px 16px;
	margin-bottom: 4px;
}

.cart-summary__title {
	font-size: 12px;
	font-weight: 600;
	color: #64748b;
	margin: 0 0 10px;
	text-transform: uppercase;
	letter-spacing: 0.06em;
}

.cart-summary__list {
	list-style: none;
	padding: 0;
	margin: 0 0 10px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.cart-summary__item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
}

.cart-summary__name {
	font-size: 13px;
	color: #0f172a;
	font-weight: 500;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	flex: 1;
}

.cart-summary__price {
	font-size: 13px;
	font-weight: 700;
	color: var(--blue-4);
	white-space: nowrap;
	flex-shrink: 0;
}

.cart-summary__total {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 10px;
	border-top: 1px dashed #e2e8f0;
	font-size: 14px;
	font-weight: 700;
	color: #0f172a;
}

/* ── Submit ────────────────────────────────────── */
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
