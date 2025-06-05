import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Target, Heart, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
    const stats = [
        { number: '10,000+', label: 'Happy Riders' },
        { number: '2,500+', label: 'Bikes Available' },
        { number: '50+', label: 'Cities' },
        { number: '4.9/5', label: 'Average Rating' },
    ];

    const values = [
        {
            icon: <Users className="h-8 w-8 text-rose-500" />,
            title: 'Community First',
            description: 'We believe in building strong local communities through shared mobility solutions.',
        },
        {
            icon: <Target className="h-8 w-8 text-rose-500" />,
            title: 'Sustainability',
            description: 'Promoting eco-friendly transportation to reduce carbon footprint and urban pollution.',
        },
        {
            icon: <Heart className="h-8 w-8 text-rose-500" />,
            title: 'Accessibility',
            description: 'Making electric mobility accessible and affordable for everyone, everywhere.',
        },
        {
            icon: <Award className="h-8 w-8 text-rose-500" />,
            title: 'Quality',
            description: 'Ensuring the highest standards in bike quality, safety, and customer service.',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">About eBikeRent</h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            We're revolutionizing urban mobility by connecting bike owners with riders, creating a
                            sustainable and accessible transportation network.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-rose-500 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Founded in 2023, eBikeRent was born from a simple idea: what if we could make
                                    electric bikes as accessible as ride-sharing, but more personal and
                                    community-driven?
                                </p>
                                <p>
                                    Our founders, passionate cyclists and sustainability advocates, recognized that many
                                    people want to try e-bikes but find the upfront cost prohibitive. At the same time,
                                    many e-bike owners only use their bikes occasionally.
                                </p>
                                <p>
                                    We created eBikeRent to bridge this gap, allowing bike owners to earn income from
                                    their bikes while making e-mobility accessible to everyone. Today, we're proud to be
                                    the fastest-growing peer-to-peer e-bike rental platform.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                            <p className="text-gray-600 mb-6">
                                To make sustainable transportation accessible, affordable, and enjoyable for everyone
                                while building stronger communities through shared mobility.
                            </p>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-gray-600">
                                A world where clean, efficient transportation is available to everyone, reducing urban
                                congestion and environmental impact while fostering community connections.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-6">
                                    <div className="flex justify-center mb-4">{value.icon}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600 text-sm">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Leadership Team</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900">Sarah Chen</h3>
                            <p className="text-rose-500 mb-2">CEO & Co-Founder</p>
                            <p className="text-sm text-gray-600">
                                Former Tesla engineer with 10+ years in sustainable mobility
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900">Mike Rodriguez</h3>
                            <p className="text-rose-500 mb-2">CTO & Co-Founder</p>
                            <p className="text-sm text-gray-600">
                                Tech veteran who built marketplace platforms at Airbnb and Uber
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900">Emily Davis</h3>
                            <p className="text-rose-500 mb-2">Head of Operations</p>
                            <p className="text-sm text-gray-600">
                                Operations expert with experience scaling sharing economy platforms
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default About;
