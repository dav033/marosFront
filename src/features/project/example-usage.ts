// src/features/project/example-usage.ts

/**
 * EXAMPLE USAGE - Este archivo muestra cómo usar la arquitectura de proyectos
 * No es parte del código de producción, solo documentación ejecutable
 */

import { ProjectApplicationContextFactory } from "./infra/ProjectApplicationContextFactory";
import type { ProjectDraft } from "./types";
import { ProjectStatus, InvoiceStatus } from "./enums";

// Ejemplo de uso básico
async function exampleUsage() {
  // 1. Crear el contexto de aplicación
  const projectContext = ProjectApplicationContextFactory.createHttpContext();

  // 2. Listar todos los proyectos
  const allProjects = await projectContext.getProjects.execute();
  console.log("Todos los proyectos:", allProjects);

  // 3. Obtener proyectos con leads
  const projectsWithLeads = await projectContext.getProjectsWithLeads.execute();
  console.log("Proyectos con leads:", projectsWithLeads);

  // 4. Buscar un proyecto específico
  const project = await projectContext.getProjectById.execute(1);
  console.log("Proyecto con ID 1:", project);

  // 5. Crear un nuevo proyecto
  const newProjectDraft: ProjectDraft = {
    projectName: "Nuevo Proyecto de Ejemplo",
    overview: "Descripción del proyecto",
    payments: [1000, 2000],
    projectStatus: ProjectStatus.IN_PROGRESS,
    invoiceStatus: InvoiceStatus.PENDING,
    quickbooks: false,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    leadId: 1
  };

  try {
    const createdProject = await projectContext.createProject.execute(newProjectDraft);
    console.log("Proyecto creado:", createdProject);

    // 6. Actualizar el proyecto
    const updatedProject = await projectContext.updateProject.execute(createdProject.id, {
      overview: "Descripción actualizada",
      projectStatus: ProjectStatus.COMPLETED
    });
    console.log("Proyecto actualizado:", updatedProject);

  } catch (error) {
    console.error("Error:", error);
  }
}

// Para usar en testing o desarrollo:
// exampleUsage().catch(console.error);