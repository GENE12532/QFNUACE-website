import { createApp } from 'vue'
import router from './router/router.js';
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./tailwind-output.css";
import App from './App.vue'
import setupAxios from './utils/axios';

const app = createApp(App);

Object.keys(ElementPlusIconsVue).forEach((key) => {
    app.component(key, ElementPlusIconsVue[key]);
});

const pinia = createPinia();
app.use(router).use(pinia).use(ElementPlus);

// 初始化 Axios 拦截器 (需要在 pinia 安装后调用，因为用到了 store)
setupAxios();

app.mount(`#app`);
