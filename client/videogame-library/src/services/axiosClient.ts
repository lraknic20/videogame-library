import axios from 'axios'
import { isTokenExpired } from '@/services/jwt';
import { useToast } from "vue-toastification";
const toast = useToast();

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
});

axiosClient.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        if (token && !isTokenExpired(token)) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;