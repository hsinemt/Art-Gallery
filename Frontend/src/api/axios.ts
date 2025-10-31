import axios from 'axios';

const TOKEN_KEY = 'auth_token';

// Create Axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 (Unauthorized) errors
        if (error.response && error.response.status === 401) {
            // Clear token if it's invalid
            localStorage.removeItem(TOKEN_KEY);
            // You might want to redirect to login page here
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;