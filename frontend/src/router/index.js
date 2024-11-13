import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateView from "../views/CreateView.vue";
import EditView from "../views/EditView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";


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
router.beforeEach(async (to, from) => {
  

  // if (!authData.authenticated){
  //   // request for new access token using refresh
  //   // if good response update authData and go to requested url
  // }
  // // avoid going to home and register pages if authenticated
  // if(to.path == '/login' || to.path == '/register' ){
  //   // Check if authenticated. If authenticated redirect to Home
  //   if (authData.authenticated) return { name: 'Home' }
  //   return;
  // }
  
  

  // if (!authData.authenticated){
  //   const response = await utils.getData(urlList.BACKEND_LOGIN_CHECK)

  //   // It is authenticated. We just need to update local store
  //   if (response.code == 200){
  //     authData.authenticated = true;
  //     return { name: to.name }
  //   }
  //   else if(to.name !== 'Login'){
  //     return { name: 'Login' }
  //   }
  // }
})


export default router;
