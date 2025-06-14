import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Map as MapIcon, SlidersHorizontal, Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import Footer from '@/components/Footer';
import BikeMap from '@/components/BikeMap';
import PaginationControls from '@/components/PaginationControls';
import { BikeType, BikeFilters, Bike } from '@/lib/types/bike';
import { useBikes } from '@/hooks/useBikes';
import { BIKE_TYPES_WITH_ALL } from '@/lib/constants/bike';

const Bikes = () => {
    const [searchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        priceRange: [10, 200],
        batteryRange: [20, 200],
        location: '',
        sortBy: 'relevance',
    });

    // Initialize filters from URL parameters
    useEffect(() => {
        const urlLocation = searchParams.get('location');
        const urlStartDate = searchParams.get('startDate');
        const urlEndDate = searchParams.get('endDate');

        if (urlLocation || urlStartDate || urlEndDate) {
            setFilters((prev) => ({
                ...prev,
                ...(urlLocation && { search: urlLocation, location: urlLocation }),
            }));
        }
    }, [searchParams]);

    const itemsPerPage = 8; // Number of bikes per page

    // Build API filters from UI filters
    const apiFilters: BikeFilters = {
        ...(filters.search && { search: filters.search }),
        ...(filters.type && filters.type !== 'All Types' && { bike_type: filters.type as BikeType }),
        ...(filters.location && filters.location !== 'All Locations' && { location: filters.location }),
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1],
        page: currentPage,
        page_size: itemsPerPage,
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
    const bikes = bikeResponse?.data?.results || [];
    const totalCount = bikeResponse?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Handle filter changes - reset to page 1
    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };

    // Handle page changes
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                                onChange={(e) => handleFilterChange({ search: e.target.value })}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center space-x-2">
                            <Select value={filters.type} onValueChange={(value) => handleFilterChange({ type: value })}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Bike Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BIKE_TYPES_WITH_ALL.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.location}
                                onValueChange={(value) => handleFilterChange({ location: value })}
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
                                            onValueChange={(value) => handleFilterChange({ priceRange: value })}
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
                                            onValueChange={(value) => handleFilterChange({ batteryRange: value })}
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
                                onValueChange={(value) => handleFilterChange({ sortBy: value })}
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
                                    onClick={() => handleFilterChange({ search: '' })}
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
                                    onClick={() => handleFilterChange({ type: '' })}
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
                        <p className="text-gray-600">
                            {totalCount} bikes available
                            {totalPages > 1 && (
                                <span className="ml-2 text-sm">
                                    • Page {currentPage} of {totalPages}
                                </span>
                            )}
                        </p>
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
                    <BikeMap bikes={bikes} />
                ) : (
                    <>
                        <div
                            className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                    : 'space-y-4'
                            }
                        >
                            {bikes.length > 0 ? (
                                bikes.map((bike) => <BikeCard key={bike.id} bike={bike} />)
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500">No bikes found matching your criteria.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 mb-8">
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Bikes;
