import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePasswordResetConfirm } from '@/hooks/auth/useAuth';
import { toast } from 'sonner';

const ResetPassword = () => {
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        new_password_confirm: '',
    });

    const passwordResetConfirm = usePasswordResetConfirm();

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uid || !token) {
            toast.error('Invalid reset link');
            return;
        }

        if (formData.new_password !== formData.new_password_confirm) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            await passwordResetConfirm.mutateAsync({
                uid,
                token,
                ...formData,
            });
            setIsSuccess(true);
            toast.success('Password reset successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to reset password');
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <Link to="/" className="text-3xl font-bold text-rose-500">
                            eBikeRent
                        </Link>
                        <div className="mt-8">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <h2 className="mt-6 text-3xl font-bold text-gray-900">Password reset successful!</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Your password has been successfully updated. You can now sign in with your new password.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white py-8 px-6 shadow rounded-lg">
                        <div className="text-center">
                            <Link to="/login">
                                <Button className="w-full bg-rose-500 hover:bg-rose-600">
                                    Sign in to your account
                                </Button>
                            </Link>
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
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Create new password</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below. Make sure it's strong and secure.
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="new_password">New Password</Label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="new_password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.new_password}
                                    onChange={(e) => handleInputChange('new_password', e.target.value)}
                                    className="pl-10 pr-10"
                                    placeholder="Enter new password"
                                    required
                                    disabled={passwordResetConfirm.isPending}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={passwordResetConfirm.isPending}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="new_password_confirm">Confirm New Password</Label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="new_password_confirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.new_password_confirm}
                                    onChange={(e) => handleInputChange('new_password_confirm', e.target.value)}
                                    className="pl-10 pr-10"
                                    placeholder="Confirm new password"
                                    required
                                    disabled={passwordResetConfirm.isPending}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={passwordResetConfirm.isPending}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password requirements */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-800 mb-2">Password requirements:</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• At least 8 characters long</li>
                                <li>• Contains uppercase and lowercase letters</li>
                                <li>• Contains at least one number</li>
                                <li>• Contains at least one special character</li>
                            </ul>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-rose-500 hover:bg-rose-600"
                            disabled={
                                passwordResetConfirm.isPending ||
                                !formData.new_password ||
                                !formData.new_password_confirm ||
                                formData.new_password !== formData.new_password_confirm
                            }
                        >
                            {passwordResetConfirm.isPending ? 'Updating password...' : 'Update password'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm font-medium text-rose-600 hover:text-rose-500">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
