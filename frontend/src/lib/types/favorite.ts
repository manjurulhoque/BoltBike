import { Bike } from './bike';

export interface Favorite {
    id: number;
    bike: Bike;
    created_at: string;
}

export interface CreateFavoriteData {
    bike: number;
}

export interface FavoriteToggleResponse {
    is_favorite: boolean;
}

export interface FavoritesListResponse {
    count: number;
    results: Favorite[];
}
