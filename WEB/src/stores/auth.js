import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import API_CONFIG from '@/config/api';

export const useAuthStore = defineStore('auth', () => {
    // 状态
    const token = ref(localStorage.getItem('token') || '');
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

    // Getters
    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const username = computed(() => user.value?.username || '');

    // Actions
    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/login`, {
                username,
                password
            });

            if (response.data.code === 200) {
                const { token: newToken, user: newUser } = response.data.data;
                
                // 更新状态
                token.value = newToken;
                user.value = newUser;

                // 持久化
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));

                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error('登录失败:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || '登录失败，请稍后重试' 
            };
        }
    };

    const logout = () => {
        token.value = '';
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return {
        token,
        user,
        isAuthenticated,
        isAdmin,
        username,
        login,
        logout
    };
});
