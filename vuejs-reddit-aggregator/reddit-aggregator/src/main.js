import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { firestorePlugin } from "vuefire";
import { BootstrapVueIcons } from "bootstrap-vue";

import Router from "vue-router";
//import Login from "./components/Login.vue";
//import Register from "./components/Register.vue";
//import Dashboard from "./components/Dashboard.vue";

//import firebase from "firebase";

Vue.prototype.$htttp = axios;

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.use(firestorePlugin);
Vue.use(Router);

/*

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
    },
  ],
});
*/

new Vue({
  //router,
  render: (h) => h(App),
}).$mount("#app");
