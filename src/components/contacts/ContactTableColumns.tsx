import React from "react";
import type { Column } from "src/types/types";
import type { Contacts } from "src/types/types";
import { formatDate } from "src/utils/dateHelpers";

export const contactTableColumns: Column<Contacts>[] = [
  {
    id: "companyName",
    header: "Company",
    accessor: (contact) => contact.companyName,
    type: "string",
  },
  {
    id: "name",
    header: "Contact Name",
    accessor: (contact) => contact.name,
    type: "string",
  },
  {
    id: "occupation",
    header: "Occupation",
    accessor: (contact) => contact.occupation ?? "—",
    type: "string",
  },
  {
    id: "product",
    header: "Product",
    accessor: (contact) => contact.product ?? "—",
    type: "string",
  },
  {
    id: "phone",
    header: "Phone",
    accessor: (contact) => contact.phone ?? "—",
    type: "string",
  },
  {
    id: "email",
    header: "Email",
    accessor: (contact) => contact.email ?? "—",
    type: "string",
  },
  {
    id: "address",
    header: "Address",
    accessor: (contact) => contact.address ?? "—",
    type: "string",
  },
  {
    id: "lastContact",
    header: "Last Contact",
    accessor: (contact) =>
      formatDate(contact.lastContact, { format: "medium" }),
    type: "string",
  },
];
