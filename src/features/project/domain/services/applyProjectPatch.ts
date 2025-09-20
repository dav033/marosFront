// src/features/project/domain/services/applyProjectPatch.ts

import { BusinessRuleError } from "../errors/BusinessRuleError";
import type { Project } from "../models/Project";
import type { ProjectPatch, ApplyProjectPatchResult } from "../../types";

/**
 * Aplica un patch a un Project existente, validando las reglas de negocio.
 */
export function applyProjectPatch(
  project: Project,
  patch: ProjectPatch
): ApplyProjectPatchResult {
  let hasChanges = false;
  const updatedProject = { ...project };

  // Aplicar cambios del patch
  if (patch.projectName !== undefined && patch.projectName !== project.projectName) {
    const normalizedName = patch.projectName.trim();
    if (!normalizedName) {
      throw new BusinessRuleError("VALIDATION_ERROR", "Project name cannot be empty");
    }
    updatedProject.projectName = normalizedName;
    hasChanges = true;
  }

  if (patch.overview !== undefined && patch.overview !== project.overview) {
    updatedProject.overview = patch.overview?.trim() || undefined;
    hasChanges = true;
  }

  if (patch.payments !== undefined && JSON.stringify(patch.payments) !== JSON.stringify(project.payments)) {
    // Validar que todos los pagos sean números válidos y no negativos
    if (patch.payments) {
      const invalidPayments = patch.payments.filter(p => 
        typeof p !== 'number' || isNaN(p) || p < 0
      );
      if (invalidPayments.length > 0) {
        throw new BusinessRuleError("VALIDATION_ERROR", "All payments must be valid non-negative numbers");
      }
    }
    updatedProject.payments = patch.payments;
    hasChanges = true;
  }

  if (patch.projectStatus !== undefined && patch.projectStatus !== project.projectStatus) {
    updatedProject.projectStatus = patch.projectStatus;
    hasChanges = true;
  }

  if (patch.invoiceStatus !== undefined && patch.invoiceStatus !== project.invoiceStatus) {
    updatedProject.invoiceStatus = patch.invoiceStatus;
    hasChanges = true;
  }

  if (patch.quickbooks !== undefined && patch.quickbooks !== project.quickbooks) {
    updatedProject.quickbooks = patch.quickbooks;
    hasChanges = true;
  }

  if (patch.startDate !== undefined && patch.startDate !== project.startDate) {
    updatedProject.startDate = patch.startDate;
    hasChanges = true;
  }

  if (patch.endDate !== undefined && patch.endDate !== project.endDate) {
    updatedProject.endDate = patch.endDate;
    hasChanges = true;
  }

  if (patch.leadId !== undefined && patch.leadId !== project.lead?.id) {
    // Note: leadId in patch represents the ID, but Project model contains full Lead object
    // This will need to be handled at the application layer when fetching the Lead
    // For now, we mark that there's a change but don't modify the lead property directly
    hasChanges = true;
  }

  // Validar fechas después de aplicar cambios
  if (updatedProject.startDate && updatedProject.endDate) {
    if (updatedProject.endDate <= updatedProject.startDate) {
      throw new BusinessRuleError("VALIDATION_ERROR", "End date must be after start date");
    }
  }

  return {
    project: updatedProject,
    hasChanges,
  };
}