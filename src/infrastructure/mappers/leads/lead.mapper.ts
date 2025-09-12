import type { Lead } from "../../../domain/entities/Lead";
import type { LeadDTO } from "../../dto/leads/LeadDTO";
import { asLocalDateString } from "../../../domain/value-objects/LocalDateString";
import { contactFromDTO, contactToDTO } from "../contacts/contact.mapper";

export function leadFromDTO(dto: LeadDTO): Lead {
  return {
    id: dto.id,
    leadNumber: dto.leadNumber,
    name: dto.name,
    startDate: asLocalDateString(dto.startDate),
    location: dto.location,
    status: dto.status as Lead["status"],
    contact: contactFromDTO(dto.contact),
    projectType: dto.projectType ? { id: dto.projectType.id, name: dto.projectType.name, color: dto.projectType.color } : null,
    leadType: dto.leadType as Lead["leadType"],
  };
}

export function leadToDTO(entity: Lead): LeadDTO {
  return {
    id: entity.id,
    leadNumber: entity.leadNumber,
    name: entity.name,
    startDate: entity.startDate,
    location: entity.location,
    status: entity.status,
    contact: contactToDTO(entity.contact),
    projectType: entity.projectType ? { id: entity.projectType.id, name: entity.projectType.name, color: entity.projectType.color } : null,
    leadType: entity.leadType,
  };
}