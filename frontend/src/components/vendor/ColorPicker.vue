<script setup>
import { ref } from "vue";
const props = defineProps(["label", "displayColor", "modelValue"]);
const emit = defineEmits(["update:modelValue"]);

function handleColorChange(event) {
  console.log(event.target.value);
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <div class="mb-7">
    <label class="block font-medium mb- 3">{{ props.label }} </label>
    <input
      type="color"
      :value="displayColor"
      @change="handleColorChange"
      class="mt-1 w-full h-10 rounded shadow-sm focus:border-tileset-blue focus:ring-tileset-blue"
    />
  </div>
</template>

<style scoped></style>
