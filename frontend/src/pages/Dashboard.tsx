import { useState } from 'react';
import {
    Calendar,
    Bike,
    Heart,
    User,
    Settings,
    LogOut,
    Plus,
    MapPin,
    Star,
    DollarSign,
    TrendingUp,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLogout, useUser } from '@/hooks/auth/useAuth';
import { Link } from 'react-router-dom';
import { useMyBikes } from '@/hooks/useBikes';
import BikeCard from '@/components/BikeCard';
import DashboardBikeCard from '@/components/DashboardBikeCard';

const Dashboard = () => {
    const { data: myBikesResponse } = useMyBikes();
    const { data: user, isLoading } = useUser();
    const [activeTab, setActiveTab] = useState('bookings');
    const logout = useLogout();
    const { first_name, last_name, email, phone } = user || {};
    const myBikes = myBikesResponse?.data?.results || [];

    const bookings = [
        {
            id: '1',
            bikeTitle: 'Trek Verve+ 2 Electric Hybrid',
            location: 'Downtown, San Francisco',
            startDate: '2024-06-15',
            endDate: '2024-06-17',
            price: 135,
            status: 'confirmed',
            image: '/placeholder.svg',
        },
        {
            id: '2',
            bikeTitle: 'Specialized Turbo Vado SL',
            location: 'Mission District, SF',
            startDate: '2024-06-20',
            endDate: '2024-06-22',
            price: 195,
            status: 'pending',
            image: '/placeholder.svg',
        },
    ];

    const favorites = [
        {
            id: '1',
            title: 'Canyon Neuron:ON Mountain',
            location: 'Marin County, CA',
            price: 85,
            rating: 4.9,
            image: '/placeholder.svg',
        },
        {
            id: '2',
            title: 'Brompton Electric Folding',
            location: 'SOMA, San Francisco',
            price: 55,
            rating: 4.6,
            image: '/placeholder.svg',
        },
    ];

    const earnings = {
        thisMonth: 1240,
        lastMonth: 890,
        totalEarnings: 5680,
        pendingPayouts: 320,
        recentTransactions: [
            { id: '1', date: '2024-06-15', amount: 135, bike: 'Trek Verve+ 2', renter: 'John D.', status: 'completed' },
            { id: '2', date: '2024-06-18', amount: 85, bike: 'Canyon Neuron', renter: 'Sarah M.', status: 'completed' },
            {
                id: '3',
                date: '2024-06-20',
                amount: 195,
                bike: 'Specialized Turbo',
                renter: 'Mike R.',
                status: 'pending',
            },
        ],
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
                            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
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

                            <div className="border-t mt-6 pt-4">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                                >
                                    <LogOut className="h-5 w-5 mr-3" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'bookings' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <Card key={booking.id} className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={booking.image}
                                                    alt={booking.bikeTitle}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {booking.bikeTitle}
                                                    </h3>
                                                    <p className="text-gray-600 flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {booking.location}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {booking.startDate} - {booking.endDate}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-gray-900">${booking.price}</p>
                                                    <Badge
                                                        variant={
                                                            booking.status === 'confirmed' ? 'default' : 'secondary'
                                                        }
                                                        className={
                                                            booking.status === 'confirmed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }
                                                    >
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Bikes</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {favorites.map((bike) => (
                                        <Card key={bike.id} className="overflow-hidden">
                                            <img
                                                src={bike.image}
                                                alt={bike.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 mb-2">{bike.title}</h3>
                                                <p className="text-gray-600 flex items-center mb-2">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {bike.location}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                                                        <span className="text-sm font-medium ml-1">{bike.rating}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">${bike.price}</span>
                                                        <span className="text-gray-600"> / day</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'bikes' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">My Bikes</h2>
                                    <Button className="bg-rose-500 hover:bg-rose-600">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New Bike
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
                                                    ${earnings.thisMonth}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-green-100 rounded-full">
                                                <TrendingUp className="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm">
                                            <span className="text-green-600 font-medium">+39%</span>
                                            <span className="text-gray-600 ml-1">from last month</span>
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Last Month</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${earnings.lastMonth}
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
                                                    ${earnings.totalEarnings}
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
                                                    ${earnings.pendingPayouts}
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
                                            View All
                                        </Button>
                                    </div>

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
                                                    <p className="font-semibold text-gray-900">${transaction.amount}</p>
                                                    <Badge
                                                        variant={
                                                            transaction.status === 'completed' ? 'default' : 'secondary'
                                                        }
                                                        className={
                                                            transaction.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }
                                                    >
                                                        {transaction.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                                    defaultValue="John"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                    defaultValue="Doe"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                defaultValue="john.doe@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                                        <Button className="bg-rose-500 hover:bg-rose-600">Save Changes</Button>
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
