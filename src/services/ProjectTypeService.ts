import { optimizedApiClient } from "src/lib/optimizedApiClient";
import type { ProjectType } from "src/types";

export const ProjectTypeService = {
  async getProjectTypes(): Promise<ProjectType[]> {
  const response = await optimizedApiClient.get<ProjectType[]>(`/project-types/all`);
  return response.data;
  },
};
