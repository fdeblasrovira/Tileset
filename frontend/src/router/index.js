import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateView from "../views/CreateView.vue";
import EditView from "../views/EditView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/create",
      name: "Create_form",
      component: CreateView,
    },
    {
      path: "/edit",
      name: "Edit_form",
      component: EditView,
    },
  ],
});

export default router;
