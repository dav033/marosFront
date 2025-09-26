
import type { LeadType } from "../../enums";
import type { LeadDraft, LeadId, LeadPatch } from "../../types";
import type { Lead } from "../models/Lead";

export interface LeadRepositoryPort {
    findById(id: LeadId): Promise<Lead | null>;

    findByType(type: LeadType): Promise<Lead[]>;

    saveNew(draft: LeadDraft): Promise<Lead>;

    update(id: LeadId, patch: LeadPatch): Promise<Lead>;

    delete(id: LeadId): Promise<void>;
}
