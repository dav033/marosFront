import type { ReactNode } from "react";
export interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export interface SidebarProviderProps {
  children: ReactNode;
}

export interface SidebarWrapperProps {
  children: ReactNode;
}

export interface SidebarItemProps {
  title: string;
  to: string;
  icon?: string;
  currentPath: string;
}

export interface TriggerProps {
  title: string;
  icon?: string;
  className?: string;
}

export interface SidebarDropdownProps {
  trigger: TriggerProps;
  width?: string;
  children: ReactNode;
  duration?: number;
  indentLevel?: number;
  defaultOpen?: boolean;
}
