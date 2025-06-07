import { useState } from 'react';
import { Heart, Grid, List, Loader, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BikeCard from '@/components/BikeCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Bike } from '@/lib/types/bike';

const Favorites = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Fetch user's favorites
    const { data: favoritesResponse, isLoading, error, refetch } = useFavorites();

    const favorites = favoritesResponse?.data?.results || [];

    // Filter and sort favorites
    const filteredFavorites = favorites
        .filter((favorite) => {
            if (!searchTerm) return true;
            const bike = favorite.bike;
            return (
                bike.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.bike_type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        })
        .sort((a, b) => {
            const bikeA = a.bike;
            const bikeB = b.bike;

            switch (sortBy) {
                case 'price-low':
                    return Number(bikeA.daily_rate) - Number(bikeB.daily_rate);
                case 'price-high':
                    return Number(bikeB.daily_rate) - Number(bikeA.daily_rate);
                case 'name':
                    return bikeA.title.localeCompare(bikeB.title);
                case 'location':
                    return bikeA.location.localeCompare(bikeB.location);
                case 'newest':
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="h-8 w-8 text-rose-500 fill-current" />
                        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
                    </div>
                    <p className="text-gray-600">
                        {isLoading
                            ? 'Loading your favorite bikes...'
                            : `${filteredFavorites.length} favorite bike${filteredFavorites.length !== 1 ? 's' : ''} ${
                                  searchTerm ? `matching "${searchTerm}"` : ''
                              }`}
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="h-8 w-8 animate-spin text-rose-500 mr-3" />
                        <span className="text-gray-600">Loading your favorites...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="max-w-md mx-auto">
                        <CardContent className="py-8 text-center">
                            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load favorites</h3>
                            <p className="text-gray-600 mb-4">There was an error loading your favorite bikes.</p>
                            <Button onClick={() => refetch()} variant="outline">
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Content */}
                {!isLoading && !error && (
                    <>
                        {favorites.length === 0 ? (
                            /* Empty State */
                            <Card className="max-w-md mx-auto">
                                <CardContent className="py-12 text-center">
                                    <Heart className="h-16 w-16 mx-auto mb-6 text-gray-400" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No favorites yet</h3>
                                    <p className="text-gray-600 mb-6">
                                        Start exploring bikes and save your favorites by clicking the heart icon on any
                                        bike card.
                                    </p>
                                    <Button
                                        onClick={() => (window.location.href = '/bikes')}
                                        className="bg-rose-500 hover:bg-rose-600"
                                    >
                                        Browse Bikes
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Filters and Controls */}
                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search favorites..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    {/* Sort */}
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Newest First</SelectItem>
                                            <SelectItem value="name">Name (A-Z)</SelectItem>
                                            <SelectItem value="location">Location</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* View Mode */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <Grid className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={viewMode === 'list' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Results Count */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {filteredFavorites.length} bike{filteredFavorites.length !== 1 ? 's' : ''}
                                        </Badge>
                                        {searchTerm && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSearchTerm('')}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                Clear search
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* No Results */}
                                {filteredFavorites.length === 0 ? (
                                    <Card className="max-w-md mx-auto">
                                        <CardContent className="py-8 text-center">
                                            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No matches found
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                No favorite bikes match your search criteria.
                                            </p>
                                            <Button variant="outline" onClick={() => setSearchTerm('')}>
                                                Clear filters
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    /* Bikes Grid */
                                    <div
                                        className={
                                            viewMode === 'grid'
                                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                                : 'space-y-4'
                                        }
                                    >
                                        {filteredFavorites.map((favorite) => (
                                            <BikeCard key={favorite.id} bike={favorite.bike} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Favorites;
