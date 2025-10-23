import type { CreateContactRequestDTO } from "@/contact";
import { ContactHttpRepository } from "@/contact";

export class ContactRepositoryAdapterForLeads {
  private http = new ContactHttpRepository();

  async saveNew(payload: CreateContactRequestDTO): Promise<number> {
    const created = await this.http.create(payload);
    return (created as any).id as number;
  }
}
