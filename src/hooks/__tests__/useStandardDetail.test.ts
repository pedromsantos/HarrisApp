import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as apiClient from '@/api/client';

import { useStandardDetail } from '../useStandardDetail';

vi.mock('@/api/client');

describe('useStandardDetail', () => {
  const AUTUMN_LEAVES_ID = 'autumn-leaves';
  const BLUE_BOSSA_ID = 'blue-bossa';

  const mockStandard = {
    id: AUTUMN_LEAVES_ID,
    name: 'Autumn Leaves',
    composer: 'Joseph Kosma',
    key: 'G minor',
    chords_original: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7'],
    chords_improvisation: ['Cm7', 'F7', 'BbMaj7'],
    form: 'AABA',
    tempo: 'Medium',
    difficulty: 'beginner' as const,
    description: 'A classic jazz standard',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetching standard by ID', () => {
    it('fetches standard by ID on mount or when ID changes', async () => {
      vi.mocked(apiClient.fetchStandardById).mockResolvedValue(mockStandard);

      const { result, rerender } = renderHook(({ id }: { id: string }) => useStandardDetail(id), {
        initialProps: { id: AUTUMN_LEAVES_ID },
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(apiClient.fetchStandardById).toHaveBeenCalledOnce();
      expect(apiClient.fetchStandardById).toHaveBeenCalledWith(AUTUMN_LEAVES_ID);
      expect(result.current.standard).toEqual(mockStandard);
      expect(result.current.error).toBeNull();

      const blueBossa = {
        ...mockStandard,
        id: BLUE_BOSSA_ID,
        name: 'Blue Bossa',
        composer: 'Kenny Dorham',
      };

      vi.mocked(apiClient.fetchStandardById).mockResolvedValueOnce(blueBossa);
      rerender({ id: BLUE_BOSSA_ID });

      await waitFor(() => {
        expect(result.current.standard).toEqual(blueBossa);
      });

      expect(apiClient.fetchStandardById).toHaveBeenCalledTimes(2);
    });
  });

  describe('loading state', () => {
    it('returns loading state during fetch and clears after completion', async () => {
      vi.mocked(apiClient.fetchStandardById).mockReturnValue(
        new Promise(() => {
          /* never resolves */
        })
      );

      const { result, unmount } = renderHook(() => useStandardDetail(AUTUMN_LEAVES_ID));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.standard).toBeNull();
      expect(result.current.error).toBeNull();

      unmount();

      vi.mocked(apiClient.fetchStandardById).mockResolvedValue(mockStandard);

      const { result: successResult } = renderHook(() => useStandardDetail(AUTUMN_LEAVES_ID));

      await waitFor(() => {
        expect(successResult.current.isLoading).toBe(false);
      });

      expect(successResult.current.standard).toEqual(mockStandard);
    });
  });

  describe('error state', () => {
    it.each([
      ['Failed to load standard', 'Failed to load standard'],
      ['Unknown error', 'An unexpected error occurred'],
    ])('handles %s error with appropriate message', async (errorInput, expectedErrorMessage) => {
      const errorValue = errorInput === 'Unknown error' ? errorInput : new Error(errorInput);
      vi.mocked(apiClient.fetchStandardById).mockRejectedValue(errorValue);

      const { result } = renderHook(() => useStandardDetail(AUTUMN_LEAVES_ID));

      await waitFor(() => {
        expect(result.current.error).toContain(expectedErrorMessage);
      });

      expect(result.current.standard).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('refetch function', () => {
    it('provides refetch function that triggers new API call', async () => {
      vi.mocked(apiClient.fetchStandardById).mockResolvedValue(mockStandard);

      const { result } = renderHook(() => useStandardDetail(BLUE_BOSSA_ID));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe('function');

      expect(apiClient.fetchStandardById).toHaveBeenCalledTimes(1);

      await result.current.refetch();

      expect(apiClient.fetchStandardById).toHaveBeenCalledTimes(2);
    });

    it('refetch clears previous error on retry', async () => {
      vi.mocked(apiClient.fetchStandardById).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useStandardDetail(AUTUMN_LEAVES_ID));

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      vi.mocked(apiClient.fetchStandardById).mockResolvedValue(mockStandard);

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });

      expect(result.current.standard).toEqual(mockStandard);
    });
  });
});
