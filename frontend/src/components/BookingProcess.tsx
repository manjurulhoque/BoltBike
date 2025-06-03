import { useState } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface BookingProcessProps {
    bikeId: string;
    bikeTitle: string;
    pricePerDay: number;
    onClose: () => void;
}

const BookingProcess = ({ bikeId, bikeTitle, pricePerDay, onClose }: BookingProcessProps) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingData, setBookingData] = useState({
        startDate: '',
        endDate: '',
        pickupTime: '09:00',
        returnTime: '18:00',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
    });
    const { toast } = useToast();

    const calculateDays = () => {
        if (!bookingData.startDate || !bookingData.endDate) return 0;
        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    };

    const totalAmount = calculateDays() * pricePerDay;
    const serviceFee = 15;
    const finalTotal = totalAmount + serviceFee;

    const handleInputChange = (field: string, value: string) => {
        setBookingData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleSubmitBooking = async () => {
        setIsLoading(true);

        // Simulate booking process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsLoading(false);
        setStep(4);

        toast({
            title: 'Booking Confirmed!',
            description: `Your e-bike "${bikeTitle}" has been successfully booked.`,
        });
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
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={bookingData.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="pickupTime">Pickup Time</Label>
                                    <Input
                                        id="pickupTime"
                                        type="time"
                                        value={bookingData.pickupTime}
                                        onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="returnTime">Return Time</Label>
                                    <Input
                                        id="returnTime"
                                        type="time"
                                        value={bookingData.returnTime}
                                        onChange={(e) => handleInputChange('returnTime', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <span>Duration: {calculateDays()} day(s)</span>
                                    <span className="font-semibold">${totalAmount}</span>
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
                                    <span>{calculateDays()} day(s)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Service Fee:</span>
                                    <span>${serviceFee}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total:</span>
                                    <span>${finalTotal}</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleSubmitBooking}
                                className="w-full bg-rose-500 hover:bg-rose-600"
                                disabled={isLoading}
                            >
                                {isLoading ? (
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
                                <p className="text-sm text-green-700">
                                    Booking ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                </p>
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
