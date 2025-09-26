import { ensureLeadNumberAvailable } from "@/features/leads/domain/services/leadNumberPolicy";

import type { LeadsAppContext } from "../../context";

export async function validateLeadNumberAvailability(
  ctx: LeadsAppContext,
  leadNumber: string
): Promise<void> {
  await ensureLeadNumberAvailable(leadNumber, async (n) => {
    const available = await ctx.services.leadNumberAvailability.isAvailable(n);
    return !available; // exists → !isAvailable
  });
}
