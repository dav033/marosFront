// Capa: Presentation — Contacts VM (lista para UI)
import * as React from "react";

import type { ContactsAppContext } from "@/features/contact/application";
import { listContacts } from "@/features/contact/application/usecases/queries/listContacts";
import type { Contact } from "@/features/contact/domain/models/Contact";
import type { ContactsVM } from "@/features/contact/vm/types";

export function useContactsVM(ctx: ContactsAppContext): ContactsVM {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await listContacts(ctx);
      setContacts(items ?? []);
      setError(null);
    } catch (e: unknown) {
      const msg = (e as Error | undefined)?.message ?? String(e ?? "Unexpected error");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [ctx]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [load]);

  return { contacts, isLoading, error, refetch: load };
}
