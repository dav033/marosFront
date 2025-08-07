# Quick Implementation Guide - Search System

## Para añadir búsqueda a una nueva página:

### 1. Crear configuración de búsqueda (ejemplo para "projects"):

```typescript
// components/projects/projectsSearchConfig.ts
import type { Project } from '../../types/types';
import type { SearchConfig } from '../../hooks/useSearch';

export const projectsSearchConfig: SearchConfig<Project> = {
  searchableFields: [
    { value: 'name', label: 'Project Name' },
    { value: 'client.companyName', label: 'Client Company' },
    { value: 'status', label: 'Status' },
  ],
  caseSensitive: false,
  searchType: 'includes',
  defaultField: 'name',
};

export const projectsSearchPlaceholder = "Search projects...";
```

### 2. Importar en tu componente:

```typescript
import { useSearch } from '../../hooks/useSearch';
import { SearchBoxWithDropdown } from '../../components/common/SearchBoxWithDropdown';
import { projectsSearchConfig, projectsSearchPlaceholder } from './projectsSearchConfig';
```

### 3. Usar el hook:

```typescript
const {
  searchTerm,
  setSearchTerm,
  selectedField,
  setSelectedField,
  filteredData: filteredProjects,
  clearSearch,
  hasActiveSearch,
  searchFields,
} = useSearch(projects, projectsSearchConfig);
```

### 4. Añadir el componente en el JSX:

```typescript
<SearchBoxWithDropdown
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  selectedField={selectedField}
  onFieldChange={setSelectedField}
  searchFields={searchFields}
  onClearSearch={clearSearch}
  placeholder={projectsSearchPlaceholder}
  hasActiveSearch={hasActiveSearch}
  resultCount={filteredProjects.length}
  totalCount={projects.length}
/>
```

### 5. Usar los datos filtrados:

```typescript
<YourTable data={filteredProjects} />
```

## Características implementadas:

✅ Búsqueda por campo específico usando dropdown
✅ Solo búsqueda por Company Name y Contact Name para contactos
✅ Input integrado con dropdown
✅ Sistema completamente reutilizable
✅ Soporte para propiedades anidadas
✅ Contador de resultados
✅ Botón de limpiar búsqueda
✅ Placeholder dinámico que muestra el campo seleccionado
