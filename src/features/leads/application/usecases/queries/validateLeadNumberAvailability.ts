// src/features/leads/application/usecases/queries/validateLeadNumberAvailability.ts
import { ensureLeadNumberAvailable } from "@/features/leads/domain/services/leadNumberPolicy";
import type { LeadsAppContext } from "../../context";

/**
 * Verifica disponibilidad. No lanza si está disponible.
 * Lanza BusinessRuleError("CONFLICT") si ya está en uso.
 */
export async function validateLeadNumberAvailability(
  ctx: LeadsAppContext,
  leadNumber: string
): Promise<void> {
  await ensureLeadNumberAvailable(leadNumber, async (n) => {
    // adaptamos: policy espera "exists"→boolean tomado; el port expone "isAvailable"
    const available = await ctx.services.leadNumberAvailability.isAvailable(n);
    return !available; // exists → !isAvailable
  });
}
