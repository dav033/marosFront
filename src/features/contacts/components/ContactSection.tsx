import React from "react";
import Table from "@components/common/table/Table";
import { useContactContextMenu } from "src/hooks/useContactContextMenu";
import type { Contacts, Column } from "@/types";

interface ContactSectionProps {
  title: string;
  data: Contacts[];
  columns: Column<Contacts>[];
  onEditItem?: (contact: Contacts) => void;
  onDeleteItem?: (contact: Contacts) => void;
}

export default function ContactSection({
  title,
  data,
  columns,
  onEditItem,
  onDeleteItem,
}: ContactSectionProps) {
  const { getContactContextOptions } = useContactContextMenu({
    onEdit: onEditItem ? (contact: unknown) => onEditItem(contact as Contacts) : undefined,
    onDelete: onDeleteItem ? (contact: unknown) => {
      const typedContact = contact as Contacts;
      if (typedContact?.id != null) {
        onDeleteItem(typedContact);
      } else {
        console.error("Cannot delete contact: invalid or missing ID", contact);
      }
    } : undefined,
  });

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        {title} ({data.length})
      </h2>
      <Table
        columns={columns}
        data={data}
        contextMenuOptions={getContactContextOptions}
      />
    </div>
  );
}
