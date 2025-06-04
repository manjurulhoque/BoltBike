import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader, X, ArrowLeft, Save, Plus, Upload, Trash2, Star } from 'lucide-react';
import Header from '@/components/Header';
import { useBike, useUpdateBike } from '@/hooks/useBikes';
import { BikeType, BikeStatus, UpdateBikeData, BikeImage } from '@/lib/types/bike';
import { BIKE_TYPES, BIKE_STATUSES } from '@/lib/constants/bike';
import { toast } from 'sonner';

const EditBike = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const bikeId = parseInt(id || '0');

    const { data: bikeResponse, isLoading: isBikeLoading, error } = useBike(bikeId);
    const bike = bikeResponse?.data;
    const updateBikeMutation = useUpdateBike();

    // Form state
    const [formData, setFormData] = useState<UpdateBikeData>({
        title: '',
        description: '',
        location: '',
        hourly_rate: undefined,
        daily_rate: 0,
        bike_type: 'city',
        battery_range: 0,
        max_speed: 0,
        weight: 0,
        features: [],
        status: 'available',
    });

    const [newFeature, setNewFeature] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Image management state
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [primaryImageId, setPrimaryImageId] = useState<number | undefined>();

    // Initialize form data when bike loads
    useEffect(() => {
        if (bike) {
            setFormData({
                title: bike.title,
                description: bike.description,
                location: bike.location,
                hourly_rate: bike.hourly_rate,
                daily_rate: bike.daily_rate,
                bike_type: bike.bike_type,
                battery_range: bike.battery_range,
                max_speed: bike.max_speed,
                weight: bike.weight,
                features: [...bike.features],
                status: bike.status,
            });
        }
    }, [bike]);

    const handleInputChange = (field: keyof UpdateBikeData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const addFeature = () => {
        if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
            setFormData((prev) => ({
                ...prev,
                features: [...(prev.features || []), newFeature.trim()],
            }));
            setNewFeature('');
        }
    };

    const removeFeature = (feature: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features?.filter((f) => f !== feature) || [],
        }));
    };

    // Image management functions
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleImageForDeletion = (imageId: number) => {
        setImagesToDelete((prev) => {
            if (prev.includes(imageId)) {
                return prev.filter((id) => id !== imageId);
            } else {
                return [...prev, imageId];
            }
        });
    };

    const setPrimaryImage = (imageId: number) => {
        setPrimaryImageId(imageId);
        // Remove from delete list if it was marked for deletion
        setImagesToDelete((prev) => prev.filter((id) => id !== imageId));
    };

    const getAvailableImages = () => {
        return bike?.images.filter((img) => !imagesToDelete.includes(img.id || 0)) || [];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updateData: UpdateBikeData = {
                ...formData,
                hourly_rate: formData.hourly_rate || undefined,
            };

            // Add image management data
            if (selectedFiles.length > 0) {
                updateData.image_files = selectedFiles;
            }
            if (imagesToDelete.length > 0) {
                updateData.delete_image_ids = imagesToDelete;
            }
            if (primaryImageId) {
                updateData.primary_image_id = primaryImageId;
            }

            await updateBikeMutation.mutateAsync({
                id: bikeId,
                data: updateData,
            });

            toast.success('Bike updated successfully!');
            navigate('/my-bikes');
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update bike. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isBikeLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center py-12">
                        <Loader className="h-8 w-8 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">Loading bike information...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !bike) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bike Not Found</h2>
                        <p className="text-gray-600 mb-6">The bike you're trying to edit could not be found.</p>
                        <Button onClick={() => navigate('/my-bikes')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to My Bikes
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Bike</h1>
                        <p className="text-gray-600 mt-2">Update your e-bike listing information</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/my-bikes')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to My Bikes
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Bike Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="e.g., Urban Commuter E-bike"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        placeholder="e.g., New York, NY"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe your e-bike's condition, special features, and any important details..."
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="bike_type">Bike Type *</Label>
                                    <Select
                                        value={formData.bike_type}
                                        onValueChange={(value: BikeType) => handleInputChange('bike_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select bike type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BIKE_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: BikeStatus) => handleInputChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BIKE_STATUSES.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                                    <Input
                                        id="hourly_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.hourly_rate || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'hourly_rate',
                                                e.target.value ? parseFloat(e.target.value) : undefined,
                                            )
                                        }
                                        placeholder="Optional hourly rate"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="daily_rate">Daily Rate ($) *</Label>
                                    <Input
                                        id="daily_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.daily_rate}
                                        onChange={(e) =>
                                            handleInputChange('daily_rate', parseFloat(e.target.value) || 0)
                                        }
                                        placeholder="Daily rental rate"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="battery_range">Battery Range (km) *</Label>
                                    <Input
                                        id="battery_range"
                                        type="number"
                                        min="0"
                                        value={formData.battery_range}
                                        onChange={(e) =>
                                            handleInputChange('battery_range', parseInt(e.target.value) || 0)
                                        }
                                        placeholder="e.g., 80"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="max_speed">Max Speed (km/h) *</Label>
                                    <Input
                                        id="max_speed"
                                        type="number"
                                        min="0"
                                        value={formData.max_speed}
                                        onChange={(e) => handleInputChange('max_speed', parseInt(e.target.value) || 0)}
                                        placeholder="e.g., 25"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="weight">Weight (kg) *</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={formData.weight}
                                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                                        placeholder="e.g., 22.5"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center mb-2">
                                {/* <Input
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="Add a feature (e.g., GPS, USB charging)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                /> */}
                                <Input
                                    type="text"
                                    placeholder="Enter a feature"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    className="mr-2"
                                />
                                <Button type="button" onClick={addFeature} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Feature
                                </Button>
                            </div>

                            {formData.features && formData.features.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.features.map((feature, index) => (
                                        <Badge key={index} className="flex items-center space-x-1">
                                            {feature}
                                            <button onClick={() => removeFeature(feature)}>
                                                <X className="h-4 w-4" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Image Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Image Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Current Images */}
                            {bike && bike.images.length > 0 && (
                                <div>
                                    <Label className="text-base font-medium">Current Images</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                                        {bike.images.map((image) => (
                                            <div
                                                key={image.id}
                                                className={`relative border-2 rounded-lg overflow-hidden ${
                                                    imagesToDelete.includes(image.id || 0)
                                                        ? 'border-red-300 bg-red-50'
                                                        : image.is_primary
                                                        ? 'border-yellow-400 bg-yellow-50'
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                <img
                                                    src={image.image_url || '/placeholder.svg'}
                                                    alt={image.alt_text || 'Bike image'}
                                                    className={`w-full h-32 object-cover ${
                                                        imagesToDelete.includes(image.id || 0) ? 'opacity-50' : ''
                                                    }`}
                                                />

                                                {/* Primary badge */}
                                                {image.is_primary && !imagesToDelete.includes(image.id || 0) && (
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-yellow-500 text-white text-xs">
                                                            <Star className="h-3 w-3 mr-1" />
                                                            Primary
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Action buttons */}
                                                <div className="absolute top-2 right-2 flex space-x-1">
                                                    {!imagesToDelete.includes(image.id || 0) && !image.is_primary && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="secondary"
                                                            className="h-6 w-6 p-1"
                                                            onClick={() => setPrimaryImage(image.id || 0)}
                                                            title="Set as primary"
                                                        >
                                                            <Star className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={
                                                            imagesToDelete.includes(image.id || 0)
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                        className="h-6 w-6 p-1"
                                                        onClick={() => toggleImageForDeletion(image.id || 0)}
                                                        title={
                                                            imagesToDelete.includes(image.id || 0)
                                                                ? 'Cancel deletion'
                                                                : 'Mark for deletion'
                                                        }
                                                    >
                                                        {imagesToDelete.includes(image.id || 0) ? (
                                                            <X className="h-3 w-3" />
                                                        ) : (
                                                            <Trash2 className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload New Images */}
                            <div>
                                <Label htmlFor="new-images" className="text-base font-medium">
                                    Add New Images
                                </Label>
                                <div className="mt-2">
                                    <Input
                                        id="new-images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="mb-2"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Select multiple images to upload. Supported formats: JPG, PNG, GIF, WebP, AVIF
                                    </p>
                                </div>
                            </div>

                            {/* Selected Files Preview */}
                            {selectedFiles.length > 0 && (
                                <div>
                                    <Label className="text-base font-medium">New Images to Upload</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative border-2 border-green-300 bg-green-50 rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`New upload ${index + 1}`}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <div className="absolute top-2 left-2">
                                                    <Badge className="bg-green-500 text-white text-xs">
                                                        <Upload className="h-3 w-3 mr-1" />
                                                        New
                                                    </Badge>
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute top-2 right-2 h-6 w-6 p-1"
                                                    onClick={() => removeSelectedFile(index)}
                                                    title="Remove from upload"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Image Management Summary */}
                            {(imagesToDelete.length > 0 || selectedFiles.length > 0 || primaryImageId) && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">Changes Summary:</h4>
                                    <ul className="space-y-1 text-sm text-blue-800">
                                        {imagesToDelete.length > 0 && (
                                            <li>• {imagesToDelete.length} image(s) will be deleted</li>
                                        )}
                                        {selectedFiles.length > 0 && (
                                            <li>• {selectedFiles.length} new image(s) will be uploaded</li>
                                        )}
                                        {primaryImageId && <li>• Primary image will be updated</li>}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/my-bikes')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || updateBikeMutation.isPending}
                            className="bg-rose-500 hover:bg-rose-600"
                        >
                            {isSubmitting || updateBikeMutation.isPending ? (
                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Update Bike
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBike;
