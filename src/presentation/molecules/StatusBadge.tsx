
import React from "react";

import type { LeadStatus } from "@/leads";
import { STATUS_LABELS } from "@/leads";

type Size = "sm" | "md";

const SIZE_CLASS: Record<Size, string> = {
  sm: "text-[11px] leading-tight px-2 py-1 rounded-md",
  md: "text-xs leading-tight px-3 py-1.5 rounded-lg",
};


const STATUS_STYLES: Partial<Record<LeadStatus, string>> = {
  NEW: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-900",
  TO_DO: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-900",
  IN_PROGRESS: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-900",
  DONE: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-900",
  LOST: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-900",
  UNDETERMINED: "bg-zinc-100 text-zinc-800 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700",
  NOT_EXECUTED: "bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/30 dark:text-slate-200 dark:ring-slate-900",
};


function toLeadStatus(input: LeadStatus | string): LeadStatus {
  const norm = String(input ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  switch (norm) {
    case "PENDING":
    case "NEW":
    case "TO_DO":
    case "TODO":
      return "TO_DO" as LeadStatus;
    case "IN_PROGRESS":
      return "IN_PROGRESS" as LeadStatus;
    case "COMPLETED":
    case "DONE":
      return "DONE" as LeadStatus;
    case "LOST":
      return "LOST" as LeadStatus;
    case "UNDETERMINED":
      return "UNDETERMINED" as LeadStatus;
    case "NOT_EXECUTED":
      return "NOT_EXECUTED" as LeadStatus;
    default:
      return "UNDETERMINED" as LeadStatus;
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
  const label = labelOverride ?? STATUS_LABELS[key] ?? String(key);

  const cn = [
    "inline-flex items-center justify-center font-medium align-middle max-w-full truncate",
    SIZE_CLASS[size],
    STATUS_STYLES[key],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cn} title={label}>
      {hideLabel ? null : label}
    </span>
  );
}
