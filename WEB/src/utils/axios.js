import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router/router';
import { ElMessage } from 'element-plus';

// 创建 Axios 实例（如果项目中其他地方直接用了 axios，可能需要替换引用，或者配置全局默认值）
// 这里我们配置全局默认值，因为项目中多处直接使用了 axios
const setupAxios = () => {
    // 请求拦截器
    axios.interceptors.request.use(
        (config) => {
            const authStore = useAuthStore();
            if (authStore.token) {
                config.headers.Authorization = `Bearer ${authStore.token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 响应拦截器
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                const { status } = error.response;
                const authStore = useAuthStore();

                if (status === 401) {
                    // Token 过期或无效
                    ElMessage.error('登录已过期，请重新登录');
                    authStore.logout();
                    router.push('/login');
                } else if (status === 403) {
                    // 权限不足
                    ElMessage.error('权限不足，无法执行此操作');
                }
            }
            return Promise.reject(error);
        }
    );
};

export default setupAxios;
