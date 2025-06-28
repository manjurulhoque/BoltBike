import { User } from './auth';
import { Bike } from './bike';
import { Booking } from './booking';

export interface Rating {
    id: number;
    bike: Bike;
    user: User;
    booking?: Booking;
    rating: number; // 1-5
    comment?: string;
    created_at: string;
}

export interface CreateRatingData {
    booking: number;
    rating: number;
    comment?: string;
}

export interface UpdateRatingData {
    rating?: number;
    comment?: string;
}

export interface RatingFilters {
    rating?: number;
    bike?: number;
    user?: number;
    min_rating?: number;
    page?: number;
    page_size?: number;
    ordering?: string;
}

export interface BikeRatingStats {
    bike_id: number;
    bike_title: string;
    statistics: {
        average_rating: number;
        total_ratings: number;
        rating_distribution: {
            [key: string]: number; // "1_star", "2_star", etc.
        };
    };
}

export interface BikeRatingsResponse {
    ratings: {
        results: Rating[];
        count: number;
        next: string | null;
        previous: string | null;
    };
    statistics: {
        average_rating: number;
        total_ratings: number;
        rating_distribution?: {
            [key: string]: number;
        };
    };
}

export interface RateableBooking extends Booking {
    // Bookings that are completed and haven't been rated yet
}
