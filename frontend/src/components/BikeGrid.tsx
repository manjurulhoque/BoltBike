import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BikeCard from './BikeCard';
import { Button } from './ui/button';
import { useHomePageData } from '@/hooks/useCore';

const BikeGrid = () => {
    const { data: homePageData, isLoading, error } = useHomePageData();
    const bikes = homePageData?.data?.bikes || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">E-bikes near you</h2>
                <p className="text-gray-600">{bikes.length} e-bikes available for your dates</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bikes.map((bike) => (
                    <BikeCard key={bike.id} bike={bike} />
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
