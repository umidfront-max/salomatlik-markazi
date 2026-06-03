<script setup>
defineComponent({ name: "partnership" });
const activeKey = ref(0);
const { $api } = useNuxtApp();
const { data } = useAsyncData("banner", () =>
  $api("posts", {
    params: {
      category: "partnership",
      is_visible_content: true,
    },
  })
);

const messageModalVisible = ref(false);
const messageModalType = ref("success");

const handleSuccess = () => {
  messageModalType.value = "success";
  messageModalVisible.value = true;
};

const handleError = () => {
  messageModalType.value = "error";
  messageModalVisible.value = true;
};
</script>
<template>
  <div>
    <SectionBreadcrumbs />
    <section
      class="section container pb-100"
      data-aos="fade-up"
      data-aos-duration="450"
    >
      <ATabs v-model:activeKey="activeKey">
        <ATabPane
          :key="index"
          :tab="item.title"
          v-for="(item, index) in data?.data ?? []"
        >
          <h2 class="section-title">
            {{ item.sub_title }}
          </h2>
          <div class="section-content" v-html="item.content"></div>
        </ATabPane>
      </ATabs>
      <div class="section-form">
        <h2 class="section-form__title">{{ $t("formApplication") }}</h2>
        <FormPartnership @success="handleSuccess" @error="handleError" />
      </div>

      <!-- Message Modal -->
      <ModalMessage
        v-model:visible="messageModalVisible"
        :type="messageModalType"
      />
    </section>
  </div>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
.section {
  --width-container: 1440px;
  &-form {
    border: 1px solid #d3e0ea;
    background: #fff;
    box-shadow: 0px 4px 20px 0px rgba(3, 24, 43, 0.1);
    padding: var(--space-32);
    margin-top: var(--space-60);

    &__title {
      @include text(32, #03182b, 700, 140%);
      margin-bottom: var(--space-32);
    }
  }
}
</style>
