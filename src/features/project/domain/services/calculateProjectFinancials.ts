// src/features/project/domain/services/calculateProjectFinancials.ts

import { BusinessRuleError } from "../errors/BusinessRuleError";

/**
 * Información financiera calculada de un proyecto.
 */
export interface ProjectFinancials {
  totalPayments: number;
  averagePayment: number;
  paymentCount: number;
  hasPayments: boolean;
  largestPayment: number;
  smallestPayment: number;
}

/**
 * Calcula la información financiera de un proyecto basada en sus pagos.
 */
export function calculateProjectFinancials(payments?: number[]): ProjectFinancials {
  if (!payments || payments.length === 0) {
    return {
      totalPayments: 0,
      averagePayment: 0,
      paymentCount: 0,
      hasPayments: false,
      largestPayment: 0,
      smallestPayment: 0,
    };
  }

  // Validar que todos los pagos sean números válidos
  const invalidPayments = payments.filter(p => 
    typeof p !== 'number' || isNaN(p) || p < 0
  );
  
  if (invalidPayments.length > 0) {
    throw new BusinessRuleError("VALIDATION_ERROR", "All payments must be valid non-negative numbers");
  }

  const totalPayments = payments.reduce((sum, payment) => sum + payment, 0);
  const averagePayment = totalPayments / payments.length;
  const largestPayment = Math.max(...payments);
  const smallestPayment = Math.min(...payments);

  return {
    totalPayments: Math.round(totalPayments * 100) / 100, // Redondear a 2 decimales
    averagePayment: Math.round(averagePayment * 100) / 100,
    paymentCount: payments.length,
    hasPayments: true,
    largestPayment: Math.round(largestPayment * 100) / 100,
    smallestPayment: Math.round(smallestPayment * 100) / 100,
  };
}

/**
 * Valida que un nuevo pago sea válido antes de agregarlo.
 */
export function validatePayment(payment: number): void {
  if (typeof payment !== 'number' || isNaN(payment)) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Payment must be a valid number");
  }

  if (payment < 0) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Payment cannot be negative");
  }

  if (payment > 999999999) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Payment amount is too large");
  }

  // Validar que no tenga más de 2 decimales
  const decimalPlaces = (payment.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Payment cannot have more than 2 decimal places");
  }
}

/**
 * Agrega un nuevo pago a la lista de pagos existentes.
 */
export function addPaymentToProject(
  existingPayments: number[] = [],
  newPayment: number
): number[] {
  validatePayment(newPayment);
  return [...existingPayments, newPayment];
}

/**
 * Calcula el progreso de pagos basado en un objetivo opcional.
 */
export function calculatePaymentProgress(
  payments: number[] = [],
  targetAmount?: number
): { 
  progress: number; // 0-100
  remaining: number;
  isComplete: boolean;
} {
  if (!targetAmount || targetAmount <= 0) {
    return {
      progress: 0,
      remaining: 0,
      isComplete: false,
    };
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment, 0);
  const progress = Math.min((totalPaid / targetAmount) * 100, 100);
  const remaining = Math.max(targetAmount - totalPaid, 0);
  const isComplete = totalPaid >= targetAmount;

  return {
    progress: Math.round(progress * 100) / 100,
    remaining: Math.round(remaining * 100) / 100,
    isComplete,
  };
}