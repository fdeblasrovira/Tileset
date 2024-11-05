<script setup>
const props = defineProps(["color", "hover", "text"]);
</script>

<template>
  <button
    v-bind:class="[props.color, props.hover]"
    class="flex h-8 justify-center rounded-md cursor-pointer px-2 items-center h-[40px]"
  >
    <h2 class="text-lg text-tileset-white font-bold mr-2">{{ props.text }}</h2>
    <slot></slot>
  </button>
</template>

<style scoped></style>
