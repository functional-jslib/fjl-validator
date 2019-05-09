export as namespace fjlValidator;

export type ValueObscurator = (x: any) => string;

export interface ValidationOptionsLike {
    messageTemplates?: object,
    valueObscured?: boolean,
    valueObscurator?: ValueObscurator
}

export interface ValidationOptions extends ValidationOptionsLike {}

export interface ValidationResultLike {
    result?: boolean,
    messages?: string[]
}

export interface ValidationResult extends ValidationResultLike {
    result: boolean,
    messages?: string[]
}

export function defaultValueObscurator(x: any): string;

export function getErrorMessageByKey(options: ValidationOptions, key: string, value: any): string | undefined

export function toValidationOptions (...options: ValidationOptionsLike[]): ValidationOptions;

export function toValidationResult (...resultLikes: ValidationResultLike[]): ValidationResult;
