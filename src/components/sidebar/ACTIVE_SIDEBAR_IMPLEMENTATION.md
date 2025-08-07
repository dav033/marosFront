# Implementación de Sidebar Activa y Dropdowns Inteligentes

## Resumen de Funcionalidades

Se ha implementado un sistema de sidebar que:
1. **Resalta automáticamente** la página donde se encuentra actualmente el usuario
2. **Abre automáticamente** los dropdowns correspondientes a la página actual
3. **Mantiene el estado** del sidebar durante la navegación

## Componentes Implementados

### 1. SidebarContext.tsx (Actualizado)
- **Ubicación**: `src/contexts/SidebarContext.tsx`
- **Funcionalidades**:
  - Detecta automáticamente la URL actual
  - Determina qué dropdowns deben estar abiertos
  - Proporciona función para verificar si una ruta está activa
  - Escucha cambios de navegación (tanto popstate como programática)

#### Nuevas funciones:
```typescript
interface SidebarContextType {
  openDropdowns: Set<string>;
  toggleDropdown: (id: string) => void;
  isDropdownOpen: (id: string) => boolean;
  currentPath: string;           // Nueva
  isPathActive: (path: string) => boolean; // Nueva
}
```

#### Lógica de apertura automática:
- Si la URL empieza con `/leads/` → abre dropdown "leads"
- Si la URL empieza con `/reports/` → abre dropdown "reports" y "reports-remodelation"

### 2. SidebarItemWithContext.tsx (Nuevo)
- **Ubicación**: `src/components/sidebar/SidebarItemWithContext.tsx`
- **Propósito**: SidebarItem que puede acceder al contexto para resaltar el item activo
- **Características**:
  - Usa `isPathActive()` del contexto para determinar si está activo
  - Aplica clases CSS diferentes según el estado activo
  - Colores: activo = `bg-theme-primary text-white`, inactivo = `text-gray-300 hover:text-white`

### 3. SidebarReact.tsx (Nuevo)
- **Ubicación**: `src/components/sidebar/SidebarReact.tsx`
- **Propósito**: Versión completamente en React de la Sidebar
- **Características**:
  - Incluye el `SidebarProvider` internamente
  - Usa componentes con contexto
  - IDs únicos para cada dropdown: "leads", "reports", "reports-remodelation"

### 4. Layout.astro (Actualizado)
- **Cambio**: Usa `SidebarReact` en lugar de `Sidebar.astro`
- **Configuración**: `client:only="react" transition:persist`

## Configuración de Rutas y Dropdowns

### Estructura de Navegación:
```
├── Lead (dropdown: "leads")
│   ├── Construction (/leads/construction)
│   ├── Plumbing (/leads/plumbing)
│   └── Roofing (/leads/roofing)
├── Contacts (/contacts)
└── Reports (dropdown: "reports")
    └── Remodelation (dropdown: "reports-remodelation")
        ├── Follow-up Report (/reports/all)
        └── Final Report (/reports/monthly)
```

### Reglas de Apertura Automática:
1. **URL `/leads/construction`**:
   - ✅ Dropdown "leads" se abre
   - ✅ Item "Construction" se resalta

2. **URL `/contacts`**:
   - ✅ Item "Contacts" se resalta
   - ✅ Todos los dropdowns permanecen cerrados

3. **URL `/reports/all`**:
   - ✅ Dropdown "reports" se abre
   - ✅ Dropdown "reports-remodelation" se abre
   - ✅ Item "Follow-up Report" se resalta

## Clases CSS para Estados

### Item Activo:
```css
bg-theme-primary text-white
```

### Item Inactivo:
```css
text-gray-300 hover:text-white hover:bg-gray-800
```

## Detección de Navegación

El contexto escucha:
- **`popstate`**: Navegación con botones del navegador
- **`history.pushState`**: Navegación programática
- **`history.replaceState`**: Reemplazo de navegación programática

## Beneficios

1. **UX Mejorada**: Los usuarios siempre saben dónde están
2. **Navegación Intuitiva**: Los dropdowns relevantes se mantienen abiertos
3. **Estado Persistente**: El estado se mantiene durante la navegación
4. **Rendimiento**: Solo se re-renderiza cuando cambia la URL
5. **Accesibilidad**: Estados claros y visuales

## Uso y Mantenimiento

### Para Agregar Nueva Ruta:
1. Agregar el `SidebarItemWithContext` con la ruta correcta
2. Si necesita dropdown, actualizar la lógica en `SidebarContext.tsx`
3. Agregar el ID del dropdown si es necesario

### Para Modificar Colores de Estado Activo:
Cambiar las clases en `SidebarItemWithContext.tsx`:
```tsx
const activeClasses = isActive 
  ? "bg-theme-primary text-white"     // ← Cambiar aquí
  : "text-gray-300 hover:text-white";
```
