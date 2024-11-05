<script setup>
import { ref, computed } from "vue";
import ListPaginationItem from "./ListPaginationItem.vue";

const props = defineProps(["maxItemsPage", "totalItems", "maxPaginationItems"]);
const offset = ref(0);

const totalNumberOfPagination =
  Math.floor(props.totalItems / props.maxItemsPage) + 1;

const elementsToDisplay = Math.min(
  props.maxPaginationItems,
  totalNumberOfPagination
);

const currentPagination = computed(() => {
  return Number(offset.value / props.maxItemsPage + 1);
});

// Calculates the left-most index number of pagination
const startingIndex = computed(() => {
  let additionalPaginationItems = Math.floor(props.maxPaginationItems / 2);
  if (currentPagination.value - additionalPaginationItems < 1) {
    // Pagination elements will start with 1
    return 0;
  } else if (
    currentPagination.value + additionalPaginationItems >
    totalNumberOfPagination
  ) {
    // Pagination elements are reaching the end of the list
    let overflowingAmount =
      currentPagination.value +
      additionalPaginationItems -
      totalNumberOfPagination;
    return (
      currentPagination.value -
      additionalPaginationItems -
      overflowingAmount -
      1
    );
  } else {
    return currentPagination.value - additionalPaginationItems - 1;
  }
});

const emit = defineEmits(["next", "previous", "goto"]);

function nextOffset() {
  // Only calculate if it does not exceed the max number
  if (offset.value + props.maxItemsPage < props.totalItems) {
    offset.value += props.maxItemsPage;
  }
  emit("next");
  console.log("startingIndex", startingIndex.value);
}

function previousOffset() {
  // Only calculate if the offset will be greater or equal than 0
  if (offset.value - props.maxItemsPage >= 0) {
    offset.value -= props.maxItemsPage;
  }
  emit("previous");
  console.log("startingIndex", startingIndex.value);
}

function goToOffset(pagination) {
  // Set the offset to the clicked pagination
  offset.value = pagination * props.maxItemsPage - props.maxItemsPage;
  emit("goto");
  console.log("startingIndex", startingIndex.value);
}
</script>

<template>
  <nav class="flex justify-center" aria-label="Pagination">
    <ul class="inline-flex mt-8 cursor-pointer">
      <li>
        <a
          @click="previousOffset()"
          class="py-2 px-3 ml-0 leading-tight text-gray-500 bg-tileset-grey-1 rounded-l-lg border border-gray-300 hover:bg-tileset-grey-2 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Previous</a
        >
      </li>
      <template v-for="i in elementsToDisplay">
        <ListPaginationItem
          @click="goToOffset(i + startingIndex)"
          v-if="i + startingIndex == currentPagination"
          :index="currentPagination"
          :selected="true"
        />
        <ListPaginationItem
          @click="goToOffset(i + startingIndex)"
          v-else-if="i + startingIndex > currentPagination"
          :index="i + startingIndex"
          :selected="false"
        />
        <ListPaginationItem
          @click="goToOffset(i + startingIndex)"
          v-else-if="i + startingIndex < currentPagination"
          :index="i + startingIndex"
          :selected="false"
        />
      </template>
      <li>
        <a
          @click="nextOffset()"
          class="py-2 px-3 leading-tight text-gray-500 bg-tileset-grey-1 rounded-r-lg border border-gray-300 hover:bg-tileset-grey-2 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
