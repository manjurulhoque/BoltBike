import { Search, Menu, User, Heart, Globe, Map, Calendar, Star, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useLogout } from '@/hooks/auth/useAuth';
import { useSearch } from '@/contexts/SearchContext';

const Header = () => {
    const { data: user, isLoading } = useUser();
    const logout = useLogout();
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

    const handleLogout = () => {
        logout();
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

                        <div className="flex items-center space-x-2">
                            {isLoading ? (
                                <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-transparent animate-spin"></div>
                            ) : (
                                <>
                                    {user ? (
                                        /* User Dropdown Menu */
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="hidden md:block text-sm font-medium">
                                                        {user.first_name || 'Account'}
                                                    </span>
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                <DropdownMenuLabel>
                                                    <div className="flex flex-col space-y-1">
                                                        <p className="text-sm font-medium leading-none">
                                                            {user.first_name} {user.last_name}
                                                        </p>
                                                        <p className="text-xs leading-none text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem asChild>
                                                    <Link to="/dashboard" className="cursor-pointer">
                                                        <User className="h-4 w-4 mr-2" />
                                                        Dashboard
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link to="/my-bikes" className="cursor-pointer">
                                                        <Heart className="h-4 w-4 mr-2" />
                                                        My Bikes
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link to="/bookings" className="cursor-pointer">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Bookings
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link to="/reviews" className="cursor-pointer">
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Reviews
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link to="/favorites" className="cursor-pointer">
                                                        <Heart className="h-4 w-4 mr-2" />
                                                        Favorites
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={handleLogout}
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                >
                                                    <User className="h-4 w-4 mr-2" />
                                                    Log out
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <>
                                            <Link to="/login">
                                                <Button variant="ghost" className="text-sm font-medium">
                                                    Log in
                                                </Button>
                                            </Link>
                                            <Link to="/signup">
                                                <Button className="bg-rose-500 hover:bg-rose-600 text-sm">
                                                    Sign up
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
