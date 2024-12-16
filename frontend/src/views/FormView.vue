<script setup>
import { ref } from "vue";
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
import FullButton from "../components/buttons/FullButton.vue";

const loadingData = useLoadingStore();
const route = useRoute(); // Access the current route

const form = ref({});
const numberQuestionPages = ref(0);
const totalPages = ref(0);

async function getForm() {
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

    loadingData.loading = false;
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loadingData.loading = false;
  }

}

// Calculate how many pages there is in this form
function setupPagination() {
  const questionsPerPage = form.value.GeneralInfos[0].questionsPerPage;
  const totalQuestions = form.value.Questions.length;

  if (totalQuestions % questionsPerPage == 0) numberQuestionPages.value = totalQuestions / questionsPerPage
  else numberQuestionPages.value =Math.floor ((totalQuestions / questionsPerPage) + 1)

  // We add the Form introduction as the first page
  totalPages.value = numberQuestionPages.value + 1
  console.log(totalPages.value)
}

(async () => {
  await getForm();
  setupPagination();
})();







</script>

<template>
  <div class="flex grow flex-col justify-center content-center">
    <div class="flex justify-center">
      <div
        class="relative w-full my-[2rem] flex grow flex-col sm:max-w-[90%] xl:max-w-[1024px] bg-tileset-full-white shadow-2xl p-6 sm:rounded-lg">
        <img src="../assets/logo.webp" class="w-64" alt="Tileset Logo" />
        <br>
        <br>
        <template v-for="(question, index) in form.Questions" :key="question.type + question.id">
          <!-- <hr v-if="index != 0" class="mx-16 my-8 border-1 border-tileset-green"> -->
          {{introPage}}
          <div class="border rounded-md border-tileset-grey-3 space-y-6 px-4 py-5 sm:p-6 my-3">
            <template v-if="question.type == 'input'">
              <Input :label="(index + 1) + '- ' + question.label" :name="question.id" type="text" />
            </template>
            <template v-if="question.type == 'textarea'">
              <Textarea :label="(index + 1) + '- ' + question.label" :name="question.id" :maxCharacters="2048" />
            </template>
            <template v-if="question.type == 'date'">
              <Date :label="(index + 1) + '- ' + question.label" :format="question.format" />
            </template>
            <template v-if="question.type == 'radio'">
              <div class="block text-sm font-medium ">
                <label class="block text-base font-medium">{{
                  (index + 1) + '- ' + question.label
                }}</label>
                <Radio v-for="(option, optionsIndex) in question.Choices" :label="option.label"
                  :name="`radio_${question.id}`" :id="`radio_${question.id}_${optionsIndex}`" :key="optionsIndex" />
              </div>
            </template>
            <template v-if="question.type == 'checkbox'">
              <div class="block text-sm font-medium mt-3">
                <label class="block text-base font-medium">{{
                  (index + 1) + '- ' + question.label
                }}</label>
                <Checkbox v-for="(option, optionsIndex) in question.Choices" :label="option.text"
                  :name="`radio_${question.id}`" :id="`radio_${question.id}_${optionsIndex}`" :key="optionsIndex" />
              </div>
            </template>
            <template v-if="question.type == 'select'">
              <div class="block text-sm font-medium mt-3">
                <label class="block text-base font-medium">{{
                  (index + 1) + '- ' + question.label
                }}</label>
                <Select :id="question.id">
                  <option v-for="(option, optionsIndex) in question.Choices" :value="optionsIndex" :key="optionsIndex">
                    {{ option.text }}
                  </option>
                </Select>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
