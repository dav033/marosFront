import React from "react";
import type { Column } from "@/types";
import { formatDate } from "@utils/dateHelpers";
import type { Contacts } from "@/types";

export const contactTableColumns: Column<Contacts>[] = [
  {
    key: "name",
    label: "Name",
    id: "name",
    header: "Name",
    accessor: (contact) => contact.name,
    type: "string",
  },
  {
    key: "phone",
    label: "Phone",
    id: "phone",
    header: "Phone",
    accessor: (contact) => contact.phone || "—",
    type: "string",
  },
  {
    key: "email",
    label: "Email",
    id: "email",
    header: "Email",
    accessor: (contact) => contact.email || "—",
    type: "string",
  },
  {
    key: "company",
    label: "Company",
    id: "company",
    header: "Company",
    accessor: (contact) => contact.company || "—",
    type: "string",
  },
  {
    key: "createdAt",
    label: "Created",
    id: "createdAt",
    header: "Created",
    accessor: (contact) => contact.createdAt ? formatDate(contact.createdAt as string | Date, { format: "medium" }) : "—",
    type: "string",
  },
];
