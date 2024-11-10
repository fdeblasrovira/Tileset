import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const authenticated = false;
  const token = "";

  return { authenticated, token };
});
