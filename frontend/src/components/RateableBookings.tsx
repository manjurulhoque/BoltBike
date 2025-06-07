import { useState } from 'react';
import { Star, Calendar, Clock, MapPin, Bike } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRateableBookings } from '@/hooks/useRatings';
import { RateableBooking } from '@/lib/types/rating';
import ReviewForm from './ReviewForm';

interface RateableBookingsProps {
    maxDisplay?: number;
    showTitle?: boolean;
}

const RateableBookings = ({ maxDisplay, showTitle = true }: RateableBookingsProps) => {
    const [selectedBooking, setSelectedBooking] = useState<RateableBooking | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const { data: bookingsResponse, isLoading, error, refetch } = useRateableBookings();

    if (isLoading) {
        return <RateableBookingsSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-gray-600">Failed to load completed bookings. Please try again.</p>
                </CardContent>
            </Card>
        );
    }

    const bookings = bookingsResponse?.data?.results || [];
    const displayBookings = maxDisplay ? bookings.slice(0, maxDisplay) : bookings;

    const handleRateBooking = (booking: RateableBooking) => {
        setSelectedBooking(booking);
        setShowReviewForm(true);
    };

    const handleReviewSubmitted = () => {
        refetch(); // Refresh the list after rating
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <div className="space-y-6">
                {showTitle && (
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Rate Your Recent Rentals</h2>
                        {bookings.length > 0 && (
                            <Badge variant="secondary">
                                {bookings.length} pending review{bookings.length !== 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                )}

                {displayBookings.length > 0 ? (
                    <div className="space-y-4">
                        {displayBookings.map((booking) => (
                            <RateableBookingCard
                                key={booking.id}
                                booking={booking}
                                onRate={handleRateBooking}
                                formatDate={formatDate}
                                formatTime={formatTime}
                            />
                        ))}

                        {maxDisplay && bookings.length > maxDisplay && (
                            <Card>
                                <CardContent className="py-4">
                                    <p className="text-center text-gray-600">
                                        Showing {maxDisplay} of {bookings.length} completed rentals
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-gray-600">
                                <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg font-medium mb-2">No rentals to rate</p>
                                <p>Complete a rental to share your experience!</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Review Form Modal */}
            {showReviewForm && selectedBooking && (
                <ReviewForm
                    bookingId={selectedBooking.id}
                    bikeId={selectedBooking.bike.id}
                    bikeTitle={selectedBooking.bike.title}
                    onClose={() => {
                        setShowReviewForm(false);
                        setSelectedBooking(null);
                    }}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}
        </>
    );
};

// Individual Rateable Booking Card Component
interface RateableBookingCardProps {
    booking: RateableBooking;
    onRate: (booking: RateableBooking) => void;
    formatDate: (date: string) => string;
    formatTime: (date: string) => string;
}

const RateableBookingCard = ({ booking, onRate, formatDate, formatTime }: RateableBookingCardProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    {/* Bike Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        {booking.bike.images && booking.bike.images.length > 0 ? (
                            <img
                                src={booking.bike.images[0].image}
                                alt={booking.bike.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <Bike className="h-8 w-8 text-gray-600" />
                        )}
                    </div>

                    <div className="flex-1">
                        {/* Bike Title and Status */}
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{booking.bike.title}</h3>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Completed
                            </Badge>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {formatDate(booking.start_time)} - {formatDate(booking.end_time)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.bike.location}</span>
                            </div>
                        </div>

                        {/* Booking Info */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <p>Booking #{booking.id}</p>
                                <p className="font-medium text-gray-900">Total: $30.00</p>
                            </div>

                            {/* Rate Button */}
                            <Button onClick={() => onRate(booking)} className="bg-rose-500 hover:bg-rose-600" size="sm">
                                <Star className="h-4 w-4 mr-2" />
                                Rate Experience
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Loading Skeleton Component
const RateableBookingsSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-24" />
            </div>

            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <Skeleton className="w-20 h-20 rounded-lg" />
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default RateableBookings;
