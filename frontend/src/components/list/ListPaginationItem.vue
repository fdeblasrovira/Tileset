<script setup>
const props = defineProps(["selected", "index"]);
console.log(props.selected);
</script>

<template>
  <li v-if="!props.selected">
    <a
      href="#"
      class="py-2 px-3 leading-tight text-gray-500 bg-tileset-grey-1 border border-gray-300 hover:bg-tileset-grey-2 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >{{ props.index }}</a
    >
  </li>
  <li v-else>
    <a
      href="#"
      class="py-2 px-3 leading-tight text-gray-500 bg-tileset-light-blue border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >{{ props.index }}</a
    >
  </li>
</template>

<style scoped></style>
