import { JazzStandard } from '@/types/jazzStandards';

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : ((import.meta.env['VITE_API_URL'] as string | undefined) ??
    'https://harrisapp-backend.your-worker-subdomain.workers.dev');

const API_KEY = (import.meta.env['VITE_API_KEY'] as string | undefined) ?? 'dev-api-key';

export async function fetchAllStandards(): Promise<JazzStandard[]> {
  const endpoint = import.meta.env.DEV ? '/api/jazz-standards' : `${API_BASE_URL}/jazz-standards`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error?: string; message?: string };
    throw new Error(errorData.message ?? errorData.error ?? 'Failed to load standards');
  }

  return (await response.json()) as JazzStandard[];
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export async function fetchStandardById(id: string): Promise<JazzStandard> {
  const endpoint = import.meta.env.DEV ? `/api/jazz-standards/${id}` : `${API_BASE_URL}/jazz-standards/${id}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error?: string; message?: string };
    const errorMessage = errorData.message ?? errorData.error ?? 'Failed to load standard';

    if (response.status === 404) {
      throw new NotFoundError(errorMessage);
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as JazzStandard;
}
