<script setup>
import { ref } from "vue";
import Input from "../components/inputs/Input.vue";
import FullButton from "../components/buttons/FullButton.vue";
import urlList from "../config/urlList"
import router from "../router/index";
import utils from "@/utils/fetch";
import { useAuthStore } from '@/stores/auth'

const authFormData = ref({
  email: "",
  password: ""
})

const authData = useAuthStore();

async function login() {
  const response = await utils.postData(urlList.BACKEND_LOGIN, authFormData.value)
  console.log(response);

  if (response.code == 200){
    authData.authenticated = true;
    authData.accessToken = response.accessToken;
    
    await router.push({ name: 'Home' })
  }
}

</script>

<template>
  <div class="flex grow flex-col justify-center content-center">
    <div class="flex justify-center">
      <div
        class="relative w-full my-[2rem] flex grow flex-col sm:max-w-[90%] xl:max-w-[1024px] bg-tileset-full-white shadow-2xl p-6 sm:rounded-lg">
        <img src="logo.webp" class="w-64" alt="Tileset Logo" />
        <br>
        <br>
        <Input @keyup.enter="login" v-model="authFormData.email" label="Email" name="email" type="text" placeholder="" />
        <br>
        <Input @keyup.enter="login" v-model="authFormData.password" label="Password" name="password" type="password" placeholder="" />
        <br>
        <FullButton @click="login" text="Login" color="bg-tileset-green" hover="hover:bg-tileset-green-1">
        </FullButton>
        <a href="/register" class="text-tileset-blue mt-2 ml-auto mr-0">Don't have an account? Register here!</a>
      </div>
    </div>
  </div>
</template>
