import { useCallback, useEffect, useState } from 'react';

import {
  GenerateInstructionsRequest,
  InstructionsResponse,
  MaterializedLinesResponse,
  MaterializeInstructionsRequest,
} from '@/types/barryHarrisInstructions';

// Use proxy server in development, Cloudflare Worker in production
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : ((import.meta.env['VITE_API_URL'] as string | undefined) ??
    'https://harrisapp-backend.your-worker-subdomain.workers.dev');

const TIMEOUT_THRESHOLD = 5000; // Show timeout message after 5 seconds

type UseBarryHarrisInstructionsReturn = {
  instructions: InstructionsResponse | null;
  materializedLines: MaterializedLinesResponse | null;
  error: string | null;
  isLoading: boolean;
  isTimedOut: boolean;
  isRateLimited: boolean;
  rateLimitSecondsRemaining: number | null;
  generateInstructions: (request: GenerateInstructionsRequest) => Promise<InstructionsResponse | null>;
  materializeInstructions: (request: MaterializeInstructionsRequest) => Promise<MaterializedLinesResponse | null>;
  retry: () => Promise<void>;
  clearError: () => void;
  clearResults: () => void;
};

export function useBarryHarrisInstructions(): UseBarryHarrisInstructionsReturn {
  const [instructions, setInstructions] = useState<InstructionsResponse | null>(null);
  const [materializedLines, setMaterializedLines] = useState<MaterializedLinesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitExpiryTime, setRateLimitExpiryTime] = useState<number | null>(null);
  const [rateLimitSecondsRemaining, setRateLimitSecondsRemaining] = useState<number | null>(null);
  const [lastGenerateRequest, setLastGenerateRequest] = useState<GenerateInstructionsRequest | null>(null);
  const [lastMaterializeRequest, setLastMaterializeRequest] = useState<MaterializeInstructionsRequest | null>(null);

  // Countdown timer for rate limit
  useEffect(() => {
    if (!rateLimitExpiryTime) {
      setRateLimitSecondsRemaining(null);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const secondsLeft = Math.ceil((rateLimitExpiryTime - now) / 1000);

      if (secondsLeft <= 0) {
        setIsRateLimited(false);
        setRateLimitExpiryTime(null);
        setRateLimitSecondsRemaining(null);
        setError(null);
      } else {
        setRateLimitSecondsRemaining(secondsLeft);
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [rateLimitExpiryTime]);

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

  const validateInstructionsResponse = useCallback((data: unknown): data is InstructionsResponse => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid response format: not an object');
    }
    const response = data as { transitions?: unknown; metadata?: unknown };
    if (response.transitions === undefined || !Array.isArray(response.transitions) || response.metadata === undefined) {
      throw new Error('Invalid response format: missing transitions or metadata');
    }
    return true;
  }, []);

  const validateMaterializedResponse = useCallback((data: unknown): data is MaterializedLinesResponse => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid response format: not an object');
    }
    const response = data as { lines?: unknown };
    if (response.lines === undefined || !Array.isArray(response.lines)) {
      throw new Error('Invalid response format: missing lines');
    }
    return true;
  }, []);

  const generateInstructions = useCallback(
    async (request: GenerateInstructionsRequest) => {
      setError(null);
      setIsLoading(true);
      setIsTimedOut(false);
      setIsRateLimited(false);
      setRateLimitExpiryTime(null);
      setRateLimitSecondsRemaining(null);
      setLastGenerateRequest(request);

      // Set timeout flag after TIMEOUT_THRESHOLD
      const timeoutId = setTimeout(() => {
        setIsTimedOut(true);
      }, TIMEOUT_THRESHOLD);

      try {
        const endpoint = import.meta.env.DEV
          ? '/api/barry-harris/generate-instructions'
          : `${API_BASE_URL}/barry-harris/generate-instructions`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(request),
        });

        let data = (await response.json()) as unknown;

        if (!response.ok) {
          // Handle rate limiting (429 status)
          if (response.status === 429) {
            const rateLimitData = data as { error?: string; message?: string; retry_after?: number };
            const retryAfter = rateLimitData.retry_after ?? 60;
            const expiryTime = Date.now() + retryAfter * 1000;

            setIsRateLimited(true);
            setRateLimitExpiryTime(expiryTime);
            setRateLimitSecondsRemaining(retryAfter);
            setError(`You're exploring shapes too quickly. Please wait ${retryAfter} seconds`);
            return null;
          }

          const errorData = data as { error?: string; message?: string };
          throw new Error(errorData.message ?? errorData.error ?? 'Failed to generate instructions');
        }

        // Unwrap message field if present (API returns stringified JSON in message field)
        if (typeof data === 'object' && data !== null && 'message' in data) {
          const wrapped = data as { message: string };
          if (typeof wrapped.message === 'string') {
            data = JSON.parse(wrapped.message) as unknown;
          }
        }

        validateInstructionsResponse(data);

        setInstructions(data as InstructionsResponse);
        setIsTimedOut(false);
        return data as InstructionsResponse;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    },
    [validateInstructionsResponse, handleError]
  );

  const materializeInstructions = useCallback(
    async (request: MaterializeInstructionsRequest) => {
      setError(null);
      setIsLoading(true);
      setIsTimedOut(false);
      setIsRateLimited(false);
      setRateLimitExpiryTime(null);
      setRateLimitSecondsRemaining(null);
      setLastMaterializeRequest(request);

      // Set timeout flag after TIMEOUT_THRESHOLD
      const timeoutId = setTimeout(() => {
        setIsTimedOut(true);
      }, TIMEOUT_THRESHOLD);

      try {
        const endpoint = import.meta.env.DEV
          ? '/api/barry-harris/materialize-instructions'
          : `${API_BASE_URL}/barry-harris/materialize-instructions`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(request),
        });

        let data = (await response.json()) as unknown;

        if (!response.ok) {
          // Handle rate limiting (429 status)
          if (response.status === 429) {
            const rateLimitData = data as { error?: string; message?: string; retry_after?: number };
            const retryAfter = rateLimitData.retry_after ?? 60;
            const expiryTime = Date.now() + retryAfter * 1000;

            setIsRateLimited(true);
            setRateLimitExpiryTime(expiryTime);
            setRateLimitSecondsRemaining(retryAfter);
            setError(`You're exploring shapes too quickly. Please wait ${retryAfter} seconds`);
            return null;
          }

          const errorData = data as { error?: string; message?: string };
          throw new Error(errorData.message ?? errorData.error ?? 'Failed to materialize instructions');
        }

        // Unwrap message field if present (API returns stringified JSON in message field)
        if (typeof data === 'object' && data !== null && 'message' in data) {
          const wrapped = data as { message: string };
          if (typeof wrapped.message === 'string') {
            data = JSON.parse(wrapped.message) as unknown;
          }
        }

        validateMaterializedResponse(data);

        setMaterializedLines(data as MaterializedLinesResponse);
        setIsTimedOut(false);
        return data as MaterializedLinesResponse;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    },
    [validateMaterializedResponse, handleError]
  );

  const retry = useCallback(async () => {
    if (lastGenerateRequest && lastMaterializeRequest) {
      const instructionsResult = await generateInstructions(lastGenerateRequest);
      if (instructionsResult) {
        await materializeInstructions(lastMaterializeRequest);
      }
    } else if (lastGenerateRequest) {
      await generateInstructions(lastGenerateRequest);
    } else if (lastMaterializeRequest) {
      await materializeInstructions(lastMaterializeRequest);
    }
  }, [lastGenerateRequest, lastMaterializeRequest, generateInstructions, materializeInstructions]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResults = useCallback(() => {
    setInstructions(null);
    setMaterializedLines(null);
    setError(null);
  }, []);

  return {
    instructions,
    materializedLines,
    error,
    isLoading,
    isTimedOut,
    isRateLimited,
    rateLimitSecondsRemaining,
    generateInstructions,
    materializeInstructions,
    retry,
    clearError,
    clearResults,
  };
}
