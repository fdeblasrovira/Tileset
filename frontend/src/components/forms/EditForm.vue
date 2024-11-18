<script setup>
import { reactive, watch, ref } from "vue";
import FullButton from "../buttons/FullButton.vue";
import GeneralInfo from "./tabs/GeneralInfo.vue";
import Attributes from "./tabs/Attributes.vue";
import Questions from "./tabs/Questions.vue";
import Results from "./tabs/Results.vue";
import { useCreateTabulation } from "@/stores/createTabulation";
import testData from "../../../test/data/editFormTestData.json";

const tabData = useCreateTabulation();

// const  = getformdata
const formData = reactive(testData);

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

// When the save button is pressed
function saveContents() {
  let json = JSON.stringify(formData)
  console.log(json)
  const result = validateForm();
  if (!result) return;
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
  return true;
}
</script>

<template>
  <div class="flex grow flex-col justify-between">
    <div class="sm:overflow-hidden sm:rounded-md bg-tileset-full-white flex flex-start flex-col grow">
      <!-- General info tab contents -->
      <GeneralInfo v-if="tabData.currentTab == 1" @on-general-info-change="updateGeneralInfo"
        :generalInfo="formData.generalInfo" :errorMessage="errorMessage"/>
      <!-- Attribute edit tab contents -->
      <Attributes :attributes="formData.attributes" :questions="formData.questions" :results="formData.results"
        v-if="tabData.currentTab == 2" @on-attribute-change="updateAttributes" @on-question-change="updateQuestions"
        @on-result-change="updateResults" :errorMessage="errorMessage"/>
      <!-- Question edit tab contents -->
      <Questions :questions="formData.questions" :attributes="formData.attributes" v-if="tabData.currentTab == 3"
        @on-question-change="updateQuestions" :errorMessage="errorMessage"/>
      <!-- Results edit tab contents -->
      <Results :results="formData.results" :attributes="formData.attributes" v-if="tabData.currentTab == 4"
        @on-result-change="updateResults" :errorMessage="errorMessage"/>
      <FullButton @click="saveContents" text="Update" color="bg-tileset-green" hover="hover:bg-tileset-green-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor"
          class="w-6 h-6 stroke-tileset-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </FullButton>
    </div>
  </div>
</template>
<style scoped></style>
