<script setup>
const props = defineProps(["title", "route"]);
</script>

<template>
  <li>
    <router-link
      :to="props.route"
      class="hover:text-tileset-blue block py-2 pr-4 pl-3 text-white rounded md:bg-transparent md:p-0"
      aria-current="page"
      >{{ props.title }}</router-link
    >
  </li>
</template>

<style scoped></style>
