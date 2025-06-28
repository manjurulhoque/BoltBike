// Generic API Response type that matches our backend response structure
export interface APIResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
    errors?: Record<string, string[]> | string;
    status_code?: number;
}

// For paginated responses
export interface PaginatedAPIResponse<T = any>
    extends APIResponse<{
        results: T[];
        count: number;
        next: string | null;
        previous: string | null;
    }> {}

// For responses that don't return data (like delete operations)
export interface APIResponseNoData extends Omit<APIResponse<null>, 'data'> {
    data: null;
}

// Helper type for API functions that can return either paginated or non-paginated data
export type APIListResponse<T> = APIResponse<T[]> | PaginatedAPIResponse<T>;
