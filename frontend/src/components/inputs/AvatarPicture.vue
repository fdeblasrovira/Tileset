<script setup>
import { ref } from "vue";
const props = defineProps(["label", "image", "modelValue"]);
const emits = defineEmits(["update:modelValue"]);

const image = ref(props.image);
const errorMessage = ref("");

function previewFiles(event) {
  errorMessage.value = ""
  console.log(event)

  const selectedFile = event.target.files[0];
  if (selectedFile.size > 2 * 1024 * 1024) {
    errorMessage.value = "File size exceeds the 2MB limit.";
    console.error(errorMessage.value);
    return;
  }
  const reader = new FileReader();

  reader.onload = function (event) {
    const blob = new Blob([event.target.result]); // create blob...
    window.URL = window.URL || window.webkitURL;
    const blobURL = window.URL.createObjectURL(blob); // and get it's URL

    // helper Image object
    const helperImage = new Image();
    helperImage.src = blobURL;

    let compressedImage = "";

    helperImage.onload = function () {
      console.log("1")
      // have to wait till it's loaded
      const width = helperImage.width;
      const height = helperImage.height;
      const canvas = document.createElement('canvas');
      console.log("2")

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      console.log("3")
      ctx.drawImage(helperImage, 0, 0, width, height);

      compressedImage = canvas.toDataURL("image/jpeg", 1);
      console.log("4")
      console.log(compressedImage)

      image.value = compressedImage;
      emits("update:modelValue", compressedImage)
    }
  };
  if (errorMessage.value.length <= 0) reader.readAsArrayBuffer(selectedFile);

  // });
  // if (errorMessage.value.length <= 0) reader.readAsDataURL(event.target.files[0]);
}
</script>

<template>
  <div>
    <label class="block font-medium">{{
      props.label
    }}</label>
    <div class="my-3 flex items-center flex-col space-y-6">
      <img v-if="image" :src="image"
        class="flex bg-cover h-24 min-w-[3rem] w-24 overflow-hidden rounded-full bg-tileset-grey-2 bg-contain bg-no-repeat bg-center">
      <div v-else
        class="flex bg-cover h-24 min-w-[3rem] w-24 overflow-hidden rounded-full bg-tileset-grey-2 bg-contain bg-no-repeat bg-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="flex w-12 h-12 m-auto self-center">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>

      <input @change="previewFiles" type="file" accept="image/*" id="image-input"
        class="flex w-full focus:outline-tileset-blue rounded-md border border-tileset-grey-5 focus:border-tileset-blue focus:ring-tileset-blue py-2 px-3 text-sm font-normal  shadow-sm" />
    </div>
  </div>
  <p v-if="errorMessage.length > 0" class="font-light text-tileset-red text-right text-sm italic px-4 sm:px-6">
    {{ errorMessage }}
  </p>
</template>

<style scoped></style>
