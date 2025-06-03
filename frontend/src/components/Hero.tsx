import { Search, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
    return (
        <div className="relative h-[60vh] bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Rent the perfect e-bike</h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                    Explore your city with eco-friendly electric bikes from local hosts
                </p>

                {/* Search Form */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Where do you want to ride?"
                                    className="pl-10 h-12 border-gray-300 focus:border-rose-500"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input type="date" className="pl-10 h-12 border-gray-300 focus:border-rose-500" />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input type="date" className="pl-10 h-12 border-gray-300 focus:border-rose-500" />
                            </div>
                        </div>

                        <div className="md:pt-6">
                            <Button className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-lg font-semibold">
                                <Search className="mr-2 h-5 w-5" />
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
