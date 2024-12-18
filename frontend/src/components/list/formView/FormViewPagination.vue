<script setup>
import { ref } from "vue";
import BaseButton from "../../buttons/BaseButtonWithIcon.vue";

const emit = defineEmits(["change"]);

function previous() {
    emit("change", "previous");
}

function next() {
    emit("change", "next");
}

</script>

<template>
    <div class="flex flex-row justify-between items-center h-full overflow-hidden flex-wrap">
        <BaseButton @click="previous" text="Previous" color="bg-tileset-green" hover="hover:bg-tileset-green-1"
            class="mx-4">
        </BaseButton>
        <BaseButton @click="next" text="Next" color="bg-tileset-green" hover="hover:bg-tileset-green-1"
            class="mx-4">
        </BaseButton>
    </div>
</template>

<style scoped></style>
