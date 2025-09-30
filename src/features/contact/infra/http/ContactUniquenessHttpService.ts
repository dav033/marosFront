import type { Contact } from "@/features/contact/domain/models/Contact";
import type {
  ContactUniquenessCheck,
  ContactUniquenessPort,
} from "@/features/contact/domain/ports/ContactUniquenessPort";
import {
  type ApiContactDTO,
  mapContactsFromDTO,
} from "@/features/contact/domain/services/contactReadMapper";
import { listPotentialDuplicates } from "@/features/contact/domain/services/contactUniquenessPolicy";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { HttpClientLike } from "@/shared/infra/http/types";

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
    const { data } = await this.api.get<ApiContactDTO[]>(endpoints.list());
    const all = mapContactsFromDTO(data ?? []);
    return listPotentialDuplicates(candidate as unknown as Contact, all);
  }
}
