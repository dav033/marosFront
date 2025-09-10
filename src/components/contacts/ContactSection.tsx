import React from "react";
import Table from "../common/table/Table";
import { useContactContextMenu } from "../../hooks/useContactContextMenu";
import type { Column, Contacts, ContactSectionProps } from "@/types";

export default function ContactSection({
  title,
  data,
  columns,
  onEditContact,
  onDeleteContact,
}: ContactSectionProps) {
  const { getContactContextOptions } = useContactContextMenu({
    onEdit: onEditContact ? (contact: unknown) => onEditContact(contact as Contacts) : undefined,
    onDelete: onDeleteContact ? (contact: unknown) => onDeleteContact((contact as Contacts).id) : undefined,
  });

  // Define column widths specifically for contacts table (8 columns)
  const contactColumnWidths: Record<string, string> = {
    company: "w-[18%]",        // Company (18%)
    contactName: "w-[18%]",    // Contact Name (18%)
    occupation: "w-[12%]",     // Occupation (12%)
    product: "w-[12%]",        // Product (12%)
    phone: "w-[12%]",          // Phone (12%)
    email: "w-[18%]",          // Email (18%)
    address: "w-[15%]",        // Address (15%)
    lastContact: "w-[12%]",    // Last Contact (12%)
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        {title} ({data.length})
      </h2>
      <Table
        columns={columns}
        data={data}
        contextMenuOptions={getContactContextOptions}
        showRowSeparators={true}
        columnWidths={contactColumnWidths}
      />
    </div>
  );
}
