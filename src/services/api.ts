const DEFAULT_TIMEOUT_MS = 10000;

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ErrorResponse {
  message?: string | string[];
}

function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new ApiError('VITE_API_URL is not configured.');
  }

  return apiUrl.replace(/\/$/, '');
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${getApiUrl()}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;

      try {
        const errorBody = (await response.json()) as ErrorResponse;

        if (Array.isArray(errorBody.message)) {
          message = errorBody.message.join(' ');
        } else if (errorBody.message) {
          message = errorBody.message;
        }
      } catch {
        // Keep the generic status message when the API does not return JSON.
      }

      throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out.');
    }

    throw new ApiError('Unable to connect to the API.');
  } finally {
    window.clearTimeout(timeout);
  }
}
