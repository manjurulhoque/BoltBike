import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SearchState {
    location: string;
    startDate: string;
    endDate: string;
}

interface SearchContextType {
    searchState: SearchState;
    updateSearchState: (updates: Partial<SearchState>) => void;
    resetSearchState: () => void;
}

const initialSearchState: SearchState = {
    location: '',
    startDate: '',
    endDate: '',
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

interface SearchProviderProps {
    children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    const [searchState, setSearchState] = useState<SearchState>(initialSearchState);

    const updateSearchState = (updates: Partial<SearchState>) => {
        setSearchState((prev) => ({ ...prev, ...updates }));
    };

    const resetSearchState = () => {
        setSearchState(initialSearchState);
    };

    return (
        <SearchContext.Provider value={{ searchState, updateSearchState, resetSearchState }}>
            {children}
        </SearchContext.Provider>
    );
};
