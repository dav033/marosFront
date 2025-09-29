import * as React from "react";

import { useContactsApp } from "@/di/DiProvider";
import { listContacts } from "@/features/contact/application";
import type { ContactsAppContext } from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";

import { cacheConfig } from "@/lib/cacheConfig";
import { useCacheQuery, type Fetcher } from "@/lib/cache";

export type UseContactsResult = {
  contacts: Contact[];
  isLoading: boolean;
  error: string | Error | null;
    refetch: () => Promise<void>;
    showSkeleton?: boolean;
  fromCache?: boolean;
};

export type UseContactsOptions = Readonly<{
    cache?: boolean;
    staleTime?: number;
    ctx?: ContactsAppContext;
    refetchOnWindowFocus?: boolean;
}>;

export function useContacts(
  options: UseContactsOptions = {}
): UseContactsResult {
  
  const diCtx = useContactsApp?.(); 
  const ctx: ContactsAppContext | undefined = options.ctx ?? diCtx;

  
  const cfg = cacheConfig.get();
  const resCfg = (cfg.resources?.["contacts"] ?? {}) as {
    enabled?: boolean;
    ttl?: number;
  };
  const cacheEnabled =
    options.cache ?? (cfg.enabled !== false && (resCfg.enabled ?? true));
  const ttl = options.staleTime ?? resCfg.ttl ?? 5 * 60 * 1000;

  
  const fetcher: Fetcher<Contact[]> = React.useCallback(async () => {
    if (!ctx) throw new Error("Contacts context is not available");
    const items = await listContacts(ctx);
    return items ?? [];
  }, [ctx]);

  
  if (cacheEnabled) {
    
    const { data, status, error, isStale, refetch } = useCacheQuery<Contact[]>(
      ["contacts", "list"],
      fetcher,
      {
        staleTime: ttl,
        refetchOnWindowFocus: options.refetchOnWindowFocus ?? true,
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
      error: (error as Error) ?? null,
      refetch: async () => {
        await refetch();
      },
      showSkeleton,
      fromCache,
    };
  }

  
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [isLoading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const items = await fetcher();
      setContacts(items ?? []);
      setErr(null);
    } catch (e: unknown) {
      const msg =
        (e as Error | undefined)?.message ?? String(e ?? "Unexpected error");
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return {
    contacts,
    isLoading,
    error: err,
    refetch: load,
  };
}
