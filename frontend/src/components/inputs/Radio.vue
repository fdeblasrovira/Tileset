<script setup>
const props = defineProps(["label", "name", "id", "value", "checked"]);
</script>

<template>
  <div class="flex items-center">
    <input
      @input="$emit('update:modelValue', $event.target.value)"
      :id="props.id"
      :name="props.name"
      :value="props.value"
      :checked="props.checked"
      type="radio"
      class="h-4 w-4 mt-3 text-tileset-blue focus:ring-0"
    />
    <label :for="props.id" class="ml-3 block font-normal mt-3">{{
      props.label
    }}</label>
  </div>
</template>

<style scoped></style>
