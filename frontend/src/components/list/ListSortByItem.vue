<script setup>
const props = defineProps(["value", "text"]);
const emit = defineEmits(["changeSortBy"]);

function sortItemClick() {
  emit("changeSortBy", props.value, props.text);
}
</script>

<template>
  <a
    @click="sortItemClick()"
    class="block px-4 py-2 text-sm hover:bg-tileset-light-blue"
    role="menuitem"
    tabindex="-1"
    >{{ props.text }}</a
  >
</template>

<style scoped></style>
