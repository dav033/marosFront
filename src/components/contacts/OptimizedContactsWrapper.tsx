/**
 * Wrapper optimizado para contactos con sistema de cache y skeleton
 */

import React from 'react';
import { useInstantContacts } from 'src/hooks/useInstantContacts';
import { ContactsTableSkeleton } from './ContactsTableSkeleton';
import ContactsTable from './ContactsTable';

const OptimizedContactsWrapper: React.FC = () => {
  const { contacts, showSkeleton, error, refetch } = useInstantContacts();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading contacts</h3>
          <p className="text-gray-500 mb-4">There was a problem loading the contacts data.</p>
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (showSkeleton) {
    return <ContactsTableSkeleton />;
  }

  return <ContactsTable contacts={contacts} onRefetch={refetch} />;
};

export default OptimizedContactsWrapper;