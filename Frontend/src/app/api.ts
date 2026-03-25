import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Get the base URL from environment variables, or fallback to localhost during development
// We use 'as any' here to bypass TypeScript's restrictive ImportMeta checks in Vite
const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '') + '/';
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/$/, '');

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
        const path = window.location.pathname;
        let token = null;

        if (path.startsWith('/superadmin')) {
            token = localStorage.getItem('superadmin_token');
        } else if (path.startsWith('/admin')) {
            token = localStorage.getItem('admin_token') || localStorage.getItem('superadmin_token');
        } else {
            token = localStorage.getItem('villager_token') || localStorage.getItem('token') || localStorage.getItem('admin_token') || localStorage.getItem('superadmin_token');
        }

        const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
        if (token && config.headers && !isAuthRequest) {
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
            const path = window.location.pathname;
            if (path.startsWith('/superadmin')) {
                localStorage.removeItem('superadmin_token');
            } else if (path.startsWith('/admin')) {
                localStorage.removeItem('admin_token');
            } else {
                localStorage.removeItem('villager_token');
                localStorage.removeItem('token');
            }

            // Check if this is an authentication request (login/register)
            const isAuthRequest = error.config.url?.includes('/auth/login') ||
                error.config.url?.includes('/auth/register');

            // Check if this is a ProtectedRoute auth check (it handles its own redirects)
            const isAuthCheck = error.config.headers?.['X-Auth-Check'] === 'true';

            // Check if user is already at the landing or auth pages
            const isAtSafePage = window.location.pathname === '/' ||
                window.location.pathname === '/auth' ||
                window.location.pathname === '/admin-auth' ||
                window.location.pathname === '/superadmin-auth';

            // Only redirect if it's NOT an auth request, NOT a ProtectedRoute check, and NOT already at a safe page
            if (!isAuthRequest && !isAuthCheck && !isAtSafePage) {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
