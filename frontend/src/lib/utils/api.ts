import { APIResponse } from '@/lib/types/api';

// Helper function to handle API responses consistently
export const handleAPIResponse = <T>(responseData: any): T => {
    // Check if response follows our custom format
    if (responseData && responseData.hasOwnProperty('success') && responseData.hasOwnProperty('data')) {
        if (!responseData.success) {
            throw new Error(responseData.message || 'Request failed');
        }
        return responseData.data as T;
    }

    // Fallback for responses that don't follow our custom format yet
    return responseData as T;
};

// Helper function to handle API errors consistently
export const handleAPIError = (responseData: any, defaultMessage: string): string => {
    return responseData.message || responseData.detail || responseData.error || defaultMessage;
};
