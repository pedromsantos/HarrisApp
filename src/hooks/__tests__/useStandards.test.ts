import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as apiClient from '@/api/client';

import { useStandards } from '../useStandards';

vi.mock('@/api/client');

describe('useStandards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetching standards on mount', () => {
    it('fetches all standards when hook is mounted', async () => {
      const mockStandards = [
        {
          id: 'autumn-leaves',
          name: 'Autumn Leaves',
          composer: 'Joseph Kosma',
          key: 'G minor',
          chords_original: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7'],
          chords_improvisation: ['Cm7', 'F7', 'BbMaj7'],
          form: 'AABA',
          tempo: 'Medium',
          difficulty: 'beginner' as const,
          description: 'A classic jazz standard',
        },
      ];

      vi.mocked(apiClient.fetchAllStandards).mockResolvedValue(mockStandards);

      const { result } = renderHook(() => useStandards());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(apiClient.fetchAllStandards).toHaveBeenCalledOnce();
      expect(result.current.standards).toEqual(mockStandards);
      expect(result.current.error).toBeNull();
    });
  });

  describe('loading state', () => {
    it.each([
      [
        'during fetch',
        () =>
          new Promise(() => {
            /* never resolves */
          }),
        true,
        null,
        null,
      ],
      ['after successful fetch', () => Promise.resolve([]), false, [], null],
      ['after fetch failure', () => Promise.reject(new Error('Network error')), false, null, 'Network error'],
    ] as const)(
      'returns correct loading state %s',
      async (scenario, mockImplementation, expectedLoading, expectedStandards, expectedError) => {
        vi.mocked(apiClient.fetchAllStandards).mockImplementation(mockImplementation);

        const { result } = renderHook(() => useStandards());

        if (scenario === 'during fetch') {
          expect(result.current.isLoading).toBe(expectedLoading);
          expect(result.current.standards).toEqual(expectedStandards);
          expect(result.current.error).toEqual(expectedError);
        } else {
          await waitFor(() => {
            expect(result.current.isLoading).toBe(expectedLoading);
          });

          if (expectedStandards !== null) {
            expect(result.current.standards).toEqual(expectedStandards);
          }
          if (expectedError !== null) {
            expect(result.current.error).not.toBeNull();
          }
        }
      }
    );
  });

  describe('error state', () => {
    it.each([
      ['Failed to load standards', 'Failed to load standards'],
      ['Failed to fetch', 'Unable to load standards library'],
      ['Unknown error', 'Unable to load standards library'],
    ])('handles %s error with appropriate message', async (errorInput, expectedErrorMessage) => {
      const errorValue = errorInput === 'Unknown error' ? errorInput : new Error(errorInput);
      vi.mocked(apiClient.fetchAllStandards).mockRejectedValue(errorValue);

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.error).toContain(expectedErrorMessage);
      });

      expect(result.current.standards).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('refetch function', () => {
    it('refetch triggers new API call', async () => {
      const mockStandards = [
        {
          id: 'blue-bossa',
          name: 'Blue Bossa',
          composer: 'Kenny Dorham',
          key: 'C minor',
          chords_original: ['Cm7', 'Fm7', 'Db7', 'Cm7'],
          chords_improvisation: ['Cm7', 'Fm7', 'Db7'],
          form: 'AABA',
          tempo: 'Medium',
          difficulty: 'intermediate' as const,
          description: 'A bossa nova jazz standard',
        },
      ];

      vi.mocked(apiClient.fetchAllStandards).mockResolvedValue(mockStandards);

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(apiClient.fetchAllStandards).toHaveBeenCalledTimes(1);

      await result.current.refetch();

      expect(apiClient.fetchAllStandards).toHaveBeenCalledTimes(2);
    });

    it('refetch clears previous error', async () => {
      vi.mocked(apiClient.fetchAllStandards).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      vi.mocked(apiClient.fetchAllStandards).mockResolvedValue([]);

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });

      expect(result.current.standards).toEqual([]);
    });
  });
});
