<script setup>
import { ref } from "vue";
import ListItem from "./ListItem.vue";
import ListPagination from "./ListPagination.vue";
import ListSearch from "./ListSearch.vue";
import BaseButton from "../buttons/BaseButtonWithIcon.vue";
import router from "../../router/index";
import { useCreateTabulation } from "@/stores/createTabulation";
import { useLoadingStore } from '@/stores/loading'
import formData from "../../../test/data/formRegistrationData.json";
import urlList from "../../config/urlList"
import utils from "@/utils/fetch";
import { listFetchError } from "@/config/toast"
import Toastify from "toastify-js"

const tabData = useCreateTabulation();
const loadingData = useLoadingStore();

const forms = ref([]);
const totalItems = ref(0);

async function getFormList() {
  try {
    // Show loading animation
    loadingData.loading = true;
    const response = await utils.getData(urlList.BACKEND_GET_FORM_LIST)
    console.log(response)

    totalItems.value = response.count

    if (response.forms.length <= 0) forms.value = []
    else {
      forms.value = response.forms.map((form) => {
        return {
          formId: form.id,
          formName: form.GeneralInfos[0].formName,
          formDescription: form.GeneralInfos[0].description,
          // formImage: "http://s3.localhost.localstack.cloud:4566/tileset-development-user-images/1/1/1/form.jpeg",
          formImage: form.GeneralInfos[0].imageUrl,
        }
      })
    }
    console.log(forms.value)
  }
  catch (e) {
    console.log(e);
    Toastify(listFetchError).showToast();
  }
  finally {
    loadingData.loading = false;
  }
};
getFormList()


const openedItem = ref(0);
const lastOpenedItem = ref(0);

function onListItemClicked(formId) {
  lastOpenedItem.value =
    openedItem.value == lastOpenedItem.value ? 0 : openedItem.value;
  openedItem.value = formId;
}

async function routeToCreate() {
  // Reset tab data so the first page the user sees is the generalInfo tab
  tabData.currentTab = 1;
  await router.push("/create");
}


async function testRegisterData() {
  const copyFormData = { ...formData }
  delete copyFormData.generalInfo.picture;
  copyFormData.results.forEach((element) => { delete element.picture });

  const response = await utils.postData(urlList.BACKEND_CREATE_FORM, { formData: formData })
  console.log(response)

  // If the response is successful, in the response there will be image upload urls. We will use these to upload the necessary images.
  if (response.code == 200) {
    const formImageUpload = response.formImageUpload;
    const resultsImageUpload = response.resultsImageUpload;

    // Check that the amount of URLs and the amount of results match
    if (resultsImageUpload.length != formData.results.length) {
      console.log("Result number and URL number missmatch")
      return;
    }

    // Upload all the form images
    await utils.uploadImage(formImageUpload, formData.generalInfo.picture)

    for (let i = 0; i < formData.results.length; ++i) {
      const currentResult = formData.results[i]
      await utils.uploadImage(resultsImageUpload[i], currentResult.picture)
    }
  }
  else {
    // 
  }
}

async function testGetData() {
  const response = await utils.getData(urlList.BACKEND_GET_FORM + "?id=1")
  console.log(response)
}

async function testRegisterUser() {
  const authFormData = {
    email: "a@a.com",
    password: "1",
    fullName: "1",
  }
  const response = await utils.postData(urlList.BACKEND_REGISTER, authFormData)
  console.log(response)
}
</script>

<template>
  <div class="flex flex-row justify-between mb-3 items-center">
    <h2 class="text-lg mb-2 text-tileset-black">Forms: {{ totalItems }}</h2>
    <BaseButton @click="testRegisterUser" text="Register User" color="bg-tileset-green" hover="hover:bg-tileset-green-1"
      :class="{ glowingAnimation: forms.length <= 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        class="w-6 h-6 stroke-tileset-white m-auto">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </BaseButton>
    <BaseButton @click="testRegisterData" text="testRegisterData" color="bg-tileset-green"
      hover="hover:bg-tileset-green-1" :class="{ glowingAnimation: forms.length <= 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        class="w-6 h-6 stroke-tileset-white m-auto">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </BaseButton>
    <BaseButton @click="testGetData" text="testGetData" color="bg-tileset-green" hover="hover:bg-tileset-green-1"
      :class="{ glowingAnimation: forms.length <= 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        class="w-6 h-6 stroke-tileset-white m-auto">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </BaseButton>
    <BaseButton @click="routeToCreate" text="Create" color="bg-tileset-green" hover="hover:bg-tileset-green-1"
      :class="{ glowingAnimation: forms.length <= 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        class="w-6 h-6 stroke-tileset-white m-auto">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </BaseButton>
  </div>
  <ListSearch />

  <div class="flex flex-col container min-w-full mx-auto items-center justify-center">
    <ul class="flex flex-col divide-y w-full bg-tileset-grey-1 rounded-lg shadow">
      <div v-if="forms.length <= 0" class="h-20 flex items-center m-auto font-light italic">
        There are no forms yet
      </div>
      <div v-else>
        <ListItem v-for="form in forms" @list-item-clicked="onListItemClicked" :data="form" :key="form.formId"
          :position="start" :open="openedItem == form.formId" :close="lastOpenedItem == form.formId" />
      </div>
    </ul>
    <ListPagination v-if="forms.length > 0" :maxItemsPage="5" :totalItems="totalItems" :maxPaginationItems="5" />
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
