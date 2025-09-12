import type { Contact } from "../../../domain/entities/Contact";
import type { ContactDTO } from "../../dto/contacts/ContactDTO";
import { asEmail } from "../../../domain/value-objects/Email";
import { asPhone } from "../../../domain/value-objects/Phone";
import { asLocalDateTimeString } from "../../../domain/value-objects/LocalDateTimeString";

export function contactFromDTO(dto: ContactDTO): Contact {
  return {
    id: dto.id,
    companyName: dto.companyName,
    name: dto.name,
    occupation: dto.occupation,
    product: dto.product,
    phone: dto.phone == null || dto.phone === "" ? null : asPhone(dto.phone),
    email: dto.email == null || dto.email === "" ? null : asEmail(dto.email),
    address: dto.address ?? null,
    lastContact: dto.lastContact == null || dto.lastContact === "" ? null : asLocalDateTimeString(dto.lastContact),
  };
}

export function contactToDTO(entity: Contact): ContactDTO {
  return {
    id: entity.id,
    companyName: entity.companyName,
    name: entity.name,
    occupation: entity.occupation,
    product: entity.product,
    phone: entity.phone ?? null,
    email: entity.email ?? null,
    address: entity.address ?? null,
    lastContact: entity.lastContact ?? null,
  };
}