// Capa: Presentation — Contacts VM (tipos)
import type { Contacts } from "@/features/contact/domain/models/Contact";

export interface ContactsVM {
  contacts: Contacts[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
