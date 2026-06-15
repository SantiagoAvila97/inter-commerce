export type HttpStatus = 400 | 401 | 403 | 404 | 500 | number;

export interface ApiErrorBody {
  message?: string;
  statusCode?: number;
}

export class ApiError extends Error {
  readonly status: HttpStatus;
  readonly body?: ApiErrorBody;

  constructor(message: string, status: HttpStatus, body?: ApiErrorBody) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500);
    this.name = 'ServerError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Error de conexión') {
    super(message);
    this.name = 'NetworkError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof NetworkError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado';
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof NotFoundError || (error instanceof ApiError && error.status === 404);
}
