<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const { locale } = useI18n();

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
	to: {
		type: String,
		default: null,
	},
	index: {
		type: Number,
		default: 0,
	},
});

// ── Cart ──────────────────────────────────────────────────
const CART_KEY = "clinic_cart";

function getCart() {
	try {
		return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
	} catch {
		return [];
	}
}

const isInCart = ref(false);
const rippling = ref(false);

// Sync isInCart from current cart state
function syncState(cartArr) {
	isInCart.value = (cartArr ?? getCart()).some(
		(item) => item.id === props.data?.id,
	);
}

// Listen to cart-updated so drawer removes are reflected here too
function onCartUpdated(e) {
	syncState(e.detail);
}

onMounted(() => {
	syncState();
	window.addEventListener("cart-updated", onCartUpdated);
});

onBeforeUnmount(() => {
	window.removeEventListener("cart-updated", onCartUpdated);
});

function toggleCart(e) {
	e.preventDefault();
	e.stopPropagation();

	rippling.value = true;
	setTimeout(() => (rippling.value = false), 500);

	const cart = getCart();
	const idx = cart.findIndex((item) => item.id === props.data?.id);

	if (idx === -1) {
		cart.push({
			id: props.data?.id,
			name: props.data?.name,
			price: props.data?.hasDiscount
				? props.data?.discountedPrice
				: props.data?.price,
			originalPrice: props.data?.price,
			hasDiscount: props.data?.hasDiscount,
			discountPercentage: props.data?.discountPercentage,
			image: props.data?.image,
			department: props.data?.department,
			durationMinutes: props.data?.durationMinutes,
			quantity: 1,
		});
		isInCart.value = true;
	} else {
		cart.splice(idx, 1);
		isInCart.value = false;
	}

	localStorage.setItem(CART_KEY, JSON.stringify(cart));
	window.dispatchEvent(new CustomEvent("cart-updated", { detail: cart }));
}

// ── Computed ───────────────────────────────────────────────
const name = computed(() => props.data?.name?.[locale?.value] || "");
const departmentTitle = computed(
	() => props.data?.department?.title?.[locale?.value] || "",
);

const descPlain = computed(() =>
	(props.data?.description?.[locale?.value] || "")
		.replace(/<[^>]*>/g, "")
		.trim(),
);

const displayPrice = computed(() => {
	const p = props.data?.hasDiscount
		? props.data?.discountedPrice
		: props.data?.price;
	if (p == null) return null;
	return Number(p).toLocaleString("ru-RU");
});

const originalPrice = computed(() => {
	if (!props.data?.hasDiscount) return null;
	return Number(props.data?.price).toLocaleString("ru-RU");
});

const animDelay = computed(() => `${(props.index || 0) * 80}ms`);
</script>

<template>
	<div class="sc" :style="{ '--delay': animDelay }">
		<!-- Discount badge -->
		<div
			v-if="data?.hasDiscount && data?.discountPercentage"
			class="sc__badge"
		>
			<i class="ri-price-tag-3-fill"></i>
			−{{ data.discountPercentage }}%
		</div>

		<!-- Image -->
		<div class="sc__img-wrap">
			<img
				v-if="data?.image"
				:src="data.image"
				:alt="name"
				class="sc__img"
			/>
			<div v-else class="sc__img-placeholder">
				<i class="ri-stethoscope-line"></i>
			</div>
			<!-- Department tag -->
			<div v-if="departmentTitle" class="sc__dept">
					<span v-if="data?.durationMinutes" class="sc__meta-item">
						<i class="ri-time-line"></i>
						{{ data.durationMinutes }} min
					</span>
			</div>
		</div>

		<!-- Body -->
		<div class="sc__body">
			<h3 class="sc__name">{{ name }}</h3>
			<p v-if="descPlain" class="sc__desc">{{ descPlain }}</p>

			<!-- Meta -->
			<!-- <div class="sc__meta">
				<span v-if="data?.durationMinutes" class="sc__meta-item">
					<i class="ri-time-line"></i>
					{{ data.durationMinutes }} min
				</span>
			</div> -->
		</div>

		<!-- Footer: price + cart -->
		<div class="sc__footer">
			<div class="sc__price-wrap">
				<span v-if="originalPrice" class="sc__old-price">
					{{ originalPrice }} so'm
				</span>
				<span v-if="displayPrice" class="sc__price">
					{{ displayPrice }}
					<span class="sc__currency">so'm</span>
				</span>
				<span v-else class="sc__price sc__price--free">Bepul</span>
			</div>

			<button
				class="sc__cart-btn"
				:class="{
					'sc__cart-btn--added': isInCart,
					'sc__cart-btn--ripple': rippling,
				}"
				@click="toggleCart"
				:title="
					isInCart ? 'Korzinkadan olib tashlash' : 'Korzinkaga qo\'shish'
				"
			>
				<i v-if="isInCart" class="ri-check-line"></i>
				<i v-else class="ri-shopping-cart-2-line"></i>
				<span>{{ isInCart ? "Qo'shildi" : "Qo'shish" }}</span>
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
@keyframes card-in {
	from {
		opacity: 0;
		transform: translateY(28px) scale(0.97);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}
@keyframes ripple-pop {
	0% {
		transform: scale(1);
	}
	40% {
		transform: scale(0.91);
	}
	70% {
		transform: scale(1.07);
	}
	100% {
		transform: scale(1);
	}
}
@keyframes badge-in {
	from {
		opacity: 0;
		transform: translateX(2px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.sc {
	position: relative;
	display: flex;
   height: 100%;
	flex-direction: column;
	background: #ffffff;
	border-radius: 20px;
	overflow: hidden;
	border: 1px solid #e9eef6;
	box-shadow:
		0 2px 8px rgba(15, 23, 42, 0.04),
		0 1px 2px rgba(15, 23, 42, 0.06);
	color: inherit;
	cursor: pointer;
	transition:
		box-shadow 0.48s cubic-bezier(0.22, 1, 0.36, 1),
		transform 0.48s cubic-bezier(0.22, 1, 0.36, 1),
		border-color 0.4s;
	animation: card-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
	animation-delay: var(--delay, 0ms);

	&:hover {
		box-shadow:
			0 16px 48px rgba(37, 99, 235, 0.12),
			0 2px 8px rgba(15, 23, 42, 0.06);
		// transform: translateY(-1px);
		border-color: #bfdbfe;
	}
	&:hover .sc__img {
		transform: scale(1.06);
	}
	&:hover .sc__cart-btn:not(.sc__cart-btn--added) {
		background: #2563eb;
		color: #fff;
		border-color: #2563eb;
	}
}

.sc__badge {
	position: absolute;
	top: 14px;
	right: 14px;
	z-index: 3;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	background: linear-gradient(135deg, #ef4444, #dc2626);
	color: #fff;
	font-size: 12px;
	font-weight: 700;
	padding: 5px 11px 5px 8px;
	border-radius: 999px;
	letter-spacing: 0.02em;
	box-shadow: 0 3px 10px rgba(220, 38, 38, 0.38);
	animation: badge-in 0.4s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
	i {
		font-size: 13px;
	}
}

.sc__img-wrap {
	position: relative;
	width: 100%;
	height: 155px;
	overflow: hidden;
	background: #f1f5f9;
	flex-shrink: 0;
}
.sc__img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	display: block;
}
.sc__img-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
	i {
		font-size: 54px;
		color: #93c5fd;
	}
}
.sc__dept {
	position: absolute;
	bottom: 12px;
	left: 12px;
	display: inline-flex;
	align-items: center;
	gap: 5px;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	color: #1d4ed8;
	font-size: 12px;
	font-weight: 600;
	padding: 3px 8px;
	border-radius: 999px;
	border: 1px solid rgba(37, 99, 235, 0.18);
	i {
		font-size: 13px;
	}
}

.sc__body {
	padding: 10px 10px 8px;
	flex: 1;
}
.sc__name {
	font-size: 17px;
	font-weight: 600;
	color: #0f172a;
	line-height: 1.35;
	margin: 0 0 4px;
	letter-spacing: -0.015em;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.sc__desc {
	font-size: 13.5px;
	color: #64748b;
	line-height: 1.6;
	margin: 0 0 6px;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.sc__meta {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}
.sc__meta-item {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 12.5px;
	font-weight: 500;
	color: var(--blue-4);
	i {
		font-size: 14px;
	}
}

.sc__footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 10px 10px;
	border-top: 1px solid #f1f5f9;
}
.sc__price-wrap {
	display: flex;
	flex-direction: column;
	gap: 2px;
}
.sc__old-price {
	font-size: 12px;
	color: #94a3b8;
	text-decoration: line-through;
	line-height: 1;
}
.sc__price {
	font-size: 19px;
	font-weight: 700;
	color: #0f172a;
	line-height: 1.15;
	letter-spacing: -0.02em;
	&--free {
		color: #16a34a;
	}
}
.sc__currency {
	font-size: 13px;
	font-weight: 500;
	color: #64748b;
	margin-left: 2px;
}

.sc__cart-btn {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 9px 16px;
	border-radius: 12px;
	border: 1.5px solid #e2e8f0;
	background: #f8fafc;
	color: #475569;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	white-space: nowrap;
	transition:
		background 0.22s cubic-bezier(0.22, 1, 0.36, 1),
		border-color 0.22s cubic-bezier(0.22, 1, 0.36, 1),
		color 0.22s cubic-bezier(0.22, 1, 0.36, 1),
		box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1);

	i {
		font-size: 17px;
		transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
	}
	&:hover i {
		transform: scale(1.2);
	}
	&:active {
		transform: scale(0.96);
	}

	&--added {
		background: #eff6ff;
		border-color: #bfdbfe;
		color: #2563eb;
		i {
			color: #2563eb;
		}

		&:hover {
			background: #fee2e2 !important;
			border-color: #fca5a5 !important;
			color: #dc2626 !important;
			i {
				color: #dc2626 !important;
			}
		}
	}
	&--ripple {
		animation: ripple-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
	}
}
</style>
