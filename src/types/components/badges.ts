
import type { LeadStatus } from "../enums";

export interface StatusBadgeProps {
  status: LeadStatus | string | null | undefined;
  className?: string;
}

export interface ProjectTypeBadgeProps {
  projectType: {
    name: string;
    color?: string;
  } | null;
  className?: string;
}

export interface BadgeVariant {
  color: string;
  background: string;
  border?: string;
}
