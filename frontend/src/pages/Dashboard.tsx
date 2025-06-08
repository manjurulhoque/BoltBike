import { useState, useEffect } from 'react';
import { Calendar, Bike, Heart, User, Settings, Plus, MapPin, Star, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useUser, useUpdateUser } from '@/hooks/auth/useAuth';
import { Link } from 'react-router-dom';
import { useMyBikes } from '@/hooks/useBikes';
import { useMyBookings, useBikeBookings } from '@/hooks/useBookings';
import { useFavorites } from '@/hooks/useFavorites';
import { getBikeTypeLabel } from '@/lib/constants';
import BikeCard from '@/components/BikeCard';
import DashboardBikeCard from '@/components/DashboardBikeCard';
import UserDropdown from '@/components/UserDropdown';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Dashboard = () => {
    const { data: myBikesResponse } = useMyBikes();
    const { data: user, isLoading } = useUser();
    const { data: myBookingsResponse } = useMyBookings();
    const { data: bikeBookingsResponse } = useBikeBookings();
    const { data: favoritesResponse } = useFavorites();
    const updateUser = useUpdateUser();

    const [activeTab, setActiveTab] = useState('bookings');
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
    });

    const { first_name, last_name, email, phone } = user || {};

    // Initialize profile form data when user data loads
    useEffect(() => {
        if (user) {
            setProfileData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
            });
        }
    }, [user]);
    const myBikes = myBikesResponse?.data?.results || [];
    const myBookings = myBookingsResponse?.data?.results || [];
    const bikeBookings = bikeBookingsResponse?.data?.results || [];
    const favorites = favoritesResponse?.data?.results || [];

    // Calculate earnings from bike bookings (bookings for bikes I own)
    const calculateEarnings = () => {
        const completedBookings = bikeBookings.filter((booking) => booking.status === 'completed');
        const pendingBookings = bikeBookings.filter((booking) => booking.status === 'active');

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const thisMonthEarnings = completedBookings
            .filter((booking) => {
                const bookingDate = new Date(booking.end_time);
                return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
            })
            .reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);

        const lastMonthEarnings = completedBookings
            .filter((booking) => {
                const bookingDate = new Date(booking.end_time);
                return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear;
            })
            .reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);

        const totalEarnings = completedBookings.reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);

        const pendingPayouts = pendingBookings.reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);

        // Recent transactions (last 5 completed bookings)
        const recentTransactions = completedBookings.slice(0, 5).map((booking) => ({
            id: booking.id.toString(),
            date: format(new Date(booking.end_time), 'yyyy-MM-dd'),
            amount: parseFloat(booking.total_price),
            bike: booking.bike.title,
            renter: `${booking.renter.first_name} ${booking.renter.last_name.charAt(0)}.`,
            status: 'completed' as const,
        }));

        return {
            thisMonth: thisMonthEarnings,
            lastMonth: lastMonthEarnings,
            totalEarnings,
            pendingPayouts,
            recentTransactions,
        };
    };

    const earnings = calculateEarnings();

    // Format date helper
    const formatBookingDate = (dateString: string) => {
        return format(new Date(dateString), 'yyyy-MM-dd');
    };

    // Get status badge styling
    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'requested':
                return 'bg-yellow-100 text-yellow-800';
            case 'active':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleProfileInputChange = (field: string, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveProfileChanges = async () => {
        try {
            await updateUser.mutateAsync(profileData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-rose-500">
                            <Link to="/" className="text-2xl font-bold text-rose-500">
                                eBikeRent
                            </Link>
                        </h1>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline">
                                <Link to="/list-bike" className="flex items-center">
                                    <Plus className="h-4 w-4 mr-2" />
                                    List your bike
                                </Link>
                            </Button>
                            <UserDropdown showChevron={false} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-rose-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <User className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {first_name} {last_name}
                                </h3>
                                <p className="text-gray-600">{email}</p>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                                        activeTab === 'bookings'
                                            ? 'bg-rose-50 text-rose-600 border-r-2 border-rose-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Calendar className="h-5 w-5 mr-3" />
                                    My Bookings
                                </button>
                                <button
                                    onClick={() => setActiveTab('favorites')}
                                    className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                                        activeTab === 'favorites'
                                            ? 'bg-rose-50 text-rose-600 border-r-2 border-rose-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Heart className="h-5 w-5 mr-3" />
                                    Favorites
                                </button>
                                <button
                                    onClick={() => setActiveTab('bikes')}
                                    className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                                        activeTab === 'bikes'
                                            ? 'bg-rose-50 text-rose-600 border-r-2 border-rose-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Bike className="h-5 w-5 mr-3" />
                                    My Bikes
                                </button>
                                <button
                                    onClick={() => setActiveTab('earnings')}
                                    className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                                        activeTab === 'earnings'
                                            ? 'bg-rose-50 text-rose-600 border-r-2 border-rose-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <DollarSign className="h-5 w-5 mr-3" />
                                    Earnings
                                </button>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                                        activeTab === 'profile'
                                            ? 'bg-rose-50 text-rose-600 border-r-2 border-rose-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Settings className="h-5 w-5 mr-3" />
                                    Profile
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'bookings' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
                                {myBookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {myBookings.map((booking) => (
                                            <Card key={booking.id} className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={booking.bike.images?.[0]?.image_url || '/placeholder.svg'}
                                                        alt={booking.bike.title}
                                                        className="w-20 h-20 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {booking.bike.title}
                                                        </h3>
                                                        <p className="text-gray-600 flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1" />
                                                            {booking.bike.location}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {formatBookingDate(booking.start_time)} -{' '}
                                                            {formatBookingDate(booking.end_time)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-gray-900">
                                                            ${booking.total_price}
                                                        </p>
                                                        <Badge
                                                            variant="secondary"
                                                            className={getStatusBadgeStyle(booking.status)}
                                                        >
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                                        <p className="text-gray-600 mb-4">
                                            Start exploring and book your first e-bike rental!
                                        </p>
                                        <Button className="bg-rose-500 hover:bg-rose-600">
                                            <Link to="/">Browse Bikes</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Bikes</h2>
                                {favorites.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {favorites.map((favorite) => (
                                            <Card key={favorite.id} className="overflow-hidden">
                                                <img
                                                    src={favorite.bike.images?.[0]?.image_url || '/placeholder.svg'}
                                                    alt={favorite.bike.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="p-4 cursor-pointer">
                                                    <Link to={`/bikes/${favorite.bike.id}`}>
                                                        <h3 className="font-semibold text-gray-900 mb-2">
                                                            {favorite.bike.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-gray-600 flex items-center mb-2">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {favorite.bike.location}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-gray-600">
                                                            {getBikeTypeLabel(favorite.bike.bike_type)}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">
                                                                ${favorite.bike.daily_rate}
                                                            </span>
                                                            <span className="text-gray-600"> / day</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                                        <p className="text-gray-600 mb-4">
                                            Save bikes you love to easily find them later!
                                        </p>
                                        <Button className="bg-rose-500 hover:bg-rose-600">
                                            <Link to="/">Browse Bikes</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'bikes' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">My Bikes</h2>
                                    <Button className="bg-rose-500 hover:bg-rose-600">
                                        <Plus className="h-4 w-4 mr-2" />
                                        <Link to="/list-bike">Add New Bike</Link>
                                    </Button>
                                </div>
                                {myBikes.length > 0 ? (
                                    <div className="space-y-4">
                                        {myBikes.map((bike) => (
                                            <DashboardBikeCard key={bike.id} bike={bike} showManageButtons={true} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Bike className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No bikes listed yet
                                        </h3>
                                        <p className="text-gray-600 mb-4">List your first bike and start earning!</p>
                                        <Button className="bg-rose-500 hover:bg-rose-600">
                                            <Plus className="h-4 w-4 mr-2" />
                                            <Link to="/list-bike">Add Your First Bike</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'earnings' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h2>

                                {/* Earnings Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <Card className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${earnings.thisMonth.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-green-100 rounded-full">
                                                <TrendingUp className="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm">
                                            {earnings.lastMonth > 0 ? (
                                                <>
                                                    <span
                                                        className={`font-medium ${
                                                            earnings.thisMonth > earnings.lastMonth
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}
                                                    >
                                                        {earnings.thisMonth > earnings.lastMonth ? '+' : ''}
                                                        {earnings.lastMonth > 0
                                                            ? Math.round(
                                                                  ((earnings.thisMonth - earnings.lastMonth) /
                                                                      earnings.lastMonth) *
                                                                      100,
                                                              )
                                                            : 0}
                                                        %
                                                    </span>
                                                    <span className="text-gray-600 ml-1">from last month</span>
                                                </>
                                            ) : (
                                                <span className="text-gray-600">No data from last month</span>
                                            )}
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Last Month</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${earnings.lastMonth.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-blue-100 rounded-full">
                                                <Calendar className="h-6 w-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${earnings.totalEarnings.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-purple-100 rounded-full">
                                                <DollarSign className="h-6 w-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${earnings.pendingPayouts.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-orange-100 rounded-full">
                                                <Clock className="h-6 w-6 text-orange-600" />
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Recent Transactions */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                                        <Button variant="outline" size="sm">
                                            <Link to="/bookings">View All</Link>
                                        </Button>
                                    </div>

                                    {earnings.recentTransactions.length > 0 ? (
                                        <div className="space-y-4">
                                            {earnings.recentTransactions.map((transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="p-2 bg-white rounded-lg">
                                                            <Bike className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {transaction.bike}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                Rented by {transaction.renter}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{transaction.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            ${transaction.amount.toFixed(2)}
                                                        </p>
                                                        <Badge
                                                            variant="default"
                                                            className="bg-green-100 text-green-800"
                                                        >
                                                            {transaction.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">No transactions yet</p>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                                <Card className="p-6">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                    value={profileData.first_name}
                                                    onChange={(e) =>
                                                        handleProfileInputChange('first_name', e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                    value={profileData.last_name}
                                                    onChange={(e) =>
                                                        handleProfileInputChange('last_name', e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                                                value={email || ''}
                                                disabled
                                                title="Email cannot be changed"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                value={profileData.phone}
                                                onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                rows={4}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                        <Button
                                            className="bg-rose-500 hover:bg-rose-600"
                                            onClick={handleSaveProfileChanges}
                                            disabled={updateUser.isPending}
                                        >
                                            {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
