<script setup>
const props = defineProps(["label", "name", "type", "placeholder", "modelValue"]);
const emits = defineEmits(["update:modelValue"]);
</script>

<template>
  <label :for="props.name" class="block font-medium w-full"
    >{{ props.label }}
    <input
      :type="props.type"
      :name="props.name"
      :id="props.name"
      :placeholder="props.placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="mt-1 block w-full h-10 rounded-md border font-normal shadow-sm focus:border-tileset-blue focus:ring-tileset-blue sm:text-sm"
    />
  </label>
</template>

<style scoped></style>
