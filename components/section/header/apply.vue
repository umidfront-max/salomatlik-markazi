<script setup>
import { ref, watch, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const open = ref(false);
const messageModalVisible = ref(false);
const messageModalType = ref("success");
const props = defineProps({
	doctorId: {
		type: String,
		default: () => "",
	},
});

function toOpen() {
	open.value = true;
}
function toClose() {
	open.value = false;
	router.push(localePath({ query: {} }));
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
	<div>
		<AModal
			:title="$t('formApplication')"
			:footer="null"
			width="1040px"
			@ok="toClose"
			@cancel="toClose"
			v-model:visible="open"
			:forceRender="true"
		>
			<FormApply
				:open="open"
				@success="handleSuccess"
				@error="handleError"
				:doctorId="props.doctorId"
			/>
		</AModal>

		<!-- Message Modal -->
		<ModalMessage
			v-model:visible="messageModalVisible"
			:type="messageModalType"
		/>
	</div>
</template>
