// src/features/project/domain/services/ensureProjectIntegrity.ts

import { BusinessRuleError } from "../errors/BusinessRuleError";
import type { Project } from "../models/Project";

/**
 * Valida que un Project cumple las reglas de integridad básicas.
 */
export function ensureProjectIntegrity(project: Project): void {
  if (!project.id || project.id <= 0) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Project must have a valid ID");
  }
  
  if (!project.projectName?.trim()) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Project must have a name");
  }
  
  // Validar que si hay pagos, sean números válidos y no negativos
  if (project.payments) {
    const invalidPayments = project.payments.filter(p => 
      typeof p !== 'number' || isNaN(p) || p < 0
    );
    if (invalidPayments.length > 0) {
      throw new BusinessRuleError("VALIDATION_ERROR", "All payments must be valid non-negative numbers");
    }
  }
  
  // Validar fechas si están presentes
  if (project.startDate && project.endDate) {
    if (project.endDate <= project.startDate) {
      throw new BusinessRuleError("VALIDATION_ERROR", "End date must be after start date");
    }
  }
}