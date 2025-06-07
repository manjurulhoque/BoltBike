import { useState } from 'react';
import { Star, MessageSquare, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import RateableBookings from '@/components/RateableBookings';
import { useMyRatings, useRateableBookings } from '@/hooks/useRatings';
import { Rating } from '@/lib/types/rating';

const Reviews = () => {
    const [activeTab, setActiveTab] = useState<'rateable' | 'my-reviews'>('rateable');

    // Fetch data for overview stats
    const { data: rateableBookingsResponse } = useRateableBookings();
    const { data: myRatingsResponse } = useMyRatings();

    const rateableBookings = rateableBookingsResponse?.data?.results || [];
    const myRatings = myRatingsResponse?.data?.results || [];

    // Calculate stats
    const averageRating =
        myRatings.length > 0 ? myRatings.reduce((sum, rating) => sum + rating.rating, 0) / myRatings.length : 0;

    const ratingDistribution = myRatings.reduce((acc, rating) => {
        acc[rating.rating] = (acc[rating.rating] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
                    <p className="text-gray-600 mt-2">Share your experiences and view your rating history</p>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <MessageSquare className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">{rateableBookings.length}</p>
                                    <p className="text-gray-600 text-sm">Pending Reviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Star className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">{myRatings.length}</p>
                                    <p className="text-gray-600 text-sm">Reviews Given</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Award className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {averageRating > 0 ? averageRating.toFixed(1) : '--'}
                                    </p>
                                    <p className="text-gray-600 text-sm">Average Rating</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">{ratingDistribution[5] || 0}</p>
                                    <p className="text-gray-600 text-sm">5-Star Reviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for different sections */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'rateable' | 'my-reviews')}>
                    <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
                        <TabsTrigger value="rateable" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Rate Experiences
                            {rateableBookings.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {rateableBookings.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="my-reviews" className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            My Reviews
                            {myRatings.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {myRatings.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* Rateable Bookings Tab */}
                    <TabsContent value="rateable">
                        <RateableBookings showTitle={false} />
                    </TabsContent>

                    {/* My Reviews Tab */}
                    <TabsContent value="my-reviews">
                        <MyReviews ratings={myRatings} formatDate={formatDate} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// Component to display user's existing reviews
interface MyReviewsProps {
    ratings: Rating[];
    formatDate: (date: string) => string;
}

const MyReviews = ({ ratings, formatDate }: MyReviewsProps) => {
    if (ratings.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center text-gray-600">
                        <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">No reviews yet</p>
                        <p>Complete some rentals to start sharing your experiences!</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Reviews</h3>
                <Badge variant="secondary">
                    {ratings.length} review{ratings.length !== 1 ? 's' : ''}
                </Badge>
            </div>

            <div className="space-y-4">
                {ratings.map((rating) => (
                    <ReviewCard key={rating.id} rating={rating} formatDate={formatDate} />
                ))}
            </div>
        </div>
    );
};

// Individual review card component
interface ReviewCardProps {
    rating: Rating;
    formatDate: (date: string) => string;
}

const ReviewCard = ({ rating, formatDate }: ReviewCardProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    {/* Bike Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {rating.bike.images && rating.bike.images.length > 0 ? (
                            <img
                                src={rating.bike.images[0].image_url || rating.bike.images[0].image}
                                alt={rating.bike.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <Star className="h-6 w-6 text-gray-600" />
                        )}
                    </div>

                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h4 className="font-semibold text-gray-900">{rating.bike.title}</h4>
                                <p className="text-sm text-gray-600">{rating.bike.location}</p>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${
                                                star <= rating.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{formatDate(rating.created_at)}</p>
                            </div>
                        </div>

                        {/* Review Content */}
                        {rating.comment && (
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                <p className="text-gray-700 leading-relaxed">{rating.comment}</p>
                            </div>
                        )}

                        {/* Booking Info */}
                        {rating.booking && (
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Verified rental • Booking #{rating.booking.id}</span>
                                <Badge variant="secondary" className="text-xs">
                                    {rating.rating}/5 stars
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Reviews;
