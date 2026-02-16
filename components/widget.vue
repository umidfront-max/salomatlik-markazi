<script setup>
import { toGetNumber } from "~/utilities/mixins";
const { list: setting } = useSetting();
const { list: socials } = useSocial();
const isOpen = ref(false);
const isModalOpen = ref(false);
const messageModalVisible = ref(false);
const messageModalType = ref("success");
const { locale } = useI18n();

const toggleWidget = () => {
	isOpen.value = !isOpen.value;
};

const openModal = () => {
	isModalOpen.value = true;
};

const handleSuccess = () => {
	messageModalType.value = "success";
	messageModalVisible.value = true;
};

const handleError = () => {
	messageModalType.value = "error";
	messageModalVisible.value = true;
};

// Animatsiya uchun har bir itemni kechiktirish
const getItemStyle = (index) => {
	return {
		transitionDelay: `${index * 80}ms`,
	};
};
onMounted(() => {
	console.log("updated");
});
const telegram = computed(() =>
	socials.find((item) => item.icon === "telegram"),
);
</script>
<template>
	<div class="widget">
		<Transition>
			<div v-if="isOpen" class="widget-items">
				<a
					:href="setting.addressLink?.[locale]"
					target="_blank"
					class="widget-item"
					:style="getItemStyle(4)"
				>
					<Icon name="location" class="widget-item__icon" />
					<span class="widget-item__text">{{
						$t("widget.ourAddress")
					}}</span>
				</a>

				<a
					:href="setting.whatsapp?.[locale]"
					target="_blank"
					class="widget-item"
					:style="getItemStyle(3)"
				>
					<Icon name="whatsapp" class="widget-item__icon" />
					<span class="widget-item__text">Whatsapp</span>
				</a>
				<a
					:href="setting.instagram?.[locale]"
					target="_blank"
					class="widget-item"
					:style="getItemStyle(3)"
				>
					<i class="ri-instagram-line widget-item__icon"></i>
					<span class="widget-item__text">Instagram</span>
				</a>

				<button
					class="widget-item"
					:style="getItemStyle(2)"
					@click="openModal"
				>
					<Icon name="telephone" class="widget-item__icon" />
					<span class="widget-item__text">{{
						$t("widget.callback")
					}}</span>
				</button>
				<a
					:href="setting.telegram?.[locale]"
					target="_blank"
					class="widget-item"
					:style="getItemStyle(1)"
				>
					<Icon name="telegram" class="widget-item__icon" />
					<span class="widget-item__text">{{
						$t("widget.sendMessage")
					}}</span>
				</a>
			</div>
		</Transition>
		<!-- Main Toggle Button -->
		<button
			class="widget-toggle"
			:class="{ active: isOpen }"
			@click="toggleWidget"
		>
			<span class="widget-toggle__text">{{ $t("widget.help") }}</span>
			<Icon name="chevron-up" class="widget-toggle__icon" />
		</button>

		<!-- Quick Apply Form -->
		<FormQuickApply
			v-model:visible="isModalOpen"
			@success="handleSuccess"
			@error="handleError"
		/>

		<!-- Message Modal -->
		<ModalMessage
			v-model:visible="messageModalVisible"
			:type="messageModalType"
		/>
	</div>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.widget {
	position: fixed;
	bottom: 32px;
	right: 24px;
	z-index: 9;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 12px;
}

.widget-items {
	display: flex;
	flex-direction: column-reverse;
	gap: 12px;
	margin-bottom: 4px;
}

.widget-item {
	display: flex;
	align-items: center;
	gap: 12px;
	background: var(--blue-4);
	color: white;
	border: none;
	border-radius: 100px;
	padding: 14px 24px 14px 14px;
	cursor: pointer;
	text-decoration: none;
	white-space: nowrap;
	box-shadow: 0 4px 16px rgba(82, 115, 227, 0.3);
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease,
		background 0.3s ease;
	animation: slideUpItem 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	width: max-content;
	margin-left: auto;
	will-change: transform;

	&__icon {
		--icon-size: 24px;
		font-size: 22px;
      line-height: 1;
		--icon-color: white;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__text {
		font-size: 16px;
		font-weight: 500;
		color: white;
	}

	&:hover {
		transform: translateY(-3px) scale(1.03) !important;
		box-shadow: 0 8px 24px rgba(88, 159, 236, 0.5) !important;
	}

	&:active {
		transform: translateY(-1px) scale(0.98) !important;
	}

	@include devices(sm) {
		padding: 12px 20px 12px 12px;
		gap: 10px;

		&__text {
			font-size: 14px;
		}

		&__icon {
			--icon-size: 20px;
		}
	}
}

.widget-toggle {
	display: flex;
	align-items: center;
	gap: 10px;
	background: var(--blue-4);
	color: white;
	border: none;
	border-radius: 100px;
	padding: 12px 28px;
	cursor: pointer;
	box-shadow: 0 6px 20px rgba(73, 105, 211, 0.35);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&__text {
		font-size: 18px;
		font-weight: 600;
		color: white;
	}

	&__icon {
		--icon-size: 24px;
		--icon-color: white;
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&.active &__icon {
		transform: rotate(180deg);
	}

	&:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 28px rgba(68, 117, 191, 0.45);
	}

	&:active {
		transform: translateY(-1px);
	}

	@include devices(sm) {
		padding: 14px 22px;

		&__text {
			font-size: 16px;
		}

		&__icon {
			--icon-size: 18px;
		}
	}
}

// Ochilish animatsiyasi
.v-enter-active {
	transition: opacity 0.3s ease;
}

.v-leave-active {
	transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

// Item animatsiyalari - pastdan tepaga
@keyframes slideUpItem {
	from {
		opacity: 0;
		transform: translateY(30px) scale(0.85);
	}

	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.v-leave-active .widget-item {
	animation: slideDownItem 0.3s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}

@keyframes slideDownItem {
	from {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	to {
		opacity: 0;
		transform: translateY(30px) scale(0.85);
	}
}
</style>
