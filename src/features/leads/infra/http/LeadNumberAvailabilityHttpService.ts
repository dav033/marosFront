// src/features/leads/infra/http/LeadNumberAvailabilityHttpService.ts

import type { LeadNumberAvailabilityPort } from "@/features/leads/domain/ports/LeadNumberAvailabilityPort";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { HttpClientLike } from "@/shared/infra/http/types";

import { endpoints } from "./endpoints";

type ValidateLeadNumberDTO = Readonly<{ valid: boolean }>;

export class LeadNumberAvailabilityHttpService
  implements LeadNumberAvailabilityPort
{
  constructor(private readonly api: HttpClientLike = optimizedApiClient) {}

  async isAvailable(leadNumber: string): Promise<boolean> {
    if (!leadNumber) return true; // vacío = no forzamos validación de unicidad
    const { data } = await this.api.get<ValidateLeadNumberDTO>(
      endpoints.validateLeadNumber(leadNumber),
      { cache: { enabled: true, strategy: "network-first", ttl: 30_000 } }
    );
    return !!data?.valid;
  }
}
