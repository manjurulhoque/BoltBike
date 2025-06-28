import { APIResponse } from '../types/api';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
export const API_BASE_URL = `${API_URL}/api/v1`;

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Base fetch function with authentication
export const apiRequest = async <T = any>(
    url: string,
    options: RequestInit = {},
    baseUrl: string = API_BASE_URL,
): Promise<T> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers,
    });

    const responseData: APIResponse<T> = await response.json().catch(() => ({}));

    if (!response.ok) {
        // Handle custom error response format
        const errorMessage =
            responseData.message ||
            (responseData as any).detail ||
            (responseData as any).error ||
            `HTTP ${response.status}`;
        throw new Error(errorMessage);
    }

    // Check if response follows our custom format
    // if (responseData.hasOwnProperty('success') && responseData.hasOwnProperty('data')) {
    //     if (!responseData.success) {
    //         throw new Error(responseData.message || 'Request failed');
    //     }
    //     return responseData as unknown as T;
    // }

    // Fallback for responses that don't follow our custom format yet
    return responseData as T;
};

// Helper function to build query string from filters
export const buildQueryString = (filters: any): string => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    return params.toString();
};
