<script setup>
import { ref } from "vue";
import BaseButton from "../../buttons/BaseButtonWithIcon.vue";

const props = defineProps(['currentPage', 'totalPages'])

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
        <BaseButton v-if="props.currentPage !== 1" @click="previous" text="Previous" color="bg-tileset-green"
            hover="hover:bg-tileset-green-1" class="mx-4">
        </BaseButton>
        <BaseButton v-else text="Previous" color="bg-tileset-green-0" :disabled="true" class="mx-4">
        </BaseButton>
        <BaseButton v-if="props.currentPage !== props.totalPages" @click="next" text="Next" color="bg-tileset-green"
            hover="hover:bg-tileset-green-1" class="mx-4">
        </BaseButton>
        <BaseButton v-else text="Submit" color="bg-tileset-green" hover="hover:bg-tileset-green-1" class="mx-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5"
                stroke="currentColor" class="w-6 h-6 stroke-tileset-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
        </BaseButton>
    </div>
</template>

<style scoped></style>
