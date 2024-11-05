<script setup>
import Input from "../../inputs/Input.vue";
import Textarea from "../../inputs/Textarea.vue";
import AvatarPicture from "../../inputs/AvatarPicture.vue";
import Radio from "../../inputs/Radio.vue";
</script>

<template>
  <div
    class="border rounded-md border-tileset-grey-2 space-y-6 px-4 py-5 sm:p-6"
  >
    <Input
      label="Form name"
      name="form-name"
      type="text"
      placeholder="This is my form's name"
    />
    <Textarea
      label="Form description"
      name="form-description"
      placeholder="Description of the form"
    />
    <AvatarPicture label="Form picture" image="" />
    <div class="block text-sm font-medium mt-3">
      <label class="block text-base font-medium">Visibility</label>

      <Radio label="Public" name="general-info-visibility" id="visibility" />
      <Radio
        label="Private"
        name="general-info-visibility"
        id="no-visibility"
      />
    </div>
  </div>
</template>

<style scoped></style>
