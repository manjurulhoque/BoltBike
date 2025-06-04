import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bike, CreateBikeData, UpdateBikeData, BikeFilters, BikeImage, BikeListResponse } from '@/lib/types/bike';
import { APIResponse, PaginatedAPIResponse, APIResponseNoData, APIListResponse } from '@/lib/types/api';
import { useToast } from '@/hooks/use-toast';

// API Configuration
const API_BASE_URL = 'http://localhost:8001/api/v1';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Base fetch function with authentication
export const apiRequest = async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    const responseData: APIResponse<T> = await response.json().catch(() => ({}));

    if (!response.ok) {
        // Handle custom error response format
        const errorMessage =
            responseData.message ||
            (responseData as any).detail ||
            (responseData as any).error ||
            `HTTP ${response.status}`;
        throw new Error(errorMessage);
    }

    // Check if response follows our custom format
    // if (responseData.hasOwnProperty('success') && responseData.hasOwnProperty('data')) {
    //     if (!responseData.success) {
    //         throw new Error(responseData.message || 'Request failed');
    //     }
    //     return responseData as unknown as T;
    // }

    // Fallback for responses that don't follow our custom format yet
    return responseData as T;
};

// Helper function to build query string from filters
const buildQueryString = (filters: BikeFilters): string => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    return params.toString();
};

// API Functions
const bikeApi = {
    // List bikes with optional filtering
    list: async (filters: BikeFilters = {}): Promise<PaginatedAPIResponse<Bike>> => {
        const queryString = buildQueryString(filters);
        const url = `/bikes/${queryString ? `?${queryString}` : ''}`;
        return await apiRequest<PaginatedAPIResponse<Bike>>(url);
    },

    // Get a specific bike by ID
    get: async (id: number): Promise<APIResponse<Bike>> => {
        return await apiRequest<APIResponse<Bike>>(`/bikes/${id}/`);
    },

    // Create a new bike
    create: async (data: CreateBikeData): Promise<APIResponse<Bike>> => {
        const formData = new FormData();

        // Add all bike data fields
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'image_files' && value) {
                // Handle file uploads
                (value as File[]).forEach((file) => {
                    formData.append('image_files', file);
                });
            } else if (key === 'features' && Array.isArray(value)) {
                // Handle features array
                formData.append('features', JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        const response = await fetch(`${API_BASE_URL}/bikes/create/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                // Don't set Content-Type for FormData - browser will set it with boundary
            },
            body: formData,
        });

        const responseData: APIResponse<Bike> = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMessage =
                responseData.message ||
                (responseData as any).detail ||
                (responseData as any).error ||
                `HTTP ${response.status}`;
            throw new Error(errorMessage);
        }

        // Handle custom response format
        // if (responseData.hasOwnProperty('success') && responseData.hasOwnProperty('data')) {
        //     if (!responseData.success) {
        //         throw new Error(responseData.message || 'Request failed');
        //     }
        //     return responseData.data;
        // }

        return responseData;
    },

    // Update an existing bike
    update: async (id: number, data: UpdateBikeData): Promise<Bike> => {
        // Check if we have files to upload
        const hasFiles = data.image_files && data.image_files.length > 0;

        if (hasFiles) {
            // Use FormData for file uploads
            const formData = new FormData();

            // Add all bike data fields
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'image_files' && value) {
                    // Handle file uploads
                    (value as File[]).forEach((file) => {
                        formData.append('image_files', file);
                    });
                } else if (key === 'features' && Array.isArray(value)) {
                    // Handle features array
                    formData.append('features', JSON.stringify(value));
                } else if (key === 'delete_image_ids' && Array.isArray(value)) {
                    // Handle delete image IDs array
                    value.forEach((id) => {
                        formData.append('delete_image_ids', String(id));
                    });
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            const response = await fetch(`${API_BASE_URL}/bikes/${id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    // Don't set Content-Type for FormData - browser will set it with boundary
                },
                body: formData,
            });

            const responseData: APIResponse<Bike> = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMessage =
                    responseData.message ||
                    (responseData as any).detail ||
                    (responseData as any).error ||
                    `HTTP ${response.status}`;
                throw new Error(errorMessage);
            }

            return responseData.data || (responseData as any);
        } else {
            // Use JSON for text-only updates
            return await apiRequest<Bike>(`/bikes/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        }
    },

    // Delete a bike
    delete: async (id: number): Promise<void> => {
        await apiRequest<void>(`/bikes/${id}/`, {
            method: 'DELETE',
        });
    },

    // Get user's own bikes
    getMyBikes: async (): Promise<PaginatedAPIResponse<Bike>> => {
        return await apiRequest<PaginatedAPIResponse<Bike>>('/bikes/my-bikes/');
    },

    // Toggle bike status (available/unavailable)
    toggleStatus: async (id: number): Promise<Bike> => {
        return await apiRequest<Bike>(`/bikes/${id}/toggle-status/`, {
            method: 'POST',
        });
    },
};

// Bike Image API functions
const bikeImageApi = {
    // Get images for a specific bike
    list: async (bikeId: number): Promise<BikeImage[]> => {
        return await apiRequest<BikeImage[]>(`/bikes/${bikeId}/images/`);
    },

    // Upload new images to a bike
    upload: async (bikeId: number, files: File[]): Promise<BikeImage[]> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('image', file);
        });

        const response = await fetch(`${API_BASE_URL}/bikes/${bikeId}/images/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: formData,
        });

        const responseData: APIResponse<BikeImage[]> = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMessage =
                responseData.message ||
                (responseData as any).detail ||
                (responseData as any).error ||
                `HTTP ${response.status}`;
            throw new Error(errorMessage);
        }

        // Handle custom response format
        if (responseData.hasOwnProperty('success') && responseData.hasOwnProperty('data')) {
            if (!responseData.success) {
                throw new Error(responseData.message || 'Request failed');
            }
            return responseData.data;
        }

        return responseData as unknown as BikeImage[];
    },

    // Delete an image
    delete: async (bikeId: number, imageId: number): Promise<void> => {
        await apiRequest<void>(`/bikes/${bikeId}/images/${imageId}/`, {
            method: 'DELETE',
        });
    },

    // Set an image as primary
    setPrimary: async (bikeId: number, imageId: number): Promise<BikeImage> => {
        return await apiRequest<BikeImage>(`/bikes/${bikeId}/images/${imageId}/set-primary/`, {
            method: 'POST',
        });
    },

    // Update image details
    update: async (bikeId: number, imageId: number, data: Partial<BikeImage>): Promise<BikeImage> => {
        return await apiRequest<BikeImage>(`/bikes/${bikeId}/images/${imageId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

// Query Keys
export const bikeKeys = {
    all: ['bikes'] as const,
    lists: () => [...bikeKeys.all, 'list'] as const,
    list: (filters: BikeFilters) => [...bikeKeys.lists(), filters] as const,
    details: () => [...bikeKeys.all, 'detail'] as const,
    detail: (id: number) => [...bikeKeys.details(), id] as const,
    myBikes: () => [...bikeKeys.all, 'my-bikes'] as const,
    images: (bikeId: number) => [...bikeKeys.all, 'images', bikeId] as const,
};

// Bikes List Hook
export const useBikes = (filters: BikeFilters = {}) => {
    return useQuery<PaginatedAPIResponse<Bike>, Error>({
        queryKey: bikeKeys.list(filters),
        queryFn: () => bikeApi.list(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });
};

// Single Bike Hook
export const useBike = (id: number) => {
    return useQuery({
        queryKey: bikeKeys.detail(id),
        queryFn: () => bikeApi.get(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

// User's Bikes Hook
export const useMyBikes = () => {
    return useQuery<PaginatedAPIResponse<Bike>, Error>({
        queryKey: bikeKeys.myBikes(),
        queryFn: () => bikeApi.getMyBikes(),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

// Create Bike Mutation
export const useCreateBike = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<APIResponse<Bike>, Error, CreateBikeData>({
        mutationFn: (data: CreateBikeData) => bikeApi.create(data),
        onSuccess: (newBike) => {
            // Invalidate and refetch bikes list
            queryClient.invalidateQueries({ queryKey: bikeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bikeKeys.myBikes() });

            // Add the new bike to cache
            queryClient.setQueryData(bikeKeys.detail(newBike.data.id), newBike.data);

            toast({
                title: 'Bike Listed Successfully!',
                description: 'Your e-bike has been added to our platform and is now available for rent.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to list bike. Please try again.',
                variant: 'destructive',
            });
        },
    });
};

// Update Bike Mutation
export const useUpdateBike = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<Bike, Error, { id: number; data: UpdateBikeData }>({
        mutationFn: ({ id, data }: { id: number; data: UpdateBikeData }) => bikeApi.update(id, data),
        onSuccess: (updatedBike) => {
            // Update bike in cache
            queryClient.setQueryData(bikeKeys.detail(updatedBike.id), {
                success: true,
                data: updatedBike,
            });

            // Invalidate lists to ensure consistency
            queryClient.invalidateQueries({ queryKey: bikeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bikeKeys.myBikes() });

            toast({
                title: 'Bike Updated',
                description: 'Your bike has been updated successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update bike. Please try again.',
                variant: 'destructive',
            });
        },
    });
};

// Delete Bike Mutation
export const useDeleteBike = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<void, Error, number>({
        mutationFn: (id: number) => bikeApi.delete(id),
        onSuccess: (_, deletedId) => {
            // Remove bike from cache
            queryClient.removeQueries({ queryKey: bikeKeys.detail(deletedId) });

            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: bikeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bikeKeys.myBikes() });

            toast({
                title: 'Bike Deleted',
                description: 'Your bike has been successfully deleted.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete bike. Please try again.',
                variant: 'destructive',
            });
        },
    });
};

// Toggle Bike Status Mutation
export const useToggleBikeStatus = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<Bike, Error, number, { previousBike?: Bike; previousMyBikes?: Bike[] }>({
        mutationFn: (id: number) => bikeApi.toggleStatus(id),
        onMutate: async (bikeId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: bikeKeys.detail(bikeId) });
            await queryClient.cancelQueries({ queryKey: bikeKeys.myBikes() });

            // Snapshot previous values
            const previousBike = queryClient.getQueryData<Bike>(bikeKeys.detail(bikeId));
            const previousMyBikes = queryClient.getQueryData<Bike[]>(bikeKeys.myBikes());

            // Optimistically update bike status
            if (previousBike) {
                const newStatus = previousBike.status === 'available' ? 'unavailable' : 'available';
                queryClient.setQueryData(bikeKeys.detail(bikeId), {
                    ...previousBike,
                    status: newStatus,
                });
            }

            // Optimistically update in my bikes list
            if (previousMyBikes) {
                queryClient.setQueryData(
                    bikeKeys.myBikes(),
                    previousMyBikes.map((bike) =>
                        bike.id === bikeId
                            ? { ...bike, status: bike.status === 'available' ? 'unavailable' : 'available' }
                            : bike,
                    ),
                );
            }

            return { previousBike, previousMyBikes };
        },
        onSuccess: (updatedBike) => {
            // Update with actual server response
            queryClient.setQueryData(bikeKeys.detail(updatedBike.id), updatedBike);

            toast({
                title: 'Status Updated',
                description: `Bike is now ${updatedBike.status}`,
            });
        },
        onError: (error: Error, bikeId, context) => {
            // Rollback optimistic updates
            if (context?.previousBike) {
                queryClient.setQueryData(bikeKeys.detail(bikeId), context.previousBike);
            }
            if (context?.previousMyBikes) {
                queryClient.setQueryData(bikeKeys.myBikes(), context.previousMyBikes);
            }

            toast({
                title: 'Error',
                description: error.message || 'Failed to update bike status. Please try again.',
                variant: 'destructive',
            });
        },
        onSettled: (_, __, bikeId) => {
            // Always invalidate to ensure server state
            queryClient.invalidateQueries({ queryKey: bikeKeys.detail(bikeId) });
            queryClient.invalidateQueries({ queryKey: bikeKeys.myBikes() });
        },
    });
};

// Bike Images Hook
export const useBikeImages = (bikeId: number) => {
    return useQuery({
        queryKey: bikeKeys.images(bikeId),
        queryFn: () => bikeImageApi.list(bikeId),
        enabled: !!bikeId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

// Upload Bike Images Mutation
export const useUploadBikeImages = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<BikeImage[], Error, { bikeId: number; files: File[] }>({
        mutationFn: ({ bikeId, files }: { bikeId: number; files: File[] }) => bikeImageApi.upload(bikeId, files),
        onSuccess: (newImages, { bikeId }) => {
            // Invalidate bike images
            queryClient.invalidateQueries({ queryKey: bikeKeys.images(bikeId) });

            // Invalidate bike details to update image list
            queryClient.invalidateQueries({ queryKey: bikeKeys.detail(bikeId) });

            toast({
                title: 'Images Uploaded',
                description: `${newImages.length} image(s) uploaded successfully.`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to upload images. Please try again.',
                variant: 'destructive',
            });
        },
    });
};

// Delete Bike Image Mutation
export const useDeleteBikeImage = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<void, Error, { bikeId: number; imageId: number }>({
        mutationFn: ({ bikeId, imageId }: { bikeId: number; imageId: number }) => bikeImageApi.delete(bikeId, imageId),
        onSuccess: (_, { bikeId }) => {
            // Invalidate bike images
            queryClient.invalidateQueries({ queryKey: bikeKeys.images(bikeId) });

            // Invalidate bike details
            queryClient.invalidateQueries({ queryKey: bikeKeys.detail(bikeId) });

            toast({
                title: 'Image Deleted',
                description: 'Image has been deleted successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete image. Please try again.',
                variant: 'destructive',
            });
        },
    });
};

// Set Primary Image Mutation
export const useSetPrimaryImage = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<BikeImage, Error, { bikeId: number; imageId: number }>({
        mutationFn: ({ bikeId, imageId }: { bikeId: number; imageId: number }) =>
            bikeImageApi.setPrimary(bikeId, imageId),
        onSuccess: (_, { bikeId }) => {
            // Invalidate bike images
            queryClient.invalidateQueries({ queryKey: bikeKeys.images(bikeId) });

            // Invalidate bike details
            queryClient.invalidateQueries({ queryKey: bikeKeys.detail(bikeId) });

            toast({
                title: 'Primary Image Set',
                description: 'Image has been set as primary successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to set primary image. Please try again.',
                variant: 'destructive',
            });
        },
    });
};
