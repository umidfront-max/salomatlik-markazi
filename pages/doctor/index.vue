<script setup>
const { list } = useDoctor();
const router = useRouter();
const localePath = useLocalePath();
defineComponent({ name: "doctors" });
</script>
<template>
	<section class="section container pb-100">
		<ARow :gutter="[{ xxl: 24, xl: 20, sm: 16, xs: 12 }, 32]">
			<ACol
				v-for="(item, index) in list"
				:key="index"
				:xl="6"
				:md="8"
				:sm="12"
				:xs="24"
			>
				<Card
					@click="router.push(localePath(`/doctor/${item.id}`))"
					:data="item"
					type="doctor"
					data-aos="fade-up"
					data-aos-duration="450"
					:data-aos-delay="index * 50"
				/>
			</ACol>
		</ARow>
	</section>
</template>
<style lang="scss" scoped>
.section {
	--width-container: 1520px;
}
</style>
