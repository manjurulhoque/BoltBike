import { Star, User, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useBikeRatings, useBikeRatingStats } from '@/hooks/useRatings';
import { Rating } from '@/lib/types/rating';

interface RatingsListProps {
    bikeId: number;
    bikeTitle?: string;
    showStats?: boolean;
    maxDisplay?: number;
}

const RatingsList = ({ bikeId, bikeTitle, showStats = true, maxDisplay }: RatingsListProps) => {
    const { data: ratingsResponse, isLoading: ratingsLoading, error: ratingsError } = useBikeRatings(bikeId);
    const { data: statsResponse, isLoading: statsLoading } = useBikeRatingStats(bikeId, showStats);

    if (ratingsLoading || (showStats && statsLoading)) {
        return <RatingsListSkeleton />;
    }

    if (ratingsError) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-gray-600">Failed to load ratings. Please try again.</p>
                </CardContent>
            </Card>
        );
    }

    const ratingsData = ratingsResponse?.data;
    const ratings = ratingsData?.ratings || [];
    const statistics = ratingsData?.statistics || statsResponse?.data?.statistics;

    const displayRatings = maxDisplay ? ratings.slice(0, maxDisplay) : ratings;

    return (
        <div className="space-y-6">
            {/* Statistics Section */}
            {showStats && statistics && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Customer Reviews
                            {bikeTitle && <span className="text-sm font-normal text-gray-600">for {bikeTitle}</span>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {statistics.average_rating.toFixed(1)}
                                </div>
                                <div className="flex items-center justify-center mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${
                                                star <= Math.round(statistics.average_rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {statistics.total_ratings} review{statistics.total_ratings !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Rating Distribution */}
                            <div className="flex-1 space-y-2">
                                {[5, 4, 3, 2, 1].map((stars) => {
                                    const count = statistics.rating_distribution?.[`${stars}_star`] || 0;
                                    const percentage =
                                        statistics.total_ratings > 0 ? (count / statistics.total_ratings) * 100 : 0;

                                    return (
                                        <div key={stars} className="flex items-center gap-2 text-sm">
                                            <span className="w-12">{stars} star</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="w-8 text-gray-600">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Ratings List */}
            {ratings.length > 0 ? (
                <div className="space-y-4">
                    {displayRatings.map((rating) => (
                        <RatingCard key={rating.id} rating={rating} />
                    ))}

                    {maxDisplay && ratings.length > maxDisplay && (
                        <Card>
                            <CardContent className="py-4">
                                <p className="text-center text-gray-600">
                                    Showing {maxDisplay} of {ratings.length} reviews
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-gray-600">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium mb-2">No reviews yet</p>
                            <p>Be the first to share your experience with this bike!</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

// Individual Rating Card Component
const RatingCard = ({ rating }: { rating: Rating }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    {/* User Avatar/Initial */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                    </div>

                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    {rating.user.first_name} {rating.user.last_name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
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
                                    <Badge variant="secondary" className="text-xs">
                                        {rating.rating}/5
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {formatDate(rating.created_at)}
                            </div>
                        </div>

                        {/* Comment */}
                        {rating.comment && <p className="text-gray-700 leading-relaxed">{rating.comment}</p>}

                        {/* Booking Info (if available) */}
                        {rating.booking && (
                            <p className="text-xs text-gray-500 mt-2">Verified rental • Booking #{rating.booking.id}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Loading Skeleton Component
const RatingsListSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Stats Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <Skeleton className="h-12 w-12 mx-auto mb-2" />
                            <Skeleton className="h-4 w-20 mx-auto mb-1" />
                            <Skeleton className="h-3 w-16 mx-auto" />
                        </div>
                        <div className="flex-1 space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-2 flex-1" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rating Cards Skeleton */}
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default RatingsList;
