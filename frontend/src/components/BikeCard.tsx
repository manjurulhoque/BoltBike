import { Heart, Star, Battery, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBikeTypeLabel } from '@/lib/constants';

interface BikeCardProps {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    images: string[];
    batteryRange: number;
    type: string;
    available: boolean;
}

const BikeCard = ({
    id,
    title,
    location,
    price,
    rating,
    reviews,
    images,
    batteryRange,
    type,
    available,
}: BikeCardProps) => {
    return (
        <div className="group cursor-pointer">
            <Link to={`/bikes/${id}`}>
                {/* Image Container */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                    <img
                        src={images[0]}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 rounded-full bg-white/80 hover:bg-white"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                    {!available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary" className="bg-white text-black">
                                Not Available
                            </Badge>
                        </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-rose-500">{getBikeTypeLabel(type as any)}</Badge>
                </div>

                {/* Content */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {location}
                        </p>
                        <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-sm font-medium">{rating}</span>
                            <span className="text-sm text-gray-600">({reviews})</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">{title}</h3>

                    <div className="flex items-center text-sm text-gray-600">
                        <Battery className="h-3 w-3 mr-1" />
                        <span>{batteryRange}km range</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <div>
                            <span className="font-semibold text-gray-900">${price}</span>
                            <span className="text-gray-600"> / day</span>
                        </div>
                        {available && (
                            <Button
                                size="sm"
                                className="bg-rose-500 hover:bg-rose-600"
                                onClick={(e) => e.preventDefault()}
                            >
                                Book Now
                            </Button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default BikeCard;
