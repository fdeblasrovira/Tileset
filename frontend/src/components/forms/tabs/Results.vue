<script setup>
import { watch, ref } from "vue";
import Input from "../../inputs/Input.vue";
import Textarea from "../../inputs/Textarea.vue";
import AvatarPicture from "../../inputs/AvatarPicture.vue";
import Range from "../../inputs/Range.vue";
import Radio from "../../inputs/Radio.vue";
import Checkbox from "../../inputs/Checkbox.vue";
import Select from "../../inputs/Select.vue";
import QuestionOption from "../../forms/edit/QuestionOption.vue";
import FullButton from "../../buttons/FullButton.vue";
import DefaultValues from "../../../config/defaultValues";
import Modal from "../../overlays/Modal.vue";
import { v4 as uuidv4 } from "uuid";
import ResultOption from "../edit/ResultOption.vue";

const props = defineProps(["results", "attributes"]);
const emits = defineEmits(["onResultsChange"]);

const results = ref(props.results);
const attributes = ref(props.attributes);

// After any change to the questions, we tell the parent component to update the value
watch(results, (newResults) => {
  emit(onResultsChange(newResults));
});

// Toggle for the delete modal
const showResultDeleteModal = ref(false);

// Toggle for the edit modals
const showResultEditModal = ref(false);

// Validation message that will display in the edit modal.
const resultModalErrorMessage = ref("");

/* 
    It stores the data of the edit modal.
    Once the user presses 'Save', this data will overwrite the selected item data.
    If the user presses 'Cancel', this data will be discarded.
*/
let editingResult = ref(null);

// It keeps a reference to the selected item by the user
const selectedResult = ref(null);

// Toggle delete modal
function displayResultDeleteModal(display, index) {
  showResultDeleteModal.value = display;
  selectedResult.value = index;
}

// Toggle edit modal
function displayResultEditModal(display, index) {
  // Resets the error message to an empty value
  resultModalErrorMessage.value = "";
  selectedResult.value = index;

  // Initializes the editor data with the current saved data
  editingResult.value = { ...results.value[index] };
  editingResult.value.attributeValues = { ...results.value[index].attributeValues };
  console.log("editingResult.value")
  console.log(editingResult.value)
  
  console.log("editingResult.value.attributeValues")
  console.log(editingResult.value.attributeValues)

  console.log("index")
  console.log(index)
  // Initializes the attribute data of the result
  for (const [key, value] of Object.entries(attributes.value)){
    if (!editingResult.value.attributeValues.hasOwnProperty(value.id)){
      editingResult.value.attributeValues[value.id] = value.defaultValue;
    }
  }

  showResultEditModal.value = true;
}

function deleteResult() {
  showResultDeleteModal.value = false;

  // Remove result in the specified index
  results.value.splice(selectedResult.value, 1);
}

// Adds an item to the result list
function addResult() {
  let result = DefaultValues.defaultResult();

  //Generate a unique ID for this specific result
  result.id = uuidv4();

  results.value.push({ ...result });
  console.log(results.value);
}

// Edits the result with the data in the edit modal
function editResult() {
  // Check if the name is set
  // If not, display error message
  if (editingResult.value.name.length <= 0) {
    resultModalErrorMessage.value =
      "The name can't be empty";
    return;
  }

  // Check if the name is set
  // If not, display error message
  if (editingResult.value.description.length <= 0) {
    resultModalErrorMessage.value =
      "The description can't be empty";
    return;
  }

  // Commit changes
  showResultEditModal.value = false;
  let currentResult = results.value[selectedResult.value]
  let attributeValuesClone = {...editingResult.value.attributeValues};

  currentResult = {...editingResult.value};
  currentResult.attributeValues = attributeValuesClone;

  results.value[selectedResult.value] = currentResult;
}
</script>

<template>
  <div
    class="border rounded-md border-tileset-grey-2 space-y-3 px-4 py-5 sm:p-6"
  >
    <label class="w-full text-left font-medium">Results</label>
    <div
      v-if="results.length <= 0"
      class="w-full h-10 text-center items-center m-auto font-light italic"
    >
      There are no results yet
    </div>
    <ResultOption
      v-for="(result, index) in results"
      @delete-result="displayResultDeleteModal(true, index)"
      @edit-result="displayResultEditModal(true, index)"
      :data="result"
      :key="result.id"
      :index="index"
      :open="openedResult == result.id"
      :close="lastOpenedResult == result.id"
    />
    <FullButton
      @click="addResult()"
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
  <!-- Result delete modal -->
  <Modal
    :open="showResultDeleteModal"
    title="Delete result"
    description="Are you sure you want to delete this result?"
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
          @click="deleteResult()"
          type="button"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-tileset-red px-4 py-2 text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-red-1 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Delete
        </button>
        <button
          @click="showResultDeleteModal = false"
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-tileset-grey-5 px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </template>
    <!-- Result delete modal -->
  </Modal>
  <!-- Result edit modal -->
  <Modal
    :open="showResultEditModal"
    title="Edit result"
    description="Edit the result's parameters"
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
        <Input
          v-model="editingResult.name"
          label="Name"
          :name="editingResult.id"
          type="text"
        />
        <Textarea
          v-model="editingResult.description"
          label="Description"
          :name="editingResult.id"
        />
        <AvatarPicture
          v-model="editingResult.picture"
          :image="editingResult.picture"
          label="Picture"
        />
        <template v-for="(attribute) in attributes">
          <div
            class="border rounded-md border-tileset-grey-2 space-y-3 px-4 py-5 sm:p-6"
          >
            <Range
              v-model="editingResult.attributeValues[attribute.id]"
              :editable="true"
              :min="attribute.min"
              :max="attribute.max"
              :defaultValue="editingResult.attributeValues[attribute.id]"
              :leftColor="attribute.leftColor"
              :leftLabel="attribute.leftLabel"
              :rightColor="attribute.rightColor"
              :rightLabel="attribute.rightLabel"
            >
            </Range>
          </div>
        </template>
      </div>
    </template>
    <template #buttons>
      <p
        v-if="resultModalErrorMessage.length > 0"
        class="font-light text-tileset-red text-right text-sm italic px-4 sm:px-6"
      >
        {{ resultModalErrorMessage }}
      </p>
      <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          @click="editResult()"
          type="button"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-tileset-green px-4 py-2 text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-green-1 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Save
        </button>
        <button
          @click="showResultEditModal = false"
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
