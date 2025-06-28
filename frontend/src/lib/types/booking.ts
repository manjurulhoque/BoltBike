import { Bike } from './bike';
import { User } from './auth';

export interface Booking {
    id: number;
    renter: User;
    bike: Bike;
    start_time: string; // ISO datetime string
    end_time: string; // ISO datetime string
    status: BookingStatus;
    total_price: string; // Decimal as string
    created_at: string; // ISO datetime string
    updated_at: string; // ISO datetime string
}

export type BookingStatus = 'requested' | 'approved' | 'active' | 'completed' | 'cancelled';

export interface CreateBookingData {
    bike_id: number;
    start_time: string; // ISO datetime string
    end_time: string; // ISO datetime string
}

export interface UpdateBookingStatusData {
    status: BookingStatus;
}

export interface BookingFilters {
    role?: 'renter' | 'owner';
    status?: BookingStatus;
    bike__id?: number;
    start_date?: string; // ISO date string
    end_date?: string; // ISO date string;
    ordering?: string;
    search?: string;
}
