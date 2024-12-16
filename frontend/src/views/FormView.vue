<script setup>
// import { watch, ref } from "vue";
// import urlList from "../config/urlList"
// import router from "../router/index";
import { useRoute } from 'vue-router';
// import utils from "@/utils/fetch";


const route = useRoute(); // Access the current route
const id = route.params.id; // 'qwerty' will be stored in params.id
console.log("id")
console.log(id)

</script>

<template>
  <div class="flex grow flex-col justify-center content-center">
    <div class="flex justify-center">
      <div
        class="relative w-full my-[2rem] flex grow flex-col sm:max-w-[90%] xl:max-w-[1024px] bg-tileset-full-white shadow-2xl p-6 sm:rounded-lg">
        <img src="../assets/logo.webp" class="w-64" alt="Tileset Logo" />
        <br>
        <br>
        
      </div>
    </div>
  </div>
</template>
