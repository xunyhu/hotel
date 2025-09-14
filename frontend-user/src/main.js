import { createApp } from "vue";
import VueLazyload from "vue-lazyload";
import App from "./App.vue";
import router from "./router";

import "./style.css"; // 全局样式

createApp(App).use(router).use(VueLazyload).mount("#app");
