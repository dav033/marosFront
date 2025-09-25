export type FieldKey<T> = Extract<keyof T, string>;

export type FieldDef<T> = {
  /** Clave del campo en el modelo (name, email, etc.) */
  key: FieldKey<T>;
  /** Etiqueta visible en el dropdown */
  label: string;
  /** Si el valor se deriva o necesita normalización especial */
  getValue?: (row: T) => string | number | null | undefined;
  /** Permite ocultar campos del dropdown sin tocar el modelo */
  searchable?: boolean; // default: true
};

export type SearchConfig<T> = {
  /** Campos disponibles para búsqueda (se usan también para el dropdown) */
  fields: FieldDef<T>[];
  /** Placeholder del input */
  placeholder?: string;
  /** Milisegundos para “debounce” del input */
  debounceMs?: number; // default: 200
  /** Normalizador de texto (por defecto: lower + sin acentos) */
  normalize?: (s: string) => string;
};

export type AnyField<T> = FieldKey<T> | "*"; // '*' = todos los campos
