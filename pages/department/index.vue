<script setup>
const { list } = useDepartment();
const localePath = useLocalePath();
</script>

<template>
	<div>
		<SectionBreadcrumbs />
		<section class="services-bg">
			<div class="services container">
				<h3 class="services_title">{{ $t("service.title2") }}</h3>
				<ARow :gutter="[16, 16]">
					<ACol
						v-for="service in list"
						:key="service.id"
						:xs="12"
						:sm="12"
						:md="8"
						:lg="6"
					>
						<NuxtLink
							:to="localePath(`/service/${service.slug || service.id}`)"
							class="service-link"
						>
							<CardServiceItem
								:data="service"
								:to="
									localePath(
										`/department/${service.slug || service.id}`,
									)
								"
							/>
						</NuxtLink>
					</ACol>
				</ARow>
			</div>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.services-bg {
	position: relative;
	padding: 64px;
	margin-top: -80px;
	margin-bottom: -100px;
	padding-bottom: 140px;
	background: #f8faff;

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
.services_title {
	margin: 0;
	font-size: 50px;
	line-height: 1.12;
	font-weight: 600;
	color: #0a2241;
	margin-bottom: 30px;
	@include devices(md) {
		font-size: 34px;
	}
	@include devices(sm) {
		font-size: 30px;
	}
}
.service-link {
	display: block;
	height: 100%;
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease;
	// margin-top: 40px;

	&:hover {
		transform: translateY(-6px);
	}
}
</style>
