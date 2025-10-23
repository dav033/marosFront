import type { Contact } from "@/contact";
import type { ContactUniquenessCheck, ContactUniquenessPort } from "@/contact";
import { type ApiContactDTO, mapContactsFromDTO } from "@/contact";
import { listPotentialDuplicates } from "@/contact";
import { type HttpClientLike,optimizedApiClient } from "@/shared";

import { contactEndpoints as endpoints } from "./endpoints";

export class ContactUniquenessHttpService implements ContactUniquenessPort {
  constructor(private readonly api: HttpClientLike = optimizedApiClient) {}

  async isDuplicate(
    candidate: ContactUniquenessCheck
  ): Promise<{ duplicate: boolean; conflictId?: number }> {
    const { data } = await this.api.get<{
      duplicate: boolean;
      conflictId?: number;
    }>(endpoints.uniquenessCheck(), {
      params: {
        name: candidate.name,
        companyName: candidate.companyName,
        email: candidate.email,
        phone: candidate.phone,
      },
    });
    return data ?? { duplicate: false };
  }

  async findDuplicates(candidate: ContactUniquenessCheck): Promise<Contact[]> {
    const listUrl = endpoints.list?.() ?? endpoints.base;
    const { data } = await this.api.get<ApiContactDTO[]>(listUrl);
    const all = mapContactsFromDTO(data ?? []);
    return listPotentialDuplicates(candidate as unknown as Contact, all);
  }
}
