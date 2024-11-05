<script setup>
const props = defineProps(["color", "hover", "text"]);
</script>

<template>
  <button
    v-bind:class="[props.color, props.hover]"
    class="flex mt-6 h-8 w-full justify-center rounded-md cursor-pointer px-2 items-center h-[40px]"
  >
    <h2 class="flex text-xl text-tileset-white font-bold mr-2">{{ props.text }}</h2>
    <slot></slot>
  </button>
</template>

<style scoped></style>
