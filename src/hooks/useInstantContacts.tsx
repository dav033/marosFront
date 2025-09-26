import { cacheConfig } from "@/lib/cacheConfig";
import {
  type ContactsAppContext,
  listContacts,
} from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";
import { ContactHttpRepository } from "@/features/contact/infra";
import type { UseInstantContactsResult } from "@/types";
import { useCacheQuery, type Fetcher } from "@/lib/cache";


function makeCtx(): ContactsAppContext {
  return {
    repos: {
      contact: new ContactHttpRepository(), // si tu repo requiere cliente HTTP, pásalo aquí
    },
  } as const;
}

const CACHE_KEY = "contacts:list";

export function useInstantContacts(): UseInstantContactsResult {
  const cfg = cacheConfig.get();
  const resourceCfg = (cfg.resources?.["contacts"] ?? {}) as {
    enabled?: boolean;
    ttl?: number;
  };
  const cachingEnabled = cfg.enabled !== false && (resourceCfg.enabled ?? true);
  const ttl = resourceCfg.ttl ?? 5 * 60 * 1000; // 5 min por defecto

  const fetcher: Fetcher<Contact[]> = async () => {
    const ctx = makeCtx();
    return listContacts(ctx);
  };

  const { data, status, error, isStale, refetch } = useCacheQuery<Contact[]>(
    ["contacts", CACHE_KEY],
    fetcher,
    {
      staleTime: cachingEnabled ? ttl : 0,
      refetchOnWindowFocus: true,
    }
  );

  const contacts = (data ?? []) as Contact[];
  const hasData = contacts.length > 0;
  const isLoading = status === "loading";
  const showSkeleton = isLoading && !hasData;
  const fromCache = hasData && !isStale;

  return {
    contacts,
    isLoading,
    showSkeleton,
    error: (error as Error) ?? null,
    fromCache,
    refetch: async () => {
      await refetch();
    },
  };
}
