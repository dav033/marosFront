
import type { Lead } from "@/leads";
import { useContextMenu } from "@/presentation";
import type { ContextMenuOption, UseLeadContextMenuProps } from "@/types";


export const useLeadContextMenu = <
  T extends { id?: number | string; leadNumber?: string; contact?: unknown } = Lead
>({
  onEdit,
  onDelete,
  onDuplicate,
}: UseLeadContextMenuProps<T> = {}) => {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const handleDeleteLead = async (lead: T) => {
  const display = (lead as unknown as Record<string, unknown>)["leadNumber"] ?? (lead as unknown as Record<string, unknown>)["id"] ?? "";
    const confirmed = typeof window !== "undefined" &&
      globalThis.window?.confirm?.(
        `Are you sure you want to delete lead ${display}?`
      );
    if (!confirmed) return;

    try {
      await onDelete?.(lead);
      hideContextMenu();
    } catch (error) {
      globalThis.console?.error?.("Error deleting lead:", error);
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
  action: () => globalThis.console?.log?.("View lead details:", (lead as unknown as Record<string, unknown>)["id"]),
    },
    {
      id: "view-contact",
      label: "View Contact",
    icon: "material-symbols:person",
  action: () => globalThis.console?.log?.("View lead contact:", (lead as unknown as Record<string, unknown>)["contact"]),
    },
    { id: "divider-2", label: "─────────────", action: () => {}, disabled: true, separator: true },
    {
      id: "change-status",
      label: "Change Status",
    icon: "material-symbols:swap-horiz",
  action: () => globalThis.console?.log?.("Change lead status:", (lead as unknown as Record<string, unknown>)["id"]),
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