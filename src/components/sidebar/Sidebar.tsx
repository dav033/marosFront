import React from "react";
import { useSidebarNavigation } from "../../hooks/useSidebarNavigation.tsx";
import SidebarDropdown from "./SidebarDropdown";
import SidebarItem from "./SidebarItem";

// Configuración de navegación como constante
const SIDEBAR_CONFIG = {
  leads: {
    id: "leads",
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
    id: "reports",
    trigger: {
      title: "Reports",
      icon: "material-symbols:partner-reports",
      className: "w-full h-[30px] py-5 hover:bg-gray-800 text-left",
    },
    nested: {
      id: "reports-remodelation",
      trigger: {
        title: "Remodelation",
        icon: "material-symbols:house-siding-rounded",
        className: "w-full h-[30px] py-5 hover:bg-gray-800 text-left",
      },
      items: [
        { title: "Follow-up Report", to: "/reports/all" },
        { title: "Final Report", to: "/reports/monthly" },
      ],
    },
  },
} as const;

export default function Sidebar() {
  const { currentPath, toggleDropdown, isDropdownOpen } =
    useSidebarNavigation();

  return (
    <aside className="fixed min-h-screen flex-col justify-start w-80 py-4 mr-64 bg-dark border-r border-gray-800">
      <nav className="w-full" role="navigation" aria-label="Sidebar navigation">
        {/* Leads Dropdown */}
        <SidebarDropdown
          id={SIDEBAR_CONFIG.leads.id}
          trigger={SIDEBAR_CONFIG.leads.trigger}
          indentLevel={0}
          isOpen={isDropdownOpen(SIDEBAR_CONFIG.leads.id)}
          onToggle={toggleDropdown}
          currentPath={currentPath}
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
          id={SIDEBAR_CONFIG.reports.id}
          trigger={SIDEBAR_CONFIG.reports.trigger}
          indentLevel={0}
          isOpen={isDropdownOpen(SIDEBAR_CONFIG.reports.id)}
          onToggle={toggleDropdown}
          currentPath={currentPath}
        >
          <SidebarDropdown
            id={SIDEBAR_CONFIG.reports.nested.id}
            trigger={SIDEBAR_CONFIG.reports.nested.trigger}
            indentLevel={16}
            isOpen={isDropdownOpen(SIDEBAR_CONFIG.reports.nested.id)}
            onToggle={toggleDropdown}
            currentPath={currentPath}
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
