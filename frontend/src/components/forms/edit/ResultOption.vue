<script setup>
const props = defineProps(["data", "index", "open", "close"]);
const emit = defineEmits(["editResult", "deleteResult"]);
function editResult() {
  emit("editResult");
}
function deleteResult() {
  emit("deleteResult");
}
</script>
<template>
  <div
    class="flex flex-col container min-w-full mx-auto items-center justify-center bg-tileset-grey-1 shadow list-item-container">
    <ul class="flex flex-col w-full">
      <li class="flex flex-row">
        <div class="hover:bg-gray-50 flex flex-1 items-center p-4">
          <div class="flex flex-col w-10 h-10 justify-center items-center mr-4">
            <img v-if="props.data.picture" alt="profil" :src="props.data.picture"
              class="mx-auto object-cover rounded-full h-10 w-10" />
            <div v-if="!props.data.picture" class="bg-tileset-full-white rounded-full w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="flex w-6 h-6 m-auto mt-2 self-center">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
          <div class="flex-1 pl-1">
            <div class="font-medium dark:text-white">
              {{ props.data.name }}
            </div>
            <div class="text-gray-600 dark:text-gray-200 text-sm">
              {{ props.data.description }}
            </div>
          </div>
          <div class="flex justify-between">
            <button @click="editResult()" type="button"
              class="flex w-10 h-10 mx-2 rounded-md border border-transparent bg-tileset-blue text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-blue-1 focus:outline-none sm:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="m-auto w-6 h-6 stroke-tileset-white">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <button @click="deleteResult()" type="button"
              class="flex w-10 h-10 mx-2 rounded-md border border-transparent bg-tileset-red text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-red-1 focus:outline-none sm:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="m-auto w-6 h-6 stroke-tileset-white">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<style scoped></style>