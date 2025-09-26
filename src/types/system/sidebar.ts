export interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
}

export interface SidebarWrapperProps {
  children: React.ReactNode;
}

export interface SidebarItemProps {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
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
