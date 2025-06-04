import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/lib/types/auth';
import { APIResponse } from '@/lib/types/api';
import { useAuthToken } from '../useAuthToken';

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
    const location = useLocation();
    const queryClient = useQueryClient();
    const { setAuthToken } = useAuthToken();

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
            setAuthToken(data.data.access);
            localStorage.setItem('refreshToken', data.data.refresh);
            queryClient.invalidateQueries({ queryKey: ['user'] });

            // Check if we should redirect back to the originally requested page
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
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
    const { hasToken, token } = useAuthToken();

    // Debug logging (remove in production)
    console.log('useUser - hasToken:', hasToken, 'token exists:', !!token);

    return useQuery({
        queryKey: ['user'], // Stable query key
        queryFn: async () => {
            // Double-check token exists before making the request
            if (!token) {
                throw new Error('No authentication token available');
            }

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
        enabled: hasToken && !!token, // Double-check both conditions
        staleTime: 1000 * 60 * 10, // 10 minutes - user data rarely changes
        gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache longer
        refetchOnMount: false, // Don't refetch on every component mount
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        refetchOnReconnect: false, // Don't refetch on network reconnect
        retry: false, // Don't retry failed requests (auth errors)
        networkMode: 'online', // Only run when online
        notifyOnChangeProps: ['data', 'error'], // Only notify when data or error changes
    });
};

// Logout function
export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { removeAuthToken } = useAuthToken();

    return () => {
        removeAuthToken();
        queryClient.clear();
        navigate('/login');
    };
};
