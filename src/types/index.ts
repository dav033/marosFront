import type { Contact } from "@/contact";

export * from "./components";
export * from "./domain";
export * from "./enums";
export * from "./hooks";
export * from "./system";
export type { Contact } from "@/contact";
// Re-export LeadType to satisfy imports expecting it from /src/types
export { LeadType } from "@/leads";

export interface UseInstantContactsResult {
  contacts: Contact[];
  isLoading: boolean;
  showSkeleton: boolean;
  error: Error | null;
  fromCache: boolean;
  refetch: () => Promise<void>;
}

export interface UseCreateLeadOptions {
  leadType: "new-contact" | "existing-contact";
  onLeadCreated?: (lead: unknown) => void;
}

export interface Section {
  name: string;
  data: unknown[];
}
