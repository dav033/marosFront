// src/presentation/molecules/contact/ContactColumns.tsx
import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Column } from "@/types";

// Anchos (la tabla usa style.width)
export const contactColumnWidths: Record<
  | "companyName"
  | "name"
  | "occupation"
  | "product"
  | "phone"
  | "email"
  | "address"
  | "lastContact",
  string
> = {
  companyName: "18%",
  name: "18%",
  occupation: "12%",
  product: "12%",
  phone: "12%",
  email: "18%",
  address: "15%",
  lastContact: "12%",
};

// Helper para definir columnas sin repetir label/header
const col = <K extends keyof Contact>(
  key: K,
  header: string,
  width: string,
  accessor?: (r: Contact) => unknown
): Column<Contact> => ({
  key, // mantiene keyof Contacts si tu Column lo soporta
  label: header, // ✅ requerido por el tipo Column
  header, // tu TableHeader usa header || label
  width,
  ...(accessor ? { accessor } : {}),
});

export const contactTableColumns: Column<Contact>[] = [
  col(
    "companyName",
    "Company",
    contactColumnWidths.companyName,
    (r) => r.companyName
  ),
  col("name", "Contact Name", contactColumnWidths.name, (r) => r.name),
  col(
    "occupation",
    "Occupation",
    contactColumnWidths.occupation,
    (r) => r.occupation ?? ""
  ),
  col(
    "product",
    "Product",
    contactColumnWidths.product,
    (r) => r.product ?? ""
  ),
  col("phone", "Phone", contactColumnWidths.phone, (r) => r.phone ?? ""),
  col("email", "Email", contactColumnWidths.email, (r) => r.email ?? ""),
  col(
    "address",
    "Address",
    contactColumnWidths.address,
    (r) => r.address ?? ""
  ),
  col(
    "lastContact",
    "Last Contact",
    contactColumnWidths.lastContact,
    (r) => r.lastContact ?? ""
  ),
];

export default contactTableColumns;
