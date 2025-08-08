import React from "react";
import Table from "../common/table/Table";
import { useContactContextMenu } from "../../hooks/useContactContextMenu";
import type { Column } from "src/types/types";
import type { Contacts } from "src/types/types";

interface ContactSectionProps {
  title: string;
  data: Contacts[];
  columns: Column<Contacts>[];
  onEditContact?: (contact: Contacts) => void;
  onDeleteContact?: (contactId: number) => void;
}

export default function ContactSection({
  title,
  data,
  columns,
  onEditContact,
  onDeleteContact,
}: ContactSectionProps) {
  const { getContactContextOptions } = useContactContextMenu({
    onEdit: onEditContact,
    onDelete: onDeleteContact,
  });

  // Define column widths specifically for contacts table (8 columns)
  const contactColumnWidths = [
    "w-[18%]", // Company (18%)
    "w-[18%]", // Contact Name (18%)
    "w-[12%]", // Occupation (12%)
    "w-[12%]", // Product (12%)
    "w-[12%]", // Phone (12%)
    "w-[18%]", // Email (18%)
    "w-[15%]", // Address (15%)
    "w-[12%]", // Last Contact (12%)
  ];

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
