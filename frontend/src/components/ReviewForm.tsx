import { useState } from 'react';
import { Star, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
    bikeId: string;
    bikeTitle: string;
    onClose: () => void;
    onReviewSubmitted?: () => void;
}

const ReviewForm = ({ bikeId, bikeTitle, onClose, onReviewSubmitted }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast({
                title: 'Rating Required',
                description: 'Please select a rating before submitting your review.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);

        toast({
            title: 'Review Submitted!',
            description: 'Thank you for your feedback. Your review has been submitted successfully.',
        });

        onReviewSubmitted?.();
        onClose();
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
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-gray-600">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
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
                        />
                        <p className="text-xs text-gray-500">{comment.length}/500 characters</p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmitReview}
                        className="w-full bg-rose-500 hover:bg-rose-600"
                        disabled={isSubmitting || rating === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReviewForm;
