/* eslint-env browser */
import type { ContactsAppContext } from "@/contact";
import type { Contact } from "@/contact";
import { ContactHttpRepository, deleteContact as ucDeleteContact } from "@/contact";
import { useContextMenu } from "@/presentation";
import type { ContextMenuOption, UseContactContextMenuProps } from "@/types";
import { getErrorMessage } from "@/utils";
function makeContactsAppContext(): ContactsAppContext {
  return {
    repos: { contact: new ContactHttpRepository() },
  };
}

export const useContactContextMenu = ({
  onEdit,
  onDelete,
}: UseContactContextMenuProps = {}) => {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const handleDeleteContact = async (contact: Contact) => {
    const confirmed = typeof window !== "undefined" &&
      globalThis.window?.confirm?.(
        `Are you sure you want to delete contact ${contact.name}?\n\nThis action cannot be undone.`
      );
    if (!confirmed) return;

    try {
      const ctx = makeContactsAppContext();
      await ucDeleteContact(ctx, contact.id);
      onDelete?.(contact.id);
    } catch (error: unknown) {
      globalThis.console?.error?.("Error deleting contact:", getErrorMessage(error));
      globalThis.alert?.("Unexpected error deleting contact.");
    }
  };

  const getContactContextOptions = (contact: Contact): ContextMenuOption[] => [
    {
      id: "edit",
      label: "Edit Contact",
      icon: "material-symbols:edit",
      action: () => {
        onEdit?.(contact);
        hideContextMenu();
      },
    },
    {
      id: "duplicate",
      label: "Duplicate Contact",
      icon: "material-symbols:content-copy",
      action: () => {
        hideContextMenu();
      },
    },
    {
      id: "view-details",
      label: "View Details",
      icon: "material-symbols:visibility",
      action: () => {
        hideContextMenu();
      },
    },
    {
      id: "delete",
      label: "Delete Contact",
      icon: "material-symbols:delete",
      action: () => {
        handleDeleteContact(contact);
        hideContextMenu();
      },
      danger: true,
    },
  ];

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    getContactContextOptions,
  };
};
