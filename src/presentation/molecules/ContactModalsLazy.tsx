import React, { lazy, Suspense } from "react";

import type { Contact } from "@/contact";
import type { ContactFormData } from "@/types";

const CreateContactModal = lazy(() =>
  import("@/presentation").then((m) => ({ default: m.CreateContactModal }))
);
const EditContactModal = lazy(() =>
  import("@/presentation").then((m) => ({ default: m.EditContactModal }))
);

export type ContactModalsLazyProps = {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  isEditOpen: boolean;
  onCloseEdit: () => void;
  editingContact: Contact | null;
  onSubmit: (values: ContactFormData) => Promise<void> | void;
  onContactUpdated: (updated: Contact) => Promise<void> | void;
};

const ContactModalsLazy: React.FC<ContactModalsLazyProps> = ({
  isCreateOpen,
  onCloseCreate,
  isEditOpen,
  onCloseEdit,
  editingContact,
  onSubmit,
  onContactUpdated,
}) => {
  return (
    <Suspense fallback={null}>
      {isCreateOpen && (
        <CreateContactModal 
          isOpen={isCreateOpen} 
          onClose={onCloseCreate}
          onSubmit={onSubmit}
        />
      )}
      {isEditOpen && editingContact && (
        <EditContactModal
          isOpen={isEditOpen}
          onClose={onCloseEdit}
          contact={editingContact}
          onContactUpdated={onContactUpdated}
        />
      )}
    </Suspense>
  );
};

export default ContactModalsLazy;
