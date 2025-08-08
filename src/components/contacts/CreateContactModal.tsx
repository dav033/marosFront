import { useState } from "react";
import { GenericButton } from "@components/common/GenericButton";
import Modal from "@components/common/modal/Modal";
import ModalBody from "@components/common/modal/ModalBody";
import ModalFooter from "@components/common/modal/ModalFooter";
import ModalHeader from "@components/common/modal/ModalHeader";
import { ContactsService } from "../../services/ContactsService";
import ContactForm from "./ContactForm";
import type { ContactFormData } from "./ContactForm";

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
}

export default function CreateContactModal({
  isOpen,
  onClose,
}: CreateContactModalProps) {
  const [form, setForm] = useState<ContactFormData>({
    companyName: "",
    name: "",
    occupation: "",
    product: "",
    phone: "",
    email: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.companyName || !form.name) {
      setError(
        "Please complete the required fields: Company Name and Contact Name"
      );
      return;
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newContact = await ContactsService.createContact({
        companyName: form.companyName,
        name: form.name,
        occupation: form.occupation || undefined,
        product: form.product || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
      });

      console.log("✅ Contact created successfully:", newContact);
      onClose(true); // shouldRefetch = true
    } catch (error) {
      console.error("❌ Error creating contact:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Unexpected error creating contact"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      companyName: "",
      name: "",
      occupation: "",
      product: "",
      phone: "",
      email: "",
      address: "",
    });
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader title="Create New Contact" onClose={handleClose} />

        <ModalBody>
          <ContactForm
            form={form}
            onChange={handleChange}
            error={error}
          />
        </ModalBody>

        <ModalFooter>
          <GenericButton
            type="button"
            onClick={handleClose}
            className="bg-theme-primary-alt hover:bg-theme-primary-alt/80"
            disabled={isLoading}
          >
            Cancel
          </GenericButton>
          <GenericButton type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Contact"}
          </GenericButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}
