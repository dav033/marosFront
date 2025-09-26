import React from "react";

import { useSidebarNavigation } from "../../hooks/useSidebarNavigation.tsx";
import SidebarDropdown from "./SidebarDropdown.tsx";
import SidebarItem from "./SidebarItem.tsx";
const SIDEBAR_CONFIG = {
  leads: {
    trigger: {
      title: "Lead",
      icon: "material-symbols:leaderboard-outline",
      className: "w-full h-[30px] py-5 hover:bg-gray-800 text-left",
    },
    items: [
      {
        title: "Construction",
        to: "/leads/construction",
        icon: "material-symbols:construction",
      },
      {
        title: "Plumbing",
        to: "/leads/plumbing",
        icon: "material-symbols:plumbing",
      },
      {
        title: "Roofing",
        to: "/leads/roofing",
        icon: "material-symbols:roofing",
      },
    ],
  },
  contacts: {
    title: "Contacts",
    to: "/contacts",
    icon: "material-symbols:contacts",
  },
  reports: {
    trigger: {
      title: "Reports",
      icon: "material-symbols:partner-reports",
      className: "w-full h-[30px] py-5 hover:bg-gray-800 text-left",
    },
    nested: {
      trigger: {
        title: "Remodelation",
        icon: "material-symbols:house-siding-rounded",
        className: "w-full h-[30px] py-5 hover:bg-gray-800 text-left",
      },
      items: [
        { title: "Follow-up Report", to: "/reports/all" },
        { title: "Final Report", to: "/reports/monthly" },
        { title: "Restoration Visit", to: "/reports/restorationVisit" },
        { title: "Restoration Final", to: "/reports/restorationFInal" },
      ],
    },
  },
} as const;

export default function Sidebar() {
  const { currentPath } = useSidebarNavigation();
  const shouldBeOpen = (routes: string[]) => {
    return routes.some(route => currentPath.startsWith(route));
  };
  const isLeadsOpen = shouldBeOpen(['/leads']);
  const isReportsOpen = shouldBeOpen(['/reports']);

  return (
    <aside className="fixed min-h-screen flex-col justify-start w-80 py-4 mr-64 bg-dark border-r border-gray-800">
      <nav className="w-full" role="navigation" aria-label="Sidebar navigation">
        {/* Leads Dropdown */}
        <SidebarDropdown
          trigger={SIDEBAR_CONFIG.leads.trigger}
          indentLevel={0}
          defaultOpen={isLeadsOpen}
        >
          {SIDEBAR_CONFIG.leads.items.map((item) => (
            <SidebarItem
              key={item.to}
              title={item.title}
              to={item.to}
              icon={item.icon}
              currentPath={currentPath}
            />
          ))}
        </SidebarDropdown>

        {/* Contacts Item */}
        <SidebarItem
          title={SIDEBAR_CONFIG.contacts.title}
          to={SIDEBAR_CONFIG.contacts.to}
          icon={SIDEBAR_CONFIG.contacts.icon}
          currentPath={currentPath}
        />

        {/* Reports Dropdown */}
        <SidebarDropdown
          trigger={SIDEBAR_CONFIG.reports.trigger}
          indentLevel={0}
          defaultOpen={isReportsOpen}
        >
          <SidebarDropdown
            trigger={SIDEBAR_CONFIG.reports.nested.trigger}
            indentLevel={16}
            defaultOpen={isReportsOpen}
          >
            {SIDEBAR_CONFIG.reports.nested.items.map((item) => (
              <SidebarItem
                key={item.to}
                title={item.title}
                to={item.to}
                currentPath={currentPath}
              />
            ))}
          </SidebarDropdown>
        </SidebarDropdown>
      </nav>
    </aside>
  );
}
