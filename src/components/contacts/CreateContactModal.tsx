import { GenericButton } from "@components/common/GenericButton";
import Modal from "@components/common/modal/Modal";
import ModalBody from "@components/common/modal/ModalBody";
import ModalFooter from "@components/common/modal/ModalFooter";
import ModalHeader from "@components/common/modal/ModalHeader";
import { useState } from "react";
import { OptimizedContactsService } from "src/services/OptimizedContactsService";
import type { ContactFormData } from "./ContactForm";
import ContactForm from "./ContactForm";

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
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Pre-validate uniqueness
      const validation = await OptimizedContactsService.validateContact({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
      });
      if (!validation.nameAvailable || !validation.emailAvailable || !validation.phoneAvailable) {
        const fe: { name?: string; email?: string; phone?: string } = {};
        if (!validation.nameAvailable) fe.name = validation.nameReason || "Name already exists";
        if (!validation.emailAvailable) fe.email = validation.emailReason || "Email already exists";
        if (!validation.phoneAvailable) fe.phone = validation.phoneReason || "Phone already exists";
        setFieldErrors(fe);
        setIsLoading(false);
        return;
      }

      const newContact = await OptimizedContactsService.createContact({
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
  setFieldErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader title="Create New Contact" onClose={handleClose} />

        <ModalBody>
          <ContactForm form={form} onChange={handleChange} error={error} />
          {Object.keys(fieldErrors).length > 0 && (
            <div className="mt-2 space-y-1">
              {fieldErrors.name && (
                <div className="text-red-600 text-sm">{fieldErrors.name}</div>
              )}
              {fieldErrors.email && (
                <div className="text-red-600 text-sm">{fieldErrors.email}</div>
              )}
              {fieldErrors.phone && (
                <div className="text-red-600 text-sm">{fieldErrors.phone}</div>
              )}
            </div>
          )}
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
