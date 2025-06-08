import { SlidersHorizontal, Filter, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { useFilter } from '@/contexts/FilterContext';

const FilterBar = () => {
    const { filterState, toggleBikeType, updateFilterState } = useFilter();
    const bikeTypes = ['mountain', 'city', 'cargo', 'folding', 'road'];

    return (
        <div className="sticky top-16 z-40 bg-white border-b py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Filter Categories */}
                    <div className="flex items-center space-x-2 overflow-x-auto">
                        {bikeTypes.map((type) => (
                            <Badge
                                key={type}
                                variant={filterState.selectedTypes.includes(type) ? 'default' : 'outline'}
                                className={`cursor-pointer whitespace-nowrap transition-colors ${
                                    filterState.selectedTypes.includes(type)
                                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                                        : 'hover:bg-rose-50 hover:border-rose-300'
                                }`}
                                onClick={() => toggleBikeType(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Badge>
                        ))}
                    </div>

                    {/* Filter Controls */}
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span>Price</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80 p-4">
                                <DropdownMenuLabel>Price Range per Day</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="space-y-4">
                                    <Slider
                                        value={filterState.priceRange}
                                        onValueChange={(value) =>
                                            updateFilterState({ priceRange: value as [number, number] })
                                        }
                                        max={200}
                                        min={10}
                                        step={5}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>${filterState.priceRange[0]}</span>
                                        <span>${filterState.priceRange[1]}+</span>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="outline" className="flex items-center space-x-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Filters</span>
                        </Button>

                        <Button
                            variant={filterState.showMap ? 'default' : 'outline'}
                            className="flex items-center space-x-2"
                            onClick={() => updateFilterState({ showMap: !filterState.showMap })}
                        >
                            <MapPin className="h-4 w-4" />
                            <span>Map</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
