import { useState } from 'react';
import { Upload, Plus, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { BikeType, CreateBikeData } from '@/lib/types/bike';
import { useCreateBike } from '@/hooks/useBikes';
import { BIKE_TYPES } from '@/lib/constants/bike';

const ListBike = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        bike_type: 'city' as BikeType,
        batteryRange: '',
        maxSpeed: '',
        weight: '',
        features: [] as string[],
    });
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [newFeature, setNewFeature] = useState('');

    const createBikeMutation = useCreateBike();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, bike_type: value as BikeType }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const urls = files.map((file) => URL.createObjectURL(file));
            setImages((prev) => [...prev, ...urls]);
            setImageFiles((prev) => [...prev, ...files]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
        });
        setImageFiles((prev) => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const addFeature = () => {
        if (newFeature && !formData.features.includes(newFeature)) {
            setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature] }));
            setNewFeature('');
        }
    };

    const removeFeature = (featureToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((feature) => feature !== featureToRemove),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare the bike data
        const bikeData: CreateBikeData = {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            daily_rate: parseFloat(formData.price),
            bike_type: formData.bike_type,
            battery_range: parseInt(formData.batteryRange),
            max_speed: parseInt(formData.maxSpeed),
            weight: parseFloat(formData.weight),
            features: formData.features,
            image_files: imageFiles.length > 0 ? imageFiles : undefined,
        };

        // Create the bike using mutation
        createBikeMutation.mutate(bikeData, {
            onSuccess: () => {
                // Reset form on success
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    location: '',
                    bike_type: 'city' as BikeType,
                    batteryRange: '',
                    maxSpeed: '',
                    weight: '',
                    features: [] as string[],
                });
                setImages([]);
                setImageFiles([]);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">List Your E-Bike</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <section className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Bike Title</Label>
                                <Input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter bike title"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="price">Price per Day</Label>
                                <Input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter price per day"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter bike description"
                                rows={4}
                                required
                            />
                        </div>
                    </section>

                    {/* Location and Type */}
                    <section className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Location and Type</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Enter location"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="type">Bike Type</Label>
                                <Select onValueChange={handleSelectChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a type" />
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
                        </div>
                    </section>

                    {/* Specifications */}
                    <section className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="batteryRange">Battery Range (km)</Label>
                                <Input
                                    type="number"
                                    id="batteryRange"
                                    name="batteryRange"
                                    value={formData.batteryRange}
                                    onChange={handleInputChange}
                                    placeholder="Enter battery range"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxSpeed">Max Speed (km/h)</Label>
                                <Input
                                    type="number"
                                    id="maxSpeed"
                                    name="maxSpeed"
                                    value={formData.maxSpeed}
                                    onChange={handleInputChange}
                                    placeholder="Enter max speed"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    placeholder="Enter weight"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                        <div className="flex items-center mb-2">
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
                    </section>

                    {/* Images */}
                    <section className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
                        <Label
                            htmlFor="imageUpload"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Upload Images
                        </Label>
                        <Input
                            type="file"
                            id="imageUpload"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mb-4"
                        />
                        <div className="flex flex-wrap gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative w-32 h-32 rounded-md overflow-hidden">
                                    <img
                                        src={image}
                                        alt={`Uploaded bike ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" type="button">
                            Save as Draft
                        </Button>
                        <Button
                            type="submit"
                            className="bg-rose-500 hover:bg-rose-600"
                            disabled={createBikeMutation.isPending}
                        >
                            {createBikeMutation.isPending ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                'Publish Bike'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListBike;
