import { useContextMenu, type ContextMenuOption } from "@components/common/ContextMenu";
import { useContacts } from "../contexts/ContactsContext";
import { ContactsService } from "../services/ContactsService";
import type { Contacts } from "../types/types";

interface UseContactContextMenuProps {
  onEdit?: (contact: Contacts) => void;
}

export const useContactContextMenu = ({ onEdit }: UseContactContextMenuProps = {}) => {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  const { removeContact } = useContacts();

  const handleDeleteContact = async (contact: Contacts) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete contact ${contact.name}?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      removeContact(contact.id);
      
      const result = await ContactsService.deleteContact(contact.id);
      
      if (!result) {
        alert(`Error deleting contact`);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Unexpected error deleting contact. Page will reload.');
      window.location.reload();
    }
  };

  const getContactContextOptions = (contact: Contacts): ContextMenuOption[] => [
    {
      id: 'edit',
      label: 'Edit Contact',
      icon: 'material-symbols:edit',
      onClick: () => {
        onEdit?.(contact);
        hideContextMenu();
      },
      variant: 'default',
    },
    {
      id: 'duplicate',
      label: 'Duplicate Contact',
      icon: 'material-symbols:content-copy',
      onClick: () => {
        // TODO: Implement duplicate functionality
        hideContextMenu();
      },
      variant: 'default',
    },
    {
      id: 'view-details',
      label: 'View Details',
      icon: 'material-symbols:visibility',
      onClick: () => {
        // TODO: Implement view details functionality
        hideContextMenu();
      },
      variant: 'default',
    },
    {
      id: 'delete',
      label: 'Delete Contact',
      icon: 'material-symbols:delete',
      onClick: () => {
        handleDeleteContact(contact);
        hideContextMenu();
      },
      variant: 'danger',
    },
  ];

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    getContactContextOptions,
  };
};
