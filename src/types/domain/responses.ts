
import type { Contact } from "@/contact";
import type { Lead, ProjectType } from "@/leads";
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
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
export interface ContactsResponse extends ApiListResponse<Contact> {}
export interface LeadsResponse extends ApiListResponse<Lead> {}
export interface ProjectTypesResponse extends ApiListResponse<ProjectType> {}
export interface ContactResponse extends ApiResponse<Contact> {}
export interface LeadResponse extends ApiResponse<Lead> {}
export interface ProjectTypeResponse extends ApiResponse<ProjectType> {}
export interface LeadNumberResponse extends ApiResponse<string> {}
