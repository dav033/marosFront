// src/features/contact/infra/http/ContactUniquenessHttpService.ts

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
      // ⬇️ El backend de origen espera query params en GET
      params: {
        name: candidate.name,
        companyName: candidate.companyName,
        email: candidate.email,
        phone: candidate.phone,
        // excludeId?: number // si más adelante lo soportas
      },
      cache: { enabled: true, strategy: "network-first", ttl: 10_000 },
    });
    return data ?? { duplicate: false };
  }

  /**
   * En el backend de origen no hay /contacts/duplicates.
   * Implementamos fallback: traemos todo y aplicamos la política pura.
   */
  async findDuplicates(candidate: ContactUniquenessCheck): Promise<Contact[]> {
    const { data } = await this.api.get<ApiContactDTO[]>(endpoints.list(), {
      cache: { enabled: true, strategy: "network-first", ttl: 10_000 },
    });
    const all = mapContactsFromDTO(data ?? []);
    // candidate comes from an external source and may have `| undefined` fields;
    // the listPotentialDuplicates signature accepts Contact | ContactLike — ensure typing matches safely.
    return listPotentialDuplicates(candidate as unknown as Contact, all);
  }
}
