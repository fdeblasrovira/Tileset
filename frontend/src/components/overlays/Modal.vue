<script setup>
const props = defineProps([
  "open",
  "title",
  "description",
  "svgBackgroundColor",
]);
</script>

<template #delete>
  <div
    v-if="props.open"
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-tileset-grey-5 bg-opacity-75"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-tileset-full-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
            <div class="sm:flex sm:items-start">
              <div
                :class="props.svgBackgroundColor"
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
              >
                <slot name="svg"></slot>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg font-medium leading-6 text-gray-900"
                  id="modal-title"
                >
                  {{ props.title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ props.description }}
                  </p>
                </div>
              </div>
            </div>
            <slot name="contents"></slot>
          </div>
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
