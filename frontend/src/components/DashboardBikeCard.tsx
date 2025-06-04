import { Heart, Star, Battery, MapPin, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getBikeTypeLabel, getBikeStatusColor } from '@/lib/constants';
import { Bike } from '@/lib/types/bike';

interface DashboardBikeCardProps {
    bike: Bike;
    showManageButtons?: boolean;
}

const DashboardBikeCard = ({ bike, showManageButtons = false }: DashboardBikeCardProps) => {
    const { id, title, location, daily_rate, battery_range, bike_type, status, images, created_at } = bike;

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
    const rating = 4.5;
    const reviews = 0;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
                <div className="flex">
                    {/* Image Section - Left Side */}
                    <div className="relative w-48 h-40 flex-shrink-0">
                        <Link to={`/bikes/${id}`}>
                            <img
                                src={bikeImages[0].image_url}
                                alt={title}
                                className="w-full h-full object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            {!available && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-l-lg">
                                    <Badge variant="secondary" className="bg-white text-black">
                                        Not Available
                                    </Badge>
                                </div>
                            )}
                        </Link>
                        <Badge className="absolute top-3 left-3 bg-rose-500">{getBikeTypeLabel(bike_type)}</Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-3 right-3 rounded-full bg-white/80 hover:bg-white"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Info Section - Right Side */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div className="space-y-3">
                            {/* Header with Title and Status */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <Link to={`/bikes/${id}`}>
                                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-rose-600 transition-colors truncate">
                                            {title}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center mt-1 space-x-4">
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {location}
                                        </p>
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                                            <span className="text-sm font-medium">{rating}</span>
                                            <span className="text-sm text-gray-600">({reviews})</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge className={`ml-3 ${getBikeStatusColor(status)}`}>{status}</Badge>
                            </div>

                            {/* Specifications */}
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Battery className="h-4 w-4 mr-1" />
                                    <span>{battery_range}km range</span>
                                </div>
                                {created_at && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>Listed {formatDate(created_at)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-2xl font-bold text-gray-900">${daily_rate}</span>
                                    <span className="text-gray-600">/ day</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {showManageButtons ? (
                                        <>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/bikes/${id}`}>
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Link>
                                            </Button>
                                            <Button size="sm" className="bg-rose-500 hover:bg-rose-600" asChild>
                                                <Link to={`/edit-bike/${id}`}>Edit</Link>
                                            </Button>
                                        </>
                                    ) : (
                                        available && (
                                            <Button
                                                size="sm"
                                                className="bg-rose-500 hover:bg-rose-600"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                Book Now
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardBikeCard;
