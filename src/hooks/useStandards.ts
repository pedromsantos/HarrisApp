import { useCallback, useEffect, useState } from 'react';

import { fetchAllStandards } from '@/api/client';
import { JazzStandard } from '@/types/jazzStandards';

type UseStandardsReturn = {
  standards: JazzStandard[] | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export function useStandards(): UseStandardsReturn {
  const [standards, setStandards] = useState<JazzStandard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      if (err.message.includes('Failed to fetch')) {
        const errorMessage = 'Unable to load standards library';
        setError(errorMessage);
      } else {
        setError(err.message);
      }
    } else {
      const errorMessage = 'Unable to load standards library';
      setError(errorMessage);
    }
  }, []);

  const loadStandards = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await fetchAllStandards();
      setStandards(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    void loadStandards();
  }, [loadStandards]);

  return {
    standards,
    error,
    isLoading,
    refetch: loadStandards,
  };
}
