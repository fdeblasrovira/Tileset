<script setup>
import NavBar from "./components/header/NavBar.vue";
import Spinner from "./components/overlays/Spinner.vue";
import { useLoadingStore } from "@/stores/loading";
import { useAuthStore } from "@/stores/auth";

const loadingData = useLoadingStore();
const authData = useAuthStore();

</script>

<template>
  <!-- toast stylesheet -->
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

  <div class="flex min-w-full min-h-screen flex-col">
    <Spinner :open="loadingData.loading" />

    <header class="flex min-h-min sticky top-0 z-50">
      <NavBar v-if="authData.authenticated"/>
    </header>
    <main class="flex justify-center grow overflow-y-scroll flex-col">
      <router-view></router-view>
      
    </main>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
