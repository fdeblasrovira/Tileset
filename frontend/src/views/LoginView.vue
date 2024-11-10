<script setup>
import { ref } from "vue";
import Input from "../components/inputs/Input.vue";
import FullButton from "../components/buttons/FullButton.vue";
import urlList from "../config/urlList"
import router from "../router/index";

const authFormData = ref({
  username: "",
  password: ""
})

async function login() {
  try {
    const response = await fetch(urlList.BACKEND_LOGIN, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify(authFormData.value)
    });
    if (!response.ok) {
      // throw new Error(`Response status: ${response.status}`);
      console.log("error: "+response.status)
    }
    else{
      await router.push({ name: 'Home'})
    }
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
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
        <Input @keyup.enter="login" v-model="authFormData.username" label="Username" name="username" type="text" placeholder="" />
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
