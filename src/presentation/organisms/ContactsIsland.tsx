// src/presentation/organisms/ContactsIsland.tsx
import React from "react";
import ContactsTable from "./ContactsTable";
import { useInstantContacts } from "@/hooks/useInstantContacts";

import { LoadingProvider } from "@/presentation/context/loading/LoadingContext";
import useLoading from "@/presentation/context/loading/hooks/useLoading";
import SkeletonRenderer from "@/presentation/organisms/SkeletonRenderer";

function ContactsIslandInner() {
  const hook = useInstantContacts() as any;
  const contacts = hook.contacts ?? [];
  const isLoading = hook.isLoading ?? hook.loading ?? false;
  const error = hook.error ?? null;
  const refetch = hook.refetch ?? (hook.reload ? () => hook.reload(true) : undefined);

  const { setSkeleton, showLoading, hideLoading } = useLoading();

  React.useEffect(() => {
    console.log("[ContactsIsland] MOUNT");
    return () => console.log("[ContactsIsland] UNMOUNT");
  }, []);

  // ⚙️ Configura tipo de skeleton: SIN overlay
  React.useEffect(() => {
    console.log("[ContactsIsland] setSkeleton -> contactsTable (inline)");
    setSkeleton("contactsTable", { rows: 15 /* overlay: false por defecto */ });
  }, [setSkeleton]);

  // 🔁 Refleja la carga real al contexto global (sin overlay)
  React.useEffect(() => {
    console.log("[ContactsIsland] isLoading=", isLoading);
    if (isLoading) {
      console.log("[ContactsIsland] showLoading()");
      showLoading("contactsTable", { rows: 15 }); // ← sin overlay
    } else {
      console.log("[ContactsIsland] hideLoading()");
      hideLoading();
    }
    return () => {
      console.log("[ContactsIsland] cleanup -> hideLoading()");
      hideLoading();
    };
  }, [isLoading, showLoading, hideLoading]);

  if (error) {
    const message = typeof error === "string" ? error : error?.message;
    console.log("[ContactsIsland] ERROR", message);
    return <div className="p-4 text-red-600">Error: {message}</div>;
  }

  console.log("[ContactsIsland] render table, contacts=", contacts?.length ?? 0);
  return (
    <div className="space-y-6">
      {isLoading ? (
        // 🧱 Skeleton ocupa el mismo espacio que la tabla
        <SkeletonRenderer />
      ) : (
        <ContactsTable contacts={contacts} onRefetch={refetch} />
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
