import type { UseContactContextMenuProps } from "@/types";
import {
  useContextMenu,
  type ContextMenuOption,
} from "@components/common/ContextMenu";
import { OptimizedContactsService } from "src/services/OptimizedContactsService";
import type { Contacts } from "../types/types";

export const useContactContextMenu = ({
  onEdit,
  onDelete,
}: UseContactContextMenuProps = {}) => {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const handleDeleteContact = async (contact: Contacts) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete contact ${contact.name}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const result = await OptimizedContactsService.deleteContact(contact.id);

      // Si no hubo excepción y result indica éxito, refrescar via callback
      if (result) {
        onDelete?.(contact.id);
      } else {
        alert("Could not delete contact.");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Unexpected error deleting contact.");
    }
  };

  const getContactContextOptions = (contact: Contacts): ContextMenuOption[] => [
    {
      id: "edit",
      label: "Edit Contact",
      icon: "material-symbols:edit",
      onClick: () => {
        onEdit?.(contact);
        hideContextMenu();
      },
      variant: "default",
    },
    {
      id: "duplicate",
      label: "Duplicate Contact",
      icon: "material-symbols:content-copy",
      onClick: () => {
        // TODO: Implement duplicate functionality
        hideContextMenu();
      },
      variant: "default",
    },
    {
      id: "view-details",
      label: "View Details",
      icon: "material-symbols:visibility",
      onClick: () => {
        // TODO: Implement view details functionality
        hideContextMenu();
      },
      variant: "default",
    },
    {
      id: "delete",
      label: "Delete Contact",
      icon: "material-symbols:delete",
      onClick: () => {
        handleDeleteContact(contact);
        hideContextMenu();
      },
      variant: "danger",
    },
  ];

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    getContactContextOptions,
  };
};
