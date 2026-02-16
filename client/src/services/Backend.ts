import { API_BASE } from '@/models/domain';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const TOKEN_KEY = 'gastos-app-token';
const REFRESH_TOKEN_KEY = 'gastos-app-refresh-token';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function isAuthenticated(): boolean {
  return !!getToken();
}

function buildHeaders(contentType?: string): HeadersInit {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  isFormData?: boolean,
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const options: RequestInit = {
    method,
    headers: buildHeaders(isFormData ? undefined : 'application/json'),
  };

  if (body) {
    options.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

const Backend = {
  getToken,
  setToken,
  setRefreshToken,
  clearTokens,
  isAuthenticated,

  get<T>(path: string): Promise<T> {
    return request<T>('GET', path);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, body);
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PUT', path, body);
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PATCH', path, body);
  },

  delete<T>(path: string): Promise<T> {
    return request<T>('DELETE', path);
  },

  upload<T>(path: string, formData: FormData): Promise<T> {
    return request<T>('POST', path, formData, true);
  },
};

export default Backend;
