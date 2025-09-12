import type { Lead } from "../../domain/entities/Lead";
import type { LeadType } from "../../domain/enums/LeadType";
import type { LeadRepositoryPort } from "../../domain/ports/LeadRepositoryPort";
import type { LeadDTO } from "../dto/leads/LeadDTO";
import { leadFromDTO, leadToDTO } from "../mappers/leads/lead.mapper";
import type { HttpClient } from "../http/httpClient";

export class LeadRestRepository implements LeadRepositoryPort {
  constructor(private readonly http: HttpClient) {}

  async list(type?: LeadType): Promise<Lead[]> {
    if (type) {
      // Use GET /leads/type?type={type} for filtering by type
      const { data } = await this.http.get<LeadDTO[]>(`/leads/type?type=${encodeURIComponent(type)}`);
      return data.map(leadFromDTO);
    } else {
      // Use GET /leads for all leads
      const { data } = await this.http.get<LeadDTO[]>("/leads");
      return data.map(leadFromDTO);
    }
  }

  async getById(id: number): Promise<Lead> {
    // Backend doesn't have getById endpoint, this would need to be implemented
    // For now, we'll throw an error to indicate this needs backend implementation
    throw new Error("getById endpoint not implemented in backend");
  }

  async createWithExistingContact(input: Omit<Lead, "id" | "contact"> & { contactId: number }): Promise<Lead> {
    // Use POST /leads/existing-contact with correct request structure
    const requestBody = {
      lead: leadToDTO({ ...input, contact: { id: input.contactId, name: "", phone: null, email: null, address: null, lastContact: null } } as unknown as Lead),
      contactId: input.contactId
    };
    const { data } = await this.http.post<LeadDTO>("/leads/existing-contact", requestBody);
    return leadFromDTO(data);
  }

  async createWithNewContact(input: Omit<Lead, "id" | "contact"> & { contact: Lead["contact"] }): Promise<Lead> {
    // Use POST /leads/new-contact with correct request structure
    const requestBody = {
      lead: leadToDTO({ ...input, contact: input.contact } as Lead),
      contact: input.contact
    };
    const { data } = await this.http.post<LeadDTO>("/leads/new-contact", requestBody);
    return leadFromDTO(data);
  }

  async update(id: number, patch: Partial<Lead>): Promise<Lead> {
    // Use PUT /leads/{leadId} with UpdateLeadRequest structure
    const requestBody = {
      lead: leadToDTO({ ...(patch as Lead) })
    };
    const { data } = await this.http.put<LeadDTO>(`/leads/${id}`, requestBody);
    return leadFromDTO(data);
  }

  async delete(id: number): Promise<void> {
    // Use DELETE /leads/{leadId}
    await this.http.delete<string>(`/leads/${id}`);
  }

  async validateLeadNumber(leadNumber: string) {
    // Use GET /leads/validate/lead-number?leadNumber={leadNumber}
    const { data } = await this.http.get<{ valid: boolean; reason?: string }>(`/leads/validate/lead-number?leadNumber=${encodeURIComponent(leadNumber)}`);
    return data;
  }
}