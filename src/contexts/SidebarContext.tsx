import React, { createContext, useContext } from "react";

import type { SidebarContextType, SidebarProviderProps } from "@/types";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const value: SidebarContextType = {
    isOpen,
    toggle,
    open,
    close,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
