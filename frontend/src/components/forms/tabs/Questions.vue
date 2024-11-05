<script setup>
import { watch, ref, toRaw } from "vue";
import Input from "../../inputs/Input.vue";
import Textarea from "../../inputs/Textarea.vue";
import Date from "../../inputs/Date.vue";
import Radio from "../../inputs/Radio.vue";
import Checkbox from "../../inputs/Checkbox.vue";
import Select from "../../inputs/Select.vue";
import QuestionOption from "../../forms/edit/QuestionOption.vue";
import FullButton from "../../buttons/FullButton.vue";
import DefaultValues from "../../../config/defaultValues";
import Modal from "../../overlays/Modal.vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps(["questions", "attributes"]);
const emits = defineEmits(["onQuestionChange"]);

const questions = ref(props.questions);
const attributes = ref(props.attributes);

// After any change to the questions, we tell the parent component to update the value
watch(questions, (newQuestions) => {
  emit(onQuestionChange(newQuestions));
});

// Toggle for the delete modal
const showQuestionDeleteModal = ref(false);

// Toggle for the edit modals
const showQuestionEditModal = ref(false);

// Validation message that will display in the edit modal.
const questionModalErrorMessage = ref("");

// What type of question will be added when the add button is pressed
const addQuestionSelectValue = ref("input");

// It keeps a reference to the selected item by the user
const selectedQuestion = ref(null);

// It keeps a reference to the opened options in the question edit modal
const openedOption = ref(-1);
const lastOpenedOption = ref(-1);

/* 
    It stores the data of the edit modal.
    Once the user presses 'Save', this data will overwrite the selected item data.
    If the user presses 'Cancel', this data will be discarded.
*/
let editingQuestion = ref(null);
let editingOptions = ref(null);

// Toggle delete modal
function displayQuestionDeleteModal(display, index) {
  showQuestionDeleteModal.value = display;
  selectedQuestion.value = index;
}

// Toggle edit modal
function displayQuestionEditModal(display, index) {
  // Resets the error message to an empty value
  questionModalErrorMessage.value = "";
  selectedQuestion.value = index;

  // Initializes the editor data with the current saved data
  editingQuestion.value = { ...questions.value[index] };
  editingOptions.value = { ...editingQuestion.value.options };

  let rawObject = JSON.parse(JSON.stringify(editingOptions.value));
  let optionsArray = [];
  for (const property in rawObject) {
    optionsArray.push(rawObject[property]);
  }
  editingOptions.value = optionsArray;

  showQuestionEditModal.value = true;
}

function editQuestion() {
  // Check if the label has text.
  // If not, display error message
  if (editingQuestion.value.question.trim().length <= 0) {
    questionModalErrorMessage.value = "The label text can't be blank";
    return;
  }

  // Each option needs a label text
  let validationErrorFlag = false;

  editingOptions.value.forEach((element) => {
    console.log(element.text.trim());
    if (element.text.trim().length <= 0) {
      questionModalErrorMessage.value = "The option text can't be blank";
      validationErrorFlag = true;
    }
  });

  if (validationErrorFlag) return;

  // Commit changes
  showQuestionEditModal.value = false;
  let clonedOptions = JSON.parse(JSON.stringify(editingOptions.value));

  questions.value[selectedQuestion.value] = JSON.parse(
    JSON.stringify(editingQuestion.value)
  );
  questions.value[selectedQuestion.value].options = clonedOptions;

  questions.value[selectedQuestion.value].options.forEach((element, index) => {
    element.actions = { ...editingOptions.value[index].actions };
  });
}

function deleteQuestion() {
  showQuestionDeleteModal.value = false;

  // Remove question in the specified index
  questions.value.splice(selectedQuestion.value, 1);
}

// Adds an item to the question list
function addQuestion(type) {
  let question;

  switch (type) {
    case "input":
      question = DefaultValues.defaultInputQuestion();
      break;
    case "textarea":
      question = DefaultValues.defaultTextareaQuestion();
      break;
    case "date":
      question = DefaultValues.defaultDateQuestion();
      break;
    case "radio":
      question = DefaultValues.defaultRadioQuestion();
      break;
    case "checkbox":
      question = DefaultValues.defaultCheckboxQuestion();
      break;
    case "select":
      question = DefaultValues.defaultSelectQuestion();
      break;
  }

  //Generate a unique ID for this specific question
  question.id = uuidv4();

  questions.value.push({ ...question });
  console.log(questions.value);
}

// The user clicked an option from the question edit modal
function onListOptionClicked(index) {
  lastOpenedOption.value =
    openedOption.value == lastOpenedOption.value ? -1 : openedOption.value;
  openedOption.value = index;
}

// Deletes one of the options of a question
function deleteOption(index) {
  editingOptions.value.splice(index, 1);

  // reset accordion values
  openedOption.value = -1;
  lastOpenedOption.value = -1;
}

// Changes one of the options of a question
function changeOption(event, index) {
  console.log("changeOption");
  editingOptions.value[index] = { ...event };
  console.log(editingOptions.value[index]);
}

function addOption() {
  editingOptions.value.push({ text: "", actions: {} });
}
</script>

<template>
  <div
    class="border rounded-md border-tileset-grey-2 space-y-3 px-4 py-5 sm:p-6"
  >
    <label class="w-full text-left font-medium">Questions</label>
    <div
      v-if="questions.length <= 0"
      class="w-full h-10 text-center items-center m-auto font-light italic"
    >
      There are no questions yet
    </div>
    <template v-for="(question, index) in questions" :key="question.id">
      <div
        class="border rounded-md border-tileset-grey-2 space-y-6 px-4 py-5 sm:p-6"
      >
        <template v-if="question.type == 'input'">
          <Input :label="question.question" :name="question.id" type="text" />
        </template>
        <template v-if="question.type == 'textarea'">
          <Textarea :label="question.question" :name="question.id" />
        </template>
        <template v-if="question.type == 'date'">
          <Date :label="question.question" :format="question.format" />
        </template>
        <template v-if="question.type == 'radio'">
          <div class="block text-sm font-medium mt-3">
            <label class="block text-base font-medium">{{
              question.question
            }}</label>
            <Radio
              v-for="(option, optionsIndex) in question.options"
              :label="option.text"
              :name="`radio_${question.id}`"
              :id="`radio_${question.id}_${optionsIndex}`"
              :key="optionsIndex"
            />
          </div>
        </template>
        <template v-if="question.type == 'checkbox'">
          <div class="block text-sm font-medium mt-3">
            <label class="block text-base font-medium">{{
              question.question
            }}</label>
            <Checkbox
              v-for="(option, optionsIndex) in question.options"
              :label="option.text"
              :name="`radio_${question.id}`"
              :id="`radio_${question.id}_${optionsIndex}`"
              :key="optionsIndex"
            />
          </div>
        </template>
        <template v-if="question.type == 'select'">
          <div class="block text-sm font-medium mt-3">
            <label class="block text-base font-medium">{{
              question.question
            }}</label>
            <Select :id="question.id">
              <option
                v-for="(option, optionsIndex) in question.options"
                :value="optionsIndex"
                :key="optionsIndex"
              >
                {{ option.text }}
              </option>
            </Select>
          </div>
        </template>
        <div class="flex justify-between">
          <FullButton
            @click="displayQuestionDeleteModal(true, index)"
            text="Delete"
            color="bg-tileset-red"
            hover="hover:bg-tileset-red-1"
            class="mx-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6 stroke-tileset-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </FullButton>
          <FullButton
            @click="displayQuestionEditModal(true, index)"
            text="Edit"
            color="bg-tileset-blue"
            hover="hover:bg-tileset-blue-1"
            class="mx-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6 stroke-tileset-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </FullButton>
        </div>
      </div>
    </template>
    <div class="flex">
      <Select
        label=""
        class="w-full sm:w-1/3 mr-4 mt-5"
        v-model="addQuestionSelectValue"
      >
        <option value="input">Single line text</option>
        <option value="textarea">Multiple line text</option>
        <option value="date">Date</option>
        <option value="radio">Single option</option>
        <option value="checkbox">Multiple options</option>
        <option value="select">Dropdown</option>
      </Select>
      <FullButton
        @click="addQuestion(addQuestionSelectValue)"
        text="Add"
        color="bg-tileset-blue"
        hover="hover:bg-tileset-blue-1"
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
            d="M12 6v12m6-6H6"
          />
        </svg>
      </FullButton>
    </div>
  </div>
  <!-- Question delete modal -->
  <Modal
    :open="showQuestionDeleteModal"
    title="Delete question"
    description="Are you sure you want to delete this question?"
    svgBackgroundColor="bg-tileset-red"
  >
    <template #svg>
      <svg
        class="h-6 w-6 stroke-tileset-white -mt-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
        />
      </svg>
    </template>
    <template #buttons>
      <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          @click="deleteQuestion()"
          type="button"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-tileset-red px-4 py-2 text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-red-1 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Delete
        </button>
        <button
          @click="showQuestionDeleteModal = false"
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-tileset-grey-5 px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </template>
  </Modal>
  <!-- Input question edit modal -->
  <Modal
    :open="showQuestionEditModal"
    title="Edit question"
    description="Edit the question's parameters"
    svgBackgroundColor="bg-tileset-blue"
  >
    <template #svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 stroke-tileset-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    </template>

    <template #contents>
      <span class="flex my-2 p-[1px] bg-tileset-grey-2"></span>
      <div class="space-y-3 mt-3">
        <template
          v-if="
            editingQuestion.type == 'input' ||
            editingQuestion.type == 'textarea'
          "
        >
          <Input v-model="editingQuestion.question" label="Label" type="text" />
        </template>
        <template v-if="editingQuestion.type == 'date'">
          <Input v-model="editingQuestion.question" label="Label" type="text" />
          <Select label="Format" v-model="editingQuestion.format">
            <option value="date">Date</option>
            <option value="datetime-local">Date and time</option>
          </Select>
        </template>
        <template
          v-if="
            editingQuestion.type == 'radio' ||
            editingQuestion.type == 'checkbox' ||
            editingQuestion.type == 'select'
          "
        >
          <Input v-model="editingQuestion.question" label="Label" type="text" />
          <div class="space-y-1">
            <label>Options</label>
            <QuestionOption
              v-for="(option, index) in editingOptions"
              @list-option-clicked="onListOptionClicked(index)"
              @delete-option="deleteOption(index)"
              @on-options-change="changeOption"
              :index="index"
              :attributes="attributes"
              :data="{ ...option }"
              :open="openedOption == index"
              :close="lastOpenedOption == index"
            />
          </div>
          <div class="flex px-2 w-full justify-center">
            <button
              @click="addOption()"
              type="button"
              class="flex w-full justify-center rounded-md bg-tileset-blue px-4 py-2 font-bold text-tileset-full-white shadow-sm hover:bg-tileset-blue-1 focus:outline-none text-xl sm:text-lg"
            >
              Add
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3.5"
                stroke="currentColor"
                class="w-6 h-6 pt-1 ml-1 stroke-tileset-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
            </button>
          </div>
        </template>
      </div>
    </template>
    <template #buttons>
      <p
        v-if="questionModalErrorMessage.length > 0"
        class="font-light text-tileset-red text-right text-sm italic px-4 sm:px-6"
      >
        {{ questionModalErrorMessage }}
      </p>
      <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          @click="editQuestion()"
          type="button"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-tileset-green px-4 py-2 text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-green-1 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Save
        </button>
        <button
          @click="showQuestionEditModal = false"
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-tileset-grey-5 px-4 py-2 text-base font-medium shadow-sm sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
