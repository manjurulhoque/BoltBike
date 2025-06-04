import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/lib/types/auth';
import { APIResponse } from '@/lib/types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1/users';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Login mutation
export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await fetch(`${API_URL}/auth/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const responseData: AuthResponse = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.message || (responseData as any).detail || 'Login failed';
                throw new Error(errorMessage);
            }

            // Handle custom response format
            if (responseData.hasOwnProperty('success') && responseData.hasOwnProperty('data')) {
                if (!responseData.success) {
                    throw new Error(responseData.message || 'Login failed');
                }
                return responseData;
            }

            return responseData;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.data.access);
            localStorage.setItem('refreshToken', data.data.refresh);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            navigate('/');
        },
    });
};

// Signup mutation
export const useSignup = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials: SignupCredentials) => {
            const response = await fetch(`${API_URL}/auth/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const responseData: APIResponse<User> = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.message || (responseData as any).detail || 'Signup failed';
                throw new Error(errorMessage);
            }

            // Handle custom response format
            if (responseData.hasOwnProperty('success') && responseData.hasOwnProperty('data')) {
                if (!responseData.success) {
                    throw new Error(responseData.message || 'Signup failed');
                }
                return responseData.data;
            }

            return responseData as unknown as User;
        },
        onSuccess: () => {
            navigate('/login');
        },
    });
};

// Get current user
export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/me/`, {
                headers: getAuthHeaders(),
            });

            const responseData: APIResponse<User> = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.message || 'Failed to fetch user';
                throw new Error(errorMessage);
            }

            // Handle custom response format
            if (responseData.hasOwnProperty('success') && responseData.hasOwnProperty('data')) {
                if (!responseData.success) {
                    throw new Error(responseData.message || 'Failed to fetch user');
                }
                return responseData.data as User;
            }

            return responseData as unknown as User;
        },
        enabled: !!localStorage.getItem('token'),
    });
};

// Logout function
export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        queryClient.clear();
        navigate('/login');
    };
};
