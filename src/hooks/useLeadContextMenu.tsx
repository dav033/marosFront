import {
  useContextMenu,
  type ContextMenuOption,
} from "@components/common/ContextMenu";
import { LeadsService } from "@services/LeadsService";
import type { Lead, UseLeadContextMenuProps } from "src/types";



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
      // Call the delete callback first
      if (onDelete) {
        onDelete(lead.id);
      }

      const result = await LeadsService.deleteLead(lead.id);

      if (!result.success) {
        alert(`Error deleting lead: ${result.message}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Unexpected error deleting lead. Page will reload.");
      window.location.reload();
    }
  };

  const getLeadContextOptions = (lead: Lead): ContextMenuOption[] => [
    {
      id: "edit",
      label: "Edit Lead",
      icon: "material-symbols:edit",
      onClick: () => {
        onEdit?.(lead);
        hideContextMenu();
      },
      variant: "default",
    },
    {
      id: "duplicate",
      label: "Duplicate Lead",
      icon: "material-symbols:content-copy",
      onClick: () => {
        console.log("Duplicate lead:", lead.id);
      },
      variant: "default",
    },
    {
      id: "divider-1",
      label: "─────────────",
      icon: "",
      onClick: () => {},
      disabled: true,
    },
    {
      id: "view-details",
      label: "View Details",
      icon: "material-symbols:visibility",
      onClick: () => {
        console.log("View lead details:", lead.id);
      },
      variant: "default",
    },
    {
      id: "view-contact",
      label: "View Contact",
      icon: "material-symbols:person",
      onClick: () => {
        console.log("View lead contact:", lead.contact);
      },
      variant: "default",
    },
    {
      id: "divider-2",
      label: "─────────────",
      icon: "",
      onClick: () => {},
      disabled: true,
    },
    {
      id: "change-status",
      label: "Change Status",
      icon: "material-symbols:swap-horiz",
      onClick: () => {
        console.log("Change lead status:", lead.id);
      },
      variant: "warning",
    },
    {
      id: "delete",
      label: "Delete Lead",
      icon: "material-symbols:delete",
      onClick: () => handleDeleteLead(lead),
      variant: "danger",
    },
  ];

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    getLeadContextOptions,
  };
};
