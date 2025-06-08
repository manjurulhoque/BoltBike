import { ArrowRight, Loader, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import BikeCard from './BikeCard';
import { Button } from './ui/button';
import { useHomePageData } from '@/hooks/useCore';
import { useFilter } from '@/contexts/FilterContext';
import { useMemo } from 'react';
import BikeMap from './BikeMap';

const BikeGrid = () => {
    const { data: homePageData, isLoading, error } = useHomePageData();
    const { filterState, isPriceInRange } = useFilter();
    const allBikes = homePageData?.data?.bikes || [];

    // Filter bikes based on filter state
    const bikes = useMemo(() => {
        return allBikes.filter((bike) => {
            // Filter by bike type
            if (filterState.selectedTypes.length > 0) {
                if (!filterState.selectedTypes.includes(bike.bike_type)) {
                    return false;
                }
            }

            // Filter by price range
            if (!isPriceInRange(Number(bike.daily_rate))) {
                return false;
            }

            return true;
        });
    }, [allBikes, filterState.selectedTypes, filterState.priceRange, isPriceInRange]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">E-bikes near you</h2>
                <p className="text-gray-600">
                    {bikes.length} e-bike{bikes.length !== 1 ? 's' : ''} available
                    {filterState.selectedTypes.length > 0 && (
                        <span className="text-rose-600">
                            {' '}
                            • Filtered by:{' '}
                            {filterState.selectedTypes
                                .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
                                .join(', ')}
                        </span>
                    )}
                    {filterState.priceRange[0] > 10 ||
                        (filterState.priceRange[1] < 200 && (
                            <span className="text-rose-600">
                                {' '}
                                • Price: ${filterState.priceRange[0]} - ${filterState.priceRange[1]}
                            </span>
                        ))}
                </p>
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
            ) : filterState.showMap ? (
                <BikeMap bikes={bikes} />
            ) : (
                <>
                    {bikes.length === 0 ? (
                        <div className="text-center py-12">
                            <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No bikes found</h3>
                            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                            <Button variant="outline" asChild>
                                <Link to="/bikes">Browse all bikes</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default BikeGrid;
