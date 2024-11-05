<script setup>
const props = defineProps(["label", "name", "id", "modelValue"]);
const emits = defineEmits(["update:modelValue"]);

</script>

<template>
  <label :for="props.id" class="block font-medium"
    >{{ props.label }}
    <select
      :id="props.id"
      :value="modelValue"
      :name="props.name"
      @change="$emit('update:modelValue', $event.target.value)"
      class="mt-1 block w-full h-10 rounded-md font-normal border bg-tileset-full-white py-2 px-3 shadow-sm focus:border-tileset-blue focus:ring-tileset-blue focus:outline-none sm:text-sm"
    >
      <slot></slot></select
  ></label>
</template>

<style scoped></style>
