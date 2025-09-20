// src/features/project/domain/services/validateProjectDates.ts

import { BusinessRuleError } from "../errors/BusinessRuleError";
import type { ISODate } from "../../types";

/**
 * Valida las fechas de un proyecto según las reglas de negocio.
 */
export function validateProjectDates(
  startDate?: ISODate,
  endDate?: ISODate
): void {
  // Si no hay fechas, no hay nada que validar
  if (!startDate && !endDate) {
    return;
  }

  // Si solo hay fecha de inicio o fin, es válido
  if (!startDate || !endDate) {
    return;
  }

  // Parsear fechas para comparación
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validar que las fechas sean válidas
  if (isNaN(start.getTime())) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Start date is not a valid date");
  }

  if (isNaN(end.getTime())) {
    throw new BusinessRuleError("VALIDATION_ERROR", "End date is not a valid date");
  }

  // La fecha de fin debe ser posterior a la fecha de inicio
  if (end <= start) {
    throw new BusinessRuleError("VALIDATION_ERROR", "End date must be after start date");
  }
}

/**
 * Valida que una fecha no sea demasiado antigua o futura.
 */
export function validateDateRange(
  date: ISODate,
  fieldName: string = "Date",
  minYearsBack: number = 10,
  maxYearsForward: number = 10
): void {
  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    throw new BusinessRuleError("VALIDATION_ERROR", `${fieldName} is not a valid date`);
  }

  const now = new Date();
  const minDate = new Date(now.getFullYear() - minYearsBack, 0, 1);
  const maxDate = new Date(now.getFullYear() + maxYearsForward, 11, 31);

  if (parsedDate < minDate) {
    throw new BusinessRuleError("VALIDATION_ERROR", 
      `${fieldName} cannot be more than ${minYearsBack} years in the past`);
  }

  if (parsedDate > maxDate) {
    throw new BusinessRuleError("VALIDATION_ERROR", 
      `${fieldName} cannot be more than ${maxYearsForward} years in the future`);
  }
}

/**
 * Normaliza una fecha ISO para asegurar formato consistente.
 */
export function normalizeDateISO(date: string): ISODate {
  const parsed = new Date(date);
  
  if (isNaN(parsed.getTime())) {
    throw new BusinessRuleError("FORMAT_ERROR", "Invalid date format");
  }

  // Retornar solo la parte de fecha (YYYY-MM-DD)
  return parsed.toISOString().split('T')[0] as ISODate;
}