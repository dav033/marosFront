import type { Project } from "@/features/project/domain/models/Project";

export function deriveVisitDefaults(project: Project) {
  const lead = project.lead;
  const contact = lead.contact;

  return {
    project_numer: lead.leadNumber ?? "", // (sic) nombre tal cual lo usa el flujo
    project_name: project.projectName ?? "",
    project_location: lead.location ?? "",
    client_name: contact.companyName ?? "",
    customer_name: contact.name ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    date_started: project.startDate ?? "",
    language: "en",
    overview: project.overview ?? "",
  activities: [] as Array<{ activity: string; imageFiles?: File[]; imageIds?: Array<string | number> }>,
  additional_activities: [] as Array<{ activity: string; imageFiles?: File[]; imageIds?: Array<string | number> }>,
  evidence_images: [] as Array<{ description: string; imageFiles?: File[]; imageIds?: Array<string | number> }>,
    next_activities: [] as string[],
    observations: [] as string[],
  };
}

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
  evidence_images: [] as Array<{ description: string; imageFiles?: File[]; imageIds?: Array<string | number> }>,
  };
}

