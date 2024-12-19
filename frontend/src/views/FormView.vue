<script setup>
import { ref, computed, reactive, onBeforeMount } from "vue";
import urlList from "../config/urlList"
// import router from "../router/index";
import { useRoute } from 'vue-router';
import utils from "@/utils/fetch";
import { useLoadingStore } from '@/stores/loading'
import Input from "../components/inputs/Input.vue";
import Textarea from "../components/inputs/Textarea.vue";
import Date from "../components/inputs/Date.vue";
import Radio from "../components/inputs/Radio.vue";
import Checkbox from "../components/inputs/Checkbox.vue";
import Select from "../components/inputs/Select.vue";
import FormViewPagination from "../components/list/formView/FormViewPagination.vue";
import FullButton from "../components/buttons/FullButton.vue";

const loadingData = useLoadingStore();
const route = useRoute(); // Access the current route

const form = ref({});
const numberQuestionPages = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const currentQuestions = computed(() => {
  return form.value ? form.value.Questions.slice(questionsPerPage * (currentPage.value - 2), questionsPerPage * (currentPage.value - 1)) : [];
})


let questionsPerPage;
let totalQuestions;

async function initializeForm() {
  try {
    // Show loading animation
    loadingData.loading = true;

    const response = await utils.getData(urlList.BACKEND_GET_FORM_VIEW + "?id=" + route.params.id, false)

    // Merge Input and Choice questions into one array
    let mergedQuestions = response.form.InputQuestions.concat(response.form.ChoiceQuestions).sort(function (a, b) {
      return a.order - b.order;
    })

    delete response.form.InputQuestions;
    delete response.form.ChoiceQuestions;

    response.form.Questions = mergedQuestions;

    form.value = response.form;
    console.log(form.value)

    // set pagination
    questionsPerPage = form.value.GeneralInfos[0].questionsPerPage;
    totalQuestions = form.value.Questions.length;

    if (totalQuestions % questionsPerPage == 0) numberQuestionPages.value = totalQuestions / questionsPerPage
    else numberQuestionPages.value = Math.floor((totalQuestions / questionsPerPage) + 1)

    // We add the Form introduction as the first page
    totalPages.value = numberQuestionPages.value + 1
    console.log(totalPages.value)

    currentQuestions.value = form.value.Questions.slice(questionsPerPage * (currentPage.value - 2), questionsPerPage * (currentPage.value - 1))
    console.log("currentQuestions.value")
    console.log(currentQuestions.value)
    console.log("form.value.Questions")
    console.log(form.value.Questions)

  }
  catch (e) {
    console.log(e)
  }
  finally {
    loadingData.loading = false;
  }
}
initializeForm()

function changePagination(operation){
  console.log(operation)
  console.log(currentPage.value)
  console.log(totalPages.value)
  if (operation == "next"){
    if (currentPage.value >= totalPages.value) return;
    currentPage.value++;
  }
  else if(operation == "previous"){
    if (currentPage.value <= 1) return;
    currentPage.value--;
  }
}

</script>

<template>
  <div class="flex grow flex-col justify-center content-center">
    <div class="flex justify-center">
      <div
        class="relative w-full my-[2rem] flex grow flex-col sm:max-w-[90%] xl:max-w-[1024px] bg-tileset-full-white shadow-2xl p-6 sm:rounded-lg">
        <img src="../assets/logo.webp" class="w-64 my-2 mx-4" alt="Tileset Logo" />
        <div v-if="form && currentQuestions">
          

<ol class="flex items-center w-full">
    <li class="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800">
        <span class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
            <svg class="w-3.5 h-3.5 text-blue-600 lg:w-4 lg:h-4 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
            </svg>
        </span>
    </li>
    <li class="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700">
        <span class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
            <svg class="w-4 h-4 text-gray-500 lg:w-5 lg:h-5 dark:text-gray-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"/>
            </svg>
        </span>
    </li>
    <li class="flex items-center w-full">
        <span class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
            <svg class="w-4 h-4 text-gray-500 lg:w-5 lg:h-5 dark:text-gray-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z"/>
            </svg>
        </span>
    </li>
</ol>

          <template v-for="(question) in currentQuestions" :key="question.type + question.id">
            <div class="border rounded-md border-tileset-grey-3 space-y-6 px-4 py-5 sm:p-6 my-3">
              <template v-if="question.type == 'input'">
                <Input :label="(question.order + 1) + '- ' + question.label" :name="question.id" type="text" />
              </template>
              <template v-if="question.type == 'textarea'">
                <Textarea :label="(question.order + 1) + '- ' + question.label" :name="question.id" :maxCharacters="2048" />
              </template>
              <template v-if="question.type == 'date'">
                <Date :label="(question.order + 1) + '- ' + question.label" :format="question.format" />
              </template>
              <template v-if="question.type == 'radio'">
                <div class="block text-sm font-medium ">
                  <label class="block text-base font-medium">{{
                    (question.order + 1) + '- ' + question.label
                  }}</label>
                  <Radio v-for="(option, optionsIndex) in question.Choices" :label="option.label"
                    :name="`radio_${question.id}`" :id="`radio_${question.id}_${optionsIndex}`" :key="optionsIndex" />
                </div>
              </template>
              <template v-if="question.type == 'checkbox'">
                <div class="block text-sm font-medium">
                  <label class="block text-base font-medium">{{
                    (question.order + 1) + '- ' + question.label
                  }}</label>
                  <Checkbox v-for="(option, optionsIndex) in question.Choices" :label="option.text"
                    :name="`radio_${question.id}`" :id="`radio_${question.id}_${optionsIndex}`" :key="optionsIndex" />
                </div>
              </template>
              <template v-if="question.type == 'select'">
                <div class="block text-sm font-medium">
                  <label class="block text-base font-medium">{{
                    (question.order + 1) + '- ' + question.label
                  }}</label>
                  <Select :id="question.id">
                    <option v-for="(option, optionsIndex) in question.Choices" :value="optionsIndex"
                      :key="optionsIndex">
                      {{ option.text }}
                    </option>
                  </Select>
                </div>
              </template>
            </div>
          </template>
        </div>
        <FormViewPagination @change="changePagination" class="my-4" :currentPage="currentPage" :totalPages="totalPages" />  
      </div>
    </div>
  </div>
</template>
