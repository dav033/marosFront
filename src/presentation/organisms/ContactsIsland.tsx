import React from "react";
import useLoading from "@/presentation/context/loading/hooks/useLoading";
import { LoadingProvider } from "@/presentation/context/loading/LoadingContext";
import SkeletonRenderer from "@/presentation/organisms/SkeletonRenderer";
import type { Contact } from "@/features/contact/domain/models/Contact";
import ContactsTable from "./ContactsTable";
import { useContacts } from "../hooks/useContact";

function ContactsIslandInner() {
  type ContactLite = { id: number; name?: string; companyName?: string; email?: string; phone?: string };

  const hook = useContacts() as unknown as {
    contacts?: ContactLite[] | undefined;
    isLoading?: boolean | undefined;
    loading?: boolean | undefined;
    error?: unknown;
    refetch?: (() => Promise<void>) | undefined;
    reload?: ((force?: boolean) => Promise<void>) | undefined;
  };

  const contacts = (hook.contacts as ContactLite[]) ?? [];
  const isLoading = hook.isLoading ?? hook.loading ?? false;
  const error = hook.error ?? null;
  const refetch =
    hook.refetch ?? (hook.reload ? (() => hook.reload!(true)) : (async () => {}));

  const { setSkeleton, showLoading, hideLoading } = useLoading();
  React.useEffect(() => {
    setSkeleton("contactsTable", { rows: 15 /* overlay: false por defecto */ });
  }, [setSkeleton]);
  React.useEffect(() => {
    if (isLoading) {
      showLoading("contactsTable", { rows: 15 }); 
    } else {
      hideLoading();
    }
    return () => {
      hideLoading();
    };
  }, [isLoading, showLoading, hideLoading]);

  if (error) {
    const message = typeof error === "string" ? error : (error && typeof error === 'object' && 'message' in error ? String((error as { message?: unknown }).message ?? '') : String(error ?? ''));

    return <div className="p-4 text-red-600">Error: {message}</div>;
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <SkeletonRenderer />
      ) : (
  <ContactsTable contacts={contacts as unknown as Contact[]} onRefetch={refetch} />
      )}
    </div>
  );
}

export default function ContactsIsland() {
  return (
    <LoadingProvider>
      <ContactsIslandInner />
    </LoadingProvider>
  );
}