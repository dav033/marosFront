import React from "react";

import type { Contact } from "@/features/contact/domain/models/Contact";
import { useContactContextMenu } from "@/hooks/useContactContextMenu";
import type { Column } from "@/types";

// ⬇️ Usa la DataTable nueva (ajusta la ruta si es distinta en tu repo)
import DataTable from "./DataTable.tsx";

export type ContactSectionProps = {
  title: string;
  data: Contact[];
  columns: Column<Contact>[];
  onEditContact?: (c: Contact) => void;
  onDeleteContact?: (id: number) => void;
};

export default function ContactSection({
  title,
  data,
  columns,
  onEditContact,
  onDeleteContact,
}: ContactSectionProps) {
  const contactMenuOpts: Parameters<typeof useContactContextMenu>[0] = {};
  if (onEditContact) contactMenuOpts.onEdit = (contact: unknown) => onEditContact(contact as Contact);
  if (onDeleteContact) contactMenuOpts.onDelete = (contact: unknown) => onDeleteContact((contact as Contact).id);

  const { getContactContextOptions } = useContactContextMenu(contactMenuOpts);

  // (Opcional) Si definiste anchos por columna en tus Column<Contact>, DataTable los respeta.
  // Si prefieres forzar anchos por id/clave, puedes pasar `columnWidths={{ companyName:"18%", ... }}`.

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">
        {title} ({data.length})
      </h2>

  <DataTable<Contact>
        columns={columns}
        data={data}
        contextMenuOptions={getContactContextOptions}
        showRowSeparators
        // columnWidths={...} // ← solo si quieres forzar anchos por clave
      />
    </section>
  );
}