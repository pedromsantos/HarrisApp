import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useAbcNotation } from '../useAbcNotation';

describe('useAbcNotation', () => {
  describe('parseAbcNote', () => {
    it('parses lowercase notes (octave 4)', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('c')).toEqual({ pitch: 'C', octave: 4 });
      expect(result.current.parseAbcNote('d')).toEqual({ pitch: 'D', octave: 4 });
      expect(result.current.parseAbcNote('e')).toEqual({ pitch: 'E', octave: 4 });
    });

    it('parses uppercase notes (octave 3)', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('C')).toEqual({ pitch: 'C', octave: 3 });
      expect(result.current.parseAbcNote('D')).toEqual({ pitch: 'D', octave: 3 });
      expect(result.current.parseAbcNote('E')).toEqual({ pitch: 'E', octave: 3 });
    });

    it('parses notes with sharp accidentals', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('^c')).toEqual({ pitch: 'C#', octave: 4 });
      expect(result.current.parseAbcNote('^C')).toEqual({ pitch: 'C#', octave: 3 });
    });

    it('parses notes with flat accidentals', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('_b')).toEqual({ pitch: 'Bb', octave: 4 });
      expect(result.current.parseAbcNote('_B')).toEqual({ pitch: 'Bb', octave: 3 });
    });

    it('parses notes with natural accidentals', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('=c')).toEqual({ pitch: 'C', octave: 4 });
      expect(result.current.parseAbcNote('=C')).toEqual({ pitch: 'C', octave: 3 });
    });

    it('parses notes with octave markers (apostrophes for higher)', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote("c'")).toEqual({ pitch: 'C', octave: 5 });
      expect(result.current.parseAbcNote("c''")).toEqual({ pitch: 'C', octave: 6 });
      expect(result.current.parseAbcNote("c'''")).toEqual({ pitch: 'C', octave: 7 });
    });

    it('parses notes with octave markers (commas for lower)', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('C,')).toEqual({ pitch: 'C', octave: 2 });
      expect(result.current.parseAbcNote('C,,')).toEqual({ pitch: 'C', octave: 1 });
      expect(result.current.parseAbcNote('C,,,')).toEqual({ pitch: 'C', octave: 0 });
    });

    it('parses notes with duration information', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('c2')).toEqual({ pitch: 'C', octave: 4 });
      expect(result.current.parseAbcNote('c1/2')).toEqual({ pitch: 'C', octave: 4 });
      expect(result.current.parseAbcNote('c1/4')).toEqual({ pitch: 'C', octave: 4 });
    });

    it('returns null for rests', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('z')).toBeNull();
      expect(result.current.parseAbcNote('z4')).toBeNull();
    });

    it('returns null for empty strings', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.parseAbcNote('')).toBeNull();
    });
  });

  describe('transposeNote', () => {
    it('transposes notes up by semitones', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.transposeNote('C4', 1)).toBe('C#4');
      expect(result.current.transposeNote('C4', 2)).toBe('D4');
      expect(result.current.transposeNote('C4', 3)).toBe('D#4');
      expect(result.current.transposeNote('C4', 12)).toBe('C5');
    });

    it('transposes notes down by semitones', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.transposeNote('C4', -1)).toBe('B3');
      expect(result.current.transposeNote('C4', -2)).toBe('A#3');
      expect(result.current.transposeNote('C4', -12)).toBe('C3');
    });

    it('transposes notes with sharps', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.transposeNote('C#4', 1)).toBe('D4');
      expect(result.current.transposeNote('C#4', 2)).toBe('D#4');
      expect(result.current.transposeNote('F#4', 1)).toBe('G4');
    });

    it('transposes notes with flats', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.transposeNote('Bb4', 1)).toBe('B4');
      expect(result.current.transposeNote('Bb4', 2)).toBe('C5');
      expect(result.current.transposeNote('Eb4', -1)).toBe('D4');
    });

    it('handles octave boundaries correctly', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.transposeNote('B4', 1)).toBe('C5');
      expect(result.current.transposeNote('C4', -1)).toBe('B3');
      expect(result.current.transposeNote('G4', 7)).toBe('D5');
    });

    it('returns unchanged for invalid note format', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.transposeNote('invalid', 2)).toBe('invalid');
      expect(result.current.transposeNote('X4', 2)).toBe('X4');
      expect(result.current.transposeNote('', 2)).toBe('');
    });

    it('handles zero transposition', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.transposeNote('C4', 0)).toBe('C4');
      expect(result.current.transposeNote('F#5', 0)).toBe('F#5');
    });
  });

  describe('stepToSemitones', () => {
    it('converts positive steps to semitones (ascending)', () => {
      const { result } = renderHook(() => useAbcNotation());

      // C to D = 2 semitones
      expect(result.current.stepToSemitones(1, 'C4')).toBe(2);
      // D to E = 2 semitones
      expect(result.current.stepToSemitones(1, 'D4')).toBe(2);
      // E to F = 1 semitone
      expect(result.current.stepToSemitones(1, 'E4')).toBe(1);
      // F to G = 2 semitones
      expect(result.current.stepToSemitones(1, 'F4')).toBe(2);
    });

    it('converts negative steps to semitones (descending)', () => {
      const { result } = renderHook(() => useAbcNotation());

      // D to C = -2 semitones
      expect(result.current.stepToSemitones(-1, 'D4')).toBe(-2);
      // E to D = -2 semitones
      expect(result.current.stepToSemitones(-1, 'E4')).toBe(-2);
      // F to E = -1 semitone
      expect(result.current.stepToSemitones(-1, 'F4')).toBe(-1);
    });

    it('converts multiple steps correctly', () => {
      const { result } = renderHook(() => useAbcNotation());

      // C to E (2 steps) = 4 semitones (C->D=2, D->E=2)
      expect(result.current.stepToSemitones(2, 'C4')).toBe(4);
      // C to F (3 steps) = 5 semitones (C->D=2, D->E=2, E->F=1)
      expect(result.current.stepToSemitones(3, 'C4')).toBe(5);
      // C to G (4 steps) = 7 semitones
      expect(result.current.stepToSemitones(4, 'C4')).toBe(7);
    });

    it('handles zero steps', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.stepToSemitones(0, 'C4')).toBe(0);
      expect(result.current.stepToSemitones(0, 'G4')).toBe(0);
    });

    it('works with notes containing sharps', () => {
      const { result } = renderHook(() => useAbcNotation());

      // C# up one step = E (same as C to D diatonically)
      expect(result.current.stepToSemitones(1, 'C#4')).toBe(2);
    });

    it('works with notes containing flats', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.stepToSemitones(1, 'Bb4')).toBe(1); // Bb to C
    });

    it('returns step value for invalid note format (fallback)', () => {
      const { result } = renderHook(() => useAbcNotation());

      expect(result.current.stepToSemitones(3, 'invalid')).toBe(3);
      expect(result.current.stepToSemitones(-2, 'X4')).toBe(-2);
    });

    it('handles large step values', () => {
      const { result } = renderHook(() => useAbcNotation());

      // C to C (7 steps up) = 12 semitones (one octave)
      expect(result.current.stepToSemitones(7, 'C4')).toBe(12);
      // C down 7 steps = -12 semitones
      expect(result.current.stepToSemitones(-7, 'C4')).toBe(-12);
    });
  });
});
