// src/features/contacts/types/index.ts

export interface ContactFormData {
  customerName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
}

export interface ContactModeSelectorProps {
  contactMode: import("../../../types/enums").ContactMode;
  onContactModeChange: (mode: import("../../../types/enums").ContactMode) => void;
  form: ContactFormData;
  onChange: (field: string, value: string) => void;
  isLoading?: boolean;
}
