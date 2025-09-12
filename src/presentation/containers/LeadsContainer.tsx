import React from "react";
import { useLeads } from "../../presentation/hooks/leads/useLeads";
import { useContacts } from "../../presentation/hooks/contacts/useContacts";
import { toLeadVM } from "../../presentation/view-models/leads/LeadVM";
import { toContactVM } from "../../presentation/view-models/contacts/ContactVM";
import type { LeadType } from "../../domain/enums/LeadType";

interface LeadsContainerProps {
  leadType?: LeadType;
}

export function LeadsContainer({ leadType }: LeadsContainerProps) {
  const {
    items: leads,
    loading: leadsLoading,
    error: leadsError,
    refetch: refetchLeads,
    createWithExistingContact,
    createWithNewContact,
    update: updateLead,
    remove: removeLead,
  } = useLeads(leadType);

  const {
    items: contacts,
    loading: contactsLoading,
    error: contactsError,
  } = useContacts();

  // Transform to view models
  const leadVMs = leads.map(toLeadVM);
  const contactVMs = contacts.map(toContactVM);

  if (leadsLoading || contactsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (leadsError || contactsError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="text-red-800">
          Error: {leadsError || contactsError}
        </div>
        <button
          onClick={refetchLeads}
          className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {leadType ? `Leads - ${leadType}` : "Todos los Leads"}
        </h1>
        <button
          onClick={refetchLeads}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{leadVMs.length}</div>
          <div className="text-gray-600">Total Leads</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{contactVMs.length}</div>
          <div className="text-gray-600">Total Contacts</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">
            {leadVMs.filter(l => l.status === "NEW").length}
          </div>
          <div className="text-gray-600">Nuevos</div>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Lista de Leads</h2>
        </div>
        <div className="p-6">
          {leadVMs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay leads disponibles
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leadVMs.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.leadNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.contactName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.status === "NEW" 
                            ? "bg-green-100 text-green-800"
                            : lead.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}