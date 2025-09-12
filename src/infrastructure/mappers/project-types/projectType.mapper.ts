import type { ProjectType } from "../../../domain/entities/ProjectType";
import type { ProjectTypeDTO } from "../../dto/project-types/ProjectTypeDTO";

export function projectTypeFromDTO(dto: ProjectTypeDTO): ProjectType {
  return { id: dto.id, name: dto.name, color: dto.color };
}

export function projectTypeToDTO(entity: ProjectType): ProjectTypeDTO {
  return { id: entity.id, name: entity.name, color: entity.color };
}