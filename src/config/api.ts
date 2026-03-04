export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : ((import.meta.env['VITE_API_URL'] as string | undefined) ??
    'https://harrisapp-backend.your-worker-subdomain.workers.dev');

export const TIMEOUT_MS = {
  DEFAULT: 5 * 1000,
  HEALTH_CHECK_INTERVAL: 60 * 1000,
} as const;

export const RATE_LIMIT = {
  DEFAULT_RETRY_SECONDS: 60,
} as const;

export const TIME = {
  MILLISECONDS_PER_SECOND: 1000,
} as const;
