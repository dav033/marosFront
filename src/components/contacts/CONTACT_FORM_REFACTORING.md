# Refactorización de Formularios de Contacto

## Resumen de Cambios

Se ha creado un componente reutilizable `ContactForm` para eliminar la duplicación de código entre `CreateContactModal` y `EditContactModal`.

## Componentes Creados

### 1. ContactForm.tsx
- **Ubicación**: `src/components/contacts/ContactForm.tsx`
- **Propósito**: Componente reutilizable que contiene todo el formulario de contacto
- **Características**:
  - Separación vertical reducida (`space-y-2`, `gap-1`)
  - Manejo de errores integrado
  - Layout responsivo con grid de 2 columnas
  - Tipos TypeScript bien definidos

#### Props del ContactForm:
```typescript
interface ContactFormProps {
  form: ContactFormData;
  onChange: (field: keyof ContactFormData, value: string) => void;
  error?: string | null;
}
```

#### Tipo ContactFormData:
```typescript
export interface ContactFormData {
  companyName: string;
  name: string;
  occupation: string;
  product: string;
  phone: string;
  email: string;
  address: string;
}
```

## Componentes Refactorizados

### 2. CreateContactModal.tsx
- **Cambios**:
  - Eliminado código duplicado del formulario
  - Importa y usa `ContactForm`
  - Usa tipo `ContactFormData` para el estado
  - Mantiene toda la lógica de creación intacta

### 3. EditContactModal.tsx
- **Cambios**:
  - Eliminado código duplicado del formulario
  - Importa y usa `ContactForm`
  - Usa tipo `ContactFormData` para el estado
  - Mantiene toda la lógica de edición intacta

## Beneficios de la Refactorización

1. **DRY (Don't Repeat Yourself)**: Eliminación de código duplicado
2. **Mantenimiento**: Cambios en el formulario solo se hacen en un lugar
3. **Consistencia**: Ambos modales usan exactamente el mismo formulario
4. **Separación vertical reducida**: Aplicada automáticamente a ambos modales
5. **Tipo safety**: Uso consistente de tipos TypeScript

## Espaciado Aplicado

- **Contenedor principal**: `space-y-2` (reducido de `space-y-4`)
- **Grid**: `gap-1` (reducido de `gap-2` o `gap-4`)
- **GenericInput**: Margin reducido a `mb-0.5` en el contenedor y `mb-1` en el input

## Uso

```tsx
// En CreateContactModal o EditContactModal
<ContactForm
  form={form}
  onChange={handleChange}
  error={error}
/>
```

## Compatibilidad

- ✅ Mantiene toda la funcionalidad existente
- ✅ Tipos TypeScript compatibles
- ✅ Validación de formularios intacta
- ✅ Manejo de errores consistente
- ✅ Layout responsivo preservado
