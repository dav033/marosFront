import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLeadsApp } from '@/di';
// Eliminado: import { patchLead } from '@/features/leads/application';
import type { Lead } from '@/leads';
import { LeadStatus, LeadType } from '@/leads';
import type { LeadFormData } from '@/types';


type UseEditLeadControllerOptions = {
  lead: Lead | null;
  onSaved?: (lead: Lead) => void;
};

export function useEditLeadController({
  lead,
  onSaved,
}: UseEditLeadControllerOptions) {
  const app = useLeadsApp();

  const initialForm: LeadFormData = useMemo(
    () => ({
      name: lead?.name ?? '',
      leadType: lead?.leadType ?? LeadType.CONSTRUCTION,
      startDate: lead?.startDate ?? '',
      status: (lead?.status as LeadStatus | null) ?? LeadStatus.NEW,
      leadNumber: lead?.leadNumber ?? '',
      leadName: lead?.name ?? '',
      location: lead?.location ?? '',
      projectTypeId: lead?.projectType?.id,
      contactId: lead?.contact?.id,
      customerName: '',
      contactName: '',
      phone: '',
      email: '',
      companyName: '',
      occupation: '',
      product: '',
      address: '',
    }),
    [lead],
  );

  const [form, setForm] = useState<LeadFormData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialForm);
    setError(null);
  }, [initialForm]);

  const handleChange = useCallback(
    (field: keyof LeadFormData, value: string | number) => {
      setError(null);
      setForm((prev) => {
        if (field === 'projectTypeId' || field === 'contactId') {
          return {
            ...prev,
            [field]:
              value === '' || value === undefined || value === null
                ? undefined
                : Number(value),
          };
        }
        if (field === 'status') {
          return {
            ...prev,
            status: value === '' ? null : (value as LeadStatus),
          };
        }
        // Evitar mutar 'next' directamente (seguro si LeadFormData tuviera readonly)
        const base = { ...prev, [field]: String(value ?? '') } as LeadFormData;
        if (field === 'leadName' && !base.name) {
          return { ...base, name: String(value ?? '') };
        }
        return base;
      });
    },
    [],
  );

  const submit = useCallback(async () => {
    if (!lead) return;
    setIsLoading(true);
    setError(null);

    // Estado actual del lead como diccionario para comparar
    const l = lead as unknown as Record<string, unknown>;

    try {
      // Construimos el patch sobre una vista MUTABLE para no chocar con readonly
  const patch: Record<string, unknown> = {};

      const newName =
        form.leadName || form.name || (l['name'] as string | undefined) || '';

      if (newName !== l['name']) patch.name = newName;
      if ((form.location ?? '') !== (l['location'] ?? ''))
        patch.location = form.location ?? '';
      if (form.status !== l['status'])
        patch.status = form.status as LeadStatus | null;
      if ((form.startDate ?? '') !== (l['startDate'] ?? ''))
        patch.startDate = form.startDate ?? '';

      const currentProjectTypeId = (
        l['projectType'] as Record<string, unknown> | undefined
      )?.['id'] as number | undefined;
      if (form.projectTypeId && form.projectTypeId !== currentProjectTypeId) {
        patch.projectTypeId = form.projectTypeId;
      }

      const currentContactId = (
        l['contact'] as Record<string, unknown> | undefined
      )?.['id'] as number | undefined;
      if (form.contactId && form.contactId !== currentContactId) {
        patch.contactId = form.contactId;
      }

      if ((form.leadNumber ?? '') !== (l['leadNumber'] ?? '')) {
        patch.leadNumber = form.leadNumber ?? '';
      }

      // Si no hay cambios, no hacemos request
      if (Object.keys(patch).length === 0) {
        onSaved?.(lead);
        setIsLoading(false);
        return;
      }

      // ✅ Única request (PUT). Sin GET adicional.
  const saved = await app.repos.lead.update(lead.id, patch as any);

      onSaved?.(saved);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : 'Error al actualizar el lead';
      setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [app, form, lead, onSaved]);

  return { form, isLoading, error, setError, handleChange, submit };
}
