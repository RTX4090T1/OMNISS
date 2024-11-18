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
import NotificationsComponent from "@/components/NotificationsComponent.vue";
import ComunicationComponent from "@/components/ComunicationComponent.vue";

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
    path: "/prodCard/:id",
    name: "prodCard",
    component: ProductCardComponent,
    props: true
  },
  {
    path: "/pay/:id",
    name: "pay",
    component: PaymentComponent,
    props:true
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
    path: "/redact/:ids",
    name: "redact",
    component: RedactAddsComponent,
    props:true
  },
  {
    path: "/notifications/:id",
    name: "notifications",
    component: NotificationsComponent,
    props:true
  },
  {
    path: "/comunicate",
    name: "comunicate",
    component: ComunicationComponent,
    props:true
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
