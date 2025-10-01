import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { useContactsApp } from "@/di/DiProvider";
import { listContacts } from "@/features/contact/application";
import type { ContactsAppContext } from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";

export type UseContactsResult = {
  contacts: Contact[];
  isLoading: boolean;
  error: string | Error | null;
  refetch: () => Promise<void>;
  showSkeleton?: boolean;
  fromCache?: boolean;
};

export type UseContactsOptions = Readonly<{
  /** @deprecated: React Query gestiona el caché; esta opción ya no se utiliza. */
  cache?: boolean;
  /** Tiempo que los datos se consideran frescos (ms). Por defecto 5 minutos. */
  staleTime?: number;
  /** Contexto de la aplicación de contactos (opcional; por defecto se usa el DI). */
  ctx?: ContactsAppContext;
  /** Controla si se refetch al enfocar la ventana (por defecto: true). */
  refetchOnWindowFocus?: boolean;
}>;

export function useContacts(
  options: UseContactsOptions = {}
): UseContactsResult {
  const diCtx = useContactsApp?.();
  const ctx: ContactsAppContext | undefined = options.ctx ?? diCtx;

  const staleTime = options.staleTime ?? 5 * 60 * 1000;

  const query = useQuery<Contact[], Error>({
    queryKey: ["contacts", "list"],
    queryFn: async () => {
      if (!ctx) throw new Error("Contacts context is not available");
      const items = await listContacts(ctx);
      return items ?? [];
    },
    staleTime,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? true,
        enabled: !!ctx,
  });

  const contacts = query.data ?? [];
  const hasData = contacts.length > 0;
  const isLoading = query.isLoading;
  const showSkeleton = isLoading && !hasData;

    const fromCache =
    hasData && Date.now() - (query.dataUpdatedAt ?? 0) <= staleTime;

  return {
    contacts,
    isLoading,
    error: (query.error as Error) ?? null,
    refetch: async () => {
      await query.refetch();
    },
    showSkeleton,
    fromCache,
  };
}
