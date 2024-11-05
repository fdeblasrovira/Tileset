<script setup>
import { reactive } from "vue";
import FullButton from "../buttons/FullButton.vue";
import GeneralInfo from "./tabs/GeneralInfo.vue";
import Attributes from "./tabs/Attributes.vue";
import Questions from "./tabs/Questions.vue";
import Results from "./tabs/Results.vue";
import { useCreateTabulation } from "@/stores/createTabulation";

const tabData = useCreateTabulation();

const formData = reactive({
  generalInfo: {},
  attributes: [],
  questions: [],
  results: [],
});

function updateAttributes(newAttributes) {
  formData.attributes = newAttributes;
}

function updateQuestions(newQuestions) {
  formData.questions = newQuestions;
}

function updateResults(newResults) {
  formData.results = newResults;
}

function saveContents() {
  let json = JSON.stringify(formData)
  console.log(json)
}
</script>

<template>
  <div class="flex grow flex-col justify-between">
    <div
      class="sm:overflow-hidden sm:rounded-md bg-tileset-full-white flex flex-start flex-col grow"
    >
      <!-- General info tab contents -->
      <GeneralInfo v-if="tabData.currentTab == 1" />
      <!-- Attribute edit tab contents -->
      <Attributes
        :attributes="formData.attributes"
        :questions="formData.questions"
        :results="formData.results"
        v-if="tabData.currentTab == 2"
        @on-attribute-change="updateAttributes"
        @on-question-change="updateQuestions"
        @on-result-change="updateResults"
      />
      <!-- Question edit tab contents -->
      <Questions
        :questions="formData.questions"
        :attributes="formData.attributes"
        v-if="tabData.currentTab == 3"
        @on-question-change="updateQuestions"
      />
      <Results
        :results="formData.results"
        :attributes="formData.attributes"
        v-if="tabData.currentTab == 4"
        @on-result-change="updateResults"
      />
      <FullButton
        @click="saveContents"
        text="Save"
        color="bg-tileset-green"
        hover="hover:bg-tileset-green-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="3.5"
          stroke="currentColor"
          class="w-6 h-6 stroke-tileset-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </FullButton>
    </div>
  </div>
</template>

<!-- <div class="block text-sm font-medium mt-3">
          <label class="block">Select one </label>

          <Checkbox label="This is a test 1" name="checkbox-1" id="checkbox1" />
          <Checkbox
            label="This is a test 1234567"
            name="checkbox-1"
            id="checkbox2"
          />
          <Checkbox label="This" name="checkbox-1" id="checkbox3" />
        </div>
        <Select label="Select option" id="select3">
          <option value="1">Japan</option>
          <option value="2">Spain</option>
          <option value="3">China</option>
        </Select> -->

<style scoped></style>
