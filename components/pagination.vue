<script setup>
import { ref, computed } from "vue";
const router = useRouter();

defineEmits(["onChange"]);
const $props = defineProps({
  pagination: {
    type: Object,
    default: undefined,
  },
  params: {
    type: Object,
    default: undefined,
  },
  module: {
    type: String,
    required: true,
  },
});

const currentPage = ref($props?.page || 1);
const pages = computed(() => {
  const totalPages = $props?.total_pages || 1;
  return Array.from({ length: totalPages }, (_, i) => i + 1);
});

const changePage = (page) => {
  currentPage.value = page;
  router.push({
    path: $props.module, query: {
      page
    }
  })
  refreshNuxtData($props.module);
};
const disablePrev = computed(() => currentPage.value === 1);
const disableNext = computed(
  () => currentPage.value === $props?.total_pages
);

</script>

<template>
  <div class="pagination">
    <button class="pagination-btn pagination-btn__prev" :disabled="disablePrev" @click="changePage(currentPage - 1)">
      <Icon name="angle-left" class="pagination-btn__icon" />
    </button>
    <ul class="pagination-list">
      <li v-for="item in pages" :key="item" class="pagination-list__item">
        <button class="pagination-btn pagination-list__link" :class="{ active: item === currentPage }"
          @click="changePage(item)">
          {{ item }}
        </button>
      </li>
    </ul>
    <button class="pagination-btn pagination-btn__next" :disabled="disableNext" @click="changePage(currentPage + 1)">
      <Icon name="angle-right" class="pagination-btn__icon" />
    </button>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.pagination {
  @include center(12px);
  margin-top: var(--space-40);

  &-list {
    @include center-y(6px);
  }

  &-btn {
    height: var(--size-btn-52);
    width: var(--size-btn-52);
    @include center;
    @include btn-default;
    @include text(20, var(--black-1), normal, 150%);
    transition: all 0.25s ease;
    border-radius: 12px;
    border: 1px solid #D3E0EA;


    &.active {
      background: var(--red-1);
      border-color: var(--red-1);
      color: var(--white-1);
    }

    &:hover:not(.active):not(:disabled) {
      background: var(--primary-1);
      border-color: var(--primary-1);
      color: var(--white-1);
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);

      .pagination-btn__icon {
        --icon-color: var(--white-1);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &__icon {
      --icon-color: var(--primary-1);
      --icon-size: var(--size-icon-24);
      transition: all 0.25s ease;
    }

  }
}
</style>
