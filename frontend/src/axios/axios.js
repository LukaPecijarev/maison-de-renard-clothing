import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken'); // ✅ Changed from 'token' to 'jwtToken'
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
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('jwtToken'); // ✅ Changed from 'token'
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;