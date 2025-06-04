import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BikeCard from './BikeCard';
import { Button } from './ui/button';

const BikeGrid = () => {
    // Sample bike data
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
        {
            id: '7',
            title: 'VanMoof S3 Smart Bike',
            location: 'Palo Alto, CA',
            price: 70,
            rating: 4.5,
            reviews: 67,
            images: ['/placeholder.svg'],
            batteryRange: 93,
            type: 'City',
            available: true,
        },
        {
            id: '8',
            title: 'Riese & Müller Delite',
            location: 'San Jose, CA',
            price: 95,
            rating: 4.9,
            reviews: 134,
            images: ['/placeholder.svg'],
            batteryRange: 140,
            type: 'Road',
            available: true,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">E-bikes near you</h2>
                <p className="text-gray-600">{bikes.length} e-bikes available for your dates</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bikes.map((bike) => (
                    <BikeCard key={bike.id} {...bike} />
                ))}
            </div>
            <div className="flex justify-center">
                <Button variant="outline" size="sm" asChild className="mt-20">
                    <Link to="/bikes">
                        <ArrowRight className="h-4 w-4" />
                        View all bikes
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default BikeGrid;
