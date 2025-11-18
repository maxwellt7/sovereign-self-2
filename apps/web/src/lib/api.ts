import axios from 'axios';
import { ApiResponse } from '@sovereign-self/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Get token from Clerk
    const token = await (window as any).__clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Type-safe API wrapper
export async function apiRequest<T>(
  method: 'get' | 'post' | 'patch' | 'delete',
  url: string,
  data?: any
): Promise<T> {
  const response = await api[method]<ApiResponse<T>>(url, data);

  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.error.message);
  }
}

export default api;

