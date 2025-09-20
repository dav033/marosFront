import React from "react";
import Badge, { type BadgeColor, type BadgeSize, type BadgeVariant } from "@/presentation/atoms/Badge";
import { LeadStatus } from "@/features/leads/enums";

export type StatusBadgeProps = {
  /** Estado del lead. Acepta null/undefined/"null" y lo trata como UNDETERMINED */
  status?: LeadStatus | null | string;
  /** Ajustes visuales que proxyamos al átomo Badge */
  size?: BadgeSize;            // "sm" | "md" | "lg"
  variant?: BadgeVariant;      // "solid" | "soft" | "outline"
  uppercase?: boolean;
  className?: string;
  /** Permite sobreescribir la etiqueta si necesitas traducción/contexto distinto */
  labelOverride?: string;
};

type StatusConfig = {
  label: string;
  icon: string;        // iconify name
  color: BadgeColor;   // "gray" | "primary" | "success" | "warning" | "danger"
};

const STATUS_MAP: Record<string, StatusConfig> = {
  // Valores mapeados (los que usa buildSections)
  "Pending": {
    label: "Pending",
    icon: "material-symbols:add-circle-outline-sharp",
    color: "primary",
  },
  "In Progress": {
    label: "In progress",
    icon: "material-symbols:schedule",
    color: "warning",
  },
  "Completed": {
    label: "Completed",
    icon: "material-symbols:check-circle",
    color: "success",
  },
  "Undetermined": {
    label: "Undetermined",
    icon: "material-symbols:help-outline",
    color: "gray",
  },
  "Lost": {
    label: "Lost",
    icon: "material-symbols:cancel",
    color: "danger",
  },
  // Valores originales para compatibilidad
  [LeadStatus.NEW]: {
    label: "New",
    icon: "material-symbols:add-circle-outline-sharp",
    color: "primary",
  },
  [LeadStatus.UNDETERMINED]: {
    label: "Undetermined",
    icon: "material-symbols:help-outline",
    color: "gray",
  },
  [LeadStatus.TO_DO]: {
    label: "To do",
    icon: "material-symbols:flag",
    color: "primary",
  },
  [LeadStatus.IN_PROGRESS]: {
    label: "In progress",
    icon: "material-symbols:schedule",
    color: "warning",
  },
  [LeadStatus.DONE]: {
    label: "Done",
    icon: "material-symbols:check-circle",
    color: "success",
  },
  [LeadStatus.LOST]: {
    label: "Lost",
    icon: "material-symbols:cancel",
    color: "danger",
  },
  [LeadStatus.NOT_EXECUTED]: {
    label: "Not executed",
    icon: "material-symbols:block",
    color: "gray",
  },
};

export default function StatusBadge({
  status,
  size = "md",
  variant = "solid",
  uppercase = false,
  className = "",
  labelOverride,
}: StatusBadgeProps) {
  // Normalizamos null/undefined/"null" → UNDETERMINED
  const effective =
    (status === null || status === undefined || status === "null"
      ? LeadStatus.UNDETERMINED
      : (status as LeadStatus));

  const cfg = STATUS_MAP[effective] ?? STATUS_MAP[LeadStatus.UNDETERMINED];

  return (
    <Badge
      label={labelOverride ?? cfg.label}
      leftIcon={cfg.icon}
      color={cfg.color}
      variant={variant}
      size={size}
      rounded="full"
      uppercase={uppercase}
      className={className}
    />
  );
}
