// src/presentation/organisms/ContactSection.tsx
import React from "react";
// ⬇️ Usa la DataTable nueva (ajusta la ruta si es distinta en tu repo)
import DataTable from "./DataTable.tsx";
import { useContactContextMenu } from "@/hooks/useContactContextMenu";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import type { Column } from "@/types";

export type ContactSectionProps = {
  title: string;
  data: Contacts[];
  columns: Column<Contacts>[];
  onEditContact?: (c: Contacts) => void;
  onDeleteContact?: (id: number) => void;
};

export default function ContactSection({
  title,
  data,
  columns,
  onEditContact,
  onDeleteContact,
}: ContactSectionProps) {
  const { getContactContextOptions } = useContactContextMenu({
    onEdit: onEditContact
      ? (contact: unknown) => onEditContact(contact as Contacts)
      : undefined,
    onDelete: onDeleteContact
      ? (contact: unknown) => onDeleteContact((contact as Contacts).id)
      : undefined,
  });

  // (Opcional) Si definiste anchos por columna en tus Column<Contacts>, DataTable los respeta.
  // Si prefieres forzar anchos por id/clave, puedes pasar `columnWidths={{ companyName:"18%", ... }}`.

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">
        {title} ({data.length})
      </h2>

      <DataTable<Contacts>
        columns={columns}
        data={data}
        contextMenuOptions={getContactContextOptions}
        showRowSeparators
        // columnWidths={...} // ← solo si quieres forzar anchos por clave
      />
    </section>
  );
}
