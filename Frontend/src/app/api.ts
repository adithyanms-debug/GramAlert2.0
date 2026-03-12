import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Get the base URL from environment variables, or fallback to localhost during development
// We use 'as any' here to bypass TypeScript's restrictive ImportMeta checks in Vite
const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '') + '/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle global errors (e.g., token expiration)
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: any) => {
        if (error.response && error.response.status === 401) {
            // 401 Unauthorized: Token might be expired or invalid
            // clear the token and demo mode
            localStorage.removeItem('token');

            // Check if this is an authentication request (login/register)
            const isAuthRequest = error.config.url?.includes('/auth/login') ||
                error.config.url?.includes('/auth/register');

            // Check if user is already at the landing or auth pages
            const isAtSafePage = window.location.pathname === '/' ||
                window.location.pathname === '/auth' ||
                window.location.pathname === '/admin-auth' ||
                window.location.pathname === '/superadmin-auth';

            // Only redirect if it's NOT an auth request and NOT already at a safe page
            if (!isAuthRequest && !isAtSafePage) {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
