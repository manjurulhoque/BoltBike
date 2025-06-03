import { useState } from 'react';
import { MapPin, Star, Battery, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BikeMap from '@/components/BikeMap';

const Map = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('');

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
        if (searchQuery && !bike.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedType && bike.type !== selectedType) return false;
        return true;
    });

    const bikeTypes = ['City', 'Mountain', 'Road', 'Cargo', 'Folding', 'Hybrid'];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">E-bikes Near You</h1>
                    <p className="text-gray-600">{filteredBikes.length} bikes available on map</p>
                </div>

                {/* Search and Filter Bar */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by bike name or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="">All Types</option>
                                    {bikeTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <Button variant="outline">
                                    <Filter className="h-4 w-4 mr-2" />
                                    More Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Map Component */}
                <BikeMap bikes={filteredBikes} />
            </div>
        </div>
    );
};

export default Map;
