<script setup>
import { watch, reactive } from "vue";
import Input from "../../inputs/Input.vue";
const props = defineProps(["data", "attributes", "open", "close", "index"]);
const emit = defineEmits(["listOptionClicked", "deleteOption", "onOptionsChange"]);

function openListItem() {
  emit("listOptionClicked");
}

function deleteOption() {
  emit("deleteOption");
}

const options = reactive(props.data);

// After any change to the questions, we tell the parent component to update the value
watch(options, (newOptions) => {
  console.log("onOptionsChange")
  emit("onOptionsChange", newOptions, props.index);
});


function calculateAttributeStyle(direction, attribute) {
  let modifier =
    typeof options.actions[attribute.id] == "undefined"
      ? 0
      : options.actions[attribute.id];
  let totalValue = Math.round(Math.abs(attribute.max - attribute.min));
  if (direction == "right" && modifier > 0) {
    let percentage = Math.round(
      (Math.abs(modifier) / Math.abs(totalValue)) * 100
    );
    return `background: linear-gradient(90deg, ${attribute.rightColor} ${percentage}%, #f4f3ee ${percentage}%); border-radius: 3px;`;
  } else if (direction == "left" && modifier < 0) {
    let percentage = Math.round(
      (Math.abs(modifier) / Math.abs(totalValue)) * 100
    );
    let remaining = 100 - percentage;
    return `background: linear-gradient(90deg, #f4f3ee ${remaining}%, ${attribute.leftColor} ${remaining}%); border-radius: 3px;`;
  }
}

function increaseModifier(attribute) {
  // If a modifier does not exist, create it and set value to 1
  if (typeof options.actions[attribute.id] == "undefined") {
    options.actions[attribute.id] = 1;
  }
  // If it exist, add 1
  else {
    options.actions[attribute.id]++;
  }

  emit("onOptionsChange", options, props.index);
}

function decreaseModifier(attribute) {
  // If a modifier does not exist, create it and set value to -1
  if (typeof options.actions[attribute.id] == "undefined") {
    options.actions[attribute.id] = -1;
  }
  // If it exist, substract 1
  else {
    options.actions[attribute.id]--;
  }

  emit("onOptionsChange", options, props.index);
}

function calculateInvisibility(direction, attribute) {
  if (typeof options.actions[attribute.id] == "undefined") return false;

  let modifier = options.actions[attribute.id];
  let totalValue = Math.round(Math.abs(attribute.max - attribute.min));

  if (direction == "left" && modifier < 0) {
    return modifier <= -totalValue;
  } else if (direction == "right" && modifier > 0) {
    return modifier >= totalValue;
  } else return false;
}
</script>

<template>
  <div
    @click="openListItem"
    class="flex flex-col container min-w-full mx-auto items-center justify-center hover:bg-tileset-grey-2 bg-tileset-grey-1 shadow"
  >
    <ul class="flex flex-col w-full">
      <li class="flex flex-row">
        <div class="select-none cursor-pointer flex flex-1 items-center p-1">
          <button class="w-10 text-right flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 transition-all ml-1"
              :class="[props.open && !props.close ? '-rotate-90' : 'rotate-90']"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
          <div class="text-left w-full">{{ options.text }}</div>
          <button
            @click.stop="deleteOption"
            class="bg-tileset-red p-1 ml-2 text-sm font-medium text-white rounded hover:bg-tileset-red-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4 text-tileset-full-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </li>
    </ul>
  </div>
  <div
    v-bind:class="[
      props.open ? 'visible' : 'hidden',
      props.close ? 'hidden' : '',
    ]"
    class="bg-tileset-white w-full border-none"
  >
  <div class="p-2">
  <Input v-model="options.text" label="Label" type="text" />
</div>
    <div
      v-for="attribute in props.attributes"
      class="flex flex-row flex-nowrap justify-between items-center h-full overflow-hidden flex-wrap p-2"
    >
      <div
        class="flex grow shrink-0 basis-0 w-0"
        :style="calculateAttributeStyle('left', attribute)"
      >
        <button
          @click="decreaseModifier(attribute)"
          class="bg-tileset-grey-2 p-1 text-sm font-medium text-white rounded hover:bg-tileset-grey-4"
          :class="{ invisible: calculateInvisibility('left', attribute) }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
        </button>
        <p class="ml-2 text-left">{{ attribute.leftLabel }}</p>
      </div>
      <div
        class="flex grow shrink-0 justify-end basis-0 w-0"
        :style="calculateAttributeStyle('right', attribute)"
      >
        <p class="mr-2 text-right">{{ attribute.rightLabel }}</p>

        <button
          @click="increaseModifier(attribute)"
          class="bg-tileset-grey-2 p-1 text-sm font-medium text-white rounded hover:bg-tileset-grey-4"
          :class="{ invisible: calculateInvisibility('right', attribute) }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
