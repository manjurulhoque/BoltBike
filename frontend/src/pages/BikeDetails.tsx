import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Heart,
    Share2,
    Star,
    MapPin,
    Battery,
    Users,
    Calendar,
    Clock,
    Shield,
    Wifi,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import BookingProcess from '@/components/BookingProcess';
import ReviewForm from '@/components/ReviewForm';

const BikeDetails = () => {
    const { id } = useParams();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [showBookingProcess, setShowBookingProcess] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Sample bike data - in a real app, this would come from an API
    const bike = {
        id: '1',
        title: 'Trek Verve+ 2 Electric Hybrid',
        type: 'City',
        location: 'Downtown, San Francisco',
        price: 45,
        rating: 4.9,
        reviews: 127,
        host: 'Sarah Johnson',
        hostImage: '/placeholder.svg',
        images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        batteryRange: 80,
        maxSpeed: 32,
        weight: 22,
        features: ['GPS Tracking', 'Phone Charging', 'LED Lights', 'Basket Included', 'Helmet Provided'],
        description:
            "Perfect for city commuting and leisure rides. This premium electric bike offers a smooth, comfortable ride with excellent battery life. Ideal for exploring San Francisco's hills and neighborhoods.",
        amenities: ['Free cancellation', 'Instant booking', '24/7 support', 'Insurance included'],
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % bike.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + bike.images.length) % bike.images.length);
    };

    const reviews = [
        {
            id: 1,
            name: 'Mike Chen',
            avatar: '/placeholder.svg',
            rating: 5,
            date: '2 weeks ago',
            comment:
                'Amazing bike! Perfect for exploring the city. The battery lasted the entire day and the ride was incredibly smooth.',
        },
        {
            id: 2,
            name: 'Emma Wilson',
            avatar: '/placeholder.svg',
            rating: 5,
            date: '1 month ago',
            comment:
                'Sarah was a great host and the bike was in perfect condition. Highly recommend for anyone visiting SF!',
        },
        {
            id: 3,
            name: 'David Rodriguez',
            avatar: '/placeholder.svg',
            rating: 4,
            date: '2 months ago',
            comment:
                'Good bike overall. The GPS tracking feature was really helpful. Only minor issue was the seat could be more comfortable.',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to search
                </Link>

                {/* Title and Actions */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-rose-500">{bike.type}</Badge>
                            <div className="flex items-center">
                                <Star className="h-4 w-4 fill-current text-yellow-400" />
                                <span className="ml-1 font-medium">{bike.rating}</span>
                                <span className="text-gray-600 ml-1">({bike.reviews} reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{bike.title}</h1>
                        <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {bike.location}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images and Details */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-8 bg-gray-100">
                            <img
                                src={bike.images[currentImageIndex]}
                                alt={bike.title}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {bike.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full ${
                                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Host Info */}
                        <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg mb-8">
                            <div className="flex items-center">
                                <img
                                    src={bike.hostImage}
                                    alt={bike.host}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h3 className="font-semibold">Hosted by {bike.host}</h3>
                                    <p className="text-sm text-gray-600">Superhost • 5 years hosting</p>
                                </div>
                            </div>
                            <Button variant="outline">Contact Host</Button>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">About this e-bike</h2>
                            <p className="text-gray-700 leading-relaxed">{bike.description}</p>
                        </div>

                        {/* Specifications */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 border border-gray-200 rounded-lg">
                                    <Battery className="h-6 w-6 mx-auto mb-2 text-green-600" />
                                    <p className="font-semibold">{bike.batteryRange}km</p>
                                    <p className="text-sm text-gray-600">Range</p>
                                </div>
                                <div className="text-center p-4 border border-gray-200 rounded-lg">
                                    <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                                    <p className="font-semibold">{bike.maxSpeed}km/h</p>
                                    <p className="text-sm text-gray-600">Max Speed</p>
                                </div>
                                <div className="text-center p-4 border border-gray-200 rounded-lg">
                                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                                    <p className="font-semibold">{bike.weight}kg</p>
                                    <p className="text-sm text-gray-600">Weight</p>
                                </div>
                                <div className="text-center p-4 border border-gray-200 rounded-lg">
                                    <Shield className="h-6 w-6 mx-auto mb-2 text-red-600" />
                                    <p className="font-semibold">Class 2</p>
                                    <p className="text-sm text-gray-600">E-bike Type</p>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">What's included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bike.features.map((feature, index) => (
                                    <div key={index} className="flex items-center">
                                        <Wifi className="h-5 w-5 mr-3 text-green-600" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <Star className="h-6 w-6 inline mr-2" />
                                    {bike.rating} • {bike.reviews} reviews
                                </h2>
                                <Button variant="outline" onClick={() => setShowReviewForm(true)}>
                                    Write a Review
                                </Button>
                            </div>
                            {/* ... keep existing code (reviews display) */}
                            <Button variant="outline" className="mt-4">
                                Show all reviews
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <span className="text-2xl font-bold">${bike.price}</span>
                                        <span className="text-gray-600"> / day</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                                        <span className="ml-1 font-medium">{bike.rating}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="checkin">Check-in</Label>
                                            <Input
                                                id="checkin"
                                                type="date"
                                                value={checkIn}
                                                onChange={(e) => setCheckIn(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="checkout">Check-out</Label>
                                            <Input
                                                id="checkout"
                                                type="date"
                                                value={checkOut}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="guests">Riders</Label>
                                        <select
                                            id="guests"
                                            value={guests}
                                            onChange={(e) => setGuests(Number(e.target.value))}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value={1}>1 rider</option>
                                            <option value={2}>2 riders</option>
                                            <option value={3}>3 riders</option>
                                            <option value={4}>4 riders</option>
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-rose-500 hover:bg-rose-600 mb-4"
                                    onClick={() => setShowBookingProcess(true)}
                                >
                                    Book Now
                                </Button>

                                <p className="text-center text-sm text-gray-600 mb-4">You won't be charged yet</p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>${bike.price} x 3 days</span>
                                        <span>${bike.price * 3}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Service fee</span>
                                        <span>$15</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${bike.price * 3 + 15}</span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-2">
                                    {bike.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                            <Shield className="h-4 w-4 mr-2 text-green-600" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Booking Process Modal */}
            {showBookingProcess && (
                <BookingProcess
                    bikeId={bike.id}
                    bikeTitle={bike.title}
                    pricePerDay={bike.price}
                    onClose={() => setShowBookingProcess(false)}
                />
            )}

            {/* Review Form Modal */}
            {showReviewForm && (
                <ReviewForm
                    bikeId={bike.id}
                    bikeTitle={bike.title}
                    onClose={() => setShowReviewForm(false)}
                    onReviewSubmitted={() => {
                        // Refresh reviews or update state
                    }}
                />
            )}
        </div>
    );
};

export default BikeDetails;
