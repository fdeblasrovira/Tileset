<script setup>
import { ref } from "vue";
import Input from "../../inputs/Input.vue";
import Textarea from "../../inputs/Textarea.vue";
import AvatarPicture from "../../inputs/AvatarPicture.vue";
import Radio from "../../inputs/Radio.vue";
import Select from "../../inputs/Select.vue";

const props = defineProps(["generalInfo", "errorMessage"]);

const generalInfo = ref(props.generalInfo);

</script>

<template>
  <div class="border rounded-md border-tileset-grey-2 space-y-6 px-4 py-5 sm:p-6">
    <Input v-model="generalInfo.formName" label="Form name" name="form-name" type="text"
      placeholder="This is my form's name" />
    <Textarea v-model="generalInfo.description" label="Form description" name="form-description"
      placeholder="Description of the form" :maxCharacters="2048" />
    <AvatarPicture v-model="generalInfo.picture" label="Form picture" :image="generalInfo.picture" />
    <div class="block text-sm font-medium mt-3">
      <label class="block text-base font-medium">Visibility</label>
      <Radio v-model="generalInfo.visibility" label="Public" name="general-info-visibility" id="visibility"
        value="public" :checked="generalInfo.visibility == 'public' ? true : false" />
      <Radio v-model="generalInfo.visibility" label="Private" name="general-info-visibility" id="no-visibility"
        value="private" :checked="generalInfo.visibility == 'private' ? true : false" />
    </div>
    <div class="block text-sm font-medium mt-3">
      <label class="block text-base font-medium">
        Questions per page
      </label>
      <Select v-model="generalInfo.questionsPerPage" :value="1">
        <option disabled value="">Please select one</option>
        <option v-for="n in 10" :value="n" :key="n">
          {{ n }}
        </option>
      </Select>
    </div>
  </div>
  <p v-if="props.errorMessage.length > 0" class="font-light text-tileset-red text-right text-sm italic px-4 sm:px-6">
    {{ errorMessage }}
  </p>
</template>

<style scoped></style>
