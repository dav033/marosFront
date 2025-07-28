// types.ts
// Tipos generados a partir de los DTOs y enums de Java

import type { LeadStatus, LeadType, ProjectStatus, InvoiceStatus } from "./enums";

// Enums


// Interfaces de datos
export interface Contacts {
  id: number;
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string; // Fecha y hora en formato ISO 8601
}

export interface ProjectType {
  id: number;
  name: string;
}

export interface Leads {
  id: number;
  leadNumber: string;
  name: string;
  startDate: string; // Fecha en formato ISO 8601
  location?: string;
  status: LeadStatus;
  contact: Contacts;
  projectType: ProjectType;
  leadType: LeadType;
}

export interface Project {
  id: number;
  projectName: string;
  overview?: string;
  payments?: number[]; // Array de montos
  projectStatus: ProjectStatus;
  invoiceStatus: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: string; // Fecha en formato ISO 8601
  endDate?: string;   // Fecha en formato ISO 8601
  lead: Leads;
}

// Objetos de petición
export interface GetContactByNameRequest {
  name: string;
}

export interface GetLeadsByTypeRequest {
  type: LeadType;
}

export interface ErrorResponse {
  timestamp: string; // ISO 8601
  status: number;
  message: string;
  path: string;
}

// Tipos para la tabla reutilizable
export type SortDirection = "asc" | "desc";

export interface Column<T> {
  /** Identificador único de la columna */
  id: string;
  /** Texto a mostrar en el encabezado */
  header: string;
  /** Función para extraer el valor de la fila */
  accessor: (row: T) => string | number;
  /** Define el tipo de dato para escoger comparador */
  type: "string" | "number";
}
