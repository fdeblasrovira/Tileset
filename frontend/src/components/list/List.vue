<script setup>
import { ref } from "vue";
import ListItem from "./ListItem.vue";
import ListPagination from "./ListPagination.vue";
import ListSearch from "./ListSearch.vue";
import BaseButton from "../buttons/BaseButtonWithIcon.vue";
import { useLoadingStore } from "@/stores/loading";
import router from "../../router/index";

const loadingData = useLoadingStore();

const forms = ref([
  {
    formId: 1,
    formName: "Form1",
    formDescription: "Form description",
    formImage:
      "https://raw.githubusercontent.com/IQAndreas/sample-images/gh-pages/100-100-color/00.jpg",
    views: "1670",
  },
  {
    formId: 2,
    formName: "What animal are you?",
    formDescription: "What animal are you? test yourself.",
    formImage:
      "https://raw.githubusercontent.com/IQAndreas/sample-images/gh-pages/100-100-color/01.jpg",
    views: "15647",
  },
  {
    formId: 3,
    formName: "Testing something",
    formDescription: "Just a test form",
    formImage:
      "https://raw.githubusercontent.com/IQAndreas/sample-images/gh-pages/100-100-color/02.jpg",
    views: "80",
  },
  {
    formId: 4,
    formName: "Lost in the jungle",
    formDescription: "Escape the jungle",
    formImage:
      "https://raw.githubusercontent.com/IQAndreas/sample-images/gh-pages/100-100-color/03.jpg",
    views: "155",
  },
  {
    formId: 5,
    formName: "Zombiez",
    formDescription:
      "Survive in this apocalypse. Escape the zombies and venture into a world of madness",
    formImage:
      "https://raw.githubusercontent.com/IQAndreas/sample-images/gh-pages/100-100-color/04.jpg",
    views: "0",
  },
  {
    formId: 6,
    formName: "Form1",
    formDescription: "Form description",
    formImage:
      "https://raw.githubusercontent.com/IQAndreas/sample-images/gh-pages/100-100-color/00.jpg",
    views: "1670",
  },
]);

const openedItem = ref(0);
const lastOpenedItem = ref(0);

function onListItemClicked(formId) {
  lastOpenedItem.value =
    openedItem.value == lastOpenedItem.value ? 0 : openedItem.value;
  openedItem.value = formId;
}

async function routeToCreate() {
  // Change global loading state to true
  loadingData.loading = true;
  await router.push("/create");
  loadingData.loading = false;
}
const totalItems = 114;
</script>

<template>
  <div class="flex flex-row justify-between mb-3 items-center">
    <h2 class="text-lg mb-2 text-tileset-black">Forms: {{ totalItems }}</h2>
    <BaseButton
      @click="routeToCreate"
      text="Create"
      color="bg-tileset-green"
      hover="hover:bg-tileset-green-1"
      :class="{ glowingAnimation: forms.length <= 0 }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        class="w-6 h-6 stroke-tileset-white m-auto"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </BaseButton>
  </div>
  <ListSearch />

  <div
    class="flex flex-col container min-w-full mx-auto items-center justify-center"
  >
    <ul
      class="flex flex-col divide-y w-full bg-tileset-grey-1 rounded-lg shadow"
    >
      <div
        v-if="forms.length <= 0"
        class="h-20 flex items-center m-auto font-light italic"
      >
        There are no forms yet
      </div>
      <ListItem
        v-for="(form, index) in forms"
        @list-item-clicked="onListItemClicked"
        :data="form"
        :key="form.formId"
        :position="start"
        :open="openedItem == form.formId"
        :close="lastOpenedItem == form.formId"
      />
    </ul>
    <ListPagination
      :maxItemsPage="10"
      :totalItems="totalItems"
      :maxPaginationItems="5"
    />
  </div>
</template>

<style scoped>
@keyframes glowing {
  0% {
    box-shadow: 0 0 5px #32b70a;
  }
  50% {
    box-shadow: 0 0 20px #3fbf18;
  }
  100% {
    box-shadow: 0 0 5px #32b70a;
  }
}

.glowingAnimation {
  animation: glowing 1300ms infinite;
}
</style>
