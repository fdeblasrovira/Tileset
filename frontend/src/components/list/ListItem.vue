<script setup>
import { ref } from "vue";
import BaseButton from "../buttons/BaseButtonWithIcon.vue";
import Modal from "../overlays/Modal.vue";

const props = defineProps(["data", "position", "open", "close"]);
const emit = defineEmits(["listItemClicked"]);

function openListItem(e) {
  console.log("itemclicked");
  emit("listItemClicked", props.data.formId);
}

const showModal = ref(false);

function changeModalDisplay(display) {
  console.log("Modal display");
  showModal.value = display;
}

function deleteForm() {
  showModal.value = false;
}
</script>

<template>
  <div
    @click="openListItem"
    class="flex flex-col container min-w-full mx-auto items-center justify-center hover:bg-tileset-grey-2 bg-tileset-grey-1 dark:bg-gray-800 shadow list-item-container"
  >
    <ul class="flex flex-col w-full">
      <li class="flex flex-row">
        <div
          class="select-none cursor-pointer hover:bg-gray-50 flex flex-1 items-center p-4"
        >
          <div class="flex flex-col w-10 h-10 justify-center items-center mr-4">
            <a href="#" class="block relative">
              <img
                alt="profil"
                :src="props.data.formImage"
                class="mx-auto object-cover rounded-full h-10 w-10"
              />
            </a>
          </div>
          <div class="flex-1 pl-1">
            <div class="font-medium dark:text-white">
              {{ props.data.formName }}
            </div>
            <div class="text-gray-600 dark:text-gray-200 text-sm">
              {{ props.data.formDescription }}
            </div>
          </div>

          <button class="w-10 text-right flex justify-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 transition-all"
              :class="[props.open && !props.close ? '-rotate-90' : 'rotate-90']"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </li>
    </ul>
  </div>
  <div
    v-bind:class="[
      props.open ? 'itemListOpen' : '',
      props.close ? 'itemListClose' : '',
    ]"
    class="bg-tileset-white w-full border-none h-0"
  >
    <div
      class="flex flex-row justify-center items-center h-full overflow-hidden flex-wrap"
    >
      <BaseButton
        text="View"
        color="bg-tileset-grey-4"
        hover="hover:bg-tileset-grey-5"
        class="m-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 stroke-tileset-white m-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </BaseButton>
      <BaseButton
        text="Edit"
        color="bg-tileset-green"
        hover="hover:bg-tileset-green-1"
        class="m-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 stroke-tileset-white m-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </BaseButton>
      <BaseButton
        text="Share"
        color="bg-tileset-blue"
        hover="hover:bg-tileset-dark-blue"
        class="m-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 stroke-tileset-white m-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
          />
        </svg>
      </BaseButton>
      <BaseButton
        text="Statistics"
        color="bg-tileset-yellow"
        hover="hover:bg-tileset-yellow-1"
        class="m-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 stroke-tileset-white m-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      </BaseButton>
      <BaseButton
        @click="changeModalDisplay(true)"
        text="Delete"
        color="bg-tileset-red"
        hover="hover:bg-tileset-red-1"
        class="m-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 stroke-tileset-white m-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </BaseButton>
    </div>
  </div>
  <Modal
    :open="showModal"
    title="Delete form"
    description="Are you sure you want to delete this form?"
    svgBackgroundColor="bg-tileset-red"
  >
    <template #svg>
      <svg
        class="h-6 w-6 stroke-tileset-white -mt-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
        />
      </svg>
    </template>
    <template #buttons>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          @click="deleteForm"
          type="button"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-tileset-red px-4 py-2 text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-red-1 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Delete
        </button>
        <button
          @click="showModal = false"
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-tileset-grey-5 px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
@media screen and (max-width: 407px) {
  @keyframes expand {
    from {
      height: 0px;
    }
    to {
      height: 228px;
    }
  }

  @keyframes collapse {
    from {
      height: 228px;
    }
    to {
      height: 0px;
    }
  }
  .itemListOpen {
    height: 228px;
    animation-name: expand;
    animation-duration: 0.3s;
  }
  .itemListClose {
    height: 0px;
    animation-name: collapse;
    animation-duration: 0.3s;
  }
}
@media screen and (min-width: 408px) {
  @keyframes expand {
    from {
      height: 0px;
    }
    to {
      height: 152px;
    }
  }

  @keyframes collapse {
    from {
      height: 152px;
    }
    to {
      height: 0px;
    }
  }
  .itemListOpen {
    height: 152px;
    animation-name: expand;
    animation-duration: 0.3s;
  }
  .itemListClose {
    height: 0px;
    animation-name: collapse;
    animation-duration: 0.3s;
  }
}
@media screen and (min-width: 703px) {
  @keyframes expand {
    from {
      height: 0px;
    }
    to {
      height: 76px;
    }
  }

  @keyframes collapse {
    from {
      height: 76px;
    }
    to {
      height: 0px;
    }
  }
  .itemListOpen {
    height: 76px;
    animation-name: expand;
    animation-duration: 0.3s;
  }
  .itemListClose {
    height: 0px;
    animation-name: collapse;
    animation-duration: 0.3s;
  }
}
</style>
