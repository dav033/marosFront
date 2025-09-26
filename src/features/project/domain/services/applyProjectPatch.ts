import type { ApplyProjectPatchResult,ProjectPatch } from "@/features/project/types";
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import type { Project } from "../models/Project";

export function applyProjectPatch(project: Project, patch: ProjectPatch): ApplyProjectPatchResult {
  let hasChanges = false;
  const updatedProject: Project = { ...project }; // ✅ corregido

  if (patch.projectName !== undefined && patch.projectName !== project.projectName) {
    const normalizedName = patch.projectName.trim();
    if (!normalizedName) {
      throw new BusinessRuleError("VALIDATION_ERROR", "Project name cannot be empty");
    }
    updatedProject.projectName = normalizedName;
    hasChanges = true;
  }

  if (patch.overview !== undefined && patch.overview !== project.overview) {
    updatedProject.overview = patch.overview?.trim() || "";
    hasChanges = true;
  }

  if (patch.payments !== undefined) {
    if (!Array.isArray(patch.payments) || patch.payments.some(p => typeof p !== "number" || !isFinite(p) || p < 0)) {
      throw new BusinessRuleError("VALIDATION_ERROR", "payments must be an array of non-negative numbers");
    }
    updatedProject.payments = [...patch.payments];
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
  return { project: updatedProject, hasChanges };
}
