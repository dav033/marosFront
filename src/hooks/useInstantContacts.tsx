/**
 * Hook para lista instantánea de contactos usando el sistema de cache
 */

import { useState, useEffect } from "react";
import type { Contacts, UseInstantContactsResult } from "src/types";
import { OptimizedContactsService } from "src/services/OptimizedContactsService";
import { apiCache } from "src/lib/cacheManager";



export function useInstantContacts(): UseInstantContactsResult {
  const ENDPOINT = "/contacts/all";
  const API_CACHE_KEY = `api_GET_${ENDPOINT}`;
  const cached = (apiCache.get(API_CACHE_KEY) as Contacts[] | null) || null;

  const [contacts, setContacts] = useState<Contacts[]>(cached ?? []);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<Error | null>(null);
  const [fromCache, setFromCache] = useState(Boolean(cached));

  const showSkeleton = isLoading && contacts.length === 0;

  const fetchContacts = async (hard = false) => {
    try {
      setError(null);
      // Hard refresh: fuerce loading; Soft refresh: si ya hay datos, no muestre skeleton
      if (hard || contacts.length === 0) setIsLoading(true);

      const data = await OptimizedContactsService.getAllContacts();
      setContacts(data);
      // Si veníamos con cache en pantalla, no necesitamos marcar desde cache=false para evitar parpadeos
      if (!cached) setFromCache(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const refetch = async () => fetchContacts(true);

  useEffect(() => {
    fetchContacts(false);
  }, []);

  return { contacts, isLoading, showSkeleton, error, fromCache, refetch };
}
