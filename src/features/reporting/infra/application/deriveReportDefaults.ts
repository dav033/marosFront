import type { Project } from "@/features/project/domain/models/Project";

/**
 * Restoration Visit – defaults derivados de Project/Lead/Contacts.
 * Mantengo 'project_numer' porque así venía el payload del flujo original.
 * No existe 'project code' en Project; uso el leadNumber como número de proyecto.
 */
export function deriveVisitDefaults(project: Project) {
  const lead = project.lead;
  const contact = lead.contact;

  return {
    // Encabezado editable del formulario:
    project_numer: lead.leadNumber ?? "", // (sic) nombre tal cual lo usa el flujo
    project_name: project.projectName ?? "",
    project_location: lead.location ?? "",
    client_name: contact.companyName ?? "",
    customer_name: contact.name ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    date_started: project.startDate ?? "",
    language: "en",

    // Texto general:
    overview: project.overview ?? "",

    // Secciones dinámicas (UI):
  activities: [] as Array<{ activity: string; imageFiles?: File[]; imageIds?: Array<string | number> }>,
  additional_activities: [] as Array<{ activity: string; imageFiles?: File[]; imageIds?: Array<string | number> }>,
  evidence_images: [] as Array<{ description: string; imageFiles?: File[]; imageIds?: Array<string | number> }>,
    next_activities: [] as string[],
    observations: [] as string[],
  };
}

/**
 * Final Restoration – defaults derivados de Project/Lead/Contacts.
 */
export function deriveFinalDefaults(project: Project) {
  const lead = project.lead;
  const contact = lead.contact;

  return {
    // Encabezado editable:
    project_name: project.projectName ?? "",
    project_location: lead.location ?? "",
    client_name: contact.companyName ?? "",
    customer_name: contact.name ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    completion_date: project.endDate ?? "",
    language: "en",

    // Texto/áreas largas:
    overview: project.overview ?? "",
    final_evaluation: "",

    // Secciones dinámicas:
    completed_activities: [] as string[],
  evidence_images: [] as Array<{ description: string; imageFiles?: File[]; imageIds?: Array<string | number> }>,
  };
}

