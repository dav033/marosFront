// Capa: Presentation — Tipos del ViewModel
import type { Dispatch, SetStateAction } from "react";
import type { Lead } from "@/features/leads/domain/models/Lead";
import { LeadStatus, type LeadType } from "@/features/leads/enums";

export type AuxStatus = "UNDETERMINED" | "NOT_EXECUTED";
export type SectionKey = LeadStatus | AuxStatus;

export interface LeadSection {
  title: string;
  status?: SectionKey;
  data: Lead[];
}

export interface LeadsVMState {
  leads: Lead[];
  sections: LeadSection[];
  error: string | null;
  isLoading: boolean;
}

export interface LeadsVMModals {
  isCreateOpen: boolean;
  isCreateLocalOpen: boolean;
  isEditOpen: boolean;
  editingLead: Lead | null;
}

export interface LeadsVMHandlers {
  refetch: () => Promise<void>;
  setLeads: Dispatch<SetStateAction<Lead[]>>;
  openCreate: () => void;
  closeCreate: () => void;
  openCreateLocal: () => void;
  closeCreateLocal: () => void;
  openEdit: (lead: Lead) => void;
  closeEdit: () => void;
  onLeadUpdated: (lead: Lead) => void;
  onLeadDeleted: (leadId: Lead["id"]) => Promise<void>;
}

export type LeadsVM = LeadsVMState & { modals: LeadsVMModals } & LeadsVMHandlers;
export type LeadsVMDeps = { /* (No se usa en esta versión) */ };

export type LeadsVMParams = {
  leadType: LeadType;
};
