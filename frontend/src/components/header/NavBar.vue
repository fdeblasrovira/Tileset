<script setup>
import { ref } from "vue";
import NavBarItem from "./NavBarItem.vue";
import NavBarUserItem from "./NavBarUserItem.vue";
import { useAccountStore } from "@/stores/account";

const accountData = useAccountStore();
const showUserMenu = ref(false);

function changeUserMenuFocus(focus) {
  // showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value && focus) focus = false;
  showUserMenu.value = focus;
}
</script>

<template>
  <nav
    class="flex z-50 grow bg-tileset-white pl-2 sm:px-4 py-0 dark:tileset-dark-blue border-b-2 border-b-tileset-grey-5 shadow-lg"
  >
    <div
      class="mx-1 container flex flex-wrap justify-between items-center mx-auto w-full min-w-full grow-0"
    >
      <a href="https://tileset.net/" class="flex items-center">
        <img src="logo.webp" class="mr-3 h-6 sm:h-9" alt="Tileset Logo" />
      </a>
      <div class="flex md:order-2">
        <button
          @click="changeUserMenuFocus(true)"
          type="button"
          class="flex text-sm bg-gray-800 rounded-full md:mr-0"
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom"
        >
          <span class="sr-only">Open user menu</span>
          <img
            class="w-8 h-8 my-auto rounded-full"
            src="https://www.gstatic.com/webp/gallery/4.sm.webp"
            alt="user photo"
          />
        </button>
        <!-- Dropdown menu -->
        <div
          v-if="showUserMenu"
          class="bg-tileset-white z-50 my-4 text-base list-none bg-white border border-tileset-grey-5 rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
          id="user-dropdown"
          style="
            position: absolute;
            inset: 0px 0.5rem auto auto;
            margin: 0px;
            transform: translateY(30%);
          "
          data-popper-reference-hidden=""
          data-popper-escaped=""
          data-popper-placement="bottom"
        >
          <div class="py-3 px-4">
            <span class="block text-sm text-gray-900 dark:text-white">{{
              accountData.accountName
            }}</span>
            <span
              class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400"
              >{{ accountData.accountEmail }}</span
            >
          </div>
          <ul class="py-1" aria-labelledby="user-menu-button">
            <NavBarUserItem title="Account" route="/account" />
            <NavBarUserItem title="Settings" route="/settings" />
            <NavBarUserItem title="Sign out" route="/logout" />
          </ul>
        </div>
        <button
          data-collapse-toggle="mobile-menu-2"
          type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        class="hidden justify-between w-full md:flex md:w-auto md:order-1 grow"
        id="mobile-menu-2"
      >
        <ul
          class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <NavBarItem title="Home" route="/" />
          <NavBarItem title="Explore" route="/test" />
          <NavBarItem title="Contact" route="/contact" />
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
