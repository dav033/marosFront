import React from "react";
import { SidebarProvider } from "../../contexts/SidebarContext";
import type { ReactNode } from "react";

interface SidebarWrapperProps {
  children: ReactNode;
}

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
