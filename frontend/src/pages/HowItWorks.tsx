import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Search, Calendar, Key, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search className="h-8 w-8 text-rose-500" />,
            title: 'Search & Browse',
            description: 'Find the perfect e-bike in your area using our smart filters for type, price, and location.',
        },
        {
            icon: <Calendar className="h-8 w-8 text-rose-500" />,
            title: 'Book Instantly',
            description: 'Select your dates and book instantly. Most bikes are available for same-day pickup.',
        },
        {
            icon: <Key className="h-8 w-8 text-rose-500" />,
            title: 'Pick Up & Ride',
            description: "Meet your host, get the keys, and start your adventure. It's that simple!",
        },
    ];

    const benefits = [
        'No monthly commitments or subscriptions',
        'Try different bike models before buying',
        'Local pickup from verified hosts',
        'Comprehensive insurance coverage',
        '24/7 roadside assistance',
        'Community-driven marketplace',
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">How eBikeRent Works</h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Discover the easiest way to rent electric bikes from local hosts. Get on the road in just a
                            few clicks.
                        </p>
                        <Link to="/bikes">
                            <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
                                Start Browsing Bikes
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Steps Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Rent in 3 Easy Steps</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-8">
                                    <div className="flex justify-center mb-4">{step.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        {index + 1}. {step.title}
                                    </h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose eBikeRent?</h2>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Start Riding?</h3>
                            <p className="text-gray-600 mb-6">
                                Join thousands of riders who have discovered the freedom of e-bike rentals.
                            </p>
                            <div className="space-y-3">
                                <Link to="/bikes" className="block">
                                    <Button className="w-full bg-rose-500 hover:bg-rose-600">
                                        Browse Available Bikes
                                    </Button>
                                </Link>
                                <Link to="/list-bike" className="block">
                                    <Button variant="outline" className="w-full">
                                        List Your Bike
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HowItWorks;
