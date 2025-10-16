// router.js - 路由配置文件
// 功能：定义应用的路由配置和导航结构
// 说明：使用Vue Router管理单页面应用的路由跳转

import { createRouter, createWebHashHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";  // 导入主布局组件

// 路由配置数组
// 说明：定义所有页面的路由路径和对应的组件
const routes = [
    // 根路径重定向到首页
    {path: "/", redirect: "/home"},
    
    // 首页路由 - 使用主布局，嵌套显示HomeContent组件
    {path: "/home", component: MainLayout, children:[
        {path: "", component: () => import("../pages/HomeContent.vue")}
    ]},
    
    // 创建工单页面 - 使用主布局，嵌套显示Create组件
    {path: "/create", component: MainLayout, children: [
        {path: "", component: () => import("../pages/Create.vue")}
    ]},
    
    // 查询工单页面 - 使用主布局，嵌套显示Search组件
    {path: "/search", component: MainLayout, children: [
        {path: "", component: () => import("../pages/Search.vue")}
    ]},
    
    // 更新工单页面 - 使用主布局，嵌套显示Update组件
    {path: "/update", component: MainLayout, children: [
        {path: "", component: () => import("../pages/Update.vue")}
    ]},
    
    // 删除工单页面 - 使用主布局，嵌套显示Delete组件
    {path: "/delete", component: MainLayout, children: [
        {path: "", component: () => import("../pages/Delete.vue")}
    ]},
];

// 创建路由实例
// 说明：配置路由历史模式和路由表
const router = createRouter({
    // 使用哈希历史模式，适合单页面应用
    history: createWebHashHistory(),
    // 路由配置
    routes,
});

// 导出路由实例供main.js使用
export default router;