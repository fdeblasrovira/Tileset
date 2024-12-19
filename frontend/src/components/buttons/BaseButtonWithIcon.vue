<script setup>
import { ref } from "vue";

const props = defineProps(["color", "hover", "text", "disabled"]);
const disabled = ref(props.disabled ? "cursor-not-allowed" : "cursor-pointer");

</script>

<template>
  <button
    v-bind:class="[props.color, props.hover, disabled]"
    class="flex h-8 justify-center rounded-md px-2 items-center h-[40px]"
  >
    <h2 class="text-lg text-tileset-white font-bold mr-2 ml-2">{{ props.text }}</h2>
    <slot></slot>
  </button>
</template>

<style scoped></style>
