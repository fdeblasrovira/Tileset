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
import Separator from "../components/misc/Separator.vue";
import FullButton from "../components/buttons/FullButton.vue";

const loadingData = useLoadingStore();
const route = useRoute(); // Access the current route

const form = ref({});
const numberQuestionPages = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const currentQuestions = computed(() => {
  return form.value?.Questions ? form.value.Questions.slice(questionsPerPage * (currentPage.value - 2), questionsPerPage * (currentPage.value - 1)) : [];
})


let questionsPerPage;
let totalQuestions;

function initializeForm() {
  try {
    // Show loading animation
    loadingData.loading = true;

    utils.getData(urlList.BACKEND_GET_FORM_VIEW + "?id=" + route.params.id, false).then(function (response) {
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

      // currentQuestions.value = form.value.Questions.slice(questionsPerPage * (currentPage.value - 2), questionsPerPage * (currentPage.value - 1))
    })
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loadingData.loading = false;
  }
}
initializeForm()

function changePagination(operation) {
  if (operation == "next") {
    if (currentPage.value >= totalPages.value) return;
    currentPage.value++;
  }
  else if (operation == "previous") {
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
        <Separator class="w-3/6 h-4 mb-4"/>
        <div v-if="form?.Questions && currentQuestions">
          <div class="flex h-64 sm:h-[16rem] md:h-[20rem] lg:h-[24rem] w-full justify-center ">
          <img :src="form.GeneralInfos[0].imageUrl" class="w-full m-4 object-cover w-96 sm:w-[32rem] md:w-[40rem] lg:w-[48rem] rounded-lg" alt="Form picture" />
          </div>
          <h1 class="w-full block text-3xl font-semibold m-4 text-center">{{
            form.GeneralInfos[0].formName
          }}</h1>
          <template v-for="(question) in currentQuestions" :key="question.type + question.id">
            <div class="border rounded-md border-tileset-grey-3 space-y-6 px-4 py-5 sm:p-6 my-3">
              <template v-if="question.type == 'input'">
                <Input :label="(question.order + 1) + '- ' + question.label" :name="question.id" type="text" />
              </template>
              <template v-if="question.type == 'textarea'">
                <Textarea :label="(question.order + 1) + '- ' + question.label" :name="question.id"
                  :maxCharacters="2048" />
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
        <FormViewPagination @change="changePagination" class="my-4" :currentPage="currentPage"
          :totalPages="totalPages" />
      </div>
    </div>
  </div>
</template>
