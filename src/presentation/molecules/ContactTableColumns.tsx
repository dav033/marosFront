import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Column } from "@/types";

/**
 * Columnas para la nueva Table (grid). Importante:
 * - `label` es requerido por el tipo Column
 * - `header` es lo que se muestra (si falta, TableHeader usa `label`)
 * - `width` se usa en el grid del body y como style.width en el header
 */
export const contactTableColumns: Column<Contact>[] = [
  {
    id: "company",
    key: "companyName",
    label: "companyName",
    header: "Company",
    width: "18%",
    accessor: (r) => r.companyName,
  },
  {
    id: "contactName",
    key: "name",
    label: "name",
    header: "Contact Name",
    width: "18%",
    accessor: (r) => r.name,
  },
  {
    id: "occupation",
    key: "occupation",
    label: "occupation",
    header: "Occupation",
    width: "12%",
    accessor: (r) => r.occupation ?? "",
  },
  {
    id: "product",
    key: "product",
    label: "product",
    header: "Product",
    width: "12%",
    accessor: (r) => r.product ?? "",
  },
  {
    id: "phone",
    key: "phone",
    label: "phone",
    header: "Phone",
    width: "12%",
    accessor: (r) => r.phone ?? "",
  },
  {
    id: "email",
    key: "email",
    label: "email",
    header: "Email",
    width: "18%",
    accessor: (r) => r.email ?? "",
  },
  {
    id: "address",
    key: "address",
    label: "address",
    header: "Address",
    width: "15%",
    accessor: (r) => r.address ?? "",
  },
  {
    id: "lastContact",
    key: "lastContact",
    label: "lastContact",
    header: "Last Contact",
    width: "12%",
    accessor: (r) => r.lastContact ?? "",
  },
];
