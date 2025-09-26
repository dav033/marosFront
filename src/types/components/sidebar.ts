import type { ReactNode } from "react";

export interface SidebarWrapperProps {
  children: ReactNode;
}

export interface TriggerProps {
  title: string;
  icon?: string;
  className?: string;
}

export interface SidebarDropdownProps {
  trigger: TriggerProps;
  width?: string;
  children: React.ReactNode;
  duration?: number;
  indentLevel?: number;
  defaultOpen?: boolean;
}
