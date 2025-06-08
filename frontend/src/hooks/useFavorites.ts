import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/utils/apiRequest';
import type {
    APIResponse,
    Favorite,
    CreateFavoriteData,
    FavoriteToggleResponse,
    FavoritesListResponse,
} from '@/lib/types';
import { toast } from 'sonner';

const FAVORITES_BASE_URL = '/favorites';

// Get user's favorites
export const useFavorites = () => {
    return useQuery<APIResponse<FavoritesListResponse>>({
        queryKey: ['favorites'],
        queryFn: () => apiRequest(`${FAVORITES_BASE_URL}/`),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Check if a bike is favorited
export const useIsFavorite = (bikeId: number) => {
    return useQuery<APIResponse<{ is_favorite: boolean }>>({
        queryKey: ['favorite-status', bikeId],
        queryFn: () => apiRequest(`${FAVORITES_BASE_URL}/${bikeId}/check/`),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!bikeId,
    });
};

// Add to favorites
export const useAddFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<Favorite>, Error, CreateFavoriteData>({
        mutationFn: (data: CreateFavoriteData) =>
            apiRequest(`${FAVORITES_BASE_URL}/create/`, {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: (response, variables) => {
            toast.success(response.message || 'Added to favorites');

            // Invalidate and refetch favorites
            queryClient.invalidateQueries({ queryKey: ['favorites'] });

            // Update favorite status for this bike
            queryClient.setQueryData(['favorite-status', variables.bike], {
                success: true,
                data: { is_favorite: true },
            });
        },
        onError: (error: any) => {
            toast.error('Failed to add to favorites');
        },
    });
};

// Remove from favorites
export const useRemoveFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<any>, Error, number>({
        mutationFn: (bikeId: number) =>
            apiRequest(`${FAVORITES_BASE_URL}/${bikeId}/delete/`, {
                method: 'DELETE',
            }),
        onSuccess: (response, bikeId) => {
            toast.success(response.message || 'Removed from favorites');

            // Invalidate and refetch favorites
            queryClient.invalidateQueries({ queryKey: ['favorites'] });

            // Update favorite status for this bike
            queryClient.setQueryData(['favorite-status', bikeId], { success: true, data: { is_favorite: false } });
        },
        onError: (error: any) => {
            toast.error('Failed to remove from favorites');
        },
    });
};

// Toggle favorite status
export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation<APIResponse<FavoriteToggleResponse>, Error, number>({
        mutationFn: (bikeId: number) =>
            apiRequest(`${FAVORITES_BASE_URL}/${bikeId}/toggle/`, {
                method: 'POST',
            }),
        onSuccess: (response, bikeId) => {
            const isNowFavorite = response.data?.is_favorite;
            toast.success(response.message || (isNowFavorite ? 'Added to favorites' : 'Removed from favorites'));

            // Invalidate and refetch favorites
            queryClient.invalidateQueries({ queryKey: ['favorites'] });

            // Update favorite status for this bike in individual bike queries
            queryClient.setQueryData(['favorite-status', bikeId], {
                success: true,
                data: { is_favorite: isNowFavorite },
            });
        },
        onError: (error: any) => {
            toast.error('Failed to update favorites');
        },
    });
};
