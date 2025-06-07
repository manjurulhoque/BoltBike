import { useState } from 'react';
import { Heart, Star, Battery, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBikeTypeLabel } from '@/lib/constants';
import { Bike } from '@/lib/types/bike';
import BookingProcess from './BookingProcess';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useBikeRatingStats } from '@/hooks/useRatings';
import { toast } from 'sonner';

interface BikeCardProps {
    bike: Bike;
}

const BikeCard = ({ bike }: BikeCardProps) => {
    const { id, title, location, daily_rate, hourly_rate, battery_range, bike_type, status, images } = bike;
    const [showBookingProcess, setShowBookingProcess] = useState(false);

    // Fetch favorite status
    const { data: favoriteResponse } = useIsFavorite(id);
    const isFavorite = favoriteResponse?.data?.is_favorite || false;

    // Fetch rating statistics
    const { data: ratingStatsResponse } = useBikeRatingStats(id);
    const ratingStats = ratingStatsResponse?.data?.statistics;

    // Toggle favorite mutation
    const toggleFavoriteMutation = useToggleFavorite();

    let bikeImages = images;
    if (images.length === 0) {
        bikeImages = [
            {
                image_url: '/placeholder.svg',
                alt_text: 'Placeholder image',
            },
        ];
    }

    const available = status === 'available';
    const rating = ratingStats?.average_rating || 0;
    const reviews = ratingStats?.total_ratings || 0;

    const handleBookNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowBookingProcess(true);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavoriteMutation.mutate(id);
    };

    const handleBookingSuccess = (bookingId: number) => {
        setShowBookingProcess(false);
        toast.success('Booking request submitted successfully!');
        // Optionally redirect to bookings page or show success message
    };

    return (
        <>
            <div className="group cursor-pointer">
                <Link to={`/bikes/${id}`}>
                    {/* Image Container */}
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                        <img
                            src={bikeImages[0].image_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-3 right-3 rounded-full bg-white/80 hover:bg-white"
                            onClick={handleToggleFavorite}
                            disabled={toggleFavoriteMutation.isPending}
                        >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                        {!available && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge variant="secondary" className="bg-white text-black">
                                    Not Available
                                </Badge>
                            </div>
                        )}
                        <Badge className="absolute top-3 left-3 bg-rose-500">{getBikeTypeLabel(bike_type)}</Badge>
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {location}
                            </p>
                            {reviews > 0 && (
                                <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                                    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                                    <span className="text-sm text-gray-600">({reviews})</span>
                                </div>
                            )}
                        </div>

                        <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                            {title}
                        </h3>

                        <div className="flex items-center text-sm text-gray-600">
                            <Battery className="h-3 w-3 mr-1" />
                            <span>{battery_range}km range</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div>
                                <span className="font-semibold text-gray-900">${daily_rate}</span>
                                <span className="text-gray-600"> / day</span>
                            </div>
                            {available && (
                                <Button size="sm" className="bg-rose-500 hover:bg-rose-600" onClick={handleBookNow}>
                                    Book Now
                                </Button>
                            )}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Booking Process Modal */}
            {showBookingProcess && (
                <BookingProcess
                    bikeId={id}
                    bikeTitle={title}
                    hourlyRate={hourly_rate}
                    dailyRate={daily_rate}
                    onClose={() => setShowBookingProcess(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </>
    );
};

export default BikeCard;
