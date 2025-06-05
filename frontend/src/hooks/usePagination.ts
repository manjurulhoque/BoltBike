import { useState, useMemo } from 'react';

interface UsePaginationProps {
    totalItems: number;
    itemsPerPage?: number;
    initialPage?: number;
}

interface UsePaginationReturn {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    resetPage: () => void;
    paginationFilters: {
        page: number;
        page_size: number;
    };
}

export const usePagination = ({
    totalItems,
    itemsPerPage = 10,
    initialPage = 1,
}: UsePaginationProps): UsePaginationReturn => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);

    const resetPage = () => {
        setCurrentPage(1);
    };

    const paginationFilters = useMemo(
        () => ({
            page: currentPage,
            page_size: itemsPerPage,
        }),
        [currentPage, itemsPerPage],
    );

    return {
        currentPage,
        totalPages,
        setCurrentPage,
        resetPage,
        paginationFilters,
    };
};
