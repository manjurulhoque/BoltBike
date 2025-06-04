import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/auth/useAuth';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { data: user, isLoading, error } = useUser();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If there's an error or no user, redirect to login
    if (error || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the protected component
    return <>{children}</>;
};

export default ProtectedRoute;
