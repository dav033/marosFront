import type { Contacts } from '../../types/types';
import type { SearchConfig } from '../../hooks/useSearch';

export const contactsSearchConfig: SearchConfig<Contacts> = {
  searchableFields: [
    { value: 'companyName', label: 'Company Name' },
    { value: 'name', label: 'Contact Name' },
  ],
  caseSensitive: false,
  searchType: 'includes',
  defaultField: 'companyName',
};

export const contactsSearchPlaceholder = "Search contacts...";
