import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePasswordResetRequest } from '@/hooks/auth/useAuth';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const passwordResetRequest = usePasswordResetRequest();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await passwordResetRequest.mutateAsync({ email });
            setIsSubmitted(true);
            toast.success('Password reset instructions sent!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <Link to="/" className="text-3xl font-bold text-rose-500">
                            eBikeRent
                        </Link>
                        <div className="mt-8">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                We've sent password reset instructions to <strong>{email}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white py-8 px-6 shadow rounded-lg">
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">Next steps:</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Check your email inbox (and spam folder)</li>
                                    <li>• Click the reset link in the email</li>
                                    <li>• Create a new password</li>
                                    <li>• Sign in with your new password</li>
                                </ul>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600 mb-4">Didn't receive the email?</p>
                                <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mb-4">
                                    Try again
                                </Button>
                            </div>

                            <div className="text-center border-t pt-4">
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center text-sm font-medium text-rose-600 hover:text-rose-500"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link to="/" className="text-3xl font-bold text-rose-500">
                        eBikeRent
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Forgot your password?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        No worries! Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    placeholder="Enter your email"
                                    required
                                    disabled={passwordResetRequest.isPending}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-rose-500 hover:bg-rose-600"
                            disabled={passwordResetRequest.isPending || !email}
                        >
                            {passwordResetRequest.isPending ? 'Sending...' : 'Send reset instructions'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="flex items-center justify-center text-sm font-medium text-rose-600 hover:text-rose-500"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
