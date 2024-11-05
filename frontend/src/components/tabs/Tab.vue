<script setup>
const props = defineProps(["active"]);
</script>

<template>
  <li class="flex grow relative cursor-pointer" :class="props.active ? 'active' : 'inactive'">
    <a
      href="#"
      class="grow h-12 py-3 px-4 trapezoid border-tileset-grey-4"
      :class="props.active ? 'bg-tileset-full-white' : 'bg-tileset-grey-3 border-t border-r border-l'"
    >
    </a>
    <slot></slot>

  </li>
</template>

<style scoped>
.trapezoid {
  margin-bottom: 5px;
  transform: perspective(15px) rotateX(8deg);
  border-radius: 10px 10px 2px 2px;
  margin-right: -1px;
  margin-left: -1px;
}

.active {
  z-index: 8;
  border-bottom-style: none;
}
.inactive {
  z-index: 0;
}

.inactive:nth-child(1) {
  z-index: 7;
}
.inactive:nth-child(2) {
  z-index: 6;
}
.inactive:nth-child(3) {
  z-index: 5;
}
.inactive:nth-child(4) {
  z-index: 4;
}
.inactive:nth-child(5) {
  z-index: 3;
}
.inactive:nth-child(6) {
  z-index: 2;
}
.inactive:nth-child(7) {
  z-index: 1;
}
</style>
