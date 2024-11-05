<script setup>
const props = defineProps(["open"]);
</script>

<template>
  <div
    v-if="props.open"
    class="relative z-10"
    aria-labelledby="spinner"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-tileset-full-white bg-opacity-75"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <svg class="spinner stroke-tileset-blue" viewBox="0 0 50 50">
        <circle
          class="path"
          stroke="stroke-tileset-blue"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;
}
.path {
  stroke: hsl(210, 70, 75);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
