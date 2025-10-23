import type { Lead, LeadDraft, LeadId, LeadPatch,LeadType } from "@/leads";

export interface LeadRepositoryPort {
    findById(id: LeadId): Promise<Lead | null>;

    findByType(type: LeadType): Promise<Lead[]>;

    saveNew(draft: LeadDraft): Promise<Lead>;

    update(id: LeadId, patch: LeadPatch): Promise<Lead>;

    delete(id: LeadId): Promise<void>;
}
