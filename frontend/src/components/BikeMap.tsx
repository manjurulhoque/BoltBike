import { useEffect, useRef, useState } from 'react';
import { MapPin, Star, Battery } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bike } from '@/lib/types/bike';

interface BikeMapProps {
    bikes: Bike[];
}

const BikeMap = ({ bikes }: BikeMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
    const [mapToken, setMapToken] = useState('');

    // Sample coordinates for demo purposes
    const bikeLocations = {
        'Downtown, San Francisco': [37.7749, -122.4194],
        'Mission District, SF': [37.7599, -122.4148],
        'Berkeley, CA': [37.8715, -122.273],
        'Marin County, CA': [38.0834, -122.7633],
        'SOMA, San Francisco': [37.7849, -122.4094],
        'Oakland, CA': [37.8044, -122.2712],
        'Palo Alto, CA': [37.4419, -122.143],
        'San Jose, CA': [37.3382, -122.0922],
    };

    useEffect(() => {
        if (!mapRef.current) return;

        // Simple fallback map implementation using OpenStreetMap
        const createSimpleMap = () => {
            const mapContainer = mapRef.current!;
            mapContainer.innerHTML = `
        <div class="relative w-full h-96 bg-blue-50 rounded-lg overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            <div class="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
              <h3 class="font-semibold text-gray-900 mb-2">San Francisco Bay Area</h3>
              <p class="text-sm text-gray-600">${bikes.length} e-bikes available</p>
            </div>
            
            <!-- Map placeholder with bike markers -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="grid grid-cols-3 gap-8 mb-4">
                  ${bikes
                      .slice(0, 6)
                      .map(
                          (bike, index) => `
                    <div 
                      class="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-rose-600 transition-colors shadow-lg"
                      data-bike-id="${bike.id}"
                      style="transform: translate(${((index % 3) - 1) * 60}px, ${Math.floor(index / 3) * 40}px)"
                    >
                      $${bike.daily_rate}
                    </div>
                  `,
                      )
                      .join('')}
                </div>
                <p class="text-gray-600 text-sm">Interactive map with real-time bike locations</p>
              </div>
            </div>
          </div>
        </div>
      `;

            // Add click handlers to markers
            bikes.forEach((bike) => {
                const marker = mapContainer.querySelector(`[data-bike-id="${bike.id}"]`);
                if (marker) {
                    marker.addEventListener('click', () => setSelectedBike(bike));
                }
            });
        };

        createSimpleMap();
    }, [bikes]);

    return (
        <div className="space-y-6">
            {/* Map Token Input */}
            <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-medium text-blue-900 mb-1">Interactive Map</h3>
                        <p className="text-sm text-blue-700 mb-3">
                            For a fully interactive map experience, you can integrate with Mapbox or other mapping
                            services.
                        </p>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Enter Mapbox token for enhanced map features"
                                className="flex-1 px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={mapToken}
                                onChange={(e) => setMapToken(e.target.value)}
                            />
                            <Button size="sm" variant="outline">
                                Enable Map
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Map Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div ref={mapRef} className="w-full h-96 bg-gray-100 rounded-lg"></div>
                </div>

                {/* Sidebar with bike list */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bikes.map((bike) => (
                        <Card
                            key={bike.id}
                            className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                                selectedBike?.id === bike.id ? 'ring-2 ring-rose-500' : ''
                            }`}
                            onClick={() => setSelectedBike(bike)}
                        >
                            <div className="flex items-start space-x-3">
                                <img
                                    src={bike.images[0].image_url}
                                    alt={bike.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 text-sm leading-tight">{bike.title}</h3>
                                    <p className="text-xs text-gray-600 flex items-center mt-1">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {bike.location}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center">
                                                <Star className="h-3 w-3 fill-current text-yellow-400" />
                                                <span className="text-xs font-medium ml-1">4.5</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-600">
                                                <Battery className="h-3 w-3 mr-1" />
                                                {bike.battery_range}km
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold text-gray-900">${bike.daily_rate}</span>
                                            <span className="text-xs text-gray-600">/day</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Selected Bike Details */}
            {selectedBike && (
                <Card className="p-6 bg-rose-50 border-rose-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Selected Bike</h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBike(null)}>
                            ×
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <img
                                src={selectedBike.images[0].image_url}
                                alt={selectedBike.title}
                                className="w-full h-48 rounded-lg object-cover"
                            />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">{selectedBike.title}</h4>
                            <p className="text-gray-600 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {selectedBike.location}
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                                    <span className="font-medium ml-1">4.5</span>
                                    <span className="text-gray-600 ml-1">(0)</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Battery className="h-4 w-4 mr-1" />
                                    {selectedBike.battery_range}km range
                                </div>
                            </div>
                            <div className="pt-2">
                                <span className="text-xl font-bold text-gray-900">${selectedBike.daily_rate}</span>
                                <span className="text-gray-600"> / day</span>
                            </div>
                            <Button className="w-full bg-rose-500 hover:bg-rose-600 mt-4">Book This Bike</Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default BikeMap;
