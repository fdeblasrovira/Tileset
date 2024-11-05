<script setup>
const props = defineProps(["label", "name", "placeholder", "modelValue"]);
const emits = defineEmits(["update:modelValue"]);
</script>

<template>
  <label :for="props.name" class="block font-medium"
    >{{ props.label }}
    <textarea
      :name="props.name"
      :id="props.name"
      :placeholder="props.placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="3"
      class="mt-1 block w-full rounded-md border font-normal shadow-sm focus:border-tileset-blue focus:ring-tileset-blue sm:text-sm"
    ></textarea>
  </label>
</template>

<style scoped></style>
