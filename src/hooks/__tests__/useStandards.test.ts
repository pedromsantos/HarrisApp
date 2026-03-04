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
    it('returns loading true during fetch', () => {
      vi.mocked(apiClient.fetchAllStandards).mockReturnValue(
        new Promise(() => {
          /* never resolves */
        })
      );

      const { result } = renderHook(() => useStandards());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.standards).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('returns loading false after successful fetch', async () => {
      vi.mocked(apiClient.fetchAllStandards).mockResolvedValue([]);

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.standards).toEqual([]);
    });

    it('returns loading false after fetch failure', async () => {
      vi.mocked(apiClient.fetchAllStandards).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).not.toBeNull();
    });
  });

  describe('error state', () => {
    it('returns error message on fetch failure', async () => {
      const errorMessage = 'Failed to load standards';
      vi.mocked(apiClient.fetchAllStandards).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });

      expect(result.current.standards).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('handles network errors gracefully', async () => {
      vi.mocked(apiClient.fetchAllStandards).mockRejectedValue(new Error('Failed to fetch'));

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.error).toContain('Unable to connect to the server');
      });
    });

    it('handles unexpected errors with generic message', async () => {
      vi.mocked(apiClient.fetchAllStandards).mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.error).toContain('An unexpected error occurred');
      });
    });
  });

  describe('refetch function', () => {
    it('provides refetch function for retry', async () => {
      vi.mocked(apiClient.fetchAllStandards).mockResolvedValue([]);

      const { result } = renderHook(() => useStandards());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe('function');
    });

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
