import { User, Heart, Calendar, Star, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useLogout } from '@/hooks/auth/useAuth';

interface UserDropdownProps {
    showChevron?: boolean;
    showName?: boolean;
    variant?: 'default' | 'compact';
    align?: 'start' | 'center' | 'end';
}

const UserDropdown = ({
    showChevron = true,
    showName = true,
    variant = 'default',
    align = 'end',
}: UserDropdownProps) => {
    const { data: user, isLoading } = useUser();
    const logout = useLogout();

    const handleLogout = () => {
        logout();
    };

    if (isLoading) {
        return <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-transparent animate-spin"></div>;
    }

    if (!user) {
        return (
            <div className="flex items-center space-x-2">
                <Link to="/login">
                    <Button variant="ghost" className="text-sm font-medium">
                        Log in
                    </Button>
                </Link>
                <Link to="/signup">
                    <Button className="bg-rose-500 hover:bg-rose-600 text-sm">Sign up</Button>
                </Link>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`flex items-center gap-2 ${variant === 'compact' ? 'p-2' : ''}`}>
                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    {showName && (
                        <span className="hidden md:block text-sm font-medium">{user.first_name || 'Account'}</span>
                    )}
                    {showChevron && <ChevronDown className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link to="/my-bikes" className="cursor-pointer">
                        <Heart className="h-4 w-4 mr-2" />
                        My Bikes
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link to="/bookings" className="cursor-pointer">
                        <Calendar className="h-4 w-4 mr-2" />
                        Bookings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link to="/reviews" className="cursor-pointer">
                        <Star className="h-4 w-4 mr-2" />
                        Reviews
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link to="/favorites" className="cursor-pointer">
                        <Heart className="h-4 w-4 mr-2" />
                        Favorites
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
