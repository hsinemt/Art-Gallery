import axios from 'axios';

// Créer une instance axios avec la configuration de base
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',  // L'URL de votre backend Django
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;