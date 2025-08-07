/**
 * Hook para lista instantánea de contactos usando el sistema de cache
 */

import { useState, useEffect } from 'react';
import type { Contacts } from 'src/types/types';
import { OptimizedContactsService } from 'src/services/OptimizedContactsService';
import { globalCache } from 'src/lib/cacheManager';

interface UseInstantContactsResult {
  contacts: Contacts[];
  isLoading: boolean;
  showSkeleton: boolean;
  error: Error | null;
  fromCache: boolean;
  refetch: () => Promise<void>;
}

export function useInstantContacts(): UseInstantContactsResult {
  const cacheKey = '/contacts/all';
  
  // Verificar cache inmediatamente al inicializar
  const cachedData = globalCache.get(cacheKey);
  
  const [contacts, setContacts] = useState<Contacts[]>(cachedData || []);
  const [isLoading, setIsLoading] = useState(!cachedData); // Solo loading si no hay cache
  const [error, setError] = useState<Error | null>(null);
  const [fromCache, setFromCache] = useState(!!cachedData);

  // Solo mostrar skeleton si estamos cargando Y no hay datos (ni cache ni datos frescos)
  const showSkeleton = isLoading && contacts.length === 0;

  const fetchContacts = async () => {
    try {
      setError(null);
      
      // Solo activar loading si no tenemos datos (ni cache ni frescos)
      if (contacts.length === 0) {
        setIsLoading(true);
      }

      // Buscar datos frescos (cache-first strategy manejará el cache internamente)
      const data = await OptimizedContactsService.getAllContacts();
      setContacts(data);
      setFromCache(false); // Los datos vienen de la red
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    setIsLoading(true);
    setFromCache(false);
    await fetchContacts();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    isLoading,
    showSkeleton,
    error,
    fromCache,
    refetch
  };
}
