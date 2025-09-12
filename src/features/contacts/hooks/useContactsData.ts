import { useCallback, useEffect, useMemo } from "react";
import { useInstantList } from "@/hooks/useInstantData";
import type { Contacts } from "@/types/domain";
import { OptimizedContactsService } from "@/services/OptimizedContactsService";
import { useLoading } from "@/contexts/LoadingContext";

export function useContactsData() {
  const {
    items: contacts = [],
    loading: isLoading,
    showSkeleton,
    refresh: refetchContacts,
    error,
    mutateItems,
  } = useInstantList<Contacts>(
    "contacts",
    () => OptimizedContactsService.getAllContacts(),
    { ttl: 300000, showSkeletonOnlyOnFirstLoad: true }
  );

  // fallback para mutateItems si es undefined
  const safeMutate = useMemo(() => mutateItems ?? (() => {}), [mutateItems]);

  const addContact = (created: Contacts) => {
    safeMutate((prev: Contacts[]) => {
      const list = Array.isArray(prev) ? prev : [];
      if (!created) return list;
      if (list.some((c) => c.id === created.id)) return list;
      return [created, ...list];
    });
  };

  const updateContact = useCallback((updated: Contacts) => {
    safeMutate((prev: Contacts[]) => {
      const list = Array.isArray(prev) ? prev : [];
      const exists = list.some((c) => c.id === updated.id);
      // si existe, reemplazar; si no, insertarlo
      return exists ? list.map((c) => (c.id === updated.id ? updated : c)) : [updated, ...list];
    });
  }, [safeMutate]);

  const removeContact = (id: number) => {
    safeMutate((prev: Contacts[]) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.filter((c) => c.id !== id);
    });
  };

  // Loading skeleton centralizado
  const { showLoading, hideLoading, setSkeleton } = useLoading();
  useEffect(() => {
    setSkeleton("contactsTable", { rows: 8, showSections: true });
  }, [setSkeleton]);
  useEffect(() => {
    if (showSkeleton || isLoading) {
      showLoading("contactsTable", { rows: 8, showSections: true });
    } else {
      hideLoading();
    }
    return () => {
      hideLoading();
    };
  }, [showSkeleton, isLoading, showLoading, hideLoading]);

  return {
    contacts,
    isLoading,
    error,
    refetchContacts,
    showSkeleton,
    addContact,
    updateContact,
    removeContact,
  };
}
