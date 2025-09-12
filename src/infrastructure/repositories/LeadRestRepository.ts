import type { Lead } from "../../domain/entities/Lead";
import type { LeadType } from "../../domain/enums/LeadType";
import type { LeadRepositoryPort } from "../../domain/ports/LeadRepositoryPort";
import type { LeadDTO } from "../dto/leads/LeadDTO";
import { leadFromDTO, leadToDTO } from "../mappers/leads/lead.mapper";
import type { HttpClient } from "../http/httpClient";

export class LeadRestRepository implements LeadRepositoryPort {
  constructor(private readonly http: HttpClient) {}

  async list(type?: LeadType): Promise<Lead[]> {
    const query = type ? `?type=${encodeURIComponent(type)}` : "";
    const { data } = await this.http.get<LeadDTO[]>(`/leads${query}`);
    return data.map(leadFromDTO);
  }

  async getById(id: number): Promise<Lead> {
    const { data } = await this.http.get<LeadDTO>(`/leads/${id}`);
    return leadFromDTO(data);
  }

  async createWithExistingContact(input: Omit<Lead, "id" | "contact"> & { contactId: number }): Promise<Lead> {
    const dto = leadToDTO({ ...input, contact: { id: input.contactId, name: "", phone: null, email: null, address: null, lastContact: null } } as unknown as Lead);
    const { data } = await this.http.post<LeadDTO>("/leads", { ...dto, contactId: input.contactId });
    return leadFromDTO(data);
  }

  async createWithNewContact(input: Omit<Lead, "id" | "contact"> & { contact: Lead["contact"] }): Promise<Lead> {
    const dto = leadToDTO({ ...input, contact: input.contact } as Lead);
    const { data } = await this.http.post<LeadDTO>("/leads", dto);
    return leadFromDTO(data);
  }

  async update(id: number, patch: Partial<Lead>): Promise<Lead> {
    const dtoPatch = leadToDTO({ ...(patch as Lead) });
    const { data } = await this.http.put<LeadDTO>(`/leads/${id}`, dtoPatch);
    return leadFromDTO(data);
  }

  async delete(id: number): Promise<void> {
    await this.http.delete<void>(`/leads/${id}`);
  }

  async validateLeadNumber(leadNumber: string) {
    const { data } = await this.http.get<{ valid: boolean; reason?: string }>(`/leads/validate-number?leadNumber=${encodeURIComponent(leadNumber)}`);
    return data;
  }
}