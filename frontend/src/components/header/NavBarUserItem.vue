<script setup>
const props = defineProps(["title", "route"]);
</script>

<template>
  <li>
    <router-link
      :to="props.route"
      class="block py-2 px-4 text-sm hover:bg-tileset-light-blue"
      aria-current="page"
      >{{ props.title }}</router-link
    >
  </li>
</template>

<style scoped></style>
