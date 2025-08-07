# Date Helpers Documentation

This file contains utility functions for formatting dates consistently across the application.

## Functions

### `formatDate(dateValue, options)`

Formats a date string or Date object to a human-readable format.

**Parameters:**
- `dateValue`: string | Date | null | undefined - The date value to format
- `options`: Object with formatting options
  - `format`: 'short' | 'medium' | 'long' | 'relative' (default: 'medium')
  - `locale`: string (default: 'en-US')

**Returns:** Formatted date string or "—" if no date provided

**Examples:**
```typescript
formatDate('2024-01-15'); // "Jan 15, 2024"
formatDate(new Date(), { format: 'short' }); // "Jan 15, 24"
formatDate('2024-01-15', { format: 'long' }); // "Mon, January 15, 2024"
formatDate('2024-01-15', { format: 'relative' }); // "2 days ago"
```

### `formatRelativeDate(date)`

Formats a date relative to now (e.g., "2 days ago", "yesterday", "just now").

**Parameters:**
- `date`: Date - The date to format

**Returns:** Relative date string

**Examples:**
```typescript
formatRelativeDate(new Date()); // "just now"
formatRelativeDate(new Date(Date.now() - 86400000)); // "yesterday"
```

### `formatDateTime(dateValue, options)`

Formats a datetime string to show both date and time.

**Parameters:**
- `dateValue`: string | Date | null | undefined - The datetime value to format
- `options`: Object with formatting options
  - `dateFormat`: 'short' | 'medium' | 'long' (default: 'medium')
  - `timeFormat`: '12h' | '24h' (default: '12h')
  - `locale`: string (default: 'en-US')

**Returns:** Formatted datetime string

**Examples:**
```typescript
formatDateTime('2024-01-15T14:30:00'); // "Jan 15, 2024, 2:30 PM"
formatDateTime(new Date(), { timeFormat: '24h' }); // "Jan 15, 2024, 14:30"
```

### `isToday(date)`

Checks if a date is today.

**Parameters:**
- `date`: Date | string - The date to check

**Returns:** boolean - True if the date is today

### `isWithinLastDays(date, days)`

Checks if a date is within the last N days.

**Parameters:**
- `date`: Date | string - The date to check
- `days`: number - Number of days to check against

**Returns:** boolean - True if the date is within the last N days

## Usage in Components

The date helpers are primarily used in table columns to format dates consistently:

```typescript
// In ContactTableColumns.tsx
{
  id: "lastContact",
  header: "Last Contact",
  accessor: (contact) => formatDate(contact.lastContact, { format: 'medium' }),
  type: "string",
}

// In LeadTableColumns.tsx
{
  id: "startDate",
  header: "Start Date",
  accessor: (lead) => formatDate(lead.startDate, { format: 'medium' }),
  type: "string",
}
```

## Error Handling

All functions handle invalid dates gracefully:
- Returns "—" for null, undefined, or invalid date values
- Logs warnings for invalid date formats
- Never throws exceptions

## Internationalization

All functions support locale-specific formatting through the `locale` parameter, making it easy to adapt the application for different regions.
