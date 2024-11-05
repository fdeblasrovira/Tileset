import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", () => {
  const accountName = "Ferran de Blas";
  const accountEmail = "ferrandeblas@yahoo.com";
  const accountId = 1;
  const accountImageUrl =
    "https://images.unsplash.com/photo-1606921231106-f1083329a65c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZXhhbXBsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=700&q=60";

  return { accountName, accountId, accountImageUrl, accountEmail };
});
