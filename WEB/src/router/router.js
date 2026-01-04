// router.js - 路由配置文件
// 功能：定义应用的路由配置和导航结构
// 说明：使用Vue Router管理单页面应用的路由跳转

import { createRouter, createWebHashHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";  // 导入主布局组件
import { useAuthStore } from "@/stores/auth";

// 路由配置数组
// 说明：定义所有页面的路由路径和对应的组件
const routes = [
    // 根路径重定向到首页
    {path: "/", redirect: "/home"},

    // 登录页面
    {path: "/login", component: () => import("../pages/Login.vue")},
    
    // 首页路由 - 使用主布局，嵌套显示HomeContent组件
    {path: "/home", component: MainLayout, children:[
        {path: "", component: () => import("../pages/HomeContent.vue")}
    ]},
    
    // 创建工单页面 - 使用主布局，嵌套显示Create组件
    {path: "/create", component: MainLayout, meta: { requiresAuth: true, roles: ['admin'] }, children: [
        {path: "", component: () => import("../pages/Create.vue")}
    ]},
    
    // 查询工单页面 - 使用主布局，嵌套显示Search组件
    {path: "/search", component: MainLayout, meta: { requiresAuth: true }, children: [
        {path: "", component: () => import("../pages/Search.vue")}
    ]},
    
    // 更新工单页面 - 使用主布局，嵌套显示Update组件
    {path: "/update", component: MainLayout, meta: { requiresAuth: true, roles: ['admin'] }, children: [
        {path: "", component: () => import("../pages/Update.vue")}
    ]},
    
    // 删除工单页面 - 使用主布局，嵌套显示Delete组件
    {path: "/delete", component: MainLayout, meta: { requiresAuth: true, roles: ['admin'] }, children: [
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

// 导航守卫
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.user?.role;

    // 检查路由是否需要认证
    if (to.meta.requiresAuth) {
        if (!isAuthenticated) {
            // 未登录，重定向到登录页
            return next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        }

        // 检查角色权限
        if (to.meta.roles && !to.meta.roles.includes(userRole)) {
            // 权限不足，重定向到首页或错误页
            // 这里简单重定向到首页
            return next('/home');
        }
    }

    // 已登录用户访问登录页，重定向到首页
    if (to.path === '/login' && isAuthenticated) {
        return next('/home');
    }

    next();
});

// 导出路由实例供main.js使用
export default router;