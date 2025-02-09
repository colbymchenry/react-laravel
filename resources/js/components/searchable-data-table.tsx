import { useState, useCallback } from 'react';
import { DataTable, TextField, Pagination, BlockStack, Spinner, ColumnContentType } from '@shopify/polaris';

interface SearchableDataTableProps {
    items: any[];
    columnContentTypes: string[];
    headings: string[];
    itemToRow: (item: any) => any[];
    loading?: boolean;
    searchPlaceholder?: string;
}

export function SearchableDataTable({
    items,
    columnContentTypes,
    headings,
    itemToRow,
    loading = false,
    searchPlaceholder = "Search..."
}: SearchableDataTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    }, []);

    const filteredItems = items.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <BlockStack gap="400">
            <TextField
                label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                labelHidden
                autoComplete="off"
            />

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Spinner size="large" />
                </div>
            ) : (
                <>
                    <DataTable
                        columnContentTypes={columnContentTypes as ColumnContentType[]}
                        headings={headings}
                        rows={paginatedItems.map(itemToRow)}
                    />

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                label={`Page ${currentPage} of ${totalPages}`}
                                hasPrevious={currentPage > 1}
                                onPrevious={() => setCurrentPage(p => p - 1)}
                                hasNext={currentPage < totalPages}
                                onNext={() => setCurrentPage(p => p + 1)}
                            />
                        </div>
                    )}
                </>
            )}
        </BlockStack>
    );
} 