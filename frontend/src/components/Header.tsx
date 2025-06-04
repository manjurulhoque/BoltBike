import { Search, Menu, User, Heart, Globe, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser, useLogout } from '@/hooks/auth/useAuth';

const Header = () => {
    const { data: user, isLoading } = useUser();
    const logout = useLogout();

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
                                />
                            </div>
                            <div className="border-l border-gray-300 h-6"></div>
                            <div className="px-3 py-1">
                                <span className="text-sm font-medium">Check in</span>
                                <input
                                    type="text"
                                    placeholder="Add dates"
                                    className="block w-24 text-sm border-0 p-0 placeholder-gray-500 focus:ring-0 focus:outline-none"
                                />
                            </div>
                            <div className="border-l border-gray-300 h-6"></div>
                            <div className="px-3 py-1">
                                <span className="text-sm font-medium">Check out</span>
                                <input
                                    type="text"
                                    placeholder="Add dates"
                                    className="block w-24 text-sm border-0 p-0 placeholder-gray-500 focus:ring-0 focus:outline-none"
                                />
                            </div>
                        </div>
                        <Link to="/bikes">
                            <Button size="sm" className="rounded-full bg-rose-500 hover:bg-rose-600 ml-2 p-2">
                                <Search className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Right Menu */}
                    <div className="flex items-center space-x-4">
                        <Link to="/list-bike">
                            <Button variant="ghost" className="hidden md:block text-sm font-medium">
                                Rent your e-bike
                            </Button>
                        </Link>
                        {user && (
                            <Link to="/my-bikes">
                                <Button variant="ghost" className="hidden md:block text-sm font-medium">
                                    My Bikes
                                </Button>
                            </Link>
                        )}
                        {/* <Link to="/map">
                            <Button variant="ghost" className="hidden md:block text-sm font-medium">
                                <Map className="h-4 w-4 mr-1" />
                                Map View
                            </Button>
                        </Link> */}
                        <div className="flex items-center space-x-2">
                            {isLoading ? (
                                <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-transparent animate-spin"></div>
                            ) : (
                                <>
                                    {user ? (
                                        <>
                                            <Link to="/dashboard">
                                                <Button variant="ghost" size="sm" className="rounded-full">
                                                    <User className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" className="text-sm font-medium" onClick={logout}>
                                                Log out
                                            </Button>
                                        </>
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
