<script setup>
import { ref } from "vue";

const props = defineProps(["label", "name", "placeholder", "modelValue", "maxCharacters"]);
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
  <p v-if="props.modelValue.length > props.maxCharacters" class="font-light text-tileset-red text-right text-sm px-4 sm:px-6 italic">
    {{ `${props.modelValue.length}/${props.maxCharacters}` }}
  </p>
  <p v-else class="font-light text-right text-sm px-4 sm:px-6 italic">
    {{ `${props.modelValue.length}/${props.maxCharacters}` }}
  </p>
</template>

<style scoped></style>
