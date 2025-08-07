# Reusable Search System Documentation

## Overview

This search system provides a flexible and reusable way to implement search functionality with field-specific filtering across different data types in the application. It consists of three main parts:

1. **useSearch Hook** - Generic search logic with field selection
2. **SearchBoxWithDropdown Component** - Reusable UI component with integrated dropdown
3. **Search Configuration** - Data-specific search settings with field options

## Features

- **Field-specific search**: Choose which field to search in via dropdown
- **Multi-field configuration**: Define multiple searchable fields with labels
- **Nested property support**: Search in nested objects (e.g., `contact.name`, `projectType.name`)
- **Flexible matching**: Supports 'includes', 'startsWith', and 'exact' matching
- **Case sensitivity control**: Can be case-sensitive or case-insensitive
- **Real-time filtering**: Instant results as user types
- **Search state management**: Clear search, active search indicators
- **Result counts**: Shows filtered vs total results
- **Default field selection**: Set a default field for searches

## Usage

### 1. Create Search Configuration

First, create a search configuration for your data type:

```typescript
// components/[feature]/[feature]SearchConfig.ts
import type { YourDataType } from '../../types/types';
import type { SearchConfig } from '../../hooks/useSearch';

export const yourDataSearchConfig: SearchConfig<YourDataType> = {
  searchableFields: [
    { value: 'field1', label: 'Field 1 Display Name' },
    { value: 'field2', label: 'Field 2 Display Name' },
    { value: 'nestedObject.field', label: 'Nested Field' },  // Support for nested properties
  ],
  caseSensitive: false,          // Optional: default false
  searchType: 'includes',        // Optional: 'includes' | 'startsWith' | 'exact'
  defaultField: 'field1',        // Optional: default field to search in
};

export const yourDataSearchPlaceholder = "Search your data...";
```

### 2. Implement in Component

```typescript
import React from 'react';
import { useSearch } from '../../hooks/useSearch';
import { SearchBoxWithDropdown } from '../../components/common/SearchBoxWithDropdown';
import { yourDataSearchConfig, yourDataSearchPlaceholder } from './yourDataSearchConfig';

export const YourComponent: React.FC = () => {
  const [data, setData] = useState<YourDataType[]>([]);
  
  // Use the search hook
  const {
    searchTerm,
    setSearchTerm,
    selectedField,
    setSelectedField,
    filteredData,
    clearSearch,
    hasActiveSearch,
    searchFields,
  } = useSearch(data, yourDataSearchConfig);

  return (
    <div className="space-y-4">
      {/* Search Box with Dropdown */}
      <SearchBoxWithDropdown
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedField={selectedField}
        onFieldChange={setSelectedField}
        searchFields={searchFields}
        onClearSearch={clearSearch}
        placeholder={yourDataSearchPlaceholder}
        hasActiveSearch={hasActiveSearch}
        resultCount={filteredData.length}
        totalCount={data.length}
      />
      
      {/* Your filtered data display */}
      <YourDataTable 
        data={filteredData}
        title={hasActiveSearch ? `Search Results (${filteredData.length})` : "All Items"}
      />
    </div>
  );
};
```

## Examples

### Example 1: Contacts Search (Implemented)

```typescript
// contactsSearchConfig.ts
export const contactsSearchConfig: SearchConfig<Contacts> = {
  searchableFields: [
    { value: 'companyName', label: 'Company Name' },
    { value: 'name', label: 'Contact Name' },
  ],
  caseSensitive: false,
  searchType: 'includes',
  defaultField: 'companyName',
};
```

### Example 2: Leads Search (Example)

```typescript
// leadsSearchConfig.ts  
export const leadsSearchConfig: SearchConfig<Lead> = {
  searchableFields: [
    { value: 'leadNumber', label: 'Lead Number' },
    { value: 'name', label: 'Lead Name' },
    { value: 'location', label: 'Location' },
    { value: 'contact.name', label: 'Contact Name' },           // Nested property
    { value: 'contact.companyName', label: 'Company Name' },    // Nested property
    { value: 'projectType.name', label: 'Project Type' },       // Nested property
  ],
  caseSensitive: false,
  searchType: 'includes',
  defaultField: 'name',
};
```

## API Reference

### useSearch Hook

```typescript
function useSearch<T>(data: T[], config: SearchConfig<T>): UseSearchResult<T>
```

**Parameters:**
- `data`: Array of items to search through
- `config`: Search configuration object

**Returns:**
- `searchTerm`: Current search term
- `setSearchTerm`: Function to update search term
- `selectedField`: Currently selected field to search in
- `setSelectedField`: Function to change the search field
- `filteredData`: Filtered array based on search
- `clearSearch`: Function to clear search
- `hasActiveSearch`: Boolean indicating if search is active
- `searchFields`: Available search fields from config

### SearchBoxWithDropdown Component

```typescript
interface SearchBoxWithDropdownProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedField: string;
  onFieldChange: (field: string) => void;
  searchFields: SearchFieldOption[];
  onClearSearch: () => void;
  placeholder?: string;
  className?: string;
  hasActiveSearch?: boolean;
  resultCount?: number;
  totalCount?: number;
}
```

### SearchConfig Interface

```typescript
interface SearchFieldOption {
  value: string;    // The actual field name/path
  label: string;    // Display name for the dropdown
}

interface SearchConfig<T> {
  searchableFields: SearchFieldOption[];       // Fields available for search
  caseSensitive?: boolean;                     // Case sensitivity (default: false)
  searchType?: 'includes' | 'startsWith' | 'exact'; // Match type (default: 'includes')
  defaultField?: string;                       // Default field to search in
}
```

## Best Practices

1. **Field Selection**: Only include fields that users would logically want to search
2. **Nested Properties**: Use dot notation for nested objects (e.g., 'contact.name')
3. **Performance**: The search is optimized with useMemo, but avoid searching very large datasets
4. **User Experience**: Provide clear placeholders indicating what can be searched
5. **Configuration**: Keep search configs in separate files for better organization

## Styling

The SearchBox component uses Tailwind CSS classes and is designed to be responsive. You can customize the appearance by:

1. Passing custom `className` prop to SearchBox
2. Modifying the SearchBox component styles
3. Using CSS custom properties for consistent theming

## Future Enhancements

Potential improvements that could be added:

1. **Advanced Filters**: Add date ranges, number ranges, etc.
2. **Search Highlighting**: Highlight matching text in results
3. **Search History**: Remember recent searches
4. **Debounced Search**: Add debouncing for better performance
5. **Fuzzy Search**: Implement fuzzy matching for typos
6. **Save Search**: Allow users to save and name searches
