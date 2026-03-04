import { useCallback, useEffect, useState } from 'react';

import { fetchStandardById } from '@/api/client';
import { JazzStandard } from '@/types/jazzStandards';

type UseStandardDetailReturn = {
  standard: JazzStandard | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export function useStandardDetail(id: string): UseStandardDetailReturn {
  const [standard, setStandard] = useState<JazzStandard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      if (err.message.includes('Failed to fetch')) {
        const errorMessage =
          'Unable to connect to the server. Please check your internet connection and try again. ' +
          'If the problem persists, the service might be temporarily unavailable.';
        setError(errorMessage);
      } else {
        setError(err.message);
      }
    } else {
      const errorMessage = 'An unexpected error occurred. Please try again later.';
      setError(errorMessage);
    }
  }, []);

  const loadStandard = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await fetchStandardById(id);
      setStandard(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id, handleError]);

  useEffect(() => {
    void loadStandard();
  }, [loadStandard]);

  return {
    standard,
    error,
    isLoading,
    refetch: loadStandard,
  };
}
