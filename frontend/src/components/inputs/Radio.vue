<script setup>
const props = defineProps(["label", "name", "id"]);
</script>

<template>
  <div class="flex items-center">
    <input
      :id="props.id"
      :name="props.name"
      type="radio"
      class="h-4 w-4 mt-3 text-tileset-blue focus:ring-0"
    />
    <label :for="props.id" class="ml-3 block font-normal mt-3">{{
      props.label
    }}</label>
  </div>
</template>

<style scoped></style>
