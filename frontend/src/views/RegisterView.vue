<script setup>
import { ref, watch } from "vue";
import Input from "../components/inputs/Input.vue";
import FullButton from "../components/buttons/FullButton.vue";
import urlList from "../config/urlList"
import router from "../router/index";
import utils from "@/utils/fetch";
import { useAuthStore } from "@/stores/auth"
import toastConfig from "@/config/toast"
import Toastify from "toastify-js"

const authFormData = ref({
  email: "",
  password: "",
  fullName: "",
})

const passwordCheck = ref("");
const errorMessage = ref("");

// Reset error message in case of new user input
watch(authFormData.value, () => {
  errorMessage.value = "";
});

watch(passwordCheck.value, () => {
  errorMessage.value = "";
});

const authData = useAuthStore();

async function register() {
  console.log(authFormData.value, passwordCheck.value)
  if (authFormData.value.email.trim().length <= 0 ||
    authFormData.value.password.trim().length <= 0 ||
    authFormData.value.fullName.trim().length <= 0) {
    errorMessage.value = "There are blank fields"
    return;
  }
  if (passwordCheck.value != authFormData.value.password) {
    errorMessage.value = "Passwords are not the same"
    return;
  }

  const response = await utils.postData(urlList.BACKEND_REGISTER, authFormData.value)
  console.log(response);

  if (response.message == "UniqueError") {
    errorMessage.value = "Email already in use"
    return;
  }

  if (response.code == 200) {
    authData.authenticated = true;
    authData.accessToken = response.accessToken;

    Toastify(toastConfig).showToast();
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
        <Input @keyup.enter="register" v-model="authFormData.fullName" label="Full name" name="fullName" type="text"
          placeholder="" />
        <br>
        <Input @keyup.enter="register" v-model="authFormData.email" label="Email" name="email" type="text"
          placeholder="" />
        <br>
        <Input @keyup.enter="register" v-model="authFormData.password" label="Password" name="password" type="password"
          placeholder="" />
        <br>
        <Input @keyup.enter="register" v-model="passwordCheck" label="Confirm password" name="passwordCheck"
          type="password" placeholder="" />
        <br>
        <p v-if="errorMessage.length > 0" class="text-tileset-red text-right text-sm px-4 sm:px-6">
          {{ errorMessage }}
        </p>
        <FullButton @click="register" text="Register" color="bg-tileset-green" hover="hover:bg-tileset-green-1">
        </FullButton>
        <a href="/login" class="text-tileset-blue mt-2 ml-auto mr-0">Already have an account? Login here!</a>
      </div>
    </div>
  </div>
</template>
