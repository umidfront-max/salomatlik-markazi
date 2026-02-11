<script setup>
const { list } = useCheckup();
const localePath = useLocalePath();
</script>

<template>
	<section class="checkups-bg">
		<div class="checkups container">
			<h3 class="checkups_title">{{ $t("Bizning Tekshiruvlar") }}</h3>
			<ARow :gutter="[20, 20]">
				<ACol
					v-for="checkup in list"
					:key="checkup.id"
					:xs="24"
					:sm="12"
					:md="12"
					:lg="6"
				>
					<NuxtLink
						:to="localePath(`/checkup/${checkup.slug || checkup.id}`)"
						class="checkup-link"
					>
						<CardServiceCheckUp
							:data="checkup"
							:to="localePath(`/checkup/${checkup.slug || checkup.id}`)"
						/>
					</NuxtLink>
				</ACol>
			</ARow>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.checkups-bg {
	position: relative;
	padding: 64px;
	margin-top: -80px;
	margin-bottom: -100px;
	padding-bottom: 140px;
	background: #d6f2fd;

	@include devices(md) {
		padding-left: 2px;
		padding-right: 2px;
	}
}
.checkups-bg::before {
	width: 420px;
	height: 420px;
	background: rgba(51, 193, 237, 0.45);
	top: -160px;
	left: -160px;
}

.checkups-bg::after {
	width: 520px;
	height: 520px;
	background: rgba(51, 193, 237, 0.35);
	bottom: -200px;
	right: -200px;
}
.checkups_title {
	margin: 0;
	font-size: 50px;
	line-height: 1.12;
	font-weight: 600;
	color: #0a2241;

	@include devices(md) {
		font-size: 34px;
	}
	@include devices(sm) {
		font-size: 30px;
	}
}
.checkup-link {
	display: block;
	height: 100%;
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease;
	margin-top: 40px;

	&:hover {
		transform: translateY(-10px);
	}
}
</style>
