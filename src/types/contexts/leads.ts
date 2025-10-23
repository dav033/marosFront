
import type React from "react";
import { type ReactNode } from "react";
import type { Lead, LeadStatus, LeadType } from "@/leads";

export interface LeadsState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
}

export type LeadsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LEADS"; payload: Lead[] }
  | { type: "ADD_LEAD"; payload: Lead }
  | { type: "UPDATE_LEAD"; payload: Lead }
  | { type: "DELETE_LEAD"; payload: number }
  | { type: "CLEAR_LEADS" };

export interface LeadsProviderProps {
  children: ReactNode;
}

export interface LeadsContextType extends LeadsState {
  dispatch: React.Dispatch<LeadsAction>;
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (leadId: number) => void;
  setLeads: (leads: Lead[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getLeadsByType: (type: LeadType) => Lead[];
  getLeadsByStatus: (status: LeadStatus) => Lead[];
  getUndeterminedLeads: () => Lead[];
  getPendingLeads: () => Lead[];
  getInProgressLeads: () => Lead[];
  getCompletedLeads: () => Lead[];
  getLostLeads: () => Lead[];
}
