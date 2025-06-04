import { useState, useEffect } from 'react';

/**
 * Custom hook to manage authentication token state
 * Prevents unnecessary re-renders and API calls when token doesn't exist
 */
export const useAuthToken = () => {
    const [token, setToken] = useState<string | null>(() => {
        // Initialize from localStorage only once
        return localStorage.getItem('token');
    });

    useEffect(() => {
        // Listen for storage changes (when token is set/removed in other tabs)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                setToken(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const setAuthToken = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
        setToken(newToken);
    };

    const removeAuthToken = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setToken(null);
    };

    return {
        token,
        hasToken: !!token,
        setAuthToken,
        removeAuthToken,
    };
};
