import { Icon } from "@iconify/react";
import React, { memo } from "react";

import type { SidebarItemProps } from "@/types";

const SidebarItem = memo(function SidebarItem({
  title,
  to,
  icon,
  currentPath,
}: SidebarItemProps) {
  const isActive = currentPath === to;
  const className = [
    "w-full h-[30px] text-center hover:bg-gray-800 transition-colors duration-200",
    "flex items-center justify-start py-5 pl-4 pr-2",
    icon ? "gap-2" : "",
    isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a href={to} className={className} data-astro-prefetch="hover">
      {icon && <Icon icon={icon} className="p-0 m-0" />}
      {title}
    </a>
  );
});

export default SidebarItem;
