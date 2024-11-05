<script setup>
import { ref } from "vue";
const props = defineProps(["label", "image", "modelValue"]);
const emits = defineEmits(["update:modelValue"]);

const image = ref(props.image);

function previewFiles(event) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    image.value = reader.result;
    emits("update:modelValue", reader.result)
  });
  reader.readAsDataURL(event.target.files[0]);

}
</script>

<template>
  <div>
    <label class="block font-medium">{{
      props.label
    }}</label>
    <div class="my-3 flex items-center flex-col space-y-6">
      <span
        :style="{ backgroundImage: 'url(' + image + ')' }"
        class="flex bg-cover h-24 min-w-[3rem] w-24 overflow-hidden rounded-full bg-tileset-grey-2 bg-contain bg-no-repeat bg-center"
      >
        <svg
          v-if="image.length <= 0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="flex w-12 h-12 m-auto self-center"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </span>
      <input
        @change="previewFiles"
        @input="$emit('update:modelValue', $event.target.value)"
        type="file"
        accept="image/*"
        id="image-input"
        class="flex w-full focus:outline-tileset-blue rounded-md border border-tileset-grey-5 focus:border-tileset-blue focus:ring-tileset-blue py-2 px-3 text-sm font-normal  shadow-sm"
      />
    </div>
  </div>
</template>

<style scoped></style>
