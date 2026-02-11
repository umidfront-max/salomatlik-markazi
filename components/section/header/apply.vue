<script setup>
import { ref, watch, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const open = ref(false);
const messageModalVisible = ref(false);
const messageModalType = ref("success");

watch(
	() => route.query.doctor_id,
	(value) => {
		if (value) {
			toOpen(true);
		}
	},
);
onMounted(() => {
	if (route.query.doctor_id) {
		toToggle(true);
	}
});

function toOpen() {
	open.value = true;
}
function toClose() {
	open.value = false;
	router.push(localePath({ query: { doctor_id: undefined } }));
}

const handleSuccess = () => {
	toClose();
	messageModalType.value = "success";
	messageModalVisible.value = true;
};

const handleError = () => {
	toClose();
	messageModalType.value = "error";
	messageModalVisible.value = true;
};

defineExpose({ toOpen });
</script>
<template>
	<AModal
		:title="$t('formApplication')"
		:footer="null"
		width="1440px"
		@ok="toClose"
		@cancel="toClose"
		v-model:visible="open"
		:forceRender="true"
	>
		<FormApply :open="open" @success="handleSuccess" @error="handleError" />
	</AModal>

	<!-- Message Modal -->
	<ModalMessage
		v-model:visible="messageModalVisible"
		:type="messageModalType"
	/>
</template>
