<script setup>
const { list } = useService();
const localePath = useLocalePath();
</script>

<template>
	<section class="services-bg">
		<div class="services container">
			<ARow :gutter="[20, 20]">
				<ACol
					v-for="service in list"
					:key="service.id"
					:xs="24"
					:sm="12"
					:md="12"
					:lg="6"
				>
					<NuxtLink
						:to="localePath(`/service/${service.slug || service.id}`)"
						class="service-link"
					>
						<CardServiceNew
							:title="service.title"
							:image="service.image"
						/>
					</NuxtLink>
				</ACol>
			</ARow>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.services-bg {
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
.services-bg::before {
	width: 420px;
	height: 420px;
	background: rgba(51, 193, 237, 0.45);
	top: -160px;
	left: -160px;
}

.services-bg::after {
	width: 520px;
	height: 520px;
	background: rgba(51, 193, 237, 0.35);
	bottom: -200px;
	right: -200px;
}

.service-link {
	display: block;
	height: 100%;
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease;

	&:hover {
		transform: translateY(-10px);
	}
}
</style>
