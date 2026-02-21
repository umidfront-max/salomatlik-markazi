<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
const { locale } = useI18n();

const props = defineProps({
	list: {
		type: Array,
		default: () => [],
	},
});

// First item is "Most Popular"
const popular = computed(() => props.list?.[0] ?? null);
const otherServices = computed(() => props.list ?? []);

const formatPrice = (val) => {
	if (!val && val !== 0) return "—";
	return Number(val).toLocaleString("uz-UZ");
};

// ── Cart (localStorage + toggle) ──────────────────────────
const CART_KEY = "clinic_cart";

function getCart() {
	try {
		return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
	} catch {
		return [];
	}
}

// Track which service IDs are in cart
const cartIds = ref(new Set());
const rippling = ref(null); // service id currently rippling

function syncCart(cartArr) {
	const arr = cartArr ?? getCart();
	cartIds.value = new Set(arr.map((i) => i.id));
}

function onCartUpdated(e) {
	syncCart(e.detail);
}

onMounted(() => {
	syncCart();
	window.addEventListener("cart-updated", onCartUpdated);
});

onBeforeUnmount(() => {
	window.removeEventListener("cart-updated", onCartUpdated);
});

const isInCart = (service) => cartIds.value.has(service?.id);

function toggleCart(service, e) {
	if (e) {
		e.preventDefault();
		e.stopPropagation();
	}

	rippling.value = service.id;
	setTimeout(() => (rippling.value = null), 500);

	const cart = getCart();
	const idx = cart.findIndex((item) => item.id === service.id);

	if (idx === -1) {
		cart.push({
			id: service.id,
			name: service.name,
			price: service.hasDiscount ? service.discountedPrice : service.price,
			originalPrice: service.price,
			hasDiscount: service.hasDiscount,
			discountPercentage: service.discountPercentage,
			image: service.image,
			department: service.department,
			durationMinutes: service.durationMinutes,
			quantity: 1,
		});
	} else {
		cart.splice(idx, 1);
	}

	localStorage.setItem(CART_KEY, JSON.stringify(cart));
	window.dispatchEvent(new CustomEvent("cart-updated", { detail: cart }));
	syncCart(cart);
}

// Icon map by index for variety
const icons = ["✏️", "🦷", "❤️", "💉", "🔬", "🩺", "💊", "🧬"];
const getIcon = (index) => icons[index % icons.length];

const getBadge = (service, index) => {
	if (service.hasDiscount && service.discountPercentage >= 20)
		return { label: `Save ${service.discountPercentage}%`, color: "orange" };
	if (index === 0) return { label: "24-48h results", color: "green" };
	if (index === 1) return { label: "New patients", color: "blue" };
	if (index === 2) return { label: "Bundle", color: "teal" };
	if (index === 3) return { label: "Limited", color: "amber" };
	return null;
};
</script>

<template>
	<div class="sp-wrap">
		<!-- LEFT: Popular Card -->
		<div v-if="popular" class="popular-card">
			<div class="popular-badge">{{ $t("service.MOSTPOPULAR") }}</div>
			<div class="popular-save" v-if="popular.hasDiscount">
				{{ $t("service.save") }} {{ popular.discountPercentage }}%
			</div>

			<div class="popular-header">
				<div class="row-icon">
					<i class="ri-heart-pulse-fill"></i>
				</div>
				<div>
					<h3 class="popular-title">{{ popular.name?.[locale] }}</h3>
				</div>
			</div>

			<div class="popular-desc" v-html="popular.description?.[locale]"></div>

			<div class="popular-pricing">
				<!-- <span class="popular-label">From</span> -->
				<div class="popular-price-row">
					<span class="popular-price">
						{{
							formatPrice(
								popular.hasDiscount
									? popular.discountedPrice
									: popular.price,
							)
						}}
						<small>{{ $t("service.sum") }}</small>
					</span>
					<span v-if="popular.hasDiscount" class="popular-old">
						{{ formatPrice(popular.price) }}
					</span>
				</div>
				<p class="popular-duration" v-if="popular.durationMinutes">
					{{ $t("service.duration") }}: {{ popular.durationMinutes }}
					{{ $t("service.minut") }}
				</p>
			</div>

			<div class="popular-actions">
				<button
					class="btn-cart"
					:class="{ 'btn-cart--added': isInCart(popular) }"
					@click="toggleCart(popular, $event)"
					:title="
						isInCart(popular) ? $t('service.kor1') : $t('service.kor2')
					"
				>
					<!-- {{ isInCart(popular) ? "✓" : "🛒" }} -->
					<i v-if="isInCart(popular)" class="ri-check-line"></i>
					<i v-else class="ri-shopping-cart-2-line"></i>
				</button>
				<button
					class="btn-buy"
					:class="{ 'btn-buy--added': isInCart(popular) }"
					@click="toggleCart(popular, $event)"
				>
					{{ isInCart(popular) ? $t("service.kor1") : $t("service.kor2") }}
				</button>
			</div>

			<div class="popular-tags">
				<span class="tag">{{ $t("service.prescriptionSupport") }}</span>
				<span class="tag">{{ $t("service.followUp") }}</span>
				<span class="tag">{{ $t("service.secureVideo") }}</span>
			</div>

			<div class="popular-footer">
				<div class="rating">
					<span class="rating-star">⭐</span>
					<div>
						<strong>4.8 / 5 {{ $t("service.raiting") }}</strong>
						<p>{{ $t("service.based") }}</p>
					</div>
				</div>
				<!-- <div class="compare">
					<p>Need help choosing?</p>
					<NuxtLink :to="localePath('/services')" class="compare-link">
						Compare plans
					</NuxtLink>
				</div> -->
			</div>
		</div>

		<!-- RIGHT: Service Table -->
		<div class="table-wrap">
			<div class="table-head">
				<div class="th th--service">{{ $t("service.SERVICE") }}</div>
				<div class="th th--price">{{ $t("service.PRICE") }}</div>
				<div class="th th--discount">{{ $t("service.DISCOUNT") }}</div>
				<div class="th th--buy">{{ $t("service.BUY") }}</div>
			</div>

			<div class="table-body">
				<div
					v-for="(service, index) in otherServices"
					:key="service.id"
					class="table-row"
				>
					<!-- Icon -->
					<div class="row-icon">
						<i class="ri-heart-pulse-fill"></i>
						<!-- <img
							v-if="service.image"
							:src="service.image"
							:alt="service.name?.[locale]"
							class="row-icon__img"
						/>
						<span v-else>{{ getIcon(index) }}</span> -->
					</div>

					<!-- Service Info -->
					<div class="row-service">
						<div class="row-name-wrap">
							<strong class="row-name">{{
								service.name?.[locale]
							}}</strong>
							<!-- <span
								v-if="getBadge(service, index)"
								:class="`badge badge--${getBadge(service, index).color}`"
							>
								{{ getBadge(service, index).label }}
							</span> -->
						</div>
						<div
							class="row-desc"
							v-html="service.description?.[locale]"
						></div>
					</div>

					<!-- Price -->
					<div class="row-price">
						<span class="price-now">
							{{
								formatPrice(
									service.hasDiscount
										? service.discountedPrice
										: service.price,
								)
							}}
							<small>{{ $t("service.sum") }}</small>
						</span>
						<span v-if="service.hasDiscount" class="price-meta">
							{{ formatPrice(service.price) }} • {{ $t("service.save") }}
							{{ formatPrice(service.price - service.discountedPrice) }}
						</span>
					</div>

					<!-- Discount -->
					<div class="row-discount">
						<span
							v-if="service.hasDiscount"
							:class="`disc-badge disc-badge--${index % 3 === 0 ? 'red' : index % 3 === 1 ? 'blue' : 'green'}`"
						>
							-{{ service.discountPercentage }}%
						</span>
						<!-- <span v-else class="disc-badge disc-badge--none">—</span> -->
					</div>

					<!-- Buy -->
					<div class="row-buy">
						<button
							class="btn-row-cart"
							:class="{
								'btn-row-cart--added': isInCart(service),
								'btn-row-cart--ripple': rippling === service.id,
							}"
							@click="toggleCart(service, $event)"
							:title="
								isInCart(service)
									? $t('service.kor1')
									: $t('service.kor2')
							"
						>
							<i v-if="isInCart(service)" class="ri-check-line"></i>
							<i v-else class="ri-shopping-cart-2-line"></i>
						</button>
					</div>
				</div>

				<p v-if="!otherServices.length" class="empty">
					{{ $t("service.Not") }}
				</p>
			</div>

			<p class="footnote">
				{{ $t("service.availability") }}
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

/* ── Root vars ─────────────────────────────── */
.sp-wrap {
	--c-primary: #0a2241;
	--c-accent: rgba(20, 63, 150, 0.92);
	--c-accent-lt: #e8f1ff;
	--c-text: #1e293b;
	--c-muted: #64748b;
	--c-bg: #f4f7ff;
	--c-white: #ffffff;
	--radius: 16px;
	--shadow: 0 8px 32px rgba(10, 34, 65, 0.09);
	--tr: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	display: grid;
	grid-template-columns: 380px 1fr;
	gap: 24px;
	align-items: start;
	font-family: "Segoe UI", system-ui, sans-serif;
}

@media (max-width: 900px) {
	.sp-wrap {
		grid-template-columns: 1fr;
	}
}

/* ── Popular Card ──────────────────────────── */
.popular-card {
	background: var(--c-white);
	border-radius: var(--radius);
	box-shadow: var(--shadow);
	padding: 28px 24px 20px;
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 14px;
	border: 1.5px solid #e2eaff;
}

.popular-badge {
	font-size: 14px;
	font-weight: 700;
	color: var(--c-accent);
	text-transform: uppercase;
}

.popular-save {
	position: absolute;
	top: 20px;
	right: 20px;
	background: var(--c-accent-lt);
	color: var(--c-accent);
	font-size: 12px;
	font-weight: 700;
	padding: 4px 12px;
	border-radius: 20px;
}

.popular-header {
	display: flex;
	align-items: center;
	gap: 14px;
}

.popular-icon {
	width: 52px;
	height: 52px;
	border-radius: 14px;
	background: var(--c-accent-lt);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 22px;
	overflow: hidden;
	flex-shrink: 0;
}

.popular-icon__img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.popular-title {
	font-size: 1.2rem;
	font-weight: 700;
	color: var(--c-primary);
	line-height: 1.25;
	margin: 0;
}

.popular-desc {
	font-size: 0.88rem;
	color: var(--c-muted);
	line-height: 1.6;
}

.popular-desc :deep(h3) {
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--c-text);
	margin: 0 0 4px;
}

.popular-desc :deep(p) {
	margin: 0;
}

.popular-pricing {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.popular-label {
	font-size: 12px;
	color: var(--c-muted);
	font-weight: 500;
}

.popular-price-row {
	display: flex;
	align-items: baseline;
	gap: 10px;
}

.popular-price {
	font-size: 2.4rem;
	font-weight: 700;
	color: var(--c-primary);
	line-height: 1;
}

.popular-price small {
	font-size: 1rem;
	font-weight: 600;
	color: var(--c-muted);
}

.popular-old {
	font-size: 1rem;
	color: var(--c-muted);
	text-decoration: line-through;
}

.popular-duration {
	font-size: 12px;
	color: var(--c-muted);
	margin: 0;
}

.popular-actions {
	display: flex;
	gap: 10px;
	align-items: center;
}

.btn-cart {
	width: 44px;
	height: 44px;
	border-radius: 12px;
	border: 1.5px solid #e2eaff;
	background: var(--c-white);
	font-size: 18px;
	cursor: pointer;
	transition: var(--tr);
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f2f7ff;
}

.btn-cart:hover {
	background: var(--c-accent);
	border-color: var(--c-accent);
	i {
		color: white;
	}
}

.btn-cart--added {
	background: #eff6ff;
	border-color: #bfdbfe;
	color: #2563eb;
	font-weight: 700;
}

.btn-cart--added:hover {
	background: var(--c-accent);
	border-color: var(--c-accent);
}

.btn-buy {
	flex: 1;
	height: 44px;
	border-radius: 12px;
	border: none;
	background: var(--c-accent);
	color: #fff;
	font-size: 14px;
	font-weight: 700;
	cursor: pointer;
	transition: var(--tr);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
}

.btn-buy:hover {
	background: #1457d4;
	color: #fff;
}

.btn-buy--added {
	background: #eff6ff;
	color: #2563eb;
}

.btn-buy--added:hover {
	background: var(--c-accent);
	border-color: var(--c-accent);
}

.popular-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.tag {
	font-size: 12px;
	padding: 5px 12px;
	border-radius: 20px;
	background: var(--c-bg);
	color: var(--c-text);
	font-weight: 500;
	border: 1px solid #e2eaff;
}

.popular-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 12px;
	border-top: 1px solid #f0f4ff;
	gap: 10px;
}

.rating {
	display: flex;
	align-items: center;
	gap: 10px;
}

.rating-star {
	font-size: 20px;
	background: var(--c-accent-lt);
	border-radius: 10px;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-bottom: 2px;
}

.rating strong {
	font-size: 13px;
	color: var(--c-text);
	display: block;
}

.rating p {
	font-size: 11px;
	color: var(--c-muted);
	margin: 0;
}

.compare p {
	font-size: 11px;
	color: var(--c-muted);
	margin: 0 0 2px;
	text-align: right;
}

.compare-link {
	font-size: 13px;
	font-weight: 700;
	color: var(--c-accent);
	text-decoration: none;
}

.compare-link:hover {
	text-decoration: underline;
}

/* ── Table ─────────────────────────────────── */
.table-wrap {
	background: var(--c-white);
	border-radius: var(--radius);
	box-shadow: var(--shadow);
	overflow: hidden;
	border: 1.5px solid #e2eaff;
}

.table-head {
	display: grid;
	grid-template-columns: 1fr 160px 130px 100px;
	gap: 0;
	padding: 14px 20px;
	border-bottom: 1px solid #f0f4ff;
}

.th {
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.07em;
	color: var(--c-accent);
	text-transform: uppercase;
}

.th--service {
	text-align: left;
}
.th--price {
	text-align: center;
}
.th--discount {
	text-align: center;
}
.th--buy {
	text-align: right;
}

.table-body {
	display: flex;
	flex-direction: column;
}

.table-row {
	display: grid;
	grid-template-columns: 52px 1fr 160px 130px 100px;
	gap: 12px;
	align-items: center;
	padding: 18px 20px;
	border-bottom: 1px solid #f7f9ff;
	transition: background var(--tr);
}

.table-row:last-child {
	border-bottom: none;
}

.table-row:hover {
	background: #f8faff;
}

/* Row icon */
.row-icon {
	width: 44px;
	height: 44px;
	border-radius: 12px;
	background: var(--c-accent-lt);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	overflow: hidden;
	flex-shrink: 0;
	i {
		color: var(--c-accent);
	}
	@include devices(sm) {
		display: none;
	}
}

.row-icon__img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* Row service */
.row-service {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.row-name-wrap {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8px;
}

.row-name {
	font-size: 15px;
	font-weight: 700;
	color: var(--c-primary);
}

.row-desc {
	font-size: 12.5px;
	color: var(--c-muted);
	line-height: 1.5;
}

.row-desc :deep(p),
.row-desc :deep(h3) {
	margin: 0;
	font-size: inherit;
	font-weight: normal;
}

/* Badges */
.badge {
	font-size: 11px;
	font-weight: 700;
	padding: 3px 10px;
	border-radius: 20px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
}

.badge--green {
	background: #d1fae5;
	color: #065f46;
}
.badge--blue {
	background: #dbeafe;
	color: #1d4ed8;
}
.badge--teal {
	background: #ccfbf1;
	color: #0f766e;
}
.badge--amber {
	background: #fef3c7;
	color: #92400e;
}
.badge--orange {
	background: #ffedd5;
	color: #c2410c;
}

/* Row Price */
.row-price {
	text-align: center;
}

.price-now {
	font-size: 1.3rem;
	font-weight: 700;
	color: var(--c-primary);
	display: block;
	line-height: 1.1;
	@include devices(md) {
		margin-top: 7px;
	}
}

.price-now small {
	font-size: 0.75rem;
	color: var(--c-muted);
	font-weight: 500;
}

.price-meta {
	font-size: 11px;
	color: var(--c-muted);
	display: block;
	margin-top: 2px;
	text-decoration: line-through;
}

/* Row Discount */
.row-discount {
	text-align: center;
}

.disc-badge {
	font-size: 12px;
	font-weight: 700;
	padding: 5px 14px;
	border-radius: 20px;
	display: inline-block;
}

.disc-badge--red {
	background: #fee2e2;
	color: #dc2626;
}
.disc-badge--blue {
	background: #dbeafe;
	color: #1d4ed8;
}
.disc-badge--green {
	background: #d1fae5;
	color: #059669;
}
.disc-badge--none {
	color: var(--c-muted);
}

/* Row Buy */
.row-buy {
	text-align: right;
}

.btn-row-cart {
	width: 40px;
	height: 40px;
	border-radius: 12px;
	border: 1.5px solid #e2eaff;
	background: var(--c-white);
	font-size: 17px;
	cursor: pointer;
	transition: var(--tr);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	@include devices(md) {
		width: 36px;
		height: 36px;
		font-size: 15px;
	}
}

.btn-row-cart:hover {
	background: var(--c-accent);
	border-color: var(--c-accent);
	i {
		color: white;
	}
}

.btn-row-cart--added {
	background: #eff6ff;
	border-color: #bfdbfe;
	color: #2563eb;
	font-weight: 700;
}

.btn-row-cart--added:hover {
	background: var(--c-accent);
	border-color: var(--c-accent);
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

.btn-row-cart--ripple {
	animation: ripple-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.empty {
	padding: 24px 20px;
	color: var(--c-muted);
	font-size: 14px;
	text-align: center;
}

.footnote {
	font-size: 11px;
	color: var(--c-muted);
	padding: 10px 20px 14px;
	margin: 0;
	border-top: 1px solid #f0f4ff;
}

/* ── Responsive ────────────────────────────── */

/* Tablet: 768px – 1200px */
@media (max-width: 1200px) {
	.table-head {
		grid-template-columns: 1fr 130px 110px 110px;
		padding: 12px 16px;
	}

	.table-row {
		grid-template-columns: 44px 1fr 130px 110px 110px;
		gap: 8px;
		padding: 14px 16px;
	}

	.price-now {
		font-size: 1.1rem;
	}

	.disc-badge {
		padding: 4px 10px;
		font-size: 11px;
	}
}

/* Mobile: max 768px */
@media (max-width: 768px) {
	/* Table header yashiriladi */
	.table-head {
		display: none;
	}

	/* Har bir row — card ko'rinishiga o'tadi */
	.table-row {
		display: grid;
		grid-template-columns: 44px 1fr;
		grid-template-rows: auto auto auto;
		grid-template-areas:
			"icon service"
			"icon price"
			".    footer";
		gap: 4px 12px;
		padding: 14px 16px;
		position: relative !important;
		@include devices(sm) {
			display: block;
		}
	}

	.row-icon {
		grid-area: icon;
		align-self: start;
		margin-top: 2px;
	}

	.row-service {
		grid-area: service;
      padding-right: 50px;
	}

	.row-price {
		grid-area: price;
		text-align: left;
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.price-now {
		font-size: 1.05rem;
	}

	.price-meta {
		display: inline;
		margin-top: 0;
	}

	/* Discount va Buy — bitta footer qatorida yonma-yon */
	.row-discount {
		grid-area: footer;
		display: flex;
		align-items: center;
		justify-self: start;
		align-self: center;
	}

	.row-buy {
		position: absolute !important;
		right: 15px;
		top: 15px;
		grid-area: footer;
		display: flex;
		align-items: center;
		justify-self: end;
		align-self: center;
	}

	/* grid-area conflict bo'lganda — explicit column/row */
	.row-discount {
		grid-area: unset;
		grid-column: 2;
		grid-row: 3;
		justify-self: start;
	}

	.row-buy {
		grid-area: unset;
		grid-column: 2;
		grid-row: 3;
		justify-self: end;
	}
}

/* Kichik mobil: max 480px */
@media (max-width: 480px) {
	.popular-card {
		padding: 20px 16px 16px;
	}

	.popular-price {
		font-size: 1.9rem;
	}

	.popular-footer {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.compare p {
		text-align: left;
	}

	.popular-tags {
		gap: 6px;
	}

	.tag {
		font-size: 11px;
		padding: 4px 10px;
	}

	.btn-buy {
		font-size: 13px;
	}

	.table-row {
		padding: 12px 12px;
	}

	.row-name {
		font-size: 13px;
	}
}
</style>
