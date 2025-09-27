import type { Project } from "@/features/project/domain/models/Project";

export function deriveFinalDefaults(project: Project) {
  const lead = project.lead;
  const contact = lead.contact;

  return {
    project_name: project.projectName ?? "",
    project_location: lead.location ?? "",
    client_name: contact.companyName ?? "",
    customer_name: contact.name ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    completion_date: project.endDate ?? "",
    language: "en",
    overview: project.overview ?? "",
    final_evaluation: "",
    completed_activities: [] as string[],
    evidence_images: [] as Array<{
      description: string;
      imageFiles?: File[];
      imageIds?: Array<string | number>;
    }>,
  };
}
