<script setup>
import { watch, ref } from "vue";
import Input from "../../inputs/Input.vue";
import Range from "../../inputs/Range.vue";
import ColorPicker from "../../vendor/ColorPicker.vue";
import FullButton from "../../buttons/FullButton.vue";
import DefaultValues from "../../../config/defaultValues";
import Modal from "../../overlays/Modal.vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps(["attributes", "results", "questions"]);
const emits = defineEmits(["onAttributeChange", "onResultChange", "onQuestionChange"]);

const attributes = ref(props.attributes);
const questions = ref(props.questions);
const results = ref(props.results);

// After any change to the attributes, questions or results, we tell the parent component to update the value
watch(attributes, (newAttributes) => {
  emit(onAttributeChange(newAttributes));
});

watch(questions, (newQuestions) => {
  emit(onAttributeChange(newQuestions));
});

watch(results, (newResults) => {
  emit(onAttributeChange(newResults));
});

// Toggle for the delete modal
const showAttributeDeleteModal = ref(false);

// Toggle for the edit modal
const showAttributeEditModal = ref(false);

// Validation message that will display in the edit modal.
const attributeModalErrorMessage = ref("");

// It keeps a reference to the selected item by the user
let selectedAttribute;

/* 
    It stores the data of the edit modal.
    Once the user presses 'Save', this data will overwrite the selected item data.
    If the user presses 'Cancel', this data will be discarded.
*/
let editingAttribute = ref(null);

// Toggle delete modal
function displayAttributeDeleteModal(display, index) {
  showAttributeDeleteModal.value = display;
  selectedAttribute = index;
}

// Toggle edit modal
function displayAttributeEditModal(display, index) {
  // Resets the error message to an empty value
  attributeModalErrorMessage.value = "";
  selectedAttribute = index;

  // Initializes the editor data with the current saved data
  editingAttribute.value = { ...attributes.value[index] };

  showAttributeEditModal.value = display;
}

// Adds an item to the attribute list
function addAttribute() {
  let defaultAttribute = DefaultValues.defaultAttribute();

  //Generate a unique ID for this specific attribute
  defaultAttribute.id = uuidv4();
  console.log({ ...defaultAttribute });

  attributes.value.push({ ...defaultAttribute });
}

function deleteAttribute() {
  showAttributeDeleteModal.value = false;

  // Remove attribute in the specified index
  attributes.value.splice(selectedAttribute, 1);
}

function editAttribute() {
  // The numbers are stored as strings, so we parse them as ints
  editingAttribute.value.min = Number(editingAttribute.value.min);
  editingAttribute.value.max = Number(editingAttribute.value.max);
  editingAttribute.value.defaultValue = Number(
    editingAttribute.value.defaultValue
  );

  // Check if the labels are set
  // If not, display error message
  if (editingAttribute.value.leftLabel.length <= 0) {
    attributeModalErrorMessage.value = "The left label can't be empty";
    return;
  }

  if (editingAttribute.value.rightLabel.length <= 0) {
    attributeModalErrorMessage.value = "The right label can't be empty";
    return;
  }

  // Check if min is smaller than max
  // If not, display error message
  if (editingAttribute.value.min > editingAttribute.value.max) {
    attributeModalErrorMessage.value =
      "Minimum value should be smaller than maximum value";
    return;
  }

  // Perform defaultValue validation
  // It needs to be between min and max. In case it does not, change it to min and max values accordingly.
  // If not, display error message
  if (
    editingAttribute.value.defaultValue > editingAttribute.value.max ||
    editingAttribute.value.defaultValue < editingAttribute.value.min
  ) {
    attributeModalErrorMessage.value =
      "Default value should be between minimum and maximum values";
    return;
  }

  // If there are changes to attribute's min and max value the attribute values of the results and questions need to be resetted
  if (
    editingAttribute.value.max != attributes.value[selectedAttribute].max ||
    editingAttribute.value.min != attributes.value[selectedAttribute].min
  ) {
    let currentAttributeId = attributes.value[selectedAttribute].id;

    // Reset results if they were using this attribute
    results.value.forEach((element, index) => {
      let resultAttributeClone = element.attributeValues

      for (const [key, value] of Object.entries(resultAttributeClone)){
        if (key === currentAttributeId) delete results.value[index].attributeValues[key]
      }
    });

    // Reset questions if they were using this attribute
    questions.value.forEach((element, index) => {
      element.options.forEach((element2, index2) => {
        for (const [key, value] of Object.entries(element2.actions)){
          if (key === currentAttributeId) delete questions.value[index].options[index2].actions[key]
        }
      });
    });
  }

  // Commit changes
  showAttributeEditModal.value = false;
  attributes.value[selectedAttribute] = { ...editingAttribute.value };
}
</script>

<template>
  <div
    class="border rounded-md border-tileset-grey-2 space-y-3 px-4 py-5 sm:p-6"
  >
    <label class="w-full text-left font-medium">Attributes</label>
    <div
      v-if="attributes.length <= 0"
      class="w-full h-10 text-center items-center m-auto font-light italic"
    >
      There are no attributes yet
    </div>
    <template v-for="(attribute, index) in attributes" :key="attribute.id">
      <div
        class="border rounded-md border-tileset-grey-2 space-y-3 px-4 py-5 sm:p-6"
      >
        <Range
          v-model="attribute.defaultValue"
          :editable="true"
          :min="attribute.min"
          :max="attribute.max"
          :defaultValue="attribute.defaultValue"
          :leftColor="attribute.leftColor"
          :leftLabel="attribute.leftLabel"
          :rightColor="attribute.rightColor"
          :rightLabel="attribute.rightLabel"
        >
        </Range>
        <div class="flex justify-between">
          <FullButton
            @click="displayAttributeDeleteModal(true, index)"
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
            @click="displayAttributeEditModal(true, index)"
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

    <FullButton
      @click="addAttribute"
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
  <!-- Attribute delete modal -->
  <Modal
    :open="showAttributeDeleteModal"
    title="Delete attribute"
    description="Are you sure you want to delete this attribute?"
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
          @click="deleteAttribute()"
          type="button"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-tileset-red px-4 py-2 text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-red-1 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Delete
        </button>
        <button
          @click="showAttributeDeleteModal = false"
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-tileset-grey-5 px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </template>
  </Modal>
  <!-- Attribute edit modal -->
  <Modal
    :open="showAttributeEditModal"
    title="Edit attribute"
    description="Edit the values of the attribute"
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
        <div class="flex">
          <Input
            v-model="editingAttribute.leftLabel"
            label="Left label"
            name="left-label"
            type="text"
            class="mr-2"
          />
          <Input
            v-model="editingAttribute.rightLabel"
            label="Right label"
            name="right-label"
            type="text"
            class="ml-2"
          />
        </div>
        <div class="flex">
          <Input
            v-model="editingAttribute.min"
            label="Minimum value"
            name="minimum-value"
            type="number"
            class="mr-2"
          />
          <Input
            v-model="editingAttribute.max"
            label="Maximum value"
            name="maximum-value"
            type="number"
            class="ml-2"
          />
        </div>
        <div class="flex">
          <ColorPicker
            v-model="editingAttribute.leftColor"
            label="Left Color"
            class="w-full h-10 mr-2"
            :display-color="editingAttribute.leftColor"
          />
          <ColorPicker
            v-model="editingAttribute.rightColor"
            label="Right Color"
            class="w-full h-10 ml-2"
            :display-color="editingAttribute.rightColor"
          />
        </div>
        <Input
          v-model="editingAttribute.defaultValue"
          label="Default value"
          name="default-value"
          type="number"
        />
      </div>
    </template>
    <template #buttons>
      <p
        v-if="attributeModalErrorMessage.length > 0"
        class="font-light text-tileset-red text-right text-sm italic px-4 sm:px-6"
      >
        {{ attributeModalErrorMessage }}
      </p>
      <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          @click="editAttribute()"
          type="button"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-tileset-green px-4 py-2 text-base font-medium text-tileset-full-white shadow-sm hover:bg-tileset-green-1 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Save
        </button>
        <button
          @click="showAttributeEditModal = false"
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
