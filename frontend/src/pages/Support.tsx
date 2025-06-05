import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, MessageCircle, Phone, Book, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Support = () => {
    const supportOptions = [
        {
            icon: <MessageCircle className="h-8 w-8 text-rose-500" />,
            title: 'Live Chat',
            description: 'Get instant help from our support team',
            action: 'Start Chat',
            available: 'Available 24/7',
        },
        {
            icon: <Phone className="h-8 w-8 text-rose-500" />,
            title: 'Phone Support',
            description: 'Call us for immediate assistance',
            action: '1-800-EBIKE-RENT',
            available: 'Mon-Fri 9AM-6PM PST',
        },
        {
            icon: <Book className="h-8 w-8 text-rose-500" />,
            title: 'Help Center',
            description: 'Browse our comprehensive knowledge base',
            action: 'Browse Articles',
            available: 'Self-service',
        },
    ];

    const popularArticles = [
        'How to rent your first e-bike',
        'Safety guidelines for riders',
        'Troubleshooting common issues',
        'How to become a bike host',
        'Understanding insurance coverage',
        'Cancellation and refund policy',
        'Bike maintenance tips',
        'Emergency procedures',
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">How Can We Help?</h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Find answers to your questions or get in touch with our support team.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input placeholder="Search for help..." className="pl-10 py-3 text-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Options */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Get Support</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {supportOptions.map((option, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-8">
                                    <div className="flex justify-center mb-4">{option.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                                    <p className="text-gray-600 mb-4">{option.description}</p>
                                    <Button
                                        className="w-full mb-3 bg-rose-500 hover:bg-rose-600"
                                        variant={index === 2 ? 'outline' : 'default'}
                                    >
                                        {option.action}
                                    </Button>
                                    <p className="text-sm text-gray-500">
                                        <Clock className="inline h-4 w-4 mr-1" />
                                        {option.available}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Help Articles</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {popularArticles.map((article, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex items-center">
                                        <Book className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-700 hover:text-rose-500">{article}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Emergency Support */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-red-800 mb-4">Emergency Support</h2>
                        <p className="text-red-700 mb-6">
                            If you're experiencing a bike breakdown, accident, or safety issue while riding, call our
                            emergency line immediately.
                        </p>
                        <div className="space-y-4">
                            <div className="bg-red-600 text-white p-4 rounded-lg inline-block">
                                <p className="text-lg font-bold">Emergency Hotline</p>
                                <p className="text-2xl font-bold">1-800-EBIKE-911</p>
                                <p className="text-sm">Available 24/7</p>
                            </div>
                            <div className="text-sm text-red-600">
                                <p>For non-emergencies, use the regular support options above.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
                            <p className="text-gray-600 mb-6">
                                Our support team is here to help you with any questions or issues you might have. Don't
                                hesitate to reach out!
                            </p>
                            <div className="space-y-4">
                                <Link to="/contact">
                                    <Button className="w-full bg-rose-500 hover:bg-rose-600">
                                        Contact Support Team
                                    </Button>
                                </Link>
                                <Link to="/safety">
                                    <Button variant="outline" className="w-full">
                                        View Safety Guidelines
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-rose-500" />
                                    Community Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Join our community forum to connect with other riders and hosts, share experiences,
                                    and get tips from the community.
                                </p>
                                <Button variant="outline" className="w-full">
                                    Join Community Forum
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Support;
