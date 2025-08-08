import apiClient from "src/lib/apiClient";
import type { ProjectType } from "src/types/types";

export const ProjectTypeService = {
  async getProjectTypes(): Promise<ProjectType[]> {
    const response = await apiClient.get(`/project-types/all`);
    return response.data;
  },
};
