const API_URL = import.meta.env.VITE_API;

/** Thrown on any non-2xx HTTP response. Carries status + parsed body. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
    message?: string
  ) {
    super(message ?? `HTTP ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  signal?: AbortSignal;
}

async function readBody(res: Response): Promise<unknown> {
  // Some endpoints return 204 / empty body; tolerate that.
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(
  endpoint: string,
  init: RequestInit,
  options: RequestOptions = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    mode: 'cors',
    credentials: 'same-origin',
    ...init,
    signal: options.signal,
  });
  const body = await readBody(res);
  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, body);
  }
  return body as T;
}

export function get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return request<T>(endpoint, { method: 'GET' }, options);
}

export function post<T>(
  endpoint: string,
  params: unknown,
  options?: RequestOptions
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    },
    options
  );
}

export function restDelete<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' }, options);
}

