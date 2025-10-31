import axios from 'axios';
import type { AxiosInstance } from 'axios';

export type RegisterPayload = {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    user_type?: 'user' | 'artist';
};

export type LoginPayload = {
    username: string;
    password: string;
};

export type AuthUser = {
    id?: number | string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    user_type?: string;
};

export type AuthResponse = {
    token?: string;
    access?: string;
    refresh?: string;
    user?: AuthUser;
    face_required?: boolean;
    [key: string]: any;
};

const API_BASE_URL = 'http://127.0.0.1:8000';
const TOKEN_KEY = 'auth_token';

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
        }
        return Promise.reject(error);
    }
);

const setToken = (token?: string | null) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
};

const extractToken = (data: AuthResponse): string | undefined => {
    return data.token || data.access;
};

export async function registerUser(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/users/register/', data);
    const token = extractToken(res.data);
    if (token) setToken(token);
    return res.data;
}

export async function loginUser(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/users/login/', data);
    const token = extractToken(res.data);
    if (token) setToken(token);
    return res.data;
}

export async function loginUserWithFace(
    username: string,
    password: string,
    faceImage: Blob
): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('face_image', faceImage, 'face.jpg');

    const res = await api.post<AuthResponse>('/api/users/login/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const token = extractToken(res.data);
    if (token) setToken(token);
    return res.data;
}

export async function uploadFaceImage(faceImage: Blob): Promise<any> {
    const formData = new FormData();
    formData.append('face_image', faceImage, 'face.jpg');

    const res = await api.post('/api/users/upload-face/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
}

export async function logoutUser(): Promise<void> {
    try {
        await api.post('/api/users/logout/');
    } catch (_) {
        // Ignore errors
    }
    setToken(null);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const res = await api.get<AuthUser>('/api/users/profile/');
        const user = (res.data as any).user ? (res.data as any).user : res.data;
        return user ?? null;
    } catch (e) {
        return null;
    }
}

export function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export { api };