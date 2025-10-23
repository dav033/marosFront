import React from "react";

import { ContactsTableSkeleton, FormSkeleton, ListSkeleton, TableSkeleton } from "@/presentation";
import { useLoading } from "@/presentation";

type SkeletonKind = "contactsTable" | "genericTable" | "leadsTable" | "list" | "form" | string;

type Props = {
  /** Fuerza la visibilidad del skeleton. Si no se pasa, usa el estado global (React Query). */
  loading?: boolean;
  /** Tipo de skeleton a mostrar (por defecto: tabla genérica). */
  type?: SkeletonKind;
  /** Número de filas a renderizar en el skeleton (si aplica). */
  rows?: number;
  /** Muestra secciones en tablas (si aplica). */
  showSections?: boolean;
  /** Renderiza el skeleton como overlay bloqueante. */
  overlay?: boolean;
};

const SkeletonRenderer: React.FC<Props> = ({
  loading,
  type = "genericTable",
  rows,
  showSections = true,
  overlay = false,
}) => {
    const { isLoading } = useLoading();
  const visible = loading ?? isLoading;

  if (!visible) return null;

  let content: React.ReactNode;

  switch (type) {
    case "contactsTable":
      content = <ContactsTableSkeleton rows={rows ?? 15} data-testid="sk-contacts" />;
      break;

    case "list":
      content = <ListSkeleton rows={rows ?? 8} data-testid="sk-list" />;
      break;

    case "form":
      content = <FormSkeleton rows={rows ?? 6} data-testid="sk-form" />;
      break;

    case "leadsTable":
    case "genericTable":
    default:
      content = (
        <TableSkeleton
          rows={rows ?? 8}
          showSections={showSections}
          data-testid="sk-table"
        />
      );
      break;
  }

  if (overlay) {
    return (
      <div
        data-testid="sk-overlay"
        className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-[1px] flex items-start justify-center p-6 overflow-auto"
      >
        <div className="max-w-6xl w-full">{content}</div>
      </div>
    );
  }

  return <div data-testid="sk-inline">{content}</div>;
};

export default SkeletonRenderer;
