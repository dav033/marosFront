export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
};

export type FieldValidation = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: unknown) => boolean | string;
};

export type FormValidation<T> = {
  [K in keyof T]?: FieldValidation;
};