import { JazzStandard } from '@/types/jazzStandards';

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : ((import.meta.env['VITE_API_URL'] as string | undefined) ??
    'https://harrisapp-backend.your-worker-subdomain.workers.dev');

export async function fetchAllStandards(): Promise<JazzStandard[]> {
  const endpoint = import.meta.env.DEV ? '/api/jazz-standards' : `${API_BASE_URL}/jazz-standards`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error?: string; message?: string };
    throw new Error(errorData.message ?? errorData.error ?? 'Failed to load standards');
  }

  return (await response.json()) as JazzStandard[];
}

export async function fetchStandardById(id: string): Promise<JazzStandard> {
  const endpoint = import.meta.env.DEV ? `/api/jazz-standards/${id}` : `${API_BASE_URL}/jazz-standards/${id}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error?: string; message?: string };
    throw new Error(errorData.message ?? errorData.error ?? 'Failed to load standard');
  }

  return (await response.json()) as JazzStandard;
}
