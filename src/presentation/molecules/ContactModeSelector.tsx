// src/presentation/molecules/ContactModeSelector.tsx
import React from "react";

import { Icon,Input } from "@/presentation/atoms";
import ContactModeSwitch from "@/presentation/molecules/ContactModeSwitch";
import { ContactMode } from "@/types/enums";

// ✅ Exportamos estos tipos, y los usa el llamador (evita “two different types…”)
export type NewContactForm = {
  customerName: string;
  contactName: string;
  phone?: string | undefined;
  email?: string | undefined;
};

export type NewContactChangeHandler = <K extends keyof NewContactForm>(
  key: K,
  value: NewContactForm[K]
) => void;

export type ContactModeSelectorProps = {
  contactMode: ContactMode;
  onContactModeChange: (mode: ContactMode) => void;
  form: NewContactForm;
  onChange: NewContactChangeHandler;
  isLoading?: boolean;
  className?: string;
};

const ContactModeSelector: React.FC<ContactModeSelectorProps> = ({
  contactMode,
  onContactModeChange,
  form,
  onChange,
  isLoading = false,
  className = "",
}) => {
  return (
    <div className={className}>
      <div className="flex justify-center mb-4">
        <ContactModeSwitch
          mode={contactMode}
          onChange={onContactModeChange}
          disabled={isLoading}
          size="md"
          className="w-80"
        />
      </div>

      {contactMode === ContactMode.NEW_CONTACT && (
        <div className="grid gap-3">
          <Input
            value={form.customerName}
            onChange={(e) => onChange("customerName", e.target.value)}
            placeholder="Customer Name *"
            leftAddon={<Icon name="material-symbols:business-center" />}
            disabled={isLoading}
          />
          <Input
            value={form.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
            placeholder="Contact Name *"
            leftAddon={<Icon name="material-symbols:person" />}
            disabled={isLoading}
          />
          <Input
            value={form.phone ?? ""}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Phone"
            leftAddon={<Icon name="material-symbols:settings-phone-sharp" />}
            disabled={isLoading}
          />
          <Input
            value={form.email ?? ""}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Email"
            leftAddon={<Icon name="material-symbols:attach-email-outline" />}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default ContactModeSelector;
