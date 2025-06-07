import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Rating,
    CreateRatingData,
    UpdateRatingData,
    RatingFilters,
    BikeRatingStats,
    RateableBooking,
} from '@/lib/types/rating';
import { APIResponse, PaginatedAPIResponse } from '@/lib/types/api';
import { toast } from 'sonner';
import { apiRequest, buildQueryString } from '@/lib/utils/apiRequest';

// API Functions
const ratingApi = {
    // List ratings with optional filtering
    list: async (filters: RatingFilters = {}): Promise<PaginatedAPIResponse<Rating>> => {
        const queryString = buildQueryString(filters);
        const url = `/ratings/${queryString ? `?${queryString}` : ''}`;
        return await apiRequest<PaginatedAPIResponse<Rating>>(url);
    },

    // Get a specific rating by ID
    get: async (id: number): Promise<APIResponse<Rating>> => {
        return await apiRequest<APIResponse<Rating>>(`/ratings/${id}/`);
    },

    // Create a new rating
    create: async (data: CreateRatingData): Promise<APIResponse<Rating>> => {
        return await apiRequest<APIResponse<Rating>>('/ratings/create/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Update an existing rating
    update: async (id: number, data: UpdateRatingData): Promise<APIResponse<Rating>> => {
        return await apiRequest<APIResponse<Rating>>(`/ratings/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    // Delete a rating
    delete: async (id: number): Promise<void> => {
        await apiRequest<void>(`/ratings/${id}/`, {
            method: 'DELETE',
        });
    },

    // Get user's own ratings
    getMyRatings: async (): Promise<PaginatedAPIResponse<Rating>> => {
        return await apiRequest<PaginatedAPIResponse<Rating>>('/ratings/my-ratings/');
    },

    // Get ratings for a specific bike
    getBikeRatings: async (bikeId: number): Promise<APIResponse<{ ratings: Rating[]; statistics: any }>> => {
        return await apiRequest<APIResponse<{ ratings: Rating[]; statistics: any }>>(`/ratings/bikes/${bikeId}/`);
    },

    // Get rating statistics for a specific bike
    getBikeRatingStats: async (bikeId: number): Promise<APIResponse<BikeRatingStats>> => {
        return await apiRequest<APIResponse<BikeRatingStats>>(`/ratings/bikes/${bikeId}/stats/`);
    },

    // Get completed bookings that can be rated
    getRateableBookings: async (): Promise<PaginatedAPIResponse<RateableBooking>> => {
        return await apiRequest<PaginatedAPIResponse<RateableBooking>>('/ratings/rateable-bookings/');
    },
};

// Query Keys
export const ratingKeys = {
    all: ['ratings'] as const,
    lists: () => [...ratingKeys.all, 'list'] as const,
    list: (filters: RatingFilters) => [...ratingKeys.lists(), filters] as const,
    details: () => [...ratingKeys.all, 'detail'] as const,
    detail: (id: number) => [...ratingKeys.details(), id] as const,
    myRatings: () => [...ratingKeys.all, 'my-ratings'] as const,
    bikeRatings: (bikeId: number) => [...ratingKeys.all, 'bike-ratings', bikeId] as const,
    bikeStats: (bikeId: number) => [...ratingKeys.all, 'bike-stats', bikeId] as const,
    rateableBookings: () => [...ratingKeys.all, 'rateable-bookings'] as const,
};

// Hook: Get ratings list
export const useRatings = (filters: RatingFilters = {}) => {
    return useQuery({
        queryKey: ratingKeys.list(filters),
        queryFn: () => ratingApi.list(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook: Get single rating
export const useRating = (id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ratingKeys.detail(id),
        queryFn: () => ratingApi.get(id),
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

// Hook: Get user's ratings
export const useMyRatings = () => {
    return useQuery({
        queryKey: ratingKeys.myRatings(),
        queryFn: () => ratingApi.getMyRatings(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook: Get bike ratings
export const useBikeRatings = (bikeId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ratingKeys.bikeRatings(bikeId),
        queryFn: () => ratingApi.getBikeRatings(bikeId),
        enabled: enabled && !!bikeId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook: Get bike rating statistics
export const useBikeRatingStats = (bikeId: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ratingKeys.bikeStats(bikeId),
        queryFn: () => ratingApi.getBikeRatingStats(bikeId),
        enabled: enabled && !!bikeId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

// Hook: Get rateable bookings
export const useRateableBookings = () => {
    return useQuery({
        queryKey: ratingKeys.rateableBookings(),
        queryFn: () => ratingApi.getRateableBookings(),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

// Mutation: Create rating
export const useCreateRating = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<Rating>, Error, CreateRatingData>({
        mutationFn: (data: CreateRatingData) => ratingApi.create(data),
        onSuccess: (response, variables) => {
            // Invalidate and refetch ratings lists
            queryClient.invalidateQueries({ queryKey: ratingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ratingKeys.myRatings() });
            queryClient.invalidateQueries({ queryKey: ratingKeys.rateableBookings() });

            // Invalidate bike-specific queries if we know the bike ID
            if (response.data) {
                queryClient.invalidateQueries({
                    queryKey: ratingKeys.bikeRatings(response.data.bike.id),
                });
                queryClient.invalidateQueries({
                    queryKey: ratingKeys.bikeStats(response.data.bike.id),
                });
            }

            // Add the new rating to cache
            if (response.data) {
                queryClient.setQueryData(ratingKeys.detail(response.data.id), response);
            }

            toast.success(response.message || 'Rating submitted successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to submit rating. Please try again.');
        },
    });
};

// Mutation: Update rating
export const useUpdateRating = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<Rating>, Error, { id: number; data: UpdateRatingData }>({
        mutationFn: ({ id, data }) => ratingApi.update(id, data),
        onSuccess: (response, variables) => {
            // Invalidate and refetch related queries
            queryClient.invalidateQueries({ queryKey: ratingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ratingKeys.myRatings() });
            queryClient.invalidateQueries({ queryKey: ratingKeys.detail(variables.id) });

            // Invalidate bike-specific queries if we know the bike ID
            if (response.data) {
                queryClient.invalidateQueries({
                    queryKey: ratingKeys.bikeRatings(response.data.bike.id),
                });
                queryClient.invalidateQueries({
                    queryKey: ratingKeys.bikeStats(response.data.bike.id),
                });
            }

            toast.success(response.message || 'Rating updated successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update rating. Please try again.');
        },
    });
};

// Mutation: Delete rating
export const useDeleteRating = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { id: number; bikeId?: number }>({
        mutationFn: ({ id }) => ratingApi.delete(id),
        onSuccess: (_, variables) => {
            // Invalidate and refetch related queries
            queryClient.invalidateQueries({ queryKey: ratingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ratingKeys.myRatings() });

            // Remove from cache
            queryClient.removeQueries({ queryKey: ratingKeys.detail(variables.id) });

            // Invalidate bike-specific queries if we know the bike ID
            if (variables.bikeId) {
                queryClient.invalidateQueries({
                    queryKey: ratingKeys.bikeRatings(variables.bikeId),
                });
                queryClient.invalidateQueries({
                    queryKey: ratingKeys.bikeStats(variables.bikeId),
                });
            }

            toast.success('Rating deleted successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete rating. Please try again.');
        },
    });
};
