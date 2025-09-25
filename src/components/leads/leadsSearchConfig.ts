import type { SearchConfig } from '@/shared/search/types';
import { defaultNormalize } from '@/shared/search/normalize';

export type Lead = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  status?: 'new' | 'qualified' | 'won' | 'lost';
  source?: string;
};

export const leadSearchConfig: SearchConfig<Lead> = {
  fields: [
    { key: 'fullName', label: 'Full name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'source', label: 'Source' },
  ],
  placeholder: 'Search leads by name, email, status…',
  debounceMs: 200,
  normalize: defaultNormalize,
};
