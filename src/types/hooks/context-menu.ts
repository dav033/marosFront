
import type { MouseEvent, ReactNode } from "react";

import type { Lead } from "@/leads";

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuOption {
  id: string;
  label: string;
  icon?: ReactNode;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
  shortcut?: string;
}

export interface ContextMenuState {
  isVisible: boolean;
  position: ContextMenuPosition;
  options: ContextMenuOption[];
}

export interface UseContextMenuResult {
  isVisible: boolean;
  position: ContextMenuPosition;
  options: ContextMenuOption[];
  show: (event: MouseEvent, options: ContextMenuOption[]) => void;
  hide: () => void;
}
export interface ContactContextMenuOptions {
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onCreateLead?: () => void;
}

export interface LeadContextMenuOptions {
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onViewContact?: () => void;
}

export interface UseContactContextMenuProps {
  onEdit?: (contact: unknown) => void;
  onDelete?: (contact: unknown) => void;
  onCreateLead?: (contact: unknown) => void;
}

export interface UseLeadContextMenuProps<T = Lead> {
  onEdit?: (lead: T) => void;
  onDelete?: (lead: T) => void;
  onDuplicate?: (lead: T) => void;
}
