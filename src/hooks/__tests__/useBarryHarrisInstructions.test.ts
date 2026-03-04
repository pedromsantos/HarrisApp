import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RATE_LIMIT } from '@/config/api';
import {
  GenerateInstructionsRequest,
  InstructionsResponse,
  MaterializeInstructionsRequest,
  MaterializedLinesResponse,
} from '@/types/barryHarrisInstructions';

import { useBarryHarrisInstructions } from '../useBarryHarrisInstructions';

describe('useBarryHarrisInstructions', () => {
  const mockGenerateRequest: GenerateInstructionsRequest = {
    chords: ['G7', 'CMaj7'],
    caged_shape: 'C',
    guitar_position: 'C',
  };

  const mockInstructionsResponse: InstructionsResponse = {
    transitions: [
      {
        from_chord: 'G7',
        to_chord: 'CMaj7',
        possible_paths: [],
      },
    ],
    metadata: {
      shape: 'C',
      position: 'C',
    },
  };

  const mockMaterializeRequest: MaterializeInstructionsRequest = {
    instructions: mockInstructionsResponse,
  };

  const mockMaterializedResponse: MaterializedLinesResponse = {
    lines: [
      {
        notes: ['G', 'A', 'B', 'C'],
        tab: '3-0-2-3',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('generateInstructions', () => {
    it('successfully generates instructions and updates state', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockInstructionsResponse,
      } as Response);

      const { result } = renderHook(() => useBarryHarrisInstructions());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.instructions).toBeNull();

      await result.current.generateInstructions(mockGenerateRequest);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.instructions).toEqual(mockInstructionsResponse);
        expect(result.current.error).toBeNull();
      });
    });

    it.each([
      ['Failed to fetch', 'Unable to connect to the server'],
      ['Server error', 'Server error'],
      ['Unknown error', 'An unexpected error occurred'],
    ])('handles %s error with appropriate message', async (errorInput, expectedErrorSubstring) => {
      const errorValue = errorInput === 'Unknown error' ? errorInput : new Error(errorInput);
      vi.mocked(global.fetch).mockRejectedValueOnce(errorValue);

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.generateInstructions(mockGenerateRequest);

      await waitFor(() => {
        expect(result.current.error).toContain(expectedErrorSubstring);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.instructions).toBeNull();
      });
    });

    it('handles rate limit response and sets countdown', async () => {
      const retryAfter = 10;
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ retry_after: retryAfter }),
      } as Response);

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.generateInstructions(mockGenerateRequest);

      await waitFor(() => {
        expect(result.current.isRateLimited).toBe(true);
        expect(result.current.rateLimitSecondsRemaining).toBe(retryAfter);
        expect(result.current.error).toContain(`wait ${retryAfter} seconds`);
      });
    });

    it('uses default retry after when not provided in rate limit response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({}),
      } as Response);

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.generateInstructions(mockGenerateRequest);

      await waitFor(() => {
        expect(result.current.rateLimitSecondsRemaining).toBe(RATE_LIMIT.DEFAULT_RETRY_SECONDS);
      });
    });
  });

  describe('materializeInstructions', () => {
    it('successfully materializes instructions and updates state', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMaterializedResponse,
      } as Response);

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.materializeInstructions(mockMaterializeRequest);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.materializedLines).toEqual(mockMaterializedResponse);
        expect(result.current.error).toBeNull();
      });
    });

    it('handles materialization errors', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Materialization failed'));

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.materializeInstructions(mockMaterializeRequest);

      await waitFor(() => {
        expect(result.current.error).toContain('Materialization failed');
        expect(result.current.materializedLines).toBeNull();
      });
    });
  });

  describe('retry function', () => {
    it('retries last generate request after error', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.generateInstructions(mockGenerateRequest);

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockInstructionsResponse,
      } as Response);

      await result.current.retry();

      await waitFor(() => {
        expect(result.current.instructions).toEqual(mockInstructionsResponse);
        expect(result.current.error).toBeNull();
      });
    });

    it('retries last materialize request after error', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.materializeInstructions(mockMaterializeRequest);

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMaterializedResponse,
      } as Response);

      await result.current.retry();

      await waitFor(() => {
        expect(result.current.materializedLines).toEqual(mockMaterializedResponse);
        expect(result.current.error).toBeNull();
      });
    });

    it('retries both requests in sequence when both were called', async () => {
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockInstructionsResponse,
        } as Response)
        .mockRejectedValueOnce(new Error('Materialization failed'));

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.generateInstructions(mockGenerateRequest);
      await result.current.materializeInstructions(mockMaterializeRequest);

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockInstructionsResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockMaterializedResponse,
        } as Response);

      await result.current.retry();

      await waitFor(() => {
        expect(result.current.instructions).toEqual(mockInstructionsResponse);
        expect(result.current.materializedLines).toEqual(mockMaterializedResponse);
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('clearError and clearResults', () => {
    it('clearError removes error message', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.generateInstructions(mockGenerateRequest);

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      result.current.clearError();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });

    it('clearResults resets all state', async () => {
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockInstructionsResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockMaterializedResponse,
        } as Response);

      const { result } = renderHook(() => useBarryHarrisInstructions());

      await result.current.generateInstructions(mockGenerateRequest);
      await result.current.materializeInstructions(mockMaterializeRequest);

      await waitFor(() => {
        expect(result.current.instructions).not.toBeNull();
        expect(result.current.materializedLines).not.toBeNull();
      });

      result.current.clearResults();

      await waitFor(() => {
        expect(result.current.instructions).toBeNull();
        expect(result.current.materializedLines).toBeNull();
        expect(result.current.error).toBeNull();
      });
    });
  });
});
