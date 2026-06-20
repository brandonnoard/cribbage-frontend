export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type ApiError = Readonly<{
  code: ApiErrorCode | string;
  message: string | unknown;
}>;

export type ApiResponse<T> = Readonly<{
  data?: T;
  error?: ApiError;
}>;

export type User = Readonly<{
  id: string;
  email: string;
  displayName: string;
}>;

export type HealthStatus = Readonly<{
  status: string;
  service: string;
}>;

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 401;
}

export function formatValidationMessage(message: unknown): string {
  if (typeof message === "string") {
    return message;
  }

  if (message && typeof message === "object") {
    return JSON.stringify(message, null, 2);
  }

  return "Validation failed";
}
