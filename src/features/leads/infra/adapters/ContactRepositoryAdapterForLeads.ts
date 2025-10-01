import { ContactHttpRepository } from "@/features/contact/infra";
import type { CreateContactRequestDTO } from "@/features/contact/domain/services/mapContactDTO";

export class ContactRepositoryAdapterForLeads {
  private http = new ContactHttpRepository();

  async saveNew(payload: CreateContactRequestDTO): Promise<number> {
    const created = await this.http.create(payload);
    return (created as any).id as number;
  }
}
