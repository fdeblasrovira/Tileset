import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateView from "../views/CreateView.vue";
import EditView from "../views/EditView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import auth from "@/auth/auth";


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
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
    },
  ],
});

// Handle user authentication
router.beforeEach(async (to) => {
  // login and register screens are only for not authenticated users
  if(to.path == '/login' || to.path == '/register' ){
    // Check if authenticated. If authenticated redirect to Home
    if (await auth.isValidAuth()) return { name: 'Home' }
    return;
  }
  else{
    // For other screens check if the user authentication is valid
    if (await auth.isValidAuth()) return;
    else return { name: 'Login' }
  }
})

export default router;
