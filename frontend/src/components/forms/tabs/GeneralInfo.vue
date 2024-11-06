<script setup>
import { watch, ref } from "vue";
import Input from "../../inputs/Input.vue";
import Textarea from "../../inputs/Textarea.vue";
import AvatarPicture from "../../inputs/AvatarPicture.vue";
import Radio from "../../inputs/Radio.vue";

const props = defineProps(["generalInfo"]);
const emits = defineEmits(["onGeneralInfoChange"]);

const generalInfo = ref(props.generalInfo);

// After any change to the general info, we tell the parent component to update the value
watch(generalInfo, (newGeneralInfo) => {
  emit(onGeneralInfoChange(newGeneralInfo));
});


</script>

<template>
  <div
    class="border rounded-md border-tileset-grey-2 space-y-6 px-4 py-5 sm:p-6"
  >
    <Input
      v-model="generalInfo.formName"
      label="Form name"
      name="form-name"
      type="text"
      placeholder="This is my form's name"
    />
    <Textarea
      v-model="generalInfo.description"
      label="Form description"
      name="form-description"
      placeholder="Description of the form"
    />
    <AvatarPicture v-model="generalInfo.picture" label="Form picture" :image="generalInfo.picture" />
    <div class="block text-sm font-medium mt-3">
      <label class="block text-base font-medium">Visibility</label>

      <Radio label="Public" name="general-info-visibility" id="visibility" />
      <Radio
        v-model="generalInfo.visibility"
        label="Private"
        name="general-info-visibility"
        id="no-visibility"
      />
    </div>
  </div>
</template>

<style scoped></style>
