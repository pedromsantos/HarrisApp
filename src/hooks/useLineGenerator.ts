import { useCallback, useEffect, useState } from 'react';

import { LineGeneratorRequest, LineGeneratorResponse } from '@/types/lineGenerator';

const API_BASE_URL = 'https://api.harrisjazzlines.com';

const HEALTH_CHECK_INTERVAL = 60 * 1000;

type UseLineGeneratorReturn = {
  result: LineGeneratorResponse | null;
  error: string | null;
  isLoading: boolean;
  isServerHealthy: boolean | null;
  checkServerHealth: () => Promise<void>;
  generateLines: (formData: LineGeneratorRequest) => Promise<LineGeneratorResponse | null>;
};

export function useLineGenerator(): UseLineGeneratorReturn {
  const [result, setResult] = useState<LineGeneratorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerHealthy, setIsServerHealthy] = useState<boolean | null>(null);

  const checkServerHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const newStatus = response.ok;
      setIsServerHealthy(newStatus);
    } catch {
      setIsServerHealthy(false);
    }
  }, []);

  useEffect(() => {
    void checkServerHealth();
  }, [checkServerHealth]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void checkServerHealth();
    }, HEALTH_CHECK_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [checkServerHealth]);

  const validateResponse = useCallback((data: unknown): data is LineGeneratorResponse => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid response format: not an object');
    }
    const response = data as { lines?: unknown };
    const hasLines = response.lines !== undefined && Array.isArray(response.lines);
    if (!hasLines) {
      throw new Error('Invalid response format: missing or invalid lines data');
    }
    return true;
  }, []);

  const normalizeResponseData = useCallback(
    (data: LineGeneratorResponse): LineGeneratorResponse => {
      return data;
    },
    []
  );

  const makeApiRequest = useCallback(async (formData: LineGeneratorRequest) => {
    const response = await fetch(`${API_BASE_URL}/lines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = (await response.json()) as unknown;

    if (!response.ok) {
      const errorData = data as { error?: string };
      throw new Error(errorData.error ?? 'Failed to generate lines');
    }

    return data as LineGeneratorResponse;
  }, []);

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

  const generateLines = useCallback(
    async (formData: LineGeneratorRequest) => {
      setError(null);
      setIsLoading(true);

      try {
        const data = await makeApiRequest(formData);

        validateResponse(data);

        const normalizedData = normalizeResponseData(data);

        setResult(normalizedData);
        return normalizedData;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [makeApiRequest, validateResponse, normalizeResponseData, handleError]
  );

  return {
    result,
    error,
    isLoading,
    isServerHealthy,
    checkServerHealth,
    generateLines,
  };
}
