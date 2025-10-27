import type { ProjectType } from '@/leads';

import type { LeadStatus } from '..';

export interface StatusBadgeProps {
  status: LeadStatus | string | null | undefined;
  className?: string;
}

export interface ProjectTypeBadgeProps {
  projectType: ProjectType | null;
  className?: string;
}

export interface BadgeVariant {
  color: string;
  background: string;
  border?: string;
}
