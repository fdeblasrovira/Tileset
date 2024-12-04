<script setup>
import { reactive, ref, watch } from "vue";
import FullButton from "../buttons/FullButton.vue";
import GeneralInfo from "./tabs/GeneralInfo.vue";
import Attributes from "./tabs/Attributes.vue";
import Questions from "./tabs/Questions.vue";
import Results from "./tabs/Results.vue";
import urlList from "../../config/urlList"
import utils from "@/utils/fetch";
import imageHandling from "@/utils/imageHandling";
import { useCreateTabulation } from "@/stores/createTabulation";
import { useLoadingStore } from '@/stores/loading'
import { formCreationSuccess, formCreationError } from "@/config/toast"
import Toastify from "toastify-js"
import router from "@/router/index";

const loadingData = useLoadingStore();
const tabData = useCreateTabulation();

const formData = reactive({
  generalInfo: { "formName": "", "description": "" },
  attributes: [],
  questions: [],
  results: [],
});

// After any change, reset errorMessage
watch(formData.generalInfo, () => {
  errorMessage.value = ""
});
watch(formData.attributes, () => {
  errorMessage.value = ""
});
watch(formData.questions, () => {
  errorMessage.value = ""
});
watch(formData.results, () => {
  errorMessage.value = ""
});

let errorMessage = ref("")

function updateGeneralInfo(newGeneralInfo) {
  formData.generalInfo = newGeneralInfo;
}

function updateAttributes(newAttributes) {
  formData.attributes = newAttributes;
}

function updateQuestions(newQuestions) {
  formData.questions = newQuestions;
}

function updateResults(newResults) {
  formData.results = newResults;
}

async function saveContents() {
  console.log(formData)
  const result = validateForm();
  if (!result) return;

  // We copy the form data because we need to remove the images before sending it to the server
  const copyFormData = JSON.parse(JSON.stringify(formData))
  delete copyFormData.generalInfo.picture

  copyFormData.results.forEach((element) => {delete element.picture})

  console.log("copyFormData")
  console.log(copyFormData)
  console.log("formData")
  console.log(formData)

  // Show loading animation
  loadingData.loading = true;

  const response = await utils.postData(urlList.BACKEND_CREATE_FORM, { formData: copyFormData }, true)
  console.log(response)

  // If the response is successful, in the response there will be image upload urls. We will use these to upload the necessary images.
  if (response.code == 200) {
    const formImageUpload = response.formImageUpload;
    const resultsImageUpload = response.resultsImageUpload;

    // Check that the amount of URLs and the amount of results match
    if (resultsImageUpload.length != formData.results.length) {
      console.log("Result number and URL number missmatch")
      Toastify(formCreationError).showToast();
      return;
    }

    const blobForm = await imageHandling.dataUrlToFile(formData.generalInfo.picture, "form.jpeg")
    
    // Upload all the form images
    const formImageResponse = await utils.uploadImage(formImageUpload, blobForm)

    console.log(formImageResponse)
    for (let i = 0; i < formData.results.length; ++i) {
      const currentResult = formData.results[i]
      const blobResult = await imageHandling.dataUrlToFile(currentResult.picture, (i+1)+".jpeg")
      
      await utils.uploadImage(resultsImageUpload[i], blobResult)
    }

    // Show successful toast
    Toastify(formCreationSuccess).showToast();

    await router.push({ name: 'Home' })
  }
  else {
    // Error in creating a form. Show error as a toast
    Toastify(formCreationError).showToast();
  }

  // Unshow loading animation
  loadingData.loading = false;
}

// Validates if the data entered in the form is in the correct form or not
function validateForm() {
  errorMessage.value = ""
  const generalInfoResult = validateGeneralInfo();
  if (!generalInfoResult) {
    // show the general info form
    tabData.currentTab = 1
    return false;
  }

  const attributeResult = validateAttribute();
  if (!attributeResult) {
    // show the attribute form
    tabData.currentTab = 2
    return false;
  }

  const questionResult = validateQuestion();
  if (!questionResult) {
    // show the question form
    tabData.currentTab = 3
    return false;
  }

  const resultResult = validateResult();
  if (!resultResult) {
    // show the result form
    tabData.currentTab = 4
    return false;
  }
  return true;
}

function validateGeneralInfo() {
  if (!formData.generalInfo.formName || formData.generalInfo.formName === undefined) {
    errorMessage.value = "Form name can't be blank"
    return false;
  }
  if (!formData.generalInfo.description || formData.generalInfo.description === undefined) {
    errorMessage.value = "Form description can't be blank"
    return false;
  }
  if (!formData.generalInfo.visibility || formData.generalInfo.visibility === undefined) {
    errorMessage.value = "Please selecte visibility option"
    return false;
  }
  return true;
}

function validateAttribute() {
  if (formData.attributes.length <= 0) {
    errorMessage.value = "There must be at least one attribute"
    return false;
  }
  return true;
}

function validateQuestion() {
  if (formData.questions.length <= 0) {
    errorMessage.value = "There must be at least one question"
    return false;
  }
  return true;
}

function validateResult() {
  if (formData.results.length <= 0) {
    errorMessage.value = "There must be at least one result"
    return false;
  }

  // Check that every result has a picture
  let error = false;
  formData.results.forEach((element) => {
    if (!element.picture) {
      errorMessage.value = "Every result must have a picture set"
      error = true;
    }
  });
  return (!error)
}
</script>

<template>
  <div class="flex grow flex-col justify-between">
    <div class="sm:overflow-hidden sm:rounded-md bg-tileset-full-white flex flex-start flex-col grow">
      <!-- General info tab contents -->
      <GeneralInfo v-if="tabData.currentTab == 1" @on-general-info-change="updateGeneralInfo"
        :generalInfo="formData.generalInfo" :errorMessage="errorMessage" />
      <!-- Attribute edit tab contents -->
      <Attributes :attributes="formData.attributes" :questions="formData.questions" :results="formData.results"
        v-if="tabData.currentTab == 2" @on-attribute-change="updateAttributes" @on-question-change="updateQuestions"
        @on-result-change="updateResults" :errorMessage="errorMessage" />
      <!-- Question edit tab contents -->
      <Questions :questions="formData.questions" :attributes="formData.attributes" v-if="tabData.currentTab == 3"
        @on-question-change="updateQuestions" :errorMessage="errorMessage" />
      <Results :results="formData.results" :attributes="formData.attributes" v-if="tabData.currentTab == 4"
        @on-result-change="updateResults" :errorMessage="errorMessage" />
      <FullButton @click="saveContents" text="Save" color="bg-tileset-green" hover="hover:bg-tileset-green-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor"
          class="w-6 h-6 stroke-tileset-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </FullButton>
    </div>
  </div>
</template>
<style scoped></style>
