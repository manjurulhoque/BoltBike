import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/lib/types/auth';

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

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            return response.json() as Promise<AuthResponse>;
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

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Signup failed');
            }

            return response.json() as Promise<User>;
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

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.json();

            return data.data as User;
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
