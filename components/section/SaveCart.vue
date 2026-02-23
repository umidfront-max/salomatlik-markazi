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

// ── Rules (xuddi BookingModal pattern) ───────────────────
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

// ── Phone focus/blur (xuddi BookingModal) ────────────────
function onPhoneFocus() {
	if (!form.phone) form.phone = "+998 ";
}
function onPhoneBlur() {
	if (form.phone === "+998 ") form.phone = "";
}

// ── Submit ────────────────────────────────────────────────
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
		<!-- Animated bg shapes -->
		<div class="cf__bg">
			<span class="cf__shape cf__shape--1" />
			<span class="cf__shape cf__shape--2" />
			<span class="cf__shape cf__shape--3" />
			<span class="cf__shape cf__shape--4" />
		</div>

		<div class="cf__inner">
			<!-- Text -->
			<div class="cf__text">
				<h2 class="cf__title">
					{{ $t("form.title") }}
				</h2>
				<p class="cf__sub">
					{{ $t("form.subtitle") }}
				</p>
			</div>

			<!-- Form / Success -->
			<Transition name="swap" mode="out-in">
				<!-- Success -->
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

				<!-- AForm -->
				<AForm
					v-else
					key="form"
					ref="formRef"
					layout="vertical"
					:model="form"
					:rules="rules"
					class="cf__form"
				>
					<!-- Full name -->
					<AFormItem name="fullName" class="cf__item">
						<AInput
							v-model:value="form.fullName"
							:placeholder="$t('form.fullName') || 'Ваше имя'"
							class="cf__input"
							allow-clear
						/>
					</AFormItem>

					<!-- Phone -->
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

					<!-- Submit -->
					<AButton
						type="primary"
						:loading="loading"
						class="cf__btn"
						@click="toSubmit"
					>
						<template v-if="!loading">{{
							$t("submitApplication")
						}}</template>
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
		120deg,
		#12c2ce 0%,
		#1ad4cc 45%,
		#00bcd4 75%,
		#0097a7 100%
	);
	max-width: 1320px;
	width: 100%;
	margin: 0px auto;
	padding: 48px 40px;
	border-radius: 22px;
	isolation: isolate;
	min-height: 270px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 100%;
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
	background: rgba(255, 255, 255, 0.13);
}
.cf__shape--1 {
	width: 340px;
	height: 340px;
	top: -110px;
	right: -80px;
	animation: drift1 9s ease-in-out infinite alternate;
}
.cf__shape--2 {
	width: 220px;
	height: 220px;
	bottom: -70px;
	right: 18%;
	background: rgba(255, 255, 255, 0.09);
	animation: drift2 12s ease-in-out infinite alternate;
}
.cf__shape--3 {
	width: 120px;
	height: 120px;
	top: 30px;
	left: 42%;
	background: rgba(255, 255, 255, 0.07);
	animation: drift1 7s ease-in-out infinite alternate-reverse;
}
.cf__shape--4 {
	width: 80px;
	height: 80px;
	bottom: 10px;
	left: 60px;
	background: rgba(255, 255, 255, 0.1);
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
}

/* ── Text ────────────────────────────────────────────── */
.cf__text {
	margin-bottom: 24px;
}

.cf__title {
	font-size: clamp(20px, 2.8vw, 34px);
	font-weight: 700;
	color: #fff;
	margin: 0 0 8px;
	line-height: 1.2;
	letter-spacing: -0.02em;
}
.cf__title em {
	font-style: normal;
	position: relative;
}
.cf__title em::after {
	content: "";
	position: absolute;
	bottom: 1px;
	left: 0;
	width: 100%;
	height: 2.5px;
	background: rgba(255, 255, 255, 0.55);
	border-radius: 2px;
	transform-origin: left;
	animation: ul-in 0.7s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes ul-in {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}

.cf__sub {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.78);
	margin: 0;
}

/* ── Form row ─────────────────────────────────────── */
.cf__form {
	display: flex;
	gap: 12px;
	align-items: flex-start;
	flex-wrap: wrap;
	max-width: 900px;
	width: 100%;
}

/* ── AFormItem: label va error olib tashlash ────────── */
.cf__item {
	flex: 1;
	min-width: 190px;
	margin-bottom: 0 !important;
}

:deep(.ant-form-item-control-input-content) {
	overflow: hidden;
}
/* Error xabarini tashqariga chiqarish */
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

/* ── White input ─────────────────────────────────────── */
.cf__input,
.cf__item :deep(.ant-input),
.cf__item :deep(.ant-input-affix-wrapper) {
	height: 52px;
	border-radius: 13px !important;
	border: 2px solid transparent !important;
	background: #ffffff !important;
	font-family: "Onest", sans-serif !important;
	font-size: 14px !important;
	font-weight: 500 !important;
	color: #0f172a !important;
	box-shadow: none !important;
	transition:
		border-color 0.2s,
		box-shadow 0.2s !important;
	padding: 0 14px !important;
}

.cf__item :deep(.ant-input::placeholder),
.cf__item :deep(.ant-input-affix-wrapper .ant-input::placeholder) {
	color: #94a3b8;
	font-weight: 400;
}

/* Focus ring via outline trick */
.cf__item :deep(.ant-input:focus),
.cf__item :deep(.ant-input-affix-wrapper-focused) {
	border-color: rgba(255, 255, 255, 0.7) !important;
	box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.22) !important;
}

/* Error state border */
.cf__item :deep(.ant-input-status-error),
.cf__item :deep(.ant-input-affix-wrapper-status-error) {
	border-color: rgba(239, 68, 68, 0.6) !important;
	box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

/* Clear icon color */
.cf__item :deep(.ant-input-clear-icon) {
	color: #94a3b8;
}

/* ── Button ──────────────────────────────────────────── */
.cf__btn {
	height: 52px !important;
	padding: 0 28px !important;
	border-radius: 13px !important;
	background: #fff !important;
	border-color: #fff !important;
	color: #0597a7 !important;
	font-family: "Onest", sans-serif !important;
	font-size: 14px !important;
	font-weight: 700 !important;
	flex-shrink: 0;
	white-space: nowrap;
	overflow: hidden;
	position: relative;
	box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3) !important;
	transition:
		transform 0.2s,
		box-shadow 0.2s !important;
	margin-bottom: 24px; /* align with AFormItem margin */
}

/* shimmer ::before */
.cf__btn::before {
	content: "";
	position: absolute;
	top: 0;
	left: -100%;
	width: 60%;
	height: 100%;
	background: linear-gradient(
		90deg,
		transparent,
		rgba(255, 255, 255, 0.55),
		transparent
	);
	animation: shimmer 2.8s ease-in-out infinite;
	pointer-events: none;
}

/* glow ring ::after */
.cf__btn::after {
	content: "";
	position: absolute;
	inset: -3px;
	border-radius: 16px;
	background: linear-gradient(
		135deg,
		rgba(255, 255, 255, 0.55),
		rgba(255, 255, 255, 0)
	);
	opacity: 0;
	transition: opacity 0.3s;
	z-index: -1;
}
.cf__btn:hover::after {
	opacity: 1 !important;
}

@keyframes shimmer {
	0% {
		left: -100%;
		opacity: 0;
	}
	20% {
		opacity: 1;
	}
	60% {
		left: 160%;
		opacity: 1;
	}
	61% {
		opacity: 0;
	}
	100% {
		left: 160%;
		opacity: 0;
	}
}

.cf__btn:hover:not(:disabled) {
	transform: translateY(-2px) !important;
	box-shadow: 0 10px 32px rgba(255, 255, 255, 0.45) !important;
	background: #f0fdff !important;
}
.cf__btn:active:not(:disabled) {
	transform: translateY(0) !important;
}

/* ── Privacy ─────────────────────────────────────────── */
.cf__privacy {
	margin-top: 10px;
	font-size: 11.5px;
	color: rgba(255, 255, 255, 0.6);
}
.cf__privacy-link {
	color: rgba(255, 255, 255, 0.85);
	text-decoration: underline;
	text-underline-offset: 2px;
	transition: color 0.15s;
}
.cf__privacy-link:hover {
	color: #fff;
}

/* ── Success ─────────────────────────────────────────── */
.cf__success {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 8px 0;
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
		padding: 32px 20px 24px;
		border-radius: 18px;
	}
	.cf__form {
		flex-direction: column;
	}
	.cf__item {
		min-width: 0;
		width: 100%;
	}
	.cf__btn {
		width: 100%;
	}
}
</style>
