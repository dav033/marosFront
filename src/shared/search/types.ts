export type FieldKey<T> = Extract<keyof T, string>;

export type FieldDef<T> = {
    key: FieldKey<T>;
    label: string;
    getValue?: (row: T) => string | number | null | undefined;
    searchable?: boolean; // default: true
};

export type SearchConfig<T> = {
    fields: FieldDef<T>[];
    placeholder?: string;
    debounceMs?: number; // default: 200
    normalize?: (s: string) => string;
};

export type AnyField<T> = FieldKey<T> | "*"; // '*' = todos los campos
