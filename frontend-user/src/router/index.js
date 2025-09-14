import { createRouter, createWebHistory } from "vue-router";
import Menu from "../pages/Menu.vue";
import Cart from "../pages/Cart.vue";
import Orders from "../pages/Orders.vue";
import Review from "../pages/Review.vue";
import Checkout from "../pages/Checkout.vue";

const routes = [
  { path: "/", component: Menu },
  { path: "/cart", component: Cart },
  { path: "/checkout", component: Checkout },
  { path: "/orders", component: Orders },
  { path: "/review/:orderId", component: Review },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
