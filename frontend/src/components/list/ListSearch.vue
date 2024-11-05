<script setup>
import { ref } from "vue";
import ListSortByItem from "./ListSortByItem.vue";

const sortVisible = ref(false);
const sortByText = ref("Sort By");
const sortByValue = ref(0);

function changeSortBy(value, text) {
  sortByValue.value = value;
  sortByText.value = text;
  console.log(sortByValue.value);
}
</script>

<template>
  <form class="flex items-center mb-3">
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        type="text"
        id="simple-search"
        class="bg-tileset-full-white border border-tileset-grey-5 text-sm rounded-lg focus:ring-1 focus:ring-tileset-blue outline-tileset-blue focus:border-tileset-blue block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search"
        required
      />
    </div>
    <div
      @click="sortVisible = !sortVisible"
      class="relative inline-block text-left"
    >
      <div class="ml-2">
        <button
          type="button"
          class="inline-flex break-keep w-full justify-center rounded-md border focus:ring-1 focus:ring-tileset-blue outline-tileset-blue focus:border-tileset-blue border-tileset-grey-5 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <p
            v-bind:class="
              sortByValue > 0 ? 'text-tileset-black' : 'text-tileset-grey-5'
            "
            class="max-w-[8rem] w-full whitespace-nowrap text-left text-sm font-light"
          >
            {{ sortByText }}
          </p>
          <svg
            class="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div
        :class="{ invisible: !sortVisible }"
        class="absolute right-0 z-10 mt-1 w-56 origin-top-right divide-gray-100 border rounded-md border-tileset-grey-5 bg-tileset-full-white shadow-lg"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <ListSortByItem
          @change-sort-by="changeSortBy"
          text="Name ASC"
          :value="1"
        />
        <ListSortByItem
          @change-sort-by="changeSortBy"
          text="Name DESC"
          :value="2"
        />
        <ListSortByItem
          @change-sort-by="changeSortBy"
          text="Popularity ASC"
          :value="3"
        />
        <ListSortByItem
          @change-sort-by="changeSortBy"
          text="Popularity DESC"
          :value="4"
        />
        <ListSortByItem
          @change-sort-by="changeSortBy"
          text="Creation date ASC"
          :value="5"
        />
        <ListSortByItem
          @change-sort-by="changeSortBy"
          text="Creation date DESC"
          :value="6"
        />
      </div>
    </div>
    <button
      type="submit"
      class="bg-tileset-blue p-2.5 ml-2 text-sm font-medium text-white rounded-lg hover:bg-tileset-dark-blue"
    >
      <svg
        class="w-5 h-5 text-tileset-full-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
      <span class="sr-only">Search</span>
    </button>
  </form>
</template>

<style scoped></style>
