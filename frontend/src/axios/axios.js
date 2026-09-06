import axios from 'axios';

// In production (Vercel) this must be set as an environment variable
// (REACT_APP_API_URL, e.g. https://your-backend.up.railway.app/api) -
// CRA only inlines REACT_APP_* vars at build time, so it has to be set in
// the Vercel project settings before deploying, not after. Falls back to
// the local backend for `npm start`.
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isChat = error.config?.url?.includes('/chat');
        if (!isChat && (error.response?.status === 401 || error.response?.status === 403)) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;