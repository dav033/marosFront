// src/hooks/useLeadContextMenu.tsx

import type { Lead } from "@/features/leads/domain/models/Lead";
import { useContextMenu, type ContextMenuOption } from "@/presentation/molecules/ContextMenu";
import type { UseLeadContextMenuProps } from "@/types/hooks/context-menu";


export const useLeadContextMenu = <
  T extends { id?: number | string; leadNumber?: string; contact?: unknown } = Lead
>({
  onEdit,
  onDelete,
  onDuplicate,
}: UseLeadContextMenuProps<T> = {}) => {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const handleDeleteLead = async (lead: T) => {
    const display = (lead as any).leadNumber ?? (lead as any).id ?? "";
    const confirmed = window.confirm(
      `Are you sure you want to delete lead ${display}?`
    );
    if (!confirmed) return;

    try {
      await onDelete?.(lead);
      hideContextMenu();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const getLeadContextOptions = (lead: T): ContextMenuOption[] => [
    {
      id: "edit",
      label: "Edit Lead",
      icon: "material-symbols:edit",
      action: () => {
        onEdit?.(lead);
        hideContextMenu();
      },
    },
    {
      id: "duplicate",
      label: "Duplicate Lead",
      icon: "material-symbols:content-copy",
      action: () => {
        onDuplicate?.(lead);
        hideContextMenu();
      },
      disabled: !onDuplicate,
    },
    { id: "divider-1", label: "─────────────", action: () => {}, disabled: true, separator: true },
    {
      id: "view-details",
      label: "View Details",
      icon: "material-symbols:visibility",
      action: () => console.log("View lead details:", (lead as any).id),
    },
    {
      id: "view-contact",
      label: "View Contact",
      icon: "material-symbols:person",
      action: () => console.log("View lead contact:", (lead as any).contact),
    },
    { id: "divider-2", label: "─────────────", action: () => {}, disabled: true, separator: true },
    {
      id: "change-status",
      label: "Change Status",
      icon: "material-symbols:swap-horiz",
      action: () => console.log("Change lead status:", (lead as any).id),
    },
    {
      id: "delete",
      label: "Delete Lead",
      icon: "material-symbols:delete",
      action: () => handleDeleteLead(lead),
      danger: true,
    },
  ];

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    getLeadContextOptions,
  };
};
