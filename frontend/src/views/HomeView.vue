<script setup>
import List from "../components/list/List.vue";
</script>

<template>
  <div class="flex grow flex-col justify-center content-center">
    <div class="flex justify-center">
      <div
        class="relative w-full my-[2rem] flex grow flex-col sm:max-w-[90%] xl:max-w-[1024px] bg-tileset-full-white shadow-2xl p-6 sm:rounded-lg"
      >
        <List />
      </div>
    </div>
  </div>
</template>
