// Capa: Presentation — Contacts VM (tipos)
import type { Contact } from "@/features/contact/domain/models/Contact";

export interface ContactsVM {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
