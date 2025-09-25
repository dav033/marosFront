// src/hooks/useInstantContacts.tsx
/**
 * Hook para lista instantánea de contactos con manejo correcto de cache vacío.
 * Muestra skeleton en primera carga si NO hay datos útiles en cache.
 */

import { useEffect, useState } from "react";
import type { UseInstantContactsResult } from "src/types";

// Clean Architecture: casos de uso + adapters
import {
  type ContactsAppContext,
  listContacts,
} from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";
import {
  ContactHttpRepository,
  ContactUniquenessHttpService,
} from "@/features/contact/infra";
import { getErrorMessage } from "@/utils/errors";
import { apiCache } from "@/shared/infra/http/cache/cacheManager";

// Factory mínimo de contexto para Contacts
function makeCtx(): ContactsAppContext {
  return {
    repos: { contact: new ContactHttpRepository() },
  };
}

export function useInstantContacts(): UseInstantContactsResult {
  const ENDPOINT = "/contacts/all";
  const API_CACHE_KEY = `api_GET_${ENDPOINT}`;

  const rawCached = apiCache.get(API_CACHE_KEY) as Contact[] | undefined | null;

  // Consideramos "cache utilizable" SOLO si trae datos no vacíos
  const hasUsableCache = Array.isArray(rawCached)
    ? rawCached.length > 0
    : Boolean(rawCached);

  const initialContacts: Contact[] = hasUsableCache
    ? (rawCached as Contact[])
    : [];

  // Empezamos en loading=true para permitir skeleton durante la primera carga
  // Si ya hay datos en memoria (cache utilizable), skeleton no bloqueará la UI (contacts.length > 0)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [fromCache, setFromCache] = useState<boolean>(hasUsableCache);

  // Skeleton sólo cuando no hay datos aún y estamos cargando
  const showSkeleton = isLoading && contacts.length === 0;

  const fetchContacts = async (hard = false) => {
    try {
      setError(null);

      // Si se fuerza (hard) o NO hay datos en pantalla, mostramos loading (y por ende skeleton si está vacío)
      if (hard || contacts.length === 0) setIsLoading(true);

      const ctx = makeCtx();
      const data = await listContacts(ctx);

      // Actualiza estado y cache
      setContacts(data);
      apiCache.set(API_CACHE_KEY, data, 5 * 60 * 1000); // TTL 5 min (ajustable)
      setFromCache(false); // post-red
    } catch (err: unknown) {
      console.error("Error fetching contacts:", getErrorMessage(err));
      setError(err instanceof Error ? err : new Error(getErrorMessage(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => fetchContacts(true);

  useEffect(() => {
    // Primera carga (si había cache útil, no habrá skeleton bloqueante porque hay filas)
    void fetchContacts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { contacts, isLoading, showSkeleton, error, fromCache, refetch };
}
