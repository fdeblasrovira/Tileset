<script setup>
import { ref } from "vue";
import NavBar from "./components/header/NavBar.vue";
import Spinner from "./components/overlays/Spinner.vue";
import { useLoadingStore } from "@/stores/loading";

const loadingData = useLoadingStore();
</script>

<template>
  <div class="flex min-w-full min-h-screen flex-col">
    <header class="flex min-h-min sticky top-0 z-50">
      <NavBar />
    </header>
    <main class="flex justify-center grow overflow-y-scroll flex-col">
      <Spinner :open="loadingData.loading" />
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
