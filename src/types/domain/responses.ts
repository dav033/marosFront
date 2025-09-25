// src/types/domain/responses.ts

import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Lead } from "@/features/leads/domain/models/Lead";

import type { ProjectType } from "../components/leads";

// ===========================================
// API RESPONSE TYPES
// ===========================================

// API response wrapper for single items
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API response wrapper for collections
export interface ApiListResponse<T> {
  data: T[];
  success: boolean;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

// Specific API responses
export interface ContactsResponse extends ApiListResponse<Contact> {}
export interface LeadsResponse extends ApiListResponse<Lead> {}
export interface ProjectTypesResponse extends ApiListResponse<ProjectType> {}

// Single item responses
export interface ContactResponse extends ApiResponse<Contact> {}
export interface LeadResponse extends ApiResponse<Lead> {}
export interface ProjectTypeResponse extends ApiResponse<ProjectType> {}

// Specialized responses
export interface LeadNumberResponse extends ApiResponse<string> {}
