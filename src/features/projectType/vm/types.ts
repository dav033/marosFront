import type { ProjectType } from "@/leads";

export interface ProjectTypesVM {
  projectTypes: ProjectType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
