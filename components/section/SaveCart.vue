<script setup>
import { ref, reactive } from "vue";
import { vMaska } from "maska/vue";

const emit = defineEmits(["success", "error"]);

const { $api } = useNuxtApp();
const { t } = useI18n();

const formRef = ref(null);
const loading = ref(false);
const isSuccess = ref(false);

const form = reactive({
	fullName: "",
	phone: "",
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
					return Promise.reject(
						t("form.validations.phone") || "Telefon raqamini kiriting",
					);
				} else if (!pattern.test(value)) {
					return Promise.reject(
						t("form.validations.phoneFormat") ||
							"To'liq format: +998 XX XXX XX XX",
					);
				}
				return Promise.resolve();
			},
			trigger: "submit",
		},
	],
};

function onPhoneFocus() {
	if (!form.phone) form.phone = "+998 ";
}
function onPhoneBlur() {
	if (form.phone === "+998 ") form.phone = "";
}

async function toSubmit() {
	try {
		await formRef.value?.validate();
	} catch {
		return;
	}

	loading.value = true;
	try {
		await $api("leads", {
			method: "POST",
			body: {
				fullName: form.fullName,
				phone: form.phone,
			},
		});

		isSuccess.value = true;
		emit("success");

		setTimeout(() => {
			isSuccess.value = false;
			formRef.value?.resetFields();
			Object.assign(form, { fullName: "", phone: "" });
		}, 3200);
	} catch (error) {
		console.error(error);
		emit("error");
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<section class="cf">
		<div class="cf__bg">
			<span class="cf__shape cf__shape--1" />
			<span class="cf__shape cf__shape--2" />
			<span class="cf__shape cf__shape--3" />
			<span class="cf__shape cf__shape--4" />
		</div>

		<div class="cf__inner">
			<div class="cf__text">
				<h2 class="cf__title">{{ $t("form.title") }}</h2>
				<p class="cf__sub">{{ $t("form.subtitle") }}</p>
			</div>

			<Transition name="swap" mode="out-in">
				<div v-if="isSuccess" key="ok" class="cf__success">
					<div class="cf__success-icon">
						<svg viewBox="0 0 52 52" fill="none">
							<circle
								cx="26"
								cy="26"
								r="25"
								stroke="rgba(255,255,255,.35)"
								stroke-width="2"
							/>
							<path
								class="cf__check"
								d="M14 27l8 8 16-16"
								stroke="#fff"
								stroke-width="2.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<div>
						<span class="cf__success-text">{{
							$t("form.successTitle")
						}}</span>
						<span class="cf__success-sub">{{
							$t("form.successSubtitle")
						}}</span>
					</div>
				</div>

				<AForm
					v-else
					key="form"
					ref="formRef"
					layout="vertical"
					:model="form"
					:rules="rules"
					class="cf__form"
				>
					<AFormItem name="fullName" class="cf__item">
						<AInput
							v-model:value="form.fullName"
							:placeholder="$t('form.fullName') || 'Ism Familiya'"
							class="cf__input"
							allow-clear
						/>
					</AFormItem>

					<AFormItem name="phone" class="cf__item">
						<AInput
							v-model:value="form.phone"
							v-maska
							data-maska="+998 ## ### ## ##"
							placeholder="+998 __ ___ __ __"
							class="cf__input"
							@focus="onPhoneFocus"
							@blur="onPhoneBlur"
						/>
					</AFormItem>

					<AButton
						type="primary"
						:loading="loading"
						class="cf__btn"
						@click="toSubmit"
					>
						<template v-if="!loading">
							<span class="cf__btn-label">{{
								$t("submitApplication")
							}}</span>
						</template>
					</AButton>
				</AForm>
			</Transition>
		</div>
	</section>
</template>

<style scoped>
/* ── Section ─────────────────────────────────────────── */
.cf {
	font-family: "Onest", sans-serif;
	position: relative;
	overflow: hidden;
	background: linear-gradient(
		135deg,
		rgba(20, 63, 150, 0.92) 0%,
		rgba(26, 80, 180, 0.95) 40%,
		rgba(15, 50, 130, 0.97) 75%,
		rgba(10, 38, 110, 1) 100%
	);
	max-width: 1300px;
	width: 100%;
	margin: 30px auto;
	padding: 56px 40px;
	border-radius: 22px;
	isolation: isolate;
	min-height: 270px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

/* ── BG shapes ──────────────────────────────────────── */
.cf__bg {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 0;
}
.cf__shape {
	position: absolute;
	border-radius: 50%;
}
.cf__shape--1 {
	width: 380px;
	height: 380px;
	top: -130px;
	right: -100px;
	background: rgba(100, 149, 237, 0.18);
	animation: drift1 9s ease-in-out infinite alternate;
}
.cf__shape--2 {
	width: 240px;
	height: 240px;
	bottom: -80px;
	right: 16%;
	background: rgba(70, 120, 220, 0.12);
	animation: drift2 12s ease-in-out infinite alternate;
}
.cf__shape--3 {
	width: 130px;
	height: 130px;
	top: 25px;
	left: 40%;
	background: rgba(150, 180, 255, 0.09);
	animation: drift1 7s ease-in-out infinite alternate-reverse;
}
.cf__shape--4 {
	width: 90px;
	height: 90px;
	bottom: 12px;
	left: 70px;
	background: rgba(100, 149, 237, 0.13);
	animation: drift2 10s ease-in-out infinite alternate;
}
@keyframes drift1 {
	from {
		transform: translateY(0) scale(1);
	}
	to {
		transform: translateY(22px) scale(1.07);
	}
}
@keyframes drift2 {
	from {
		transform: translateY(0) rotate(0deg);
	}
	to {
		transform: translateY(-18px) rotate(8deg);
	}
}

/* ── Inner ───────────────────────────────────────────── */
.cf__inner {
	position: relative;
	z-index: 1;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

/* ── Text ────────────────────────────────────────────── */
.cf__text {
	margin-bottom: 28px;
}
.cf__title {
	font-size: clamp(22px, 2.8vw, 36px);
	font-weight: 700;
	color: #fff;
	margin: 0 0 10px;
	line-height: 1.2;
	letter-spacing: -0.02em;
}
.cf__sub {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.72);
	margin: 0;
}

/* ── Form row ─────────────────────────────────────── */
.cf__form {
	display: flex;
	gap: 12px;
	align-items: flex-start;
	flex-wrap: wrap;
	max-width: 820px;
	width: 100%;
	justify-content: center;
}

/* ── AFormItem ────────────────────────────────────────── */
.cf__item {
	flex: 1;
	min-width: 220px;
	max-width: 290px;
	margin-bottom: 0 !important;
}

:deep(.ant-form-item-control-input-content) {
	overflow: visible;
}
.cf__item :deep(.ant-form-item-explain-error) {
	font-size: 11.5px;
	font-weight: 600;
	color: #fff;
	background: rgba(220, 38, 38, 0.55);
	padding: 2px 10px;
	border-radius: 6px;
	display: inline-block;
	backdrop-filter: blur(4px);
	margin-top: 5px;
}
.cf__item :deep(.ant-form-item-label) {
	display: none;
}

/* ── Input: affix wrapper (Ism Familiya — has allow-clear) */
.cf__item :deep(.ant-input-affix-wrapper) {
	height: 52px !important;
	padding: 0 14px !important;
	border-radius: 13px !important;
	border: 2px solid rgba(255, 255, 255, 0.25) !important;
	background: rgba(255, 255, 255, 0.97) !important;
	box-shadow:
		0 2px 16px rgba(0, 0, 60, 0.2),
		inset 0 1px 2px rgba(0, 0, 0, 0.04) !important;
	transition:
		border-color 0.2s,
		box-shadow 0.2s !important;
	display: flex !important;
	align-items: center !important;
}

/* inner <input> inside affix — reset everything */
.cf__item :deep(.ant-input-affix-wrapper > input.ant-input) {
	height: auto !important;
	border: none !important;
	background: transparent !important;
	box-shadow: none !important;
	padding: 3px !important;
	font-family: "Onest", sans-serif !important;
	font-size: 15px !important;
	font-weight: 500 !important;
	color: #0f172a !important;
}

/* ── Input: plain (Phone field — no affix wrapper) */
.cf__item :deep(input.ant-input) {
	height: 52px !important;
	/* border-radius: 13px !important; */
	border: 2px solid rgba(255, 255, 255, 0.25) !important;
	background: rgba(255, 255, 255, 0.97) !important;
	font-family: "Onest", sans-serif !important;
	font-size: 15px !important;
	font-weight: 500 !important;
	color: #0f172a !important;
	box-shadow:
		0 2px 16px rgba(0, 0, 60, 0.2),
		inset 0 1px 2px rgba(0, 0, 0, 0.04) !important;
	transition:
		border-color 0.2s,
		box-shadow 0.2s !important;
	padding: 2px 16px !important;
}

/* Placeholders */
.cf__item :deep(.ant-input::placeholder),
.cf__item :deep(.ant-input-affix-wrapper input::placeholder) {
	color: #b0bec5 !important;
	font-weight: 400 !important;
	font-size: 16px !important;
}

/* Focus */
.cf__item :deep(.ant-input-affix-wrapper-focused),
.cf__item :deep(.ant-input-affix-wrapper:focus-within) {
	border-color: rgba(100, 149, 237, 0.85) !important;
	box-shadow:
		0 0 0 4px rgba(100, 149, 237, 0.2),
		0 2px 16px rgba(0, 0, 60, 0.15) !important;
}
.cf__item :deep(input.ant-input:focus) {
	/* border-color: rgba(100, 149, 237, 0.85) !important; */
	/* box-shadow:
		0 0 0 4px rgba(100, 149, 237, 0.2),
		0 2px 16px rgba(0, 0, 60, 0.15) !important;
	outline: none !important; */
}

/* Error */
.cf__item :deep(.ant-input-affix-wrapper-status-error) {
	border-color: rgba(239, 68, 68, 0.7) !important;
	box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
}
.cf__item :deep(input.ant-input-status-error) {
	border-color: rgba(239, 68, 68, 0.7) !important;
	box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
}

/* Clear icon */
.cf__item :deep(.ant-input-clear-icon) {
	color: #94a3b8;
}

/* ── Button — center-out hover ───────────────────────── */
.cf__btn {
	position: relative;
	overflow: hidden;
	height: 52px !important;
	padding: 0 32px !important;
	border-radius: 16px !important;
	background: rgba(255, 255, 255, 0.12) !important;
	border: 1.5px solid rgba(255, 255, 255, 0.55) !important;
	color: #fff !important;
	font-family: "Onest", sans-serif !important;
	font-size: 14px !important;
	font-weight: 700 !important;
	letter-spacing: 0.01em;
	flex-shrink: 0;
	white-space: nowrap;
	backdrop-filter: blur(8px);
	box-shadow: 0 4px 20px rgba(0, 0, 80, 0.2) !important;
	transition:
		transform 0.2s,
		box-shadow 0.2s,
		border-color 0.2s !important;
	margin-bottom: 24px;
}

/* center-out white overlay */
.cf__btn::before {
	content: "";
	position: absolute;
	inset: 0;
	background: rgba(255, 255, 255, 0.22);
	transform: scaleX(0);
	transform-origin: center;
	transition: transform 280ms ease;
	border-radius: inherit;
	z-index: 0;
}
.cf__btn:hover::before {
	transform: scaleX(1) !important;
}

/* label z-index above overlay */
.cf__btn-label {
	position: relative;
	z-index: 2;
}
.cf__btn :deep(span) {
	position: relative;
	z-index: 2;
}

.cf__btn:hover:not(:disabled) {
	transform: translateY(-2px) !important;
	box-shadow: 0 10px 28px rgba(0, 0, 80, 0.3) !important;
	border-color: rgba(255, 255, 255, 0.85) !important;
}
.cf__btn:active:not(:disabled) {
	transform: translateY(0) !important;
}

/* ── Success ─────────────────────────────────────────── */
.cf__success {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 8px 0;
	justify-content: center;
}
.cf__success-icon {
	width: 56px;
	height: 56px;
	flex-shrink: 0;
}
.cf__success-icon svg {
	width: 56px;
	height: 56px;
}
.cf__check {
	stroke-dasharray: 40;
	stroke-dashoffset: 40;
	animation: draw 0.5s 0.2s ease forwards;
}
@keyframes draw {
	to {
		stroke-dashoffset: 0;
	}
}
.cf__success-text {
	font-size: 20px;
	font-weight: 800;
	color: #fff;
	display: block;
}
.cf__success-sub {
	font-size: 13px;
	color: rgba(255, 255, 255, 0.8);
	display: block;
	margin-top: 3px;
}

/* ── Transitions ─────────────────────────────────────── */
.swap-enter-active {
	transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.swap-leave-active {
	transition: all 0.2s ease;
}
.swap-enter-from {
	opacity: 0;
	transform: translateY(14px) scale(0.96);
}
.swap-leave-to {
	opacity: 0;
	transform: translateY(-10px) scale(0.97);
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 640px) {
	.cf {
		padding: 36px 20px 28px;
		border-radius: 18px;
	}
	.cf__form {
		flex-direction: column;
		align-items: stretch;
	}
	.cf__item {
		min-width: 0;
		max-width: 100%;
		width: 100%;
	}
	.cf__btn {
		width: 100%;
	}
}
</style>
