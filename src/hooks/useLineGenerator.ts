import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { LineGeneratorRequest, LineGeneratorResponse } from '../types/lineGenerator';

const API_BASE_URL = 'https://barry-harris-line-generator.pedro-santos-personal.workers.dev';

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
    const response = await fetch(`${API_BASE_URL}/health`);
    const newStatus = response.ok;
    setIsServerHealthy(newStatus);

    if (newStatus && isServerHealthy === false) {
      toast.success('Server Available', {
        description: 'The line generator service is now available.',
      });
    }
  }, [isServerHealthy]);

  useEffect(() => {
    void checkServerHealth();
  }, [checkServerHealth]);

  useEffect(() => {
    if (isServerHealthy === false) {
      toast.error('Server Unavailable', {
        description: 'The line generator service is currently unavailable. Please try again later.',
        action: {
          label: 'Retry',
          onClick: () => void checkServerHealth(),
        },
        duration: Infinity,
      });
    }
  }, [isServerHealthy, checkServerHealth]);

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
      if (data.tabs === undefined) {
        return {
          ...data,
          tabs: data.lines.map(() => []),
        };
      }
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
        toast.error('Connection Error', {
          description: errorMessage,
        });
      } else {
        setError(err.message);
        toast.error('Error', {
          description: err.message,
        });
      }
    } else {
      const errorMessage = 'An unexpected error occurred. Please try again later.';
      setError(errorMessage);
      toast.error('Unexpected Error', {
        description: errorMessage,
      });
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
        toast.success('Lines Generated', {
          description: 'Your musical lines have been successfully generated.',
        });

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
