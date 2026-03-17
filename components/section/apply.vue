   <script setup>
   const applyRef = ref({});
   const emit = defineEmits(['openApply']);
   </script>
   <template>
   <section class="section">
      <div class="container section-container">
         <div class="section-wrapper">
         <h3 class="section-title">
            {{ $t("apply.title") }}
         </h3>
         <p class="section-text">
            {{ $t("apply.text") }}
         </p>
         </div>
         <Btn
         @click="applyRef.toOpen(true)"
         color="white-1"
         text-color="red-1"
         :size="48"
         class="section-btn"
         :data-text="$t('sendApplication')"

         >
         {{ $t("sendApplication") }}
         </Btn>
      </div>
   </section>
   <!-- <ClientOnly>
      <SectionHeaderApply ref="applyRef" />
   </ClientOnly> -->
   </template>
   <style lang="scss" scoped>
   @use "@/assets/scss/config/mixins" as *;

   .section {
   padding: var(--space-40);
   background-color: var(--primary-1);
   position: relative;
   z-index: 1;
   background-color: var(--red-2);
   &::before {
      background-color: #111821;
      bottom: 0;
      clip-path: polygon(12% 0, 100% 0, 100% 100%, 0 100%);
      content: "";
      margin: 0 0 0 auto;
      position: absolute;
      right: 0;
      top: 0;
      width: 50%;
      z-index: -1;
   }

   &-container {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @include devices(xs) {
         flex-wrap: wrap;
         row-gap: 20px;
      }
   }
   &-title {
      @include text(32, var(--white-1), 700, 140%);
      margin-bottom: 8px;
   }

   &-text {
      @include text(20, rgba(var(--white), 0.8), 500, 140%);
   }
   &-btn {
      margin-right: auto;
      margin-left: auto;
      @include devices(sm) {
         margin-right: 0;
      }
   }
   }
   </style>
