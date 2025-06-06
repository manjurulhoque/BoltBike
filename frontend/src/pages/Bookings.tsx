import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Filter, Loader, Eye, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Header from '@/components/Header';
import { useMyBookings, useBikeBookings, useCancelBooking, useUpdateBookingStatus } from '@/hooks/useBookings';
import { BookingStatus, Booking } from '@/lib/types/booking';
import { format } from 'date-fns';

const Bookings = () => {
    const [activeTab, setActiveTab] = useState<'my-bookings' | 'bike-bookings'>('my-bookings');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

    // Modal states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    // Fetch bookings based on active tab
    const { data: myBookingsResponse, isLoading: myBookingsLoading } = useMyBookings();
    const { data: bikeBookingsResponse, isLoading: bikeBookingsLoading } = useBikeBookings();
    const cancelBooking = useCancelBooking();
    const updateBookingStatus = useUpdateBookingStatus();

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

    const canAcceptBooking = (booking: Booking) => {
        return booking.status === 'requested' && activeTab === 'bike-bookings';
    };

    const handleCancelBooking = async () => {
        if (selectedBooking) {
            try {
                await cancelBooking.mutateAsync(selectedBooking.id);
                setShowCancelModal(false);
                setSelectedBooking(null);
            } catch (error) {
                console.error('Failed to cancel booking:', error);
            }
        }
    };

    const handleAcceptBooking = async (bookingId: number) => {
        try {
            await updateBookingStatus.mutateAsync({
                id: bookingId,
                data: { status: 'approved' },
            });
        } catch (error) {
            console.error('Failed to accept booking:', error);
        }
    };

    const openCancelModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const openDetailsModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
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
                                        {canAcceptBooking(booking) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAcceptBooking(booking.id)}
                                                disabled={updateBookingStatus.isPending}
                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                {updateBookingStatus.isPending ? 'Accepting...' : 'Accept Booking'}
                                            </Button>
                                        )}

                                        {canCancelBooking(booking.status) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openCancelModal(booking)}
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <X className="h-4 w-4 mr-1" />
                                                Cancel
                                            </Button>
                                        )}

                                        <Button variant="outline" size="sm" onClick={() => openDetailsModal(booking)}>
                                            <Eye className="h-4 w-4 mr-1" />
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Cancel Confirmation Modal */}
                <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Cancel Booking
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to cancel this booking? This action cannot be undone.
                            </p>
                            {selectedBooking && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-medium">{selectedBooking.bike.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {formatDateTime(selectedBooking.start_time)} -{' '}
                                        {formatDateTime(selectedBooking.end_time)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Total: ${parseFloat(selectedBooking.total_price).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelModal(false)}
                                disabled={cancelBooking.isPending}
                            >
                                Keep Booking
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleCancelBooking}
                                disabled={cancelBooking.isPending}
                            >
                                {cancelBooking.isPending ? (
                                    <>
                                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    'Cancel Booking'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Booking Details Modal */}
                <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                        </DialogHeader>
                        {selectedBooking && (
                            <div className="space-y-6">
                                {/* Bike Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Bike Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-start gap-4">
                                            {selectedBooking.bike.images && selectedBooking.bike.images.length > 0 && (
                                                <img
                                                    src={
                                                        selectedBooking.bike.images[0].image_url ||
                                                        selectedBooking.bike.images[0].image
                                                    }
                                                    alt={selectedBooking.bike.title}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-medium">{selectedBooking.bike.title}</h4>
                                                <div className="flex items-center text-gray-600 mt-1">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {selectedBooking.bike.location}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    {selectedBooking.bike.description}
                                                </p>
                                                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                    <span>Daily Rate: ${selectedBooking.bike.daily_rate}</span>
                                                    {selectedBooking.bike.hourly_rate && (
                                                        <span>Hourly Rate: ${selectedBooking.bike.hourly_rate}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Booking Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">Booking ID</p>
                                            <p className="font-semibold">#{selectedBooking.id}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">Status</p>
                                            <Badge className={getStatusColor(selectedBooking.status)}>
                                                {selectedBooking.status.charAt(0).toUpperCase() +
                                                    selectedBooking.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">Start Time</p>
                                            <p className="font-semibold">
                                                {formatDateTime(selectedBooking.start_time)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">End Time</p>
                                            <p className="font-semibold">{formatDateTime(selectedBooking.end_time)}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">Total Price</p>
                                            <p className="font-semibold text-lg">
                                                ${parseFloat(selectedBooking.total_price).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">Created At</p>
                                            <p className="font-semibold">
                                                {formatDateTime(selectedBooking.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        {activeTab === 'my-bookings' ? 'Bike Owner' : 'Renter'} Contact
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        {activeTab === 'my-bookings' ? (
                                            <div>
                                                <p className="font-medium">
                                                    {selectedBooking.bike.owner.first_name}{' '}
                                                    {selectedBooking.bike.owner.last_name}
                                                </p>
                                                <p className="text-gray-600">{selectedBooking.bike.owner.email}</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium">
                                                    {selectedBooking.renter.first_name}{' '}
                                                    {selectedBooking.renter.last_name}
                                                </p>
                                                <p className="text-gray-600">{selectedBooking.renter.email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons in Modal */}
                                <div className="flex justify-between pt-4 border-t">
                                    <div className="flex gap-2">
                                        {canAcceptBooking(selectedBooking) && (
                                            <Button
                                                onClick={() => {
                                                    handleAcceptBooking(selectedBooking.id);
                                                    setShowDetailsModal(false);
                                                }}
                                                disabled={updateBookingStatus.isPending}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Accept Booking
                                            </Button>
                                        )}

                                        {canCancelBooking(selectedBooking.status) && (
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    setShowDetailsModal(false);
                                                    openCancelModal(selectedBooking);
                                                }}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Cancel Booking
                                            </Button>
                                        )}
                                    </div>

                                    <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Bookings;
