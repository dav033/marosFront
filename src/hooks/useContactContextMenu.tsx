// src/presentation/organisms/contacts/hooks/useContactContextMenu.ts
import type { Contacts } from "@/features/contact/domain/models/Contact";
import { useContextMenu } from "@/presentation/molecules/ContextMenu";
import type { ContextMenuOption, UseContactContextMenuProps } from "@/types";

// ✅ Usar Clean Architecture: Application + Infra (sin carpeta services)
import type { ContactsAppContext } from "@/features/contact/application";
import { deleteContact as ucDeleteContact } from "@/features/contact/application";
import { ContactHttpRepository } from "@/features/contact/infra";

// Factory mínimo de contexto (Contact). Si ya expones un makeContactsAppContext desde Application,
// puedes reemplazar esta función por ese factory y mantener la misma firma.
function makeContactsAppContext(): ContactsAppContext {
  return {
    repos: { contact: new ContactHttpRepository() },
    ports: {}, // no se requiere unicidad para delete
  };
}

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
      const ctx = makeContactsAppContext();
      // En Clean Architecture, delete no retorna boolean; si no lanza error, se asume éxito.
      await ucDeleteContact(ctx, contact.id);
      onDelete?.(contact.id);
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
        // TODO: Implement duplicate functionality
        hideContextMenu();
      },
    },
    {
      id: "view-details",
      label: "View Details",
      icon: "material-symbols:visibility",
      action: () => {
        // TODO: Implement view details functionality
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
