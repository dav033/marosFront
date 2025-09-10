import React from "react";
import type { Column, Contacts } from "@/types";
import { formatDate } from "src/utils/dateHelpers";

export const contactTableColumns: Column<Contacts>[] = [
  {
    id: "companyName",
    header: "Company",
    accessor: (contact) => contact.companyName,
    type: "string",
    key: "",
    label: ""
  },
  {
    id: "name",
    header: "Contact Name",
    accessor: (contact) => contact.name,
    type: "string",
    key: "",
    label: ""
  },
  {
    id: "occupation",
    header: "Occupation",
    accessor: (contact) => contact.occupation ?? "—",
    type: "string",
    key: "",
    label: ""
  },
  {
    id: "product",
    header: "Product",
    accessor: (contact) => contact.product ?? "—",
    type: "string",
    key: "",
    label: ""
  },
  {
    id: "phone",
    header: "Phone",
    accessor: (contact) => contact.phone ?? "—",
    type: "string",
    key: "",
    label: ""
  },
  {
    id: "email",
    header: "Email",
    accessor: (contact) => contact.email ?? "—",
    type: "string",
    key: "",
    label: ""
  },
  {
    id: "address",
    header: "Address",
    accessor: (contact) => contact.address ?? "—",
    type: "string",
    key: "",
    label: ""
  },
  {
    id: "lastContact",
    header: "Last Contact",
    accessor: (contact) => formatDate(contact.lastContact, { format: "medium" }),
    type: "string",
    key: "",
    label: ""
  },
];
