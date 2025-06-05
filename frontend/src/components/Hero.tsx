import { ArrowRight, Zap, Shield, Globe, Star, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
    return (
        <div className="relative min-h-[80vh] bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-bounce delay-700"></div>

                {/* Floating Bike Icons */}
                <div className="absolute top-32 left-1/3 animate-float">
                    <div className="w-8 h-8 text-white/20">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                            <path d="M5 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm9.5-3c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm.5 3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM17.5 9c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                        </svg>
                    </div>
                </div>
                <div className="absolute bottom-40 right-1/4 animate-float delay-1000">
                    <div className="w-6 h-6 text-white/20">
                        <Zap className="w-full h-full" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
                <div className="text-center text-white max-w-6xl mx-auto">
                    {/* Main Content */}
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Ride the Future
                            <span className="block text-4xl md:text-6xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                Go Electric
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
                            Discover premium electric bikes from trusted local hosts. Sustainable, efficient, and
                            exciting urban mobility at your fingertips.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link to="/bikes">
                            <Button
                                size="lg"
                                className="bg-white text-rose-600 hover:bg-gray-100 text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Explore E-Bikes
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/list-bike">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-rose-600 hover:bg-white hover:text-rose-600 text-lg font-semibold px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                            >
                                List Your Bike
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                            <div className="text-sm md:text-base opacity-80 flex items-center justify-center">
                                <Globe className="w-4 h-4 mr-1" />
                                E-Bikes Available
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                            <div className="text-sm md:text-base opacity-80 flex items-center justify-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                Cities Covered
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                            <div className="text-sm md:text-base opacity-80 flex items-center justify-center">
                                <Users className="w-4 h-4 mr-1" />
                                Happy Riders
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">4.9</div>
                            <div className="text-sm md:text-base opacity-80 flex items-center justify-center">
                                <Star className="w-4 h-4 mr-1" />
                                Average Rating
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                        <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
                            <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                            <h3 className="text-xl font-semibold mb-2">Fast & Efficient</h3>
                            <p className="text-sm opacity-80">Premium electric bikes with long-lasting batteries</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
                            <Shield className="w-12 h-12 mx-auto mb-4 text-green-300" />
                            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                            <p className="text-sm opacity-80">Verified bikes and trusted local hosts</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
                            <Globe className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                            <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
                            <p className="text-sm opacity-80">Sustainable transportation for a greener future</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Hero;
