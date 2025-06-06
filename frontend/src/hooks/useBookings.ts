import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, CreateBookingData, UpdateBookingStatusData, BookingFilters } from '@/lib/types/booking';
import { APIResponse, PaginatedAPIResponse } from '@/lib/types/api';
import { toast } from 'sonner';
import { apiRequest, buildQueryString } from '@/lib/utils/apiRequest';

// API Functions
const bookingApi = {
    // List bookings with optional filtering
    list: async (filters: BookingFilters = {}): Promise<PaginatedAPIResponse<Booking>> => {
        const queryString = buildQueryString(filters);
        const url = `/bookings/${queryString ? `?${queryString}` : ''}`;
        return await apiRequest<PaginatedAPIResponse<Booking>>(url);
    },

    // Get a specific booking by ID
    get: async (id: number): Promise<APIResponse<Booking>> => {
        return await apiRequest<APIResponse<Booking>>(`/bookings/${id}/`);
    },

    // Create a new booking
    create: async (data: CreateBookingData): Promise<APIResponse<Booking>> => {
        return await apiRequest<APIResponse<Booking>>('/bookings/create/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Update booking status
    updateStatus: async (id: number, data: UpdateBookingStatusData): Promise<APIResponse<Booking>> => {
        return await apiRequest<APIResponse<Booking>>(`/bookings/${id}/update-status/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    // Cancel a booking
    cancel: async (id: number): Promise<APIResponse<Booking>> => {
        return await apiRequest<APIResponse<Booking>>(`/bookings/${id}/cancel/`, {
            method: 'POST',
        });
    },

    // Get user's bookings (as renter)
    getMyBookings: async (): Promise<PaginatedAPIResponse<Booking>> => {
        return await apiRequest<PaginatedAPIResponse<Booking>>('/bookings/my-bookings/');
    },

    // Get bookings for user's bikes (as owner)
    getBikeBookings: async (): Promise<PaginatedAPIResponse<Booking>> => {
        return await apiRequest<PaginatedAPIResponse<Booking>>('/bookings/bike-bookings/');
    },

    // Start a rental (approved -> active)
    startRental: async (id: number): Promise<APIResponse<Booking>> => {
        return await apiRequest<APIResponse<Booking>>(`/bookings/${id}/start/`, {
            method: 'POST',
        });
    },

    // Complete a rental (active -> completed)
    completeRental: async (id: number): Promise<APIResponse<Booking>> => {
        return await apiRequest<APIResponse<Booking>>(`/bookings/${id}/complete/`, {
            method: 'POST',
        });
    },

    // Check expired bookings (auto-transition)
    checkExpiredBookings: async (): Promise<APIResponse<{ started_count: number; completed_count: number }>> => {
        return await apiRequest<APIResponse<{ started_count: number; completed_count: number }>>(
            '/bookings/check-expired/',
        );
    },
};

// Query Keys
export const bookingKeys = {
    all: ['bookings'] as const,
    lists: () => [...bookingKeys.all, 'list'] as const,
    list: (filters: BookingFilters) => [...bookingKeys.lists(), filters] as const,
    details: () => [...bookingKeys.all, 'detail'] as const,
    detail: (id: number) => [...bookingKeys.details(), id] as const,
    myBookings: () => [...bookingKeys.all, 'my-bookings'] as const,
    bikeBookings: () => [...bookingKeys.all, 'bike-bookings'] as const,
};

// React Query Hooks

// List Bookings Hook
export const useBookings = (filters: BookingFilters = {}) => {
    return useQuery<PaginatedAPIResponse<Booking>, Error>({
        queryKey: bookingKeys.list(filters),
        queryFn: () => bookingApi.list(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Get Booking Details Hook
export const useBooking = (id: number) => {
    return useQuery<APIResponse<Booking>, Error>({
        queryKey: bookingKeys.detail(id),
        queryFn: () => bookingApi.get(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};

// Get My Bookings Hook
export const useMyBookings = () => {
    return useQuery<PaginatedAPIResponse<Booking>, Error>({
        queryKey: bookingKeys.myBookings(),
        queryFn: () => bookingApi.getMyBookings(),
        staleTime: 1000 * 60 * 5,
    });
};

// Get Bike Bookings Hook
export const useBikeBookings = () => {
    return useQuery<PaginatedAPIResponse<Booking>, Error>({
        queryKey: bookingKeys.bikeBookings(),
        queryFn: () => bookingApi.getBikeBookings(),
        staleTime: 1000 * 60 * 5,
    });
};

// Create Booking Mutation
export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<Booking>, Error, CreateBookingData>({
        mutationFn: (data: CreateBookingData) => bookingApi.create(data),
        onSuccess: (response) => {
            // Invalidate and refetch bookings lists
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });

            // Add the new booking to cache
            if (response.data) {
                queryClient.setQueryData(bookingKeys.detail(response.data.id), response);
            }

            toast.success(response.message || 'Your booking request has been submitted.');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create booking. Please try again.');
        },
    });
};

// Update Booking Status Mutation
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<Booking>, Error, { id: number; data: UpdateBookingStatusData }>({
        mutationFn: ({ id, data }) => bookingApi.updateStatus(id, data),
        onSuccess: (response, variables) => {
            // Invalidate and refetch bookings
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.bikeBookings() });

            // Update the specific booking in cache
            if (response.data) {
                queryClient.setQueryData(bookingKeys.detail(variables.id), response);
            }

            toast.success(response.message || 'Booking status has been updated successfully.');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update booking status. Please try again.');
        },
    });
};

// Cancel Booking Mutation
export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<Booking>, Error, number>({
        mutationFn: (id: number) => bookingApi.cancel(id),
        onSuccess: (response, bookingId) => {
            // Invalidate and refetch bookings
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.bikeBookings() });

            // Update the specific booking in cache
            if (response.data) {
                queryClient.setQueryData(bookingKeys.detail(bookingId), response);
            }

            toast.success(response.message || 'Your booking has been cancelled successfully.');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to cancel booking. Please try again.');
        },
    });
};

// Start Rental Mutation
export const useStartRental = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<Booking>, Error, number>({
        mutationFn: (id: number) => bookingApi.startRental(id),
        onSuccess: (response, bookingId) => {
            // Invalidate and refetch bookings
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.bikeBookings() });

            // Update the specific booking in cache
            if (response.data) {
                queryClient.setQueryData(bookingKeys.detail(bookingId), response);
            }

            toast.success(response.message || 'The rental has been started successfully.');
        },
        onError: (error: Error) => {
            console.log(error.message);
            toast.error(error.message || 'Failed to start rental. Please try again.');
        },
    });
};

// Complete Rental Mutation
export const useCompleteRental = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<Booking>, Error, number>({
        mutationFn: (id: number) => bookingApi.completeRental(id),
        onSuccess: (response, bookingId) => {
            // Invalidate and refetch bookings
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.bikeBookings() });

            // Update the specific booking in cache
            if (response.data) {
                queryClient.setQueryData(bookingKeys.detail(bookingId), response);
            }

            toast.success(response.message || 'The rental has been completed successfully.');
        },
        onError: (error: Error) => {
            console.log(error.message);
            toast.error(error.message || 'Failed to complete rental. Please try again.');
        },
    });
};

// Check Expired Bookings Mutation
export const useCheckExpiredBookings = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<{ started_count: number; completed_count: number }>, Error, void>({
        mutationFn: () => bookingApi.checkExpiredBookings(),
        onSuccess: (response) => {
            // Invalidate and refetch all booking lists
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.bikeBookings() });

            const { started_count, completed_count } = response.data || { started_count: 0, completed_count: 0 };

            if (started_count > 0 || completed_count > 0) {
                toast.success(`Started ${started_count} rentals and completed ${completed_count} rentals.`);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to check expired bookings.');
        },
    });
};
