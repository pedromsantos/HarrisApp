import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCounterpoint } from '../useCounterpoint';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('useCounterpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('initializes with default example', () => {
      const { result } = renderHook(() => useCounterpoint());

      expect(result.current.state.cantusFirmus).toEqual(['C3', 'G3', 'F3', 'E3', 'F3', 'D3', 'C3']);
      expect(result.current.state.counterpoint).toEqual(['C4', 'B3', 'D4', 'C4', 'A3', 'B3', 'C4']);
      expect(result.current.state.mode).toBe('cantus_firmus');
      expect(result.current.state.octave).toBe(4);
    });

    it('initializes with empty validation and intervals', () => {
      const { result } = renderHook(() => useCounterpoint());

      expect(result.current.state.validation).toBeNull();
      expect(result.current.state.intervals).toEqual([]);
      expect(result.current.state.savedExercises).toEqual([]);
    });
  });

  describe('note management', () => {
    it('adds note to cantus firmus when in CF mode', () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.clearAll();
        result.current.setMode('cantus_firmus');
        result.current.addNote('G4');
      });

      expect(result.current.state.cantusFirmus).toContain('G4');
    });

    it('adds note to counterpoint when in CP mode', () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.clearAll();
        result.current.setMode('counterpoint');
        result.current.addNote('B4');
      });

      expect(result.current.state.counterpoint).toContain('B4');
    });

    it('undoes last note from cantus firmus', () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.setMode('cantus_firmus');
      });

      const initialLength = result.current.state.cantusFirmus.length;

      act(() => {
        result.current.undoNote();
      });

      expect(result.current.state.cantusFirmus.length).toBe(initialLength - 1);
    });

    it('undoes last note from counterpoint', () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.setMode('counterpoint');
      });

      const initialLength = result.current.state.counterpoint.length;

      act(() => {
        result.current.undoNote();
      });

      expect(result.current.state.counterpoint.length).toBe(initialLength - 1);
    });

    it('updates cantus firmus notes when mode is cantus_firmus', () => {
      const { result } = renderHook(() => useCounterpoint());

      const newNotes = ['C4', 'D4', 'E4', 'F4'];

      act(() => {
        result.current.updateNotes(newNotes, 'cantus_firmus');
      });

      expect(result.current.state.cantusFirmus).toEqual(newNotes);
    });

    it('updates counterpoint notes when mode is counterpoint', () => {
      const { result } = renderHook(() => useCounterpoint());

      const newNotes = ['G4', 'A4', 'B4', 'C5'];

      act(() => {
        result.current.updateNotes(newNotes, 'counterpoint');
      });

      expect(result.current.state.counterpoint).toEqual(newNotes);
    });

    it('clears validation when updating notes', () => {
      const { result } = renderHook(() => useCounterpoint());

      // Manually set validation
      act(() => {
        result.current.state.validation = {
          species: 'First',
          isValid: true,
          errorCount: 0,
          warningCount: 0,
          violations: [],
        };
      });

      expect(result.current.state.validation).not.toBeNull();

      act(() => {
        result.current.updateNotes(['C4', 'D4'], 'cantus_firmus');
      });

      expect(result.current.state.validation).toBeNull();
    });

    it('clears validation when adding a note', () => {
      const { result } = renderHook(() => useCounterpoint());

      // Manually set validation
      act(() => {
        result.current.state.validation = {
          species: 'First',
          isValid: true,
          errorCount: 0,
          warningCount: 0,
          violations: [],
        };
        result.current.addNote('A4');
      });

      expect(result.current.state.validation).toBeNull();
    });
  });

  describe('mode management', () => {
    it('switches between cantus firmus and counterpoint modes', () => {
      const { result } = renderHook(() => useCounterpoint());

      expect(result.current.state.mode).toBe('cantus_firmus');

      act(() => {
        result.current.setMode('counterpoint');
      });

      expect(result.current.state.mode).toBe('counterpoint');

      act(() => {
        result.current.setMode('cantus_firmus');
      });

      expect(result.current.state.mode).toBe('cantus_firmus');
    });
  });

  describe('octave management', () => {
    it('changes octave', () => {
      const { result } = renderHook(() => useCounterpoint());

      expect(result.current.state.octave).toBe(4);

      act(() => {
        result.current.setOctave(5);
      });

      expect(result.current.state.octave).toBe(5);
    });
  });

  describe('clearing lines', () => {
    it('clears current line (cantus firmus)', () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.setMode('cantus_firmus');
        result.current.clearCurrentLine();
      });

      expect(result.current.state.cantusFirmus).toEqual([]);
      expect(result.current.state.counterpoint.length).toBeGreaterThan(0);
    });

    it('clears current line (counterpoint)', () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.setMode('counterpoint');
        result.current.clearCurrentLine();
      });

      expect(result.current.state.counterpoint).toEqual([]);
      expect(result.current.state.cantusFirmus.length).toBeGreaterThan(0);
    });

    it('clears all lines', () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.state.cantusFirmus).toEqual([]);
      expect(result.current.state.counterpoint).toEqual([]);
      expect(result.current.state.intervals).toEqual([]);
      expect(result.current.state.validation).toBeNull();
    });
  });

  describe('interval calculation', () => {
    it('calculates intervals via API', async () => {
      const mockIntervalResponse = { interval: 'M3' };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockIntervalResponse),
      } as unknown as Response);

      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.clearAll();
        result.current.setMode('cantus_firmus');
        result.current.addNote('C4');
        result.current.setMode('counterpoint');
        result.current.addNote('E4');
      });

      await act(async () => {
        await result.current.calculateIntervals();
      });

      await waitFor(() => {
        expect(result.current.state.intervals).toContain('M3');
      });
    });

    it('returns empty array when no notes present', async () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.clearAll();
      });

      await act(async () => {
        await result.current.calculateIntervals();
      });

      expect(result.current.state.intervals).toEqual([]);
    });

    it('handles API errors gracefully', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useCounterpoint());

      await act(async () => {
        await result.current.calculateIntervals();
      });

      expect(result.current.state.intervals).toEqual([]);
    });
  });

  describe('validation', () => {
    it('validates counterpoint via API', async () => {
      const mockValidationResponse = {
        species: 'First',
        is_valid: true,
        error_count: 0,
        warning_count: 0,
        violations: [],
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockValidationResponse),
      } as unknown as Response);

      const { result } = renderHook(() => useCounterpoint());

      await act(async () => {
        await result.current.validate();
      });

      await waitFor(() => {
        expect(result.current.state.validation).toEqual({
          species: 'First',
          isValid: true,
          errorCount: 0,
          warningCount: 0,
          violations: [],
        });
      });
    });

    it('sets error when validation fails', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Validation failed' }),
      } as unknown as Response);

      const { result } = renderHook(() => useCounterpoint());

      await act(async () => {
        await result.current.validate();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Validation failed');
      });
    });

    it('shows error when no notes present', async () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.clearAll();
      });

      await act(async () => {
        await result.current.validate();
      });

      expect(result.current.error).toBe('Please enter both cantus firmus and counterpoint lines');
    });

    it('sets isValidating flag during validation', async () => {
      let resolveFetch: (value: Response) => void;
      const fetchPromise = new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      });

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValue(fetchPromise);

      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        void result.current.validate();
      });

      expect(result.current.isValidating).toBe(true);

      await act(async () => {
        resolveFetch({
          ok: true,
          json: vi.fn().mockResolvedValue({
            species: 'First',
            is_valid: true,
            error_count: 0,
            warning_count: 0,
            violations: [],
          }),
        } as unknown as Response);
        await fetchPromise;
      });

      await waitFor(() => {
        expect(result.current.isValidating).toBe(false);
      });
    });
  });

  describe('save and load', () => {
    it('saves an exercise', () => {
      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.saveExercise('My Exercise');
      });

      expect(result.current.state.savedExercises).toHaveLength(1);
      expect(result.current.state.savedExercises[0]?.name).toBe('My Exercise');
    });

    it('loads a saved exercise', () => {
      const { result } = renderHook(() => useCounterpoint());

      let exerciseId = '';
      let savedCF: string[] = [];

      act(() => {
        result.current.clearAll();
        result.current.setMode('cantus_firmus');
        result.current.addNote('A4');
        result.current.addNote('B4');
        savedCF = [...result.current.state.cantusFirmus];
        result.current.saveExercise('Test Exercise');
      });

      exerciseId = result.current.state.savedExercises[0]?.id ?? '';
      expect(result.current.state.savedExercises).toHaveLength(1);

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.state.cantusFirmus).toEqual([]);
      expect(result.current.state.savedExercises).toHaveLength(1);

      act(() => {
        result.current.loadExercise(exerciseId);
      });

      expect(result.current.state.cantusFirmus).toEqual(savedCF);
    });

    it('does nothing when loading non-existent exercise', () => {
      const { result } = renderHook(() => useCounterpoint());

      const beforeState = { ...result.current.state };

      act(() => {
        result.current.loadExercise('non-existent-id');
      });

      expect(result.current.state).toEqual(beforeState);
    });
  });

  describe('export', () => {
    it('exports ABC notation', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL');
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

      const { result } = renderHook(() => useCounterpoint());

      act(() => {
        result.current.exportABC();
      });

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });
  });
});
