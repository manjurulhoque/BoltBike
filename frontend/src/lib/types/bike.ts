export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface BikeImage {
    id?: number;
    image?: string;
    image_url?: string;
    alt_text?: string;
    caption?: string;
    is_primary?: boolean;
    order?: number;
    created_at?: string;
}

export interface Bike {
    id: number;
    owner: User;
    title: string;
    description: string;
    location: string;
    hourly_rate?: number;
    daily_rate: number;
    bike_type: BikeType;
    battery_range: number;
    max_speed: number;
    weight: number;
    features: string[];
    images: BikeImage[];
    status: BikeStatus;
    created_at: string;
    updated_at: string;
    is_favorited?: boolean; // Added to include favorite status when user is authenticated
}

export type BikeType = 'city' | 'mountain' | 'road' | 'cargo' | 'folding' | 'hybrid';

export type BikeStatus = 'available' | 'unavailable' | 'maintenance';

export interface CreateBikeData {
    title: string;
    description: string;
    location: string;
    hourly_rate?: number;
    daily_rate: number;
    bike_type: BikeType;
    battery_range: number;
    max_speed: number;
    weight: number;
    features: string[];
    image_files?: File[];
}

export interface UpdateBikeData extends Partial<CreateBikeData> {
    status?: BikeStatus;
    delete_image_ids?: number[];
    primary_image_id?: number;
}

export interface BikeFilters {
    owner?: 'me' | number;
    available_only?: boolean;
    min_price?: number;
    max_price?: number;
    search?: string;
    location?: string;
    status?: BikeStatus;
    ordering?: string;
    page?: number;
    page_size?: number;
    bike_type?: BikeType;
}

// Legacy interface - will be replaced by PaginatedAPIResponse<Bike>
export interface BikeListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Bike[];
}

export interface MaintenanceTicket {
    id: number;
    bike: Bike;
    reported_by: User;
    description: string;
    status: 'open' | 'in_progress' | 'resolved';
    created_at: string;
    updated_at: string;
}

export interface CreateMaintenanceTicketData {
    bike: number;
    description: string;
}
