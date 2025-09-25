// Capa: Presentation — ProjectType VM (tipos)
import type { ProjectType } from "@/features/leads/domain/models/ProjectType";

export interface ProjectTypesVM {
  projectTypes: ProjectType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
