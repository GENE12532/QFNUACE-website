import { createRouter, createWebHashHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";

const routes = [
    {path: "/", redirect: "/home"},
    {path: "/home", component: MainLayout, children:[{path: "", component: () => import("../pages/HomeContent.vue")}]},
    {path: "/function1", component: MainLayout, children: [{path: "", component: () => import("../pages/function1.vue")}]},
    {path: "/function2", component: MainLayout, children: [{path: "", component: () => import("../pages/function2.vue")}]},
    {path: "/function3", component: MainLayout, children: [{path: "", component: () => import("../pages/function3.vue")}]},
    {path: "/function4", component: MainLayout, children: [{path: "", component: () => import("../pages/function4.vue")}]},

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;