import { Search, Menu, User, Heart, Globe, Map, Calendar, Star, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/SearchContext';
import UserDropdown from './UserDropdown';

const Header = () => {
    const navigate = useNavigate();
    const { searchState, updateSearchState } = useSearch();

    const handleSearch = () => {
        // Navigate to bikes page with search parameters
        const params = new URLSearchParams();
        if (searchState.location) params.set('location', searchState.location);
        if (searchState.startDate) params.set('startDate', searchState.startDate);
        if (searchState.endDate) params.set('endDate', searchState.endDate);

        navigate(`/bikes?${params.toString()}`);
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-rose-500">
                            eBikeRent
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="px-3 py-1">
                                <span className="text-sm font-medium">Where</span>
                                <input
                                    type="text"
                                    placeholder="Search destinations"
                                    className="block w-32 text-sm border-0 p-0 placeholder-gray-500 focus:ring-0 focus:outline-none"
                                    value={searchState.location}
                                    onChange={(e) => updateSearchState({ location: e.target.value })}
                                />
                            </div>
                            <div className="border-l border-gray-300 h-6"></div>
                            <div className="px-3 py-1">
                                <span className="text-sm font-medium">Check in</span>
                                <input
                                    type="date"
                                    className="block w-32 text-sm border-0 p-0 placeholder-gray-500 focus:ring-0 focus:outline-none"
                                    value={searchState.startDate}
                                    onChange={(e) => updateSearchState({ startDate: e.target.value })}
                                />
                            </div>
                            <div className="border-l border-gray-300 h-6"></div>
                            <div className="px-3 py-1">
                                <span className="text-sm font-medium">Check out</span>
                                <input
                                    type="date"
                                    className="block w-32 text-sm border-0 p-0 placeholder-gray-500 focus:ring-0 focus:outline-none"
                                    value={searchState.endDate}
                                    onChange={(e) => updateSearchState({ endDate: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Menu */}
                    <div className="flex items-center space-x-4">
                        {/* Rent your e-bike - Standalone button */}
                        <Link to="/list-bike">
                            <Button variant="ghost" className="hidden md:block text-sm font-medium">
                                Rent your e-bike
                            </Button>
                        </Link>

                        <UserDropdown />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
