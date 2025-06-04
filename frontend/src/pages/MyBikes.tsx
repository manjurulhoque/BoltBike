import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { useMyBikes, useDeleteBike, useToggleBikeStatus } from '@/hooks/useBikes';
import { getBikeStatusColor, getBikeStatusLabel, getBikeTypeLabel } from '@/lib/constants/bike';

const MyBikes = () => {
    const { data: myBikesResponse, isLoading, error } = useMyBikes();
    const deleteBikeMutation = useDeleteBike();
    const toggleStatusMutation = useToggleBikeStatus();
    const bikes = myBikesResponse?.data?.results || [];

    const handleToggleStatus = (bikeId: number) => {
        toggleStatusMutation.mutate(bikeId);
    };

    const handleDeleteBike = (bikeId: number) => {
        deleteBikeMutation.mutate(bikeId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center py-12">
                        <Loader className="h-8 w-8 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">Loading your bikes...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Bikes</h1>
                        <p className="text-gray-600 mt-2">Manage your e-bike listings</p>
                    </div>
                    <Link to="/list-bike">
                        <Button className="bg-rose-500 hover:bg-rose-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Bike
                        </Button>
                    </Link>
                </div>

                {bikes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bikes listed yet</h3>
                        <p className="text-gray-600 mb-6">Start earning by listing your first e-bike!</p>
                        <Link to="/list-bike">
                            <Button className="bg-rose-500 hover:bg-rose-600">
                                <Plus className="h-4 w-4 mr-2" />
                                List Your First Bike
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bikes.map((bike) => (
                            <Card key={bike.id} className="overflow-hidden">
                                <div className="relative">
                                    {bike.images.length > 0 ? (
                                        <img
                                            src={
                                                bike.images.find((img) => img.is_primary)?.image_url ||
                                                bike.images[0]?.image_url
                                            }
                                            alt={bike.images.find((img) => img.is_primary)?.alt_text || bike.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No image</span>
                                        </div>
                                    )}
                                    <Badge className={`absolute top-2 right-2 ${getBikeStatusColor(bike.status)}`}>
                                        {getBikeStatusLabel(bike.status as any)}
                                    </Badge>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-lg">{bike.title}</CardTitle>
                                    <div className="flex justify-between items-center text-sm text-gray-600">
                                        <span>{bike.location}</span>
                                        <span className="font-semibold text-lg text-gray-900">
                                            ${bike.daily_rate}/day
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                        <div>
                                            <span className="text-gray-500">Type:</span>
                                            <span className="ml-1 font-medium">{getBikeTypeLabel(bike.bike_type as any)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Range:</span>
                                            <span className="ml-1 font-medium">{bike.battery_range}km</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Max Speed:</span>
                                            <span className="ml-1 font-medium">{bike.max_speed}km/h</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Weight:</span>
                                            <span className="ml-1 font-medium">{bike.weight}kg</span>
                                        </div>
                                    </div>

                                    {bike.features.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {bike.features.slice(0, 3).map((feature, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                                {bike.features.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{bike.features.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <Link to={`/bikes/${bike.id}`}>
                                                <Button variant="outline" size="sm" title="View bike details">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link to={`/edit-bike/${bike.id}`}>
                                                <Button variant="outline" size="sm" title="Edit bike details">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={deleteBikeMutation.isPending}
                                                        title="Delete bike"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Bike</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{bike.title}"? This action
                                                            cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteBike(bike.id)}
                                                            className="bg-red-500 hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleStatus(bike.id)}
                                            disabled={toggleStatusMutation.isPending}
                                            className="flex items-center space-x-1"
                                        >
                                            {toggleStatusMutation.isPending ? (
                                                <Loader className="h-4 w-4 animate-spin" />
                                            ) : bike.status === 'available' ? (
                                                <ToggleRight className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                            )}
                                            <span className="text-xs">
                                                {bike.status === 'available' ? 'Available' : 'Unavailable'}
                                            </span>
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

export default MyBikes;
