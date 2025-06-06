import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, CreateBookingData, UpdateBookingStatusData, BookingFilters } from '@/lib/types/booking';
import { APIResponse, PaginatedAPIResponse } from '@/lib/types/api';
import { useToast } from '@/hooks/use-toast';
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
    const { toast } = useToast();

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

            toast({
                title: 'Booking Created Successfully!',
                description: response.message || 'Your booking request has been submitted.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Booking Failed',
                description: error.message || 'Failed to create booking. Please try again.',
                variant: 'destructive',
            });
        },
    });
};

// Update Booking Status Mutation
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

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

            toast({
                title: 'Status Updated',
                description: response.message || 'Booking status has been updated successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Update Failed',
                description: error.message || 'Failed to update booking status. Please try again.',
                variant: 'destructive',
            });
        },
    });
};

// Cancel Booking Mutation
export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

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

            toast({
                title: 'Booking Cancelled',
                description: response.message || 'Your booking has been cancelled successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Cancellation Failed',
                description: error.message || 'Failed to cancel booking. Please try again.',
                variant: 'destructive',
            });
        },
    });
};
