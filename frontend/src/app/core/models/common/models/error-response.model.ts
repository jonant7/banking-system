export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: FieldError[];
}

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return obj &&
    typeof obj.status === 'number' &&
    typeof obj.error === 'string' &&
    typeof obj.message === 'string';
}

export function extractErrorMessage(error: any): string {
  if (isErrorResponse(error)) {
    return error.message;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

export function extractFieldErrors(error: any): FieldError[] {
  if (isErrorResponse(error) && error.fieldErrors) {
    return error.fieldErrors;
  }

  if (error?.error?.fieldErrors) {
    return error.error.fieldErrors;
  }

  return [];
}
