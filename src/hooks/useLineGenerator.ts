import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { LineGeneratorRequest, LineGeneratorResponse } from '../types/lineGenerator';

const API_BASE_URL = 'https://barry-harris-line-generator.pedro-santos-personal.workers.dev';

export function useLineGenerator() {
  const [result, setResult] = useState<LineGeneratorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerHealthy, setIsServerHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkServerHealth();
  }, []);

  useEffect(() => {
    if (isServerHealthy === false) {
      toast.error('Server Unavailable', {
        description: 'The line generator service is currently unavailable. Please try again later.',
        action: {
          label: 'Retry',
          onClick: checkServerHealth,
        },
        duration: Infinity,
      });
    }
  }, [isServerHealthy]);

  const checkServerHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const newStatus = response.ok;
      setIsServerHealthy(newStatus);

      if (newStatus && isServerHealthy === false) {
        toast.success('Server Available', {
          description: 'The line generator service is now available.',
        });
      }
    } catch (err) {
      setIsServerHealthy(false);
    }
  }, [isServerHealthy]);

  const validateResponse = useCallback((data: any): data is LineGeneratorResponse => {
    if (!data.lines || !Array.isArray(data.lines)) {
      throw new Error('Invalid response format: missing or invalid lines data');
    }
    return true;
  }, []);

  const normalizeResponseData = useCallback(
    (data: LineGeneratorResponse): LineGeneratorResponse => {
      if (!data.tabs) {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate lines');
    }

    return data;
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
    [makeApiRequest, validateResponse, normalizeResponseData]
  );

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

  return {
    result,
    error,
    isLoading,
    isServerHealthy,
    checkServerHealth,
    generateLines,
  };
}
