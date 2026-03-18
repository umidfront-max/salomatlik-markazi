<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const { locale } = useI18n();

const { data: detail } = await useAsyncData(
	`equipment_${route.params.slug}`,
	() => $api(`equipment/${route.params.slug}`),
);

useCustomHead(detail.value);

const BASE = "https://api-his.wemard.uz";

const mainImage = computed(() => {
	if (detail.value?.mainImage) return BASE + detail.value.mainImage;
	if (detail.value?.images?.[0]?.url) return BASE + detail.value.images[0].url;
	return null;
});

const galleryImages = computed(() =>
	(detail.value?.images ?? []).map((img) => BASE + img.url),
);

const activeImg = ref(0);
const activeTab = ref("description");

const tabs = computed(() => [
	{ key: "description", label: "Tavsif" },
	{ key: "technical", label: "Texnik xususiyatlar" },
	{ key: "manufacturer", label: "Ishlab chiqaruvchi" },
]);
</script>

<template>
	<div class="eq-detail" v-if="detail">
		<!-- ░░ HERO ░░ -->
		<div class="eq-detail__hero">
			<div class="eq-detail__hero-bg" />
			<div class="container eq-detail__hero-inner">
				<!-- Gallery -->
				<div
					class="eq-gallery"
					data-aos="fade-right"
					data-aos-duration="600"
				>
					<div class="eq-gallery__main">
						<img
							:src="galleryImages[activeImg] ?? mainImage"
							:alt="detail.title?.[locale]"
							class="eq-gallery__main-img"
						/>
						<!-- glow blob -->
						<div class="eq-gallery__glow" />
					</div>
					<div class="eq-gallery__thumbs" v-if="galleryImages.length > 1">
						<button
							v-for="(img, i) in galleryImages"
							:key="i"
							class="eq-gallery__thumb"
							:class="{ 'is-active': activeImg === i }"
							@click="activeImg = i"
						>
							<img :src="img" />
						</button>
					</div>
				</div>

				<!-- Meta -->
				<div
					class="eq-meta"
					data-aos="fade-left"
					data-aos-duration="600"
					data-aos-delay="100"
				>
					<div class="eq-meta__badge" v-if="detail.manufacturer?.[locale]">
						{{ detail.manufacturer?.[locale] }}
					</div>

					<h1 class="eq-meta__title">{{ detail.title?.[locale] }}</h1>

					<p
						class="eq-meta__short"
						v-if="detail.shortDescription?.[locale]"
						v-html="detail.shortDescription?.[locale]"
					/>

					<div class="eq-meta__divider" />

					<ul class="eq-meta__specs">
						<li v-if="detail.manufacturer?.[locale]">
							<span class="eq-meta__specs-label"
								>Ishlab chiqaruvchi</span
							>
							<span class="eq-meta__specs-value">{{
								detail.manufacturer?.[locale]
							}}</span>
						</li>
						<li v-if="detail.createdAt">
							<span class="eq-meta__specs-label">Qo'shilgan sana</span>
							<span class="eq-meta__specs-value">
								{{
									new Date(detail.createdAt).toLocaleDateString(
										"uz-UZ",
									)
								}}
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- ░░ TABS ░░ -->
		<div class="container eq-tabs-wrap">
			<!-- Tab nav -->
			<div class="eq-tabs__nav" data-aos="fade-up" data-aos-duration="500">
				<button
					v-for="tab in tabs"
					:key="tab.key"
					class="eq-tabs__btn"
					:class="{ 'is-active': activeTab === tab.key }"
					@click="activeTab = tab.key"
				>
					{{ tab.label }}
				</button>
			</div>

			<!-- Tab panels -->
			<div
				class="eq-tabs__body"
				data-aos="fade-up"
				data-aos-duration="500"
				data-aos-delay="80"
			>
				<Transition name="tab-fade" mode="out-in">
					<!-- Description -->
					<div
						v-if="activeTab === 'description'"
						key="description"
						class="eq-tabs__panel"
					>
						<div
							class="eq-rich"
							v-html="detail.fullDescription?.[locale]"
							v-if="detail.fullDescription?.[locale]"
						/>
						<p class="eq-tabs__empty" v-else>Ma'lumot mavjud emas</p>
					</div>

					<!-- Technical specs -->
					<div
						v-else-if="activeTab === 'technical'"
						key="technical"
						class="eq-tabs__panel"
					>
						<div
							class="eq-rich"
							v-html="detail.technicalSpecifications?.[locale]"
							v-if="detail.technicalSpecifications?.[locale]"
						/>
						<p class="eq-tabs__empty" v-else>Ma'lumot mavjud emas</p>
					</div>

					<!-- Manufacturer -->
					<div
						v-else-if="activeTab === 'manufacturer'"
						key="manufacturer"
						class="eq-tabs__panel"
					>
						<div class="eq-manufacturer">
							<div
								class="eq-manufacturer__name"
								v-if="detail.manufacturer?.[locale]"
							>
								{{ detail.manufacturer?.[locale] }}
							</div>
							<div
								class="eq-rich"
								v-html="detail.manufacturerDetails?.[locale]"
								v-if="detail.manufacturerDetails?.[locale]"
							/>
						</div>
						<!-- <p class="eq-tabs__empty" v-else>Ma'lumot mavjud emas</p> -->
					</div>
				</Transition>
			</div>
		</div>

		<!-- ░░ IMAGE GALLERY STRIP ░░ -->
		<div
			class="container eq-strip"
			v-if="galleryImages.length > 1"
			data-aos="fade-up"
			data-aos-duration="500"
		>
			<h2 class="eq-strip__title">Rasmlar galereyasi</h2>
			<div class="eq-strip__grid">
				<button
					v-for="(img, i) in galleryImages"
					:key="i"
					class="eq-strip__item"
					@click="
						activeImg = i;
						window.scrollTo({ top: 0, behavior: 'smooth' });
					"
				>
					<img :src="img" :alt="`Rasm ${i + 1}`" />
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

$blue: #33c1ed;
$blue-dk: #0ea8d8;
$navy: #0b2239;
$navy-lt: #26364b;
$bg: #f5f8fb;

/* ── page root ── */
.eq-detail {
	padding-bottom: 100px;
}

/* ════════════════════════════════════════
   HERO
════════════════════════════════════════ */
.eq-detail__hero {
	position: relative;
	padding: 60px 0 56px;
	overflow: hidden;

	&-bg {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, #eaf7fd 0%, #f9fcff 60%, #fff 100%);
		z-index: 0;

		&::after {
			content: "";
			position: absolute;
			top: -120px;
			right: -160px;
			width: 520px;
			height: 520px;
			border-radius: 50%;
			background: radial-gradient(
				circle,
				rgba($blue, 0.14) 0%,
				transparent 70%
			);
			pointer-events: none;
		}
	}

	&-inner {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		align-items: start;

		@include devices(md) {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}
}

/* ── Gallery ── */
.eq-gallery {
	display: flex;
	flex-direction: column;
	gap: 14px;

	&__main {
		position: relative;
		border-radius: 20px;
		background: #fff;
		border: 1.5px solid rgba($blue, 0.18);
		overflow: hidden;
		aspect-ratio: 4 / 3;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover .eq-gallery__main-img {
			transform: scale(1.04);
		}
	}

	&__main-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 20px;
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	&__glow {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse at 50% 110%,
			rgba($blue, 0.12) 0%,
			transparent 65%
		);
	}

	&__thumbs {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	&__thumb {
		width: 72px;
		height: 72px;
		border-radius: 12px;
		border: 2px solid transparent;
		background: #fff;
		overflow: hidden;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease;
		padding: 4px;

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		&:hover {
			transform: translateY(-2px);
		}
		&.is-active {
			border-color: $blue;
			box-shadow: 0 0 0 3px rgba($blue, 0.18);
		}
	}
}

/* ── Meta ── */
.eq-meta {
	padding-top: 8px;

	&__badge {
		display: inline-flex;
		align-items: center;
		padding: 5px 14px;
		border-radius: 20px;
		background: rgba($blue, 0.1);
		border: 1px solid rgba($blue, 0.25);
		font-size: 12px;
		font-weight: 700;
		color: $blue-dk;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 16px;
		animation: fadeSlideDown 0.5s ease both;
	}

	&__title {
		margin: 0 0 16px;
		font-size: 32px;
		font-weight: 800;
		line-height: 1.25;
		color: $navy;
		animation: fadeSlideDown 0.55s ease 0.06s both;

		@include devices(md) {
			font-size: 24px;
		}
	}

	&__short {
		margin: 0;
		font-size: 15px;
		line-height: 1.7;
		color: rgba($navy-lt, 0.7);
		animation: fadeSlideDown 0.55s ease 0.12s both;

		:deep(p) {
			margin: 0;
		}
	}

	&__divider {
		height: 1.5px;
		background: linear-gradient(to right, rgba($blue, 0.4), transparent);
		margin: 24px 0;
		border-radius: 2px;
		animation: scaleX 0.6s ease 0.2s both;
		transform-origin: left;
	}

	&__specs {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
		animation: fadeSlideDown 0.55s ease 0.22s both;

		li {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 12px 16px;
			border-radius: 12px;
			background: #fff;
			border: 1.5px solid #eef2f6;
		}

		&-label {
			font-size: 13px;
			color: rgba($navy, 0.45);
			font-weight: 500;
		}

		&-value {
			font-size: 14px;
			font-weight: 700;
			color: $navy;
		}
	}
}

/* ════════════════════════════════════════
   TABS
════════════════════════════════════════ */
.eq-tabs-wrap {
	margin-top: 48px;
}

.eq-tabs {
	&__nav {
		display: flex;
		gap: 4px;
		border-bottom: 2px solid #eef2f6;
		margin-bottom: 0;
		overflow-x: auto;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}

	&__btn {
		position: relative;
		padding: 12px 22px;
		border: none;
		background: transparent;
		font-size: 14px;
		font-weight: 600;
		color: rgba($navy, 0.45);
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.22s ease;

		&::after {
			content: "";
			position: absolute;
			bottom: -2px;
			left: 0;
			right: 0;
			height: 2px;
			background: $blue;
			border-radius: 2px 2px 0 0;
			transform: scaleX(0);
			transition: transform 0.25s ease;
		}

		&:hover {
			color: $navy;
		}

		&.is-active {
			color: $blue-dk;
			&::after {
				transform: scaleX(1);
			}
		}
	}

	&__body {
		background: #fff;
		border: 1.5px solid #eef2f6;
		border-top: none;
		border-radius: 0 0 16px 16px;
		min-height: 160px;
		overflow: hidden;
	}

	&__panel {
		padding: 28px 28px;

		@include devices(md) {
			padding: 20px 16px;
		}
	}

	&__empty {
		font-size: 14px;
		color: rgba($navy, 0.35);
		font-style: italic;
		margin: 0;
	}
}

/* tab transition */
.tab-fade-enter-active,
.tab-fade-leave-active {
	transition:
		opacity 0.22s ease,
		transform 0.22s ease;
}
.tab-fade-enter-from {
	opacity: 0;
	transform: translateY(8px);
}
.tab-fade-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}

/* ── Rich HTML content ── */
.eq-rich {
	:deep(p) {
		margin: 0 0 12px;
		font-size: 15px;
		line-height: 1.75;
		color: rgba($navy-lt, 0.78);
		&:last-child {
			margin-bottom: 0;
		}
	}
	:deep(ul),
	:deep(ol) {
		padding-left: 20px;
		margin: 8px 0 12px;
		li {
			font-size: 15px;
			line-height: 1.7;
			color: rgba($navy-lt, 0.78);
			margin-bottom: 4px;
		}
	}
	:deep(h2),
	:deep(h3) {
		color: $navy;
		font-weight: 700;
		margin: 0 0 10px;
	}
	:deep(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 12px 0;
		td,
		th {
			padding: 10px 14px;
			border: 1px solid #eef2f6;
			font-size: 14px;
			color: $navy;
		}
		th {
			background: $bg;
			font-weight: 700;
		}
		tr:hover td {
			background: rgba($blue, 0.03);
		}
	}
}

/* ── Manufacturer panel ── */
.eq-manufacturer {
	&__name {
		display: inline-block;
		font-size: 22px;
		font-weight: 800;
		color: $navy;
		margin-bottom: 16px;
		padding-bottom: 10px;
		border-bottom: 2.5px solid $blue;
	}
}

/* ════════════════════════════════════════
   GALLERY STRIP
════════════════════════════════════════ */
.eq-strip {
	margin-top: 56px;

	&__title {
		font-size: 20px;
		font-weight: 700;
		color: $navy;
		margin: 0 0 20px;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 14px;

		@include devices(md) {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
			gap: 10px;
		}
	}

	&__item {
		aspect-ratio: 1;
		border-radius: 14px;
		border: 1.5px solid #eef2f6;
		background: #fff;
		overflow: hidden;
		cursor: pointer;
		padding: 8px;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			transition: transform 0.3s ease;
		}

		&:hover {
			border-color: rgba($blue, 0.5);
			transform: translateY(-3px);
			box-shadow: 0 8px 20px rgba($navy, 0.08);
			img {
				transform: scale(1.06);
			}
		}
	}
}

/* ════════════════════════════════════════
   KEYFRAMES
════════════════════════════════════════ */
@keyframes fadeSlideDown {
	from {
		opacity: 0;
		transform: translateY(-14px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
@keyframes scaleX {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}
</style>
