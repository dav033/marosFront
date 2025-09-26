import React from "react";

import { Icon,Input } from "@/presentation/atoms";
import type { ContactFormData } from "@/types";

export type ContactFormProps = {
  form: ContactFormData;
  onChange: <K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) => void;
  disabled?: boolean;
  className?: string;
};

const ContactForm: React.FC<ContactFormProps> = ({
  form,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      <Input
        value={form.companyName}
        onChange={(e) => onChange("companyName", e.target.value)}
        placeholder="Company *"
        leftAddon={<Icon name="material-symbols:business-center" />}
        disabled={disabled}
      />
      <Input
        value={form.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Contact name *"
        leftAddon={<Icon name="material-symbols:person" />}
        disabled={disabled}
      />
      <Input
        value={form.occupation ?? ""}
        onChange={(e) => onChange("occupation", e.target.value)}
        placeholder="Occupation"
        leftAddon={<Icon name="material-symbols:badge" />}
        disabled={disabled}
      />
      <Input
        value={form.product ?? ""}
        onChange={(e) => onChange("product", e.target.value)}
        placeholder="Product"
        leftAddon={<Icon name="material-symbols:inventory-2" />}
        disabled={disabled}
      />
      <Input
        value={form.phone ?? ""}
        onChange={(e) => onChange("phone", e.target.value)}
        placeholder="Phone"
        leftAddon={<Icon name="material-symbols:settings-phone-sharp" />}
        disabled={disabled}
      />
      <Input
        value={form.email ?? ""}
        onChange={(e) => onChange("email", e.target.value)}
        placeholder="Email"
        leftAddon={<Icon name="material-symbols:attach-email-outline" />}
        disabled={disabled}
      />
      <Input
        value={form.address ?? ""}
        onChange={(e) => onChange("address", e.target.value)}
        placeholder="Address"
        leftAddon={<Icon name="material-symbols:home-pin" />}
        disabled={disabled}
      />
    </div>
  );
};

export default ContactForm;
