import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Filter, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { useMyBookings, useBikeBookings, useCancelBooking } from '@/hooks/useBookings';
import { BookingStatus } from '@/lib/types/booking';
import { format } from 'date-fns';

const Bookings = () => {
    const [activeTab, setActiveTab] = useState<'my-bookings' | 'bike-bookings'>('my-bookings');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

    // Fetch bookings based on active tab
    const { data: myBookingsResponse, isLoading: myBookingsLoading } = useMyBookings();
    const { data: bikeBookingsResponse, isLoading: bikeBookingsLoading } = useBikeBookings();
    const cancelBooking = useCancelBooking();

    const myBookings = myBookingsResponse?.data?.results || [];
    const bikeBookings = bikeBookingsResponse?.data?.results || [];

    const currentBookings = activeTab === 'my-bookings' ? myBookings : bikeBookings;
    const isLoading = activeTab === 'my-bookings' ? myBookingsLoading : bikeBookingsLoading;

    // Filter bookings by status
    const filteredBookings =
        statusFilter === 'all' ? currentBookings : currentBookings.filter((booking) => booking.status === statusFilter);

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case 'requested':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-blue-100 text-blue-800';
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const canCancelBooking = (status: BookingStatus) => {
        return ['requested', 'approved'].includes(status);
    };

    const handleCancelBooking = async (bookingId: number) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking.mutateAsync(bookingId);
            } catch (error) {
                console.error('Failed to cancel booking:', error);
            }
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        try {
            return format(new Date(dateTimeString), 'MMM dd, yyyy HH:mm');
        } catch {
            return dateTimeString;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-600 mt-2">Manage your bike rentals and bookings</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
                    <button
                        onClick={() => setActiveTab('my-bookings')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'my-bookings'
                                ? 'bg-white text-rose-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        My Rentals
                    </button>
                    <button
                        onClick={() => setActiveTab('bike-bookings')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'bike-bookings'
                                ? 'bg-white text-rose-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        My Bike Bookings
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Filter by status:</span>
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value as BookingStatus | 'all')}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="requested">Requested</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="h-8 w-8 animate-spin text-rose-500" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredBookings.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-600">
                            {activeTab === 'my-bookings'
                                ? "You haven't made any bookings yet."
                                : 'No one has booked your bikes yet.'}
                        </p>
                    </div>
                )}

                {/* Bookings List */}
                {!isLoading && filteredBookings.length > 0 && (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <Card key={booking.id} className="overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{booking.bike.title}</CardTitle>
                                            <div className="flex items-center text-gray-600 mt-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {booking.bike.location}
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(booking.status)}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <div>
                                                <div>Start: {formatDateTime(booking.start_time)}</div>
                                                <div>End: {formatDateTime(booking.end_time)}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="h-4 w-4 mr-2" />
                                            <div>
                                                {activeTab === 'my-bookings' ? (
                                                    <div>
                                                        <div>
                                                            Owner: {booking.bike.owner.first_name}{' '}
                                                            {booking.bike.owner.last_name}
                                                        </div>
                                                        <div className="text-xs">{booking.bike.owner.email}</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div>
                                                            Renter: {booking.renter.first_name}{' '}
                                                            {booking.renter.last_name}
                                                        </div>
                                                        <div className="text-xs">{booking.renter.email}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <div>
                                                <div className="font-semibold text-lg text-gray-900">
                                                    ${parseFloat(booking.total_price).toFixed(2)}
                                                </div>
                                                <div className="text-xs">Total Price</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bike Images */}
                                    {booking.bike.images && booking.bike.images.length > 0 && (
                                        <div className="flex gap-2 mb-4">
                                            {booking.bike.images.slice(0, 3).map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.image_url || image.image}
                                                    alt={image.alt_text || booking.bike.title}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {canCancelBooking(booking.status) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCancelBooking(booking.id)}
                                                disabled={cancelBooking.isPending}
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                {cancelBooking.isPending ? 'Cancelling...' : 'Cancel Booking'}
                                            </Button>
                                        )}

                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
