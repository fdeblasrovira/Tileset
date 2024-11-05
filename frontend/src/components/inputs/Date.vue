<script setup>
const props = defineProps(["label", "modelValue", "format"]);
const emits = defineEmits(["update:modelValue"]);
</script>

<template>
  <label :for="props.name" class="block font-medium"
    >{{ props.label }}
    <input
      :type="props.format"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="mt-1 block w-full h-10 rounded-md border font-normal shadow-sm focus:border-tileset-blue focus:ring-tileset-blue sm:text-sm"
    />
  </label>
</template>

<style scoped></style>
