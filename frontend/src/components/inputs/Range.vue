<script setup>
import { ref, computed } from "vue";
const emits = defineEmits(["update:modelValue"]);
const props = defineProps([
  "editable",
  "min",
  "max",
  "defaultValue",
  "leftColor",
  "leftLabel",
  "rightColor",
  "rightLabel",
  "modelValue"
]);

function onRangeChange(event){
  emits("update:modelValue", event.target.value)
}

const background = computed(
  () =>
    `background: linear-gradient(90deg, ${props.leftColor} 0%, ${props.rightColor}); height:25px; border-radius: 5px;`
);
</script>

<template>
  <div class="relative">
    <div class="flex">
      <p class="w-full text-left text-sm font-medium">{{ props.leftLabel }}</p>
      <p class="w-full text-right text-sm font-medium">
        {{ props.rightLabel }}
      </p>
    </div>

    <div
      class="flex justify-between relative w-full mt-[-22px] top-9 left-0 px-3 pointer-events-none z-0"
    >
      <div></div>

      <div v-for="n in (props.max - props.min - 1)" class="range-space"></div>
      <div></div>
    </div>
    <input
      v-if="props.editable === true"
      @input="onRangeChange"
      type="range"
      :value="props.defaultValue"
      :min="props.min"
      :max="props.max"
      class="w-full z-10 absolute"
      :style="background"
    />
    <input
      v-else
      type="range"
      :value="props.defaultValue"
      :min="props.min"
      :max="props.max"
      class="w-full z-10 absolute"
      :style="background"
      disabled
    />
    <div class="flex mt-10">
      <p class="w-full text-left text-sm font-medium">{{ props.min }}</p>
      <p class="w-full text-center text-sm font-medium">{{ props.defaultValue }}</p>
      <p class="w-full text-right text-sm font-medium">
        {{ props.max }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.range-space {
  height: 42px;
  background-color: #666;
  width: 2px;
  z-index: 0;
}
input[type="range"] {
  height: 42px;
  -webkit-appearance: none;
  margin: 2px 0 !important;
  width: 100%;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 25px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000;
  border-radius: 5px;
  border: 1px solid #000000;
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 1px 1px 5px #000000;
  border: 1px solid #000000;
  height: 34px;
  width: 20px;
  border-radius: 15px;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5.5px;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 25px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000;
  border-radius: 5px;
  border: 1px solid #000000;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 1px 1px 5px #000000;
  border: 1px solid #000000;
  height: 34px;
  width: 20px;
  border-radius: 15px;
  background: #ffffff;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: 25px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 0px 0px 0px #000000;
}
input[type="range"]::-ms-fill-upper {
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 0px 0px 0px #000000;
}
input[type="range"]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 1px 1px 5px #000000;
  border: 1px solid #000000;
  height: 34px;
  width: 20px;
  border-radius: 15px;
  background: #ffffff;
  cursor: pointer;
}
</style>
