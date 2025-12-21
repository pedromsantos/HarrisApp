import { useCallback, useState } from 'react';

import {
  CounterpointMode,
  CounterpointState,
  EvaluateCounterpointRequest,
  EvaluateCounterpointResponse,
  IntervalResponse,
  SavedExercise,
  ValidationResult,
} from '@/types/counterpoint';

// Use proxy server in development, Cloudflare Worker in production
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : ((import.meta.env['VITE_API_URL'] as string | undefined) ??
    'https://harrisapp-backend.your-worker-subdomain.workers.dev');

const DEFAULT_EXAMPLE = {
  counterpoint: ['C4', 'B3', 'D4', 'C4', 'A3', 'B3', 'C4'],
  cantusFirmus: ['C3', 'G3', 'F3', 'E3', 'F3', 'D3', 'C3'],
};

type UseCounterpointReturn = {
  state: CounterpointState;
  addNote: (note: string) => void;
  undoNote: () => void;
  updateNotes: (notes: string[], mode: CounterpointMode) => void;
  setMode: (mode: CounterpointMode) => void;
  setOctave: (octave: number) => void;
  clearCurrentLine: () => void;
  clearAll: () => void;
  validate: () => Promise<void>;
  calculateIntervals: () => Promise<void>;
  saveExercise: (name: string) => void;
  loadExercise: (id: string) => void;
  exportABC: () => void;
  isValidating: boolean;
  error: string | null;
};

export function useCounterpoint(): UseCounterpointReturn {
  const [state, setState] = useState<CounterpointState>({
    mode: 'cantus_firmus',
    cantusFirmus: DEFAULT_EXAMPLE.cantusFirmus,
    counterpoint: DEFAULT_EXAMPLE.counterpoint,
    intervals: [],
    validation: null,
    octave: 4,
    savedExercises: [],
  });

  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = useCallback((note: string) => {
    setState((prev) => {
      if (prev.mode === 'cantus_firmus') {
        return {
          ...prev,
          cantusFirmus: [...prev.cantusFirmus, note],
          validation: null,
        };
      } else {
        return {
          ...prev,
          counterpoint: [...prev.counterpoint, note],
          validation: null,
        };
      }
    });
  }, []);

  const undoNote = useCallback(() => {
    setState((prev) => {
      if (prev.mode === 'cantus_firmus') {
        return {
          ...prev,
          cantusFirmus: prev.cantusFirmus.slice(0, -1),
          validation: null,
        };
      } else {
        return {
          ...prev,
          counterpoint: prev.counterpoint.slice(0, -1),
          validation: null,
        };
      }
    });
  }, []);

  const updateNotes = useCallback((notes: string[], mode: CounterpointMode) => {
    setState((prev) => {
      if (mode === 'cantus_firmus') {
        return {
          ...prev,
          cantusFirmus: notes,
          validation: null,
        };
      } else {
        return {
          ...prev,
          counterpoint: notes,
          validation: null,
        };
      }
    });
  }, []);

  const setMode = useCallback((mode: CounterpointMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const setOctave = useCallback((octave: number) => {
    setState((prev) => ({ ...prev, octave }));
  }, []);

  const clearCurrentLine = useCallback(() => {
    setState((prev) => {
      if (prev.mode === 'cantus_firmus') {
        return {
          ...prev,
          cantusFirmus: [],
          validation: null,
        };
      } else {
        return {
          ...prev,
          counterpoint: [],
          validation: null,
        };
      }
    });
  }, []);

  const clearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cantusFirmus: [],
      counterpoint: [],
      intervals: [],
      validation: null,
    }));
  }, []);

  const calculateIntervals = useCallback(async () => {
    if (state.cantusFirmus.length === 0 || state.counterpoint.length === 0) {
      setState((prev) => ({ ...prev, intervals: [] }));
      return;
    }

    try {
      const endpoint = import.meta.env.DEV
        ? '/api/pitch/interval'
        : `${API_BASE_URL}/api/pitch/interval`;

      const intervalPromises = state.cantusFirmus.map(async (cfNote, index) => {
        const cpNote = state.counterpoint[index];
        if (cpNote === undefined || cpNote === '') return '—';

        const response = await fetch(`${endpoint}?pitch1=${cfNote}&pitch2=${cpNote}`);
        if (!response.ok) return '—';

        const data = (await response.json()) as IntervalResponse;
        return data.interval;
      });

      const intervals = await Promise.all(intervalPromises);
      setState((prev) => ({ ...prev, intervals }));
    } catch {
      setState((prev) => ({ ...prev, intervals: [] }));
    }
  }, [state.cantusFirmus, state.counterpoint]);

  const validate = useCallback(async () => {
    if (state.cantusFirmus.length === 0 || state.counterpoint.length === 0) {
      setError('Please enter both cantus firmus and counterpoint lines');
      return;
    }

    setError(null);
    setIsValidating(true);

    try {
      const endpoint = import.meta.env.DEV
        ? '/api/counterpoint/evaluate'
        : `${API_BASE_URL}/api/counterpoint/evaluate`;

      const requestData: EvaluateCounterpointRequest = {
        cantus_firmus: state.cantusFirmus,
        counterpoint: state.counterpoint,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? 'Failed to validate counterpoint');
      }

      const data = (await response.json()) as EvaluateCounterpointResponse;

      const validationResult: ValidationResult = {
        species: data.species,
        isValid: data.is_valid,
        errorCount: data.error_count,
        warningCount: data.warning_count,
        violations: data.violations.map((v) => ({
          severity: v.severity as 'Error' | 'Warning',
          rule: v.rule,
          position: v.position,
          description: v.description,
          suggestion: v.suggestion,
        })),
      };

      setState((prev) => ({
        ...prev,
        validation: validationResult,
      }));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during validation');
      }
    } finally {
      setIsValidating(false);
    }
  }, [state.cantusFirmus, state.counterpoint]);

  const saveExercise = useCallback(
    (name: string) => {
      const exercise: SavedExercise = {
        id: globalThis.crypto.randomUUID(),
        name,
        timestamp: Date.now(),
        cantusFirmus: state.cantusFirmus,
        counterpoint: state.counterpoint,
        validation: state.validation ?? undefined,
      };

      setState((prev) => ({
        ...prev,
        savedExercises: [...prev.savedExercises, exercise],
      }));
    },
    [state.cantusFirmus, state.counterpoint, state.validation]
  );

  const loadExercise = useCallback((id: string) => {
    setState((prev) => {
      const exercise = prev.savedExercises.find((e) => e.id === id);
      if (!exercise) return prev;

      return {
        ...prev,
        cantusFirmus: exercise.cantusFirmus,
        counterpoint: exercise.counterpoint,
        validation: exercise.validation ?? null,
        intervals: [],
      };
    });
  }, []);

  const exportABC = useCallback(() => {
    // This will be implemented after we create the ABC conversion helper
    // For now, just a placeholder
    const abcContent = `% Counterpoint Exercise
X:1
T:Counterpoint Exercise
M:4/4
L:1/4
K:C
% Cantus Firmus: ${state.cantusFirmus.join(', ')}
% Counterpoint: ${state.counterpoint.join(', ')}
`;

    const blob = new Blob([abcContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'counterpoint-exercise.abc';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.cantusFirmus, state.counterpoint]);

  return {
    state,
    addNote,
    undoNote,
    updateNotes,
    setMode,
    setOctave,
    clearCurrentLine,
    clearAll,
    validate,
    calculateIntervals,
    saveExercise,
    loadExercise,
    exportABC,
    isValidating,
    error,
  };
}
