import { useState } from 'react';
import { Filter, Grid, List, Map as MapIcon, SlidersHorizontal, Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import BikeCard from '@/components/BikeCard';
import Header from '@/components/Header';
import BikeMap from '@/components/BikeMap';
import { BikeType, BikeFilters } from '@/lib/types/bike';
import { useBikes } from '@/hooks/useBikes';

const Bikes = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        priceRange: [10, 200],
        batteryRange: [20, 200],
        location: '',
        sortBy: 'relevance',
    });
    // Build API filters from UI filters
    const apiFilters: BikeFilters = {
        ...(filters.search && { search: filters.search }),
        ...(filters.type && filters.type !== 'All Types' && { bike_type: filters.type as BikeType }),
        ...(filters.location && filters.location !== 'All Locations' && { location: filters.location }),
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1],
        // Set ordering based on sortBy
        ordering: (() => {
            switch (filters.sortBy) {
                case 'price-low':
                    return 'daily_rate';
                case 'price-high':
                    return '-daily_rate';
                case 'newest':
                    return '-created_at';
                default:
                    return '-created_at';
            }
        })(),
    };

    const { data: bikeResponse, isLoading, error } = useBikes(apiFilters);

    const bikeTypes = ['All Types', 'City', 'Mountain', 'Road', 'Cargo', 'Folding', 'Hybrid'];
    const locations = [
        'All Locations',
        'San Francisco',
        'Oakland',
        'Berkeley',
        'Palo Alto',
        'San Jose',
        'Marin County',
    ];

    // Transform bikes for BikeCard component
    const bikes = bikeResponse?.data.results || [];
    const totalCount = bikeResponse?.data.count || 0;

    const transformedBikes = bikes.map((bike) => ({
        id: bike.id.toString(),
        title: bike.title,
        location: bike.location,
        price: bike.daily_rate,
        rating: 4.5, // Default rating - you might want to add this to your backend
        reviews: 0, // Default reviews - you might want to add this to your backend
        images: bike.images.length > 0 ? bike.images.map((img) => img.image_url) : ['/placeholder.svg'],
        batteryRange: bike.battery_range,
        type: bike.bike_type,
        available: bike.status === 'available',
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Search & Filter Bar */}
            <div className="bg-white border-b sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search e-bikes..."
                                className="pl-10"
                                value={filters.search}
                                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center space-x-2">
                            <Select
                                value={filters.type}
                                onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Bike Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bikeTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.location}
                                onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((location) => (
                                        <SelectItem key={location} value={location}>
                                            {location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        More Filters
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80 p-4">
                                    <DropdownMenuLabel>Price Range (per day)</DropdownMenuLabel>
                                    <div className="px-3 py-4">
                                        <Slider
                                            value={filters.priceRange}
                                            onValueChange={(value) =>
                                                setFilters((prev) => ({ ...prev, priceRange: value }))
                                            }
                                            max={200}
                                            min={10}
                                            step={5}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                                            <span>${filters.priceRange[0]}</span>
                                            <span>${filters.priceRange[1]}+</span>
                                        </div>
                                    </div>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuLabel>Battery Range (km)</DropdownMenuLabel>
                                    <div className="px-3 py-4">
                                        <Slider
                                            value={filters.batteryRange}
                                            onValueChange={(value) =>
                                                setFilters((prev) => ({ ...prev, batteryRange: value }))
                                            }
                                            max={200}
                                            min={20}
                                            step={10}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                                            <span>{filters.batteryRange[0]}km</span>
                                            <span>{filters.batteryRange[1]}km+</span>
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Select
                                value={filters.sortBy}
                                onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">Relevance</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <Button
                                size="sm"
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('grid')}
                                className="h-8"
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('list')}
                                className="h-8"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant={viewMode === 'map' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('map')}
                                className="h-8"
                            >
                                <MapIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    <div className="flex items-center space-x-2 mt-4">
                        {filters.search && (
                            <Badge variant="secondary" className="flex items-center">
                                Search: {filters.search}
                                <button
                                    onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                                    className="ml-2 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {filters.type && filters.type !== 'All Types' && (
                            <Badge variant="secondary" className="flex items-center">
                                Type: {filters.type}
                                <button
                                    onClick={() => setFilters((prev) => ({ ...prev, type: '' }))}
                                    className="ml-2 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">E-bikes for rent</h1>
                        <p className="text-gray-600">{totalCount} bikes available</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader className="h-8 w-8 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">Loading bikes...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">Error loading bikes. Please try again.</p>
                    </div>
                ) : viewMode === 'map' ? (
                    <BikeMap bikes={transformedBikes} />
                ) : (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                        }
                    >
                        {transformedBikes.length > 0 ? (
                            transformedBikes.map((bike) => <BikeCard key={bike.id} {...bike} />)
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">No bikes found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bikes;
