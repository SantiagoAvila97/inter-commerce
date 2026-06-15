import { ApiError, NetworkError, NotFoundError, ServerError } from '@/types/errors';

const DEFAULT_BASE_URL = 'https://dummyjson.com';
const REQUEST_TIMEOUT_MS = 15_000;

function getBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(path, getBaseUrl());
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export async function apiRequest<T>(
  path: string,
  options: {
    params?: Record<string, string | number | undefined>;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const url = buildUrl(path, options.params);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const signal = options.signal ?? controller.signal;

  try {
    const response = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    });

    const body = await parseResponseBody(response);

    if (!response.ok) {
      const message =
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        typeof (body as { message: unknown }).message === 'string'
          ? (body as { message: string }).message
          : `Error HTTP ${response.status}`;

      if (response.status === 404) {
        throw new NotFoundError(message);
      }
      if (response.status >= 500) {
        throw new ServerError(message);
      }
      throw new ApiError(message, response.status, body as { message?: string });
    }

    return body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new NetworkError('La solicitud tardó demasiado');
    }
    if (error instanceof TypeError) {
      throw new NetworkError('No se pudo conectar con el servidor');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export { buildUrl, getBaseUrl };
