import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
    selectedTypes: string[];
    priceRange: [number, number];
    showMap: boolean;
}

interface FilterContextType {
    filterState: FilterState;
    updateFilterState: (updates: Partial<FilterState>) => void;
    resetFilterState: () => void;
    toggleBikeType: (type: string) => void;
    isPriceInRange: (price: number) => boolean;
}

const initialFilterState: FilterState = {
    selectedTypes: [],
    priceRange: [10, 200],
    showMap: false,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};

interface FilterProviderProps {
    children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
    const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

    const updateFilterState = (updates: Partial<FilterState>) => {
        setFilterState((prev) => ({ ...prev, ...updates }));
    };

    const resetFilterState = () => {
        setFilterState(initialFilterState);
    };

    const toggleBikeType = (type: string) => {
        setFilterState((prev) => ({
            ...prev,
            selectedTypes: prev.selectedTypes.includes(type)
                ? prev.selectedTypes.filter((t) => t !== type)
                : [...prev.selectedTypes, type],
        }));
    };

    const isPriceInRange = (price: number) => {
        return price >= filterState.priceRange[0] && price <= filterState.priceRange[1];
    };

    return (
        <FilterContext.Provider
            value={{
                filterState,
                updateFilterState,
                resetFilterState,
                toggleBikeType,
                isPriceInRange,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};
