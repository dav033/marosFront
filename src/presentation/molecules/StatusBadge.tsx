import React from "react";
import { LeadStatus } from "@/features/leads/enums";

type Size = "sm" | "md";

const SIZE_CLASS: Record<Size, string> = {
  sm: "text-[11px] leading-tight px-2 py-1 rounded-md",
  md: "text-xs leading-tight px-3 py-1.5 rounded-lg",
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  [LeadStatus.NEW]:
    "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-900",
  [LeadStatus.TO_DO]:
    "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-900",
  [LeadStatus.IN_PROGRESS]:
    "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-900",
  [LeadStatus.DONE]:
    "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-900",
  [LeadStatus.LOST]:
    "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-900",
  [LeadStatus.UNDETERMINED]:
    "bg-zinc-100 text-zinc-800 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700",
  [LeadStatus.NOT_EXECUTED]:
    "bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/30 dark:text-slate-200 dark:ring-slate-900",
};

// Etiquetas UI
const STATUS_LABEL: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "Pending",
  [LeadStatus.TO_DO]: "Pending",
  [LeadStatus.IN_PROGRESS]: "In Progress",
  [LeadStatus.DONE]: "Completed",
  [LeadStatus.LOST]: "Lost",
  [LeadStatus.UNDETERMINED]: "Undetermined",
  [LeadStatus.NOT_EXECUTED]: "Not executed",
};

// Normalizar textos libres a LeadStatus
function toLeadStatus(input: LeadStatus | string): LeadStatus {
  if (Object.values(LeadStatus).includes(input as LeadStatus)) return input as LeadStatus;
  const norm = String(input).trim().toUpperCase().replace(/[\s-]+/g, "_");
  switch (norm) {
    case "PENDING":
    case "NEW":
    case "TO_DO":
    case "TODO":
      return LeadStatus.TO_DO;
    case "IN_PROGRESS":
      return LeadStatus.IN_PROGRESS;
    case "COMPLETED":
    case "DONE":
      return LeadStatus.DONE;
    case "LOST":
      return LeadStatus.LOST;
    case "UNDETERMINED":
      return LeadStatus.UNDETERMINED;
    case "NOT_EXECUTED":
      return LeadStatus.NOT_EXECUTED;
    default:
      return LeadStatus.UNDETERMINED;
  }
}

export type StatusBadgeProps = Readonly<{
  status: LeadStatus | string;
  size?: Size;
  className?: string;
  hideLabel?: boolean;
  labelOverride?: string;
}>;

export default function StatusBadge({
  status,
  size = "md",
  className = "",
  hideLabel = false,
  labelOverride,
}: StatusBadgeProps) {
  const key = toLeadStatus(status);
  const label = labelOverride ?? STATUS_LABEL[key];

  const cn = [
    "inline-flex items-center justify-center font-medium align-middle max-w-full truncate",
    SIZE_CLASS[size],
    STATUS_STYLES[key],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={cn} title={label}>{hideLabel ? null : label}</span>;
}
