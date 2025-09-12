import type { Contact } from "../../domain/entities/Contact";
import type { ContactRepositoryPort } from "../../domain/ports/ContactRepositoryPort";
import type { ContactDTO } from "../dto/contacts/ContactDTO";
import { contactFromDTO, contactToDTO } from "../mappers/contacts/contact.mapper";
import type { HttpClient } from "../http/httpClient";

export class ContactRestRepository implements ContactRepositoryPort {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Contact[]> {
    const { data } = await this.http.get<ContactDTO[]>("/contacts");
    return data.map(contactFromDTO);
  }

  async getById(id: number): Promise<Contact> {
    const { data } = await this.http.get<ContactDTO>(`/contacts/${id}`);
    return contactFromDTO(data);
  }

  async create(contact: Contact): Promise<Contact> {
    const { data } = await this.http.post<ContactDTO>("/contacts", contactToDTO(contact));
    return contactFromDTO(data);
  }

  async update(id: number, patch: Partial<Contact>): Promise<Contact> {
    const { data } = await this.http.put<ContactDTO>(`/contacts/${id}`, contactToDTO(patch as Contact));
    return contactFromDTO(data);
  }

  async delete(id: number): Promise<void> {
    await this.http.delete<void>(`/contacts/${id}`);
  }

  async validateAvailability(params: { name?: string; email?: string; phone?: string; excludeId?: number }) {
    const search = new URLSearchParams();
    if (params.name) search.set("name", params.name);
    if (params.email) search.set("email", params.email);
    if (params.phone) search.set("phone", params.phone);
    if (params.excludeId != null) search.set("excludeId", String(params.excludeId));
    const { data } = await this.http.get<{ nameAvailable: boolean; emailAvailable: boolean; phoneAvailable: boolean; nameReason?: string; emailReason?: string; phoneReason?: string }>(
      `/contacts/validate?${search.toString()}`
    );
    return data;
  }
}