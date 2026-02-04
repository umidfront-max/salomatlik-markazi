<template>
	<div class="service-card-two">
		<div class="service-card-two__content">
			<div class="img_con">
				<img :src="image" :alt="title" class="service-card-two__image" />
			</div>

			<!-- ✅ CodePen-style corner -->
			<div class="corner" aria-hidden="true">
				<a href="#" class="corner__iconBox" aria-label="open">
					<i class="ri-arrow-right-up-line"></i>
				</a>
			</div>

			<h3 class="service-card-two__title">
				<a href="#" tabindex="-1">{{ title }}</a>
			</h3>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
	image: string;
}>();
</script>

<style scoped lang="scss">
.service-card-two {
	--white: #ffffff;
	--dark: #0a2241;
	--blue: #33c1ed;
	--corner: var(--dark); /* default corner */
	--corner-hover: var(--blue); /* hover corner */

	position: relative;
	border-radius: 30px;
	background: var(--white);
	overflow: hidden;
	transition: 0.4s;
}

/* container */
.service-card-two__content {
	position: relative;
	padding: 20px;
	height: 320px;
}

/* image */
.service-card-two__image {
	width: 100%;
	height: 100%;
	border-radius: 20px;
	object-fit: cover;
	display: block;
}
.img_con {
	padding-right: 95px;
	height: 100%;
}

/* vertical title (sizdagi kabi) */
.service-card-two__title {
	position: absolute;
	right: 0;
	bottom: 0;
	writing-mode: vertical-rl;
	transform: rotate(180deg);
	padding: 30px 0 112px 40px;
	font-size: 20px;
	font-weight: 600;
	line-height: 1.25;
	text-transform: capitalize;
	color: var(--dark);
	margin: 0;
}
.service-card-two__title a {
	color: inherit;
	text-decoration: none;
}

.corner {
	position: absolute;
	top: -6px;
	right: -6px;

	width: 100px;
	height: 100px;

	background: var(--corner);
	border-bottom-left-radius: 50%;
	transition: 0.4s;
}

/* ✅ oq fon patch — chap tomondagi egri “toza” chiqishi uchun
   BU PATCH hoverda o‘zgarmaydi (doim oq bo‘lishi kerak) */
.corner::before {
	content: "";
	position: absolute;

	/* ✅ top-right uchun mos joy */
	top: 6px;
	left: -25px;
	width: 25px;
	height: 25px;

	background: transparent;
	border-top-right-radius: 30px;
	transition: 0.4s;
	/* ✅ oq fonni chizish (yo‘nalish: pastga + chapga) */
	box-shadow: 10px -10px 0 10px var(--corner);
}

/* ✅ corner rang patch — hoverda ham rang bilan birga o‘zgaradi */
.corner::after {
	content: "";
	transition: 0.4s;
	position: absolute;
	bottom: -25px;
	right: 6px;
	width: 22px;
	height: 25px;
	background: transparent;
	border-top-right-radius: 30px;
	border-bottom-left-radius: 30px;

	/* ✅ DOIM corner rangida */
	box-shadow: 10px -10px 0 10px var(--corner);
}

/* icon */
.corner__iconBox {
	position: absolute;
	inset: 12px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: 0.4s;
	text-decoration: none;
}

.corner__iconBox i {
	font-size: 32px;
	line-height: 1;
	color: var(--blue);
}

.corner:hover .corner__iconBox {
	transform: scale(1.04);
}

/* ============================
   ✅ HOVER
   ============================ */
.service-card-two:hover {
	transform: translateY(-6px);
	--corner: var(--corner-hover); /* ✅ corner + ::after birga almashadi */
}

.service-card-two:hover .corner__iconBox i {
	color: #fff;
}

/* CodePen: hover icon scale */
.corner:hover .corner__iconBox {
	transform: scale(1.08);
}

/* ============================
   ✅ HOVER: corner rang o‘zgaradi
   ============================ */
.service-card-two:hover {
	transform: translateY(-6px);
}

/* hover’da corner rangi blue bo‘lsin */
.service-card-two:hover {
	--corner: var(--corner-hover);
}

/* patch ham hover rangga mos yangilansin */
.service-card-two:hover .corner::after,
.service-card-two:hover .corner::before {
	box-shadow: 6px -6px 0 6px var(--corner);
}

/* icon hover: arrow oq bo‘lsin (xohlasangiz) */
.service-card-two:hover .corner__iconBox i {
	color: #fff;
}
</style>
