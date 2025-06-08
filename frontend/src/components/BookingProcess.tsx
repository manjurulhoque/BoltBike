import { useState } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCreateBooking } from '@/hooks/useBookings';

interface BookingProcessProps {
    bikeId: number;
    bikeTitle: string;
    hourlyRate?: number;
    dailyRate: number;
    onClose: () => void;
    onSuccess?: (bookingId: number) => void;
}

const BookingProcess = ({ bikeId, bikeTitle, hourlyRate, dailyRate, onClose, onSuccess }: BookingProcessProps) => {
    const [step, setStep] = useState(1);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [bookingData, setBookingData] = useState({
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '18:00',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
    });
    const { toast } = useToast();
    const createBooking = useCreateBooking();

    const calculateDuration = () => {
        if (!bookingData.startDate || !bookingData.endDate || !bookingData.startTime || !bookingData.endTime) {
            return { days: 0, hours: 0, totalHours: 0 };
        }

        const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
        const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);
        const diffTime = endDateTime.getTime() - startDateTime.getTime();
        const totalHours = diffTime / (1000 * 60 * 60);
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;

        return {
            days: Math.max(0, days),
            hours: Math.max(0, hours),
            totalHours: Math.max(1, totalHours), // Minimum 1 hour
        };
    };

    const calculatePrice = () => {
        const duration = calculateDuration();

        // If booking is 24+ hours, use daily rate, otherwise use hourly rate
        if (duration.totalHours >= 24) {
            const totalDays = Math.ceil(duration.totalHours / 24);
            return totalDays * dailyRate;
        } else {
            const hourlyPrice = hourlyRate || dailyRate / 24; // Fallback to daily rate / 24 if no hourly rate
            return Math.ceil(duration.totalHours) * hourlyPrice;
        }
    };

    const totalAmount = calculatePrice();
    const serviceFee = 15;
    const finalTotal = totalAmount + serviceFee;

    const handleInputChange = (field: string, value: string) => {
        setBookingData((prev) => ({ ...prev, [field]: value }));
    };

    const validateDateTimeSelection = () => {
        if (!bookingData.startDate || !bookingData.endDate || !bookingData.startTime || !bookingData.endTime) {
            return false;
        }

        const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
        const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);

        // Check if start time is in the future
        if (startDateTime <= new Date()) {
            toast({
                title: 'Invalid Start Time',
                description: 'Start time must be in the future.',
                variant: 'destructive',
            });
            return false;
        }

        // Check if end time is after start time
        if (endDateTime <= startDateTime) {
            toast({
                title: 'Invalid End Time',
                description: 'End time must be after start time.',
                variant: 'destructive',
            });
            return false;
        }

        // Check minimum duration (1 hour)
        const duration = calculateDuration();
        if (duration.totalHours < 1) {
            toast({
                title: 'Minimum Duration',
                description: 'Minimum booking duration is 1 hour.',
                variant: 'destructive',
            });
            return false;
        }

        return true;
    };

    const handleNextStep = () => {
        if (step === 1 && !validateDateTimeSelection()) {
            return;
        }

        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleSubmitBooking = async () => {
        try {
            // Create ISO datetime strings for start and end times
            const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
            const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);

            const bookingPayload = {
                bike_id: bikeId,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
            };

            const response = await createBooking.mutateAsync(bookingPayload);

            if (response.data) {
                setBookingId(response.data.id);
            }

            setStep(4);

            // Call success callback if provided
            if (onSuccess && response.data) {
                onSuccess(response.data.id);
            }
        } catch (error) {
            // Error is already handled by the useCreateBooking hook
            console.error('Booking submission failed:', error);
        }
    };

    const steps = [
        { number: 1, title: 'Dates & Time', icon: Calendar },
        { number: 2, title: 'Payment', icon: CreditCard },
        { number: 3, title: 'Review', icon: Clock },
        { number: 4, title: 'Confirmed', icon: CheckCircle },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Book {bikeTitle}</CardTitle>
                        <Button variant="ghost" onClick={onClose}>
                            ×
                        </Button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mt-4">
                        {steps.map((stepItem, index) => (
                            <div key={stepItem.number} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                        step >= stepItem.number
                                            ? 'bg-rose-500 border-rose-500 text-white'
                                            : 'border-gray-300 text-gray-400'
                                    }`}
                                >
                                    <stepItem.icon className="h-5 w-5" />
                                </div>
                                <span
                                    className={`ml-2 text-sm ${
                                        step >= stepItem.number ? 'text-rose-500 font-medium' : 'text-gray-400'
                                    }`}
                                >
                                    {stepItem.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-12 h-0.5 mx-4 ${
                                            step > stepItem.number ? 'bg-rose-500' : 'bg-gray-300'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Step 1: Dates & Time */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Select Dates & Time</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={bookingData.startDate}
                                        min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={bookingData.endDate}
                                        min={
                                            bookingData.startDate ||
                                            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                        }
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="startTime">Start Time</Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        value={bookingData.startTime}
                                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        value={bookingData.endTime}
                                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <span>
                                        Duration:{' '}
                                        {calculateDuration().totalHours < 24
                                            ? `${Math.ceil(calculateDuration().totalHours)} hour(s)`
                                            : `${Math.ceil(calculateDuration().totalHours / 24)} day(s)`}
                                    </span>
                                    <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleNextStep}
                                className="w-full"
                                disabled={!bookingData.startDate || !bookingData.endDate}
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Payment Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="nameOnCard">Name on Card</Label>
                                    <Input
                                        id="nameOnCard"
                                        placeholder="John Doe"
                                        value={bookingData.nameOnCard}
                                        onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={bookingData.cardNumber}
                                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiryDate">Expiry Date</Label>
                                        <Input
                                            id="expiryDate"
                                            placeholder="MM/YY"
                                            value={bookingData.expiryDate}
                                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            placeholder="123"
                                            value={bookingData.cvv}
                                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleNextStep}
                                className="w-full"
                                disabled={!bookingData.nameOnCard || !bookingData.cardNumber}
                            >
                                Review Booking
                            </Button>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Review Your Booking</h3>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between">
                                    <span>E-bike:</span>
                                    <span className="font-medium">{bikeTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Dates:</span>
                                    <span>
                                        {bookingData.startDate} to {bookingData.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span>
                                        {calculateDuration().totalHours < 24
                                            ? `${Math.ceil(calculateDuration().totalHours)} hour(s)`
                                            : `${Math.ceil(calculateDuration().totalHours / 24)} day(s)`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Service Fee:</span>
                                    <span>${serviceFee}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total:</span>
                                    <span>${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleSubmitBooking}
                                className="w-full bg-rose-500 hover:bg-rose-600"
                                disabled={createBooking.isPending}
                            >
                                {createBooking.isPending ? (
                                    <>
                                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <div className="text-center space-y-4">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <h3 className="text-xl font-semibold text-green-600">Booking Confirmed!</h3>
                            <p className="text-gray-600">
                                Your e-bike has been successfully booked. You'll receive a confirmation email shortly.
                            </p>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-700">Booking ID: #{bookingId || 'PENDING'}</p>
                            </div>
                            <Button onClick={onClose} className="w-full">
                                Close
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingProcess;
