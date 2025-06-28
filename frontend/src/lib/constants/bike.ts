import { BikeType, BikeStatus } from '@/lib/types/bike';

export const BIKE_TYPES: { value: BikeType; label: string }[] = [
    { value: 'city', label: 'City' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'road', label: 'Road' },
    { value: 'cargo', label: 'Cargo' },
    { value: 'folding', label: 'Folding' },
    { value: 'hybrid', label: 'Hybrid' },
];

// For filter dropdown with "All Types" option
export const BIKE_TYPES_WITH_ALL = ['All Types', ...BIKE_TYPES.map((type) => type.label)];

export const BIKE_STATUSES: { value: BikeStatus; label: string }[] = [
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
    { value: 'maintenance', label: 'Under Maintenance' },
];

// Common bike features for suggestions
export const COMMON_BIKE_FEATURES = [
    'GPS Tracking',
    'USB Charging Port',
    'LED Lights',
    'Phone Holder',
    'Basket',
    'Helmet Included',
    'Lock Included',
    'Insurance',
    'Maintenance Kit',
    'Spare Battery',
    'Puncture-proof Tires',
    'Anti-theft System',
    'Weather Protection',
    'Child Seat Compatible',
    'Cargo Rack',
];

// Helper function to get bike type label
export const getBikeTypeLabel = (bikeType: BikeType): string => {
    const type = BIKE_TYPES.find((t) => t.value === bikeType);
    return type ? type.label : bikeType;
};

// Helper function to get bike status label
export const getBikeStatusLabel = (status: BikeStatus): string => {
    const statusObj = BIKE_STATUSES.find((s) => s.value === status);
    return statusObj ? statusObj.label : status;
};

// Helper function to get status color classes
export const getBikeStatusColor = (status: BikeStatus): string => {
    switch (status) {
        case 'available':
            return 'bg-green-100 text-green-800';
        case 'unavailable':
            return 'bg-yellow-100 text-yellow-800';
        case 'maintenance':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
