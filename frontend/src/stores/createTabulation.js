import { defineStore } from "pinia";

export const useCreateTabulation = defineStore("createTabulation", () => {
  const currentTab = 1;

  return { currentTab };
});
