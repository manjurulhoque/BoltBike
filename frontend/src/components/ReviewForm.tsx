import { useState } from 'react';
import { Star, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateRating } from '@/hooks/useRatings';
import { CreateRatingData } from '@/lib/types/rating';

interface ReviewFormProps {
    bookingId: number;
    bikeId: number;
    bikeTitle: string;
    onClose: () => void;
    onReviewSubmitted?: () => void;
}

const ReviewForm = ({ bookingId, bikeId, bikeTitle, onClose, onReviewSubmitted }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const { toast } = useToast();
    const createRating = useCreateRating();

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast({
                title: 'Rating Required',
                description: 'Please select a rating before submitting your review.',
                variant: 'destructive',
            });
            return;
        }

        if (comment.length > 500) {
            toast({
                title: 'Comment Too Long',
                description: 'Please keep your comment under 500 characters.',
                variant: 'destructive',
            });
            return;
        }

        const ratingData: CreateRatingData = {
            booking: bookingId,
            rating,
            comment: comment.trim() || undefined,
        };

        try {
            await createRating.mutateAsync(ratingData);
            onReviewSubmitted?.();
            onClose();
        } catch (error) {
            // Error handling is done in the mutation's onError callback
            console.error('Failed to submit rating:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Write a Review</CardTitle>
                        <Button variant="ghost" onClick={onClose}>
                            ×
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600">Share your experience with {bikeTitle}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Rating Stars */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rating *</label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none"
                                    disabled={createRating.isPending}
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        } transition-colors ${
                                            createRating.isPending ? 'opacity-50' : 'hover:scale-110'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-gray-600">
                                {rating === 1 && 'Poor - Not satisfied'}
                                {rating === 2 && 'Fair - Below expectations'}
                                {rating === 3 && 'Good - Met expectations'}
                                {rating === 4 && 'Very Good - Exceeded expectations'}
                                {rating === 5 && 'Excellent - Outstanding experience'}
                            </p>
                        )}
                    </div>

                    {/* Review Comment */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Review (Optional)</label>
                        <Textarea
                            placeholder="Tell others about your experience with this e-bike..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="resize-none"
                            disabled={createRating.isPending}
                            maxLength={500}
                        />
                        <p className={`text-xs ${comment.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                            {comment.length}/500 characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={createRating.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitReview}
                            className="flex-1 bg-rose-500 hover:bg-rose-600"
                            disabled={createRating.isPending || rating === 0}
                        >
                            {createRating.isPending ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Review'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReviewForm;
