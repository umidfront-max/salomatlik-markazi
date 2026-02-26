<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
const { locale } = useI18n();


// ── State ─────────────────────────────────────────────────
const CART_KEY = "clinic_cart";
const open = ref(false);
const cart = ref([]);
const justRemoved = ref(null); // id of item being animated out

// ── Helpers ───────────────────────────────────────────────
function readCart() {
	try {
		cart.value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
	} catch {
		cart.value = [];
	}
}

function saveCart() {
	localStorage.setItem(CART_KEY, JSON.stringify(cart.value));
	window.dispatchEvent(
		new CustomEvent("cart-updated", { detail: cart.value }),
	);
}

function removeItem(id) {
	justRemoved.value = id;
	setTimeout(() => {
		cart.value = cart.value.filter((i) => i.id !== id);
		saveCart();
		justRemoved.value = null;
	}, 280);
}

function clearAll() {
	cart.value = [];
	saveCart();
}

// ── Expose open/close ─────────────────────────────────────
function toOpen() {
	readCart();
	open.value = true;
	document.body.classList.add("no-scroll");
}
function toClose() {
	open.value = false;
	document.body.classList.remove("no-scroll");
}
defineExpose({ toOpen, toClose });

// ── Computed ──────────────────────────────────────────────
const total = computed(() =>
	cart.value.reduce(
		(sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
		0,
	),
);

const count = computed(() => cart.value.length);

function itemName(item) {
	if (typeof item.name === "object") return item.name?.[locale?.value] || "";
	return item.name || "";
}

function formatPrice(p) {
	return Number(p || 0).toLocaleString("ru-RU");
}

// ── Booking ───────────────────────────────────────────────
const emit = defineEmits(["booking"]);
function goBooking() {
	toClose();
	emit("booking");
}

// ── Listen to cart-updated event ──────────────────────────
function onCartUpdated(e) {
	cart.value = e.detail || [];
}

onMounted(() => {
	readCart();
	window.addEventListener("cart-updated", onCartUpdated);
});
onBeforeUnmount(() => {
	window.removeEventListener("cart-updated", onCartUpdated);
});

// ── ESC key ───────────────────────────────────────────────
function onKey(e) {
	if (e.key === "Escape" && open.value) toClose();
}
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<template>
	<!-- Overlay -->
	<Teleport to="body">
		<Transition name="cart-overlay">
			<div v-if="open" class="cart-overlay" @click.self="toClose" />
		</Transition>

		<!-- Drawer -->
		<Transition name="cart-drawer">
			<div v-if="open" class="cart-drawer" role="dialog" aria-modal="true">
				<!-- Header -->
				<div class="cd__head">
					<div class="cd__head-left">
						<i class="ri-shopping-bag-3-line cd__head-icon"></i>
						<div>
							<h2 class="cd__title">{{ $t("cart.title") }}</h2>
							<span class="cd__count">
								{{ $t("cart.count", { count }) }}
							</span>
						</div>
					</div>
					<button
						class="cd__close"
						@click="toClose"
						:aria-label="$t('cart.close')"
					>
						<i class="ri-close-line"></i>
					</button>
				</div>

				<!-- Empty state -->
				<div v-if="count === 0" class="cd__empty">
					<div class="cd__empty-icon">
						<i class="ri-shopping-cart-2-line"></i>
					</div>
					<p class="cd__empty-text">{{ $t("cart.empty.title") }}</p>
					<p class="cd__empty-sub">{{ $t("cart.empty.subtitle") }}</p>
				</div>

				<!-- List -->
				<div v-else class="cd__list">
					<TransitionGroup name="cart-item" tag="ul" class="cd__items">
						<li
							v-for="item in cart"
							:key="item.id"
							class="cd__item"
							:class="{ 'is-removing': justRemoved === item.id }"
						>
							<!-- Service image -->
							<div class="row-icon">
								<i class="ri-heart-pulse-fill"></i>
							</div>

							<!-- Info -->
							<div class="cd__item-info">
								<span class="cd__item-name">{{ itemName(item) }}</span>
								<div class="cd__item-prices">
									<span v-if="item.hasDiscount" class="cd__item-old">
										{{ formatPrice(item.originalPrice) }}
										{{ $t("cart.currency") }}
									</span>
									<span class="cd__item-price">
										{{ formatPrice(item.price) }}
										{{ $t("cart.currency") }}
									</span>
									<span
										v-if="item.hasDiscount && item.discountPercentage"
										class="cd__item-badge"
									>
										−{{ item.discountPercentage }}%
									</span>
								</div>
							</div>

							<!-- Remove -->
							<button
								class="cd__item-remove"
								@click="removeItem(item.id)"
								aria-label="O'chirish"
							>
								<i class="ri-close-line"></i>
							</button>
						</li>
					</TransitionGroup>

					<!-- Divider -->
					<div class="cd__divider"></div>

					<!-- Total -->
					<div class="cd__total">
						<span class="cd__total-label">{{ $t("cart.total") }}:</span>
						<span class="cd__total-price">
							{{ formatPrice(total) }} {{ $t("cart.currency") }}
						</span>
					</div>
				</div>

				<!-- Footer -->
				<div class="cd__footer">
					<button v-if="count > 0" class="cd__clear" @click="clearAll">
						<i class="ri-delete-bin-6-line"></i>
						{{ $t("cart.clear") }}
					</button>

					<Btn
						class="card-info__button"
						:data-text="$t('booking')"
						:disabled="count === 0"
						@click="goBooking"
					>
						<!-- <i class="ri-calendar-check-line"></i> -->
						{{ $t("booking") }}
					</Btn>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

// ── Overlay ───────────────────────────────────────────────
.cart-overlay {
	position: fixed;
	inset: 0;
	z-index: 14000;
	background: rgba(10, 20, 48, 0.45);
	backdrop-filter: blur(4px);
}

// ── Drawer ────────────────────────────────────────────────
.cart-drawer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 14001;
	width: min(440px, 100vw);
	background: #fff;
	display: flex;
	flex-direction: column;
	box-shadow: -8px 0 48px rgba(10, 20, 48, 0.14);
}

// ── Transitions ───────────────────────────────────────────
.cart-overlay-enter-active,
.cart-overlay-leave-active {
	transition: opacity 0.3s ease;
}
.cart-overlay-enter-from,
.cart-overlay-leave-to {
	opacity: 0;
}
.row-icon {
	width: 44px;
	height: 44px;
	border-radius: 12px;
	background: #e8f1ff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	overflow: hidden;
	flex-shrink: 0;
	i {
		color: rgba(20, 63, 150, 0.92);
	}
	@include devices(sm) {
		display: none;
	}
}
.cart-drawer-enter-active {
	transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}
.cart-drawer-leave-active {
	transition: transform 0.28s cubic-bezier(0.55, 0, 1, 0.45);
}
.cart-drawer-enter-from,
.cart-drawer-leave-to {
	transform: translateX(100%);
}

// Item transitions
.cart-item-enter-active {
	transition: all 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.cart-item-leave-active {
	transition: all 0.26s cubic-bezier(0.55, 0, 1, 0.45);
	position: absolute;
	width: 100%;
}
.cart-item-enter-from {
	opacity: 0;
	transform: translateX(24px);
}
.cart-item-leave-to {
	opacity: 0;
	transform: translateX(40px) scale(0.96);
}
.cart-item-move {
	transition: transform 0.3s ease;
}

// ── Head ─────────────────────────────────────────────────
.cd__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24px 24px 20px;
	border-bottom: 1px solid #f0f4f8;
	flex-shrink: 0;
}

.cd__head-left {
	display: flex;
	align-items: center;
	gap: 14px;
}

.cd__head-icon {
	font-size: 28px;
	color: var(--blue-4);
	background: #eff6ff;
	width: 52px;
	height: 52px;
	border-radius: 16px;
	display: grid;
	place-items: center;
	flex-shrink: 0;
}

.cd__title {
	font-size: 18px;
	font-weight: 600;
	color: #0f172a;
	letter-spacing: -0.015em;
}

.cd__count {
	font-size: 13px;
	color: #64748b;
	font-weight: 500;
}

.cd__close {
	width: 42px;
	height: 42px;
	border-radius: 12px;
	border: 1.5px solid #e2e8f0;
	background: #f8fafc;
	color: #64748b;
	cursor: pointer;
	display: grid;
	place-items: center;
	transition: all 0.18s;
	flex-shrink: 0;

	i {
		font-size: 20px;
	}

	&:hover {
		border-color: #cbd5e1;
		background: #f1f5f9;
		color: #0f172a;
		transform: scale(1.06);
	}
}

// ── Empty ─────────────────────────────────────────────────
.cd__empty {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 24px;
	text-align: center;
}

.cd__empty-icon {
	width: 88px;
	height: 88px;
	border-radius: 24px;
	background: #f1f5f9;
	display: grid;
	place-items: center;
	margin-bottom: 20px;

	i {
		font-size: 44px;
		color: #94a3b8;
	}
}

.cd__empty-text {
	font-size: 18px;
	font-weight: 700;
	color: #0f172a;
	margin: 0 0 8px;
}

.cd__empty-sub {
	font-size: 14px;
	color: #94a3b8;
	margin: 0;
	line-height: 1.6;
}

// ── List ─────────────────────────────────────────────────
.cd__list {
	flex: 1;
	overflow-y: auto;
	padding: 16px 24px;
	display: flex;
	flex-direction: column;
	position: relative;

	&::-webkit-scrollbar {
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 99px;
	}
}

.cd__items {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 4px;
	position: relative;
}

// ── Item ─────────────────────────────────────────────────
.cd__item {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 14px 12px;
	border-radius: 14px;
	border: 1px solid transparent;
	transition:
		background 0.18s,
		border-color 0.18s;

	&:hover {
		background: #f8faff;
		border-color: #e8edf6;
	}

	&.is-removing {
		opacity: 0.4;
		pointer-events: none;
	}
}

.cd__item-img {
	width: 52px;
	height: 52px;
	border-radius: 12px;
	overflow: hidden;
	background: #f1f5f9;
	flex-shrink: 0;
	display: grid;
	place-items: center;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	i {
		font-size: 24px;
		color: #93c5fd;
	}
}

.cd__item-info {
	flex: 1;
	min-width: 0;
}

.cd__item-name {
	display: block;
	font-size: 14px;
	font-weight: 600;
	color: #0f172a;
	line-height: 1.35;
	margin-bottom: 6px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.cd__item-prices {
	display: flex;
	align-items: center;
	gap: 6px;
	flex-wrap: wrap;
}

.cd__item-old {
	font-size: 12px;
	color: #94a3b8;
	text-decoration: line-through;
}

.cd__item-price {
	font-size: 14px;
	font-weight: 700;
	color: var(--blue-4);
}

.cd__item-badge {
	font-size: 11px;
	font-weight: 700;
	color: #dc2626;
	background: #fef2f2;
	padding: 2px 7px;
	border-radius: 999px;
}

.cd__item-remove {
	width: 32px;
	height: 32px;
	border-radius: 8px;
	border: 1.5px solid #e2e8f0;
	background: transparent;
	color: #94a3b8;
	cursor: pointer;
	display: grid;
	place-items: center;
	flex-shrink: 0;
	transition: all 0.16s;

	i {
		font-size: 16px;
	}

	&:hover {
		border-color: #fca5a5;
		background: #fef2f2;
		color: #dc2626;
		transform: scale(1.08);
	}
}

// ── Divider + Total ───────────────────────────────────────
.cd__divider {
	height: 1px;
	background: #f0f4f8;
	margin: 16px 0;
}

.cd__total {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 12px;
}

.cd__total-label {
	font-size: 15px;
	font-weight: 600;
	color: #64748b;
}

.cd__total-price {
	font-size: 22px;
	font-weight: 700;
	color: #0f172a;
	letter-spacing: -0.02em;
}

// ── Footer ────────────────────────────────────────────────
.cd__footer {
	padding: 16px 24px 24px;
	border-top: 1px solid #f0f4f8;
	display: flex;
	flex-direction: column;
	gap: 10px;
	flex-shrink: 0;
}

.cd__clear {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	height: 42px;
	border-radius: 12px;
	border: 1.5px solid #e2e8f0;
	background: transparent;
	color: #94a3b8;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.18s;

	i {
		font-size: 16px;
	}

	&:hover {
		border-color: #fca5a5;
		color: #dc2626;
		background: #fef2f2;
	}
}
.card-info__button {
	height: var(--size-btn-52);
	border: none;
	outline: none;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.25s ease;
	&:hover {
		// background-color: darken((--blue-4), 10%);
		// transform: translateY(-2px);
		box-shadow: 0 10px 26px rgba(51, 193, 237, 0.35);
	}

	&::before {
		display: block;
		width: 100%;
		padding-right: 36px;
		padding-left: 12px;
		margin-top: 15px;
	}
}
</style>
