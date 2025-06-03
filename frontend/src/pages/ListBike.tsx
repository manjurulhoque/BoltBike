import { useState } from 'react';
import { Upload, Plus, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const ListBike = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        type: '',
        batteryRange: '',
        maxSpeed: '',
        weight: '',
        features: [],
    });
    const [images, setImages] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState('');
    const bikeTypes = ['City', 'Mountain', 'Road', 'Cargo', 'Folding', 'Hybrid'];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, type: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const urls = files.map((file) => URL.createObjectURL(file));
            setImages((prev) => [...prev, ...urls]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
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
        setIsSubmitting(true);

        // Simulate API submission
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsSubmitting(false);

        toast({
            title: 'Bike Listed Successfully!',
            description: 'Your e-bike has been added to our platform and is now available for rent.',
        });

        // Reset form
        setFormData({
            title: '',
            description: '',
            price: '',
            location: '',
            type: '',
            batteryRange: '',
            maxSpeed: '',
            weight: '',
            features: [],
        });
        setImages([]);
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
                                        {bikeTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
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
                        <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={isSubmitting}>
                            {isSubmitting ? (
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
