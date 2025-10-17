import { createRouter, createWebHashHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";

const routes = [
    {path: "/", redirect: "/home"},
    {path: "/home", component: MainLayout, children:[{path: "", component: () => import("../pages/HomeContent.vue")}]},
    {path: "/create", component: MainLayout, children: [{path: "", component: () => import("../pages/Create.vue")}]},
    {path: "/search", component: MainLayout, children: [{path: "", component: () => import("../pages/Search.vue")}]},
    {path: "/update", component: MainLayout, children: [{path: "", component: () => import("../pages/Update.vue")}]},
    {path: "/delete", component: MainLayout, children: [{path: "", component: () => import("../pages/Delete.vue")}]},

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;