import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/MainPage.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import RegComponent from "@/components/RegComponent.vue";
import store from '@/store'
import AccauntComponent from "@/components/AccauntComponent.vue";
import AddAppComponent from "@/components/AddAppComponent.vue";
import FavoritesComponent from "@/components/FavoritesComponent.vue";
import MyAddsComponent from "@/components/MyAddsComponent.vue";
import ProductCardComponent from "@/components/ProductCardComponent.vue";
import PaymentComponent from "@/components/PaymentComponent.vue";
import MyOrdersComponent from "@/components/MyOrdersComponent.vue";
import MySalesComponent from "@/components/MySalesComponent.vue";
import RedactAddsComponent from "@/components/RedactAddsComponent.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: MainPage,
  },
  {
    path:"/login",
    name:"login",
    component:LoginComponent
  },
  {
    path:"/register",
    name:"register",
    component:RegComponent
  },
  {
    path:"/account",
    name:"account",
    component:AccauntComponent
  },
  {
    path:"/addApplication",
    name:"addApplication",
    component:AddAppComponent
  },
  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesComponent
  },
  {
    path: "/myAdds",
    name: "myAdds",
    component: MyAddsComponent
  },
  {
    path: "/prodCard",
    name: "prodCard",
    component: ProductCardComponent
  },
  {
    path: "/pay",
    name: "pay",
    component: PaymentComponent
  },
  {
    path: "/ord",
    name: "ord",
    component: MyOrdersComponent
  },
  {
    path: "/sale",
    name: "sale",
    component: MySalesComponent
  },
  {
    path: "/redact",
    name: "redact",
    component: RedactAddsComponent
  }


];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  mode: 'history',
  routes,
});

router.beforeEach(async(to)=>{if(to.meta?.requiedAuth)
  {
    var isAuth = store.state.auth.user
    if(!isAuth) isAuth = await store.dispatch('auth/logInWithCredentials')
      if(!isAuth){
        return{
          name:"login"
        }
      }
  }
})
export default router;
