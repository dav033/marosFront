// src/presentation/components/lead/StatusBadge.tsx
import React from "react";
import { LeadStatus } from "@/features/leads/domain"; // ajuste la ruta si su enum vive en otro módulo

type Size = "sm" | "md";

const SIZE_CLASS: Record<Size, string> = {
  sm: "text-xs px-2 py-0.5 rounded-md",
  md: "text-sm px-2.5 py-1 rounded-lg",
};

/**
 * Estilos por estado: claves EXACTAS del enum.
 * Si agrega/quita un estado en LeadStatus, TypeScript exigirá actualizar aquí.
 */
const STATUS_STYLES: Record<LeadStatus, string> = {
  [LeadStatus.NEW]:
    "bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:ring-indigo-900",
  [LeadStatus.UNDETERMINED]:
    "bg-zinc-100 text-zinc-800 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700",
  [LeadStatus.TO_DO]:
    "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-900",
  [LeadStatus.IN_PROGRESS]:
    "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-900",
  [LeadStatus.DONE]:
    "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-900",
  [LeadStatus.LOST]:
    "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-900",
  [LeadStatus.NOT_EXECUTED]:
    "bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/30 dark:text-slate-200 dark:ring-slate-900",
};

export type StatusBadgeProps = Readonly<{
  /** Estado EXACTO del enum de dominio. */
  status: LeadStatus;
  /** Tamaño visual del badge. */
  size?: Size;
  /** Clases extra para personalización. */
  className?: string;
  /** Si true, oculta el texto y deja solo el chip de color. */
  hideLabel?: boolean;
}>;

export function StatusBadge({
  status,
  size = "sm",
  className = "",
  hideLabel = false,
}: StatusBadgeProps) {
  const cls = [
    "inline-flex items-center font-medium",
    SIZE_CLASS[size],
    STATUS_STYLES[status],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Muestra exactamente el valor del enum (p.ej., "IN_PROGRESS")
  return <span className={cls}>{hideLabel ? null : status}</span>;
}

export default StatusBadge;
