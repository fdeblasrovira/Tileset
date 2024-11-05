import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", () => {
  const loading = false;

  return { loading };
});
