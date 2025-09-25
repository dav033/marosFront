import React from "react";

import { SidebarProvider } from "@/contexts/SidebarContext";
import type { SidebarWrapperProps } from "@/types";

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
