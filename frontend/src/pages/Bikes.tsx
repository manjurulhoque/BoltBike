import { useState } from 'react';
import { Filter, Grid, List, Map as MapIcon, SlidersHorizontal, Search } from 'lucide-react';
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

    const bikes = [
        {
            id: '1',
            title: 'Trek Verve+ 2 Electric Hybrid',
            location: 'Downtown, San Francisco',
            price: 45,
            rating: 4.9,
            reviews: 127,
            images: ['/placeholder.svg'],
            batteryRange: 80,
            type: 'City',
            available: true,
        },
        {
            id: '2',
            title: 'Specialized Turbo Vado SL',
            location: 'Mission District, SF',
            price: 65,
            rating: 4.8,
            reviews: 89,
            images: ['/placeholder.svg'],
            batteryRange: 120,
            type: 'Road',
            available: true,
        },
        {
            id: '3',
            title: 'Rad Power RadCity 5 Plus',
            location: 'Berkeley, CA',
            price: 35,
            rating: 4.7,
            reviews: 203,
            images: ['/placeholder.svg'],
            batteryRange: 72,
            type: 'City',
            available: false,
        },
        {
            id: '4',
            title: 'Canyon Neuron:ON Mountain',
            location: 'Marin County, CA',
            price: 85,
            rating: 4.9,
            reviews: 156,
            images: ['/placeholder.svg'],
            batteryRange: 100,
            type: 'Mountain',
            available: true,
        },
        {
            id: '5',
            title: 'Brompton Electric Folding',
            location: 'SOMA, San Francisco',
            price: 55,
            rating: 4.6,
            reviews: 92,
            images: ['/placeholder.svg'],
            batteryRange: 55,
            type: 'Folding',
            available: true,
        },
        {
            id: '6',
            title: 'Tern GSD S10 Cargo',
            location: 'Oakland, CA',
            price: 75,
            rating: 4.8,
            reviews: 174,
            images: ['/placeholder.svg'],
            batteryRange: 90,
            type: 'Cargo',
            available: true,
        },
    ];

    const filteredBikes = bikes.filter((bike) => {
        if (filters.search && !bike.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.type && filters.type !== 'All Types' && bike.type !== filters.type) return false;
        if (bike.price < filters.priceRange[0] || bike.price > filters.priceRange[1]) return false;
        if (bike.batteryRange < filters.batteryRange[0] || bike.batteryRange > filters.batteryRange[1]) return false;
        return true;
    });

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
                        <p className="text-gray-600">{filteredBikes.length} bikes available</p>
                    </div>
                </div>

                {viewMode === 'map' ? (
                    <BikeMap bikes={filteredBikes} />
                ) : (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                        }
                    >
                        {filteredBikes.map((bike) => (
                            <BikeCard key={bike.id} {...bike} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bikes;
