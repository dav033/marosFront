import { useContextMenu } from "@components/common/ContextMenu";
import type { ContextMenuOption, Lead, UseLeadContextMenuProps } from "@/types";

export const useLeadContextMenu = ({
  onEdit,
  onDelete,
}: UseLeadContextMenuProps = {}) => {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const handleDeleteLead = async (lead: Lead) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete lead ${lead.leadNumber}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await onDelete?.(lead);
      hideContextMenu();
    } catch (error) {
      console.error("Error deleting lead:", error);
      // (Opcional) mostrar toast, pero NO recargar la página
    }
  };

  const getLeadContextOptions = (lead: Lead): ContextMenuOption[] => {
    return [
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
        console.log("Duplicate lead:", lead.id);
      },

    },
    {
      id: "divider-1",
      label: "─────────────",
      icon: "",
      action: () => {},
      disabled: true,
    },
    {
      id: "view-details",
      label: "View Details",
      icon: "material-symbols:visibility",
      action: () => {
        console.log("View lead details:", lead.id);
      },

    },
    {
      id: "view-contact",
      label: "View Contact",
      icon: "material-symbols:person",
      action: () => {
        console.log("View lead contact:", lead.contact);
      },

    },
    {
      id: "divider-2",
      label: "─────────────",
      icon: "",
      action: () => {},
      disabled: true,
    },
    {
      id: "change-status",
      label: "Change Status",
      icon: "material-symbols:swap-horiz",
      action: () => {
        console.log("Change lead status:", lead.id);
      },

    },
    {
      id: "delete",
      label: "Delete Lead", 
      icon: "material-symbols:delete",
      action: () => handleDeleteLead(lead),
      danger: true,
    },
  ];
  };

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    getLeadContextOptions,
  };
};
