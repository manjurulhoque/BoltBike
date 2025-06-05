import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, HardHat, Settings, Phone, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Safety = () => {
    const safetyFeatures = [
        {
            icon: <Shield className="h-8 w-8 text-rose-500" />,
            title: 'Verified Hosts',
            description: 'All bike hosts are verified with ID checks and background screening for your safety.',
        },
        {
            icon: <HardHat className="h-8 w-8 text-rose-500" />,
            title: 'Safety Equipment',
            description: 'Helmets and safety gear included with every rental. Safety first, always.',
        },
        {
            icon: <Settings className="h-8 w-8 text-rose-500" />,
            title: 'Bike Inspections',
            description: 'Regular maintenance checks ensure all bikes meet our strict safety standards.',
        },
        {
            icon: <Phone className="h-8 w-8 text-rose-500" />,
            title: '24/7 Support',
            description: 'Emergency roadside assistance and support available around the clock.',
        },
    ];

    const safetyTips = [
        'Always wear a helmet and visible clothing',
        'Check bike condition before riding',
        'Follow local traffic laws and bike lane rules',
        'Use lights when riding in low visibility',
        'Keep emergency contact information handy',
        'Report any issues immediately',
        'Stay hydrated and take breaks on long rides',
        'Be aware of weather conditions',
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Your Safety is Our Priority
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            We've built comprehensive safety measures into every aspect of our platform to ensure you
                            have a safe and enjoyable riding experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* Safety Features */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Safety Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {safetyFeatures.map((feature, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-6">
                                    <div className="flex justify-center mb-4">{feature.icon}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Safety Guidelines */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Safety Guidelines</h2>
                            <p className="text-gray-600 mb-8">
                                Follow these essential safety guidelines to ensure a safe and enjoyable ride. Your
                                safety and the safety of others on the road is paramount.
                            </p>

                            <div className="space-y-3">
                                {safetyTips.map((tip, index) => (
                                    <div key={index} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-rose-500">Emergency Contact</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">In case of emergency or bike breakdown:</p>
                                    <div className="bg-rose-50 p-4 rounded-lg">
                                        <p className="font-bold text-rose-600 text-lg">1-800-EBIKE-911</p>
                                        <p className="text-sm text-gray-600">Available 24/7</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Insurance Coverage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Every rental includes comprehensive insurance coverage for:
                                    </p>
                                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                                        <li>• Theft protection</li>
                                        <li>• Damage coverage</li>
                                        <li>• Third-party liability</li>
                                        <li>• Medical expenses</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pre-Ride Checklist</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>✓ Check battery charge level</li>
                                        <li>✓ Test brakes and gears</li>
                                        <li>✓ Inspect tires for proper inflation</li>
                                        <li>✓ Ensure lights are working</li>
                                        <li>✓ Adjust seat height</li>
                                        <li>✓ Put on helmet and safety gear</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Safety;
