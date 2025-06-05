# Reusable Pagination Components

This directory contains reusable pagination components that can be used across different pages with consistent API response structures.

## PaginationControls Component

A reusable pagination UI component that handles all the pagination logic and renders the pagination interface.

### Usage

```tsx
import PaginationControls from '@/components/PaginationControls';

const MyComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div>
            {/* Your content here */}
            
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxVisiblePages={5} // Optional, defaults to 5
            />
        </div>
    );
};
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentPage` | `number` | Yes | - | Current active page |
| `totalPages` | `number` | Yes | - | Total number of pages |
| `onPageChange` | `(page: number) => void` | Yes | - | Callback when page changes |
| `maxVisiblePages` | `number` | No | `5` | Maximum number of page buttons to show |

## usePagination Hook

A reusable hook for managing pagination state.

### Usage

```tsx
import { usePagination } from '@/hooks/usePagination';

const MyComponent = () => {
    const { data } = useMyDataQuery(apiFilters);
    const totalItems = data?.data?.count || 0;
    
    const {
        currentPage,
        totalPages,
        setCurrentPage,
        resetPage,
        paginationFilters
    } = usePagination({
        totalItems,
        itemsPerPage: 10,
        initialPage: 1
    });

    // Use paginationFilters in your API call
    const apiFilters = {
        ...otherFilters,
        ...paginationFilters
    };

    // Reset page when filters change
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        resetPage();
    };

    return (
        <div>
            {/* Your content */}
            
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};
```

## Features

- **Consistent UI**: All pagination across the app looks the same
- **Smart Page Display**: Shows appropriate page numbers with ellipsis for large page counts
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsive**: Works on mobile and desktop
- **Customizable**: Configurable number of visible pages
- **Auto-hide**: Doesn't render when there's only one page

## Backend Compatibility

These components are designed to work with Django REST Framework's PageNumberPagination:
- Uses `page` and `page_size` parameters
- Expects response format: `{ count: number, results: T[] }`

## Examples in Codebase

- **Bikes Page**: `frontend/src/pages/Bikes.tsx`
- **Favorites**: Can use the same pattern
- **Bookings**: Can use the same pattern
- **User's Bikes**: Already uses pagination in backend 