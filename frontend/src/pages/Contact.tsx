import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Contact = () => {
    const contactInfo = [
        {
            icon: <Mail className="h-6 w-6 text-rose-500" />,
            title: 'Email',
            details: 'support@ebikerent.com',
            description: 'Send us an email anytime',
        },
        {
            icon: <Phone className="h-6 w-6 text-rose-500" />,
            title: 'Phone',
            details: '1-800-EBIKE-RENT',
            description: 'Mon-Fri 9AM-6PM PST',
        },
        {
            icon: <MapPin className="h-6 w-6 text-rose-500" />,
            title: 'Address',
            details: '123 Innovation Drive, San Francisco, CA 94105',
            description: 'Visit our headquarters',
        },
        {
            icon: <Clock className="h-6 w-6 text-rose-500" />,
            title: 'Response Time',
            details: 'Within 24 hours',
            description: "We'll get back to you quickly",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Get in Touch</h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as
                            possible.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Form and Info */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First name</Label>
                                        <Input id="firstName" placeholder="John" />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last name</Label>
                                        <Input id="lastName" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="How can we help?" />
                                </div>
                                <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Tell us more about your question..." rows={6} />
                                </div>
                                <Button className="w-full bg-rose-500 hover:bg-rose-600">Send Message</Button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <Card key={index}>
                                        <CardContent className="flex items-start p-6">
                                            <div className="flex-shrink-0 mr-4">{info.icon}</div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {info.title}
                                                </h3>
                                                <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                                                <p className="text-gray-600 text-sm">{info.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>How do I rent a bike?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Simply browse available bikes in your area, select your dates, and book instantly.
                                    You'll receive pickup instructions from the host.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>What if there's an issue with my rental?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Contact our 24/7 support team immediately. We provide roadside assistance and will
                                    help resolve any issues quickly.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>How do I list my bike?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Create a host account, upload photos of your bike, set your price and availability.
                                    Our team will verify your listing within 24 hours.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Is insurance included?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Yes! Every rental includes comprehensive insurance coverage for theft, damage, and
                                    third-party liability.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
