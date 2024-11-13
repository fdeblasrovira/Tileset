import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const authenticated = false;
  const accessToken = "";

  return { authenticated, accessToken };
});
