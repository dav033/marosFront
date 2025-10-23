import type { Contact } from "@/contact";

export interface ContactsVM {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
