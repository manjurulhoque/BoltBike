// API Response types
export interface APIResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any;
    status_code: number;
}

export interface PaginatedAPIResponse<T> {
    success: boolean;
    message: string;
    data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: T[];
    };
    status_code: number;
}

// Re-export all types
export * from './bike';
export * from './favorite';
export * from './booking';
export * from './rating';
