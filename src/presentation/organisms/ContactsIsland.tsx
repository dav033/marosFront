import React from "react";
import type { Contact } from "@/features/contact/domain/models/Contact";
import ContactsTable from "./ContactsTable";
import SkeletonRenderer from "@/presentation/organisms/SkeletonRenderer";
import { useContacts } from "../hooks/useContact";

export default function ContactsIsland() {
  type ContactLite = {
    id: number;
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
  };

    const hook = useContacts() as {
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
    hook.refetch ?? (hook.reload ? () => hook.reload!(true) : async () => {});

  if (error) {
    const message =
      typeof error === "string"
        ? error
        : error && typeof error === "object" && "message" in error
          ? String((error as { message?: unknown }).message ?? "")
          : String(error ?? "");
    return <div className="p-4 text-red-600">Error: {message}</div>;
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <SkeletonRenderer />
      ) : (
        <ContactsTable
          contacts={contacts as unknown as Contact[]}
          onRefetch={refetch}
        />
      )}
    </div>
  );
}
