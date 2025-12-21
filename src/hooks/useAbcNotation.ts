import { useCallback } from 'react';

interface AbcNotationUtils {
  parseAbcNote: (abcNote: string) => { pitch: string; octave: number } | null;
  transposeNote: (note: string, semitones: number) => string;
  stepToSemitones: (step: number, currentNote: string) => number;
  calculateNoteIndex: (voiceContent: string, notePosition: number) => number;
}

/**
 * Extract accidental from ABC notation
 */
function extractAccidental(noteOnly: string): { accidental: string; noteChar: string } {
  if (noteOnly.startsWith('^')) {
    return { accidental: '#', noteChar: noteOnly.slice(1) };
  }
  if (noteOnly.startsWith('_')) {
    return { accidental: 'b', noteChar: noteOnly.slice(1) };
  }
  if (noteOnly.startsWith('=')) {
    return { accidental: '', noteChar: noteOnly.slice(1) };
  }
  return { accidental: '', noteChar: noteOnly };
}

/**
 * Calculate octave from ABC notation
 */
function calculateOctave(baseNote: string, noteChar: string): number {
  const apostrophes = (noteChar.match(/'/g) ?? []).length;
  const commas = (noteChar.match(/,/g) ?? []).length;

  if (baseNote === baseNote.toUpperCase()) {
    // Uppercase = octave 3, 2, 1, 0 (with commas going down)
    return 3 - commas;
  }
  // Lowercase = octave 4, 5, 6, 7, 8 (with apostrophes going up)
  return 4 + apostrophes;
}

/**
 * Convert note to MIDI number
 */
function noteToMidi(noteName: string, accidental: string, octave: number): number {
  const noteValues: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  let midiNote = noteValues[noteName] ?? 0;
  if (accidental === '#') midiNote += 1;
  if (accidental === 'b') midiNote -= 1;
  midiNote += (octave + 1) * 12;
  return midiNote;
}

/**
 * Convert MIDI number to note
 */
function midiToNote(midiNote: number): string | null {
  const newOctave = Math.floor(midiNote / 12) - 1;
  const pitchClass = midiNote % 12;
  const pitchClasses = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const newNote = pitchClasses[pitchClass];

  if (newNote === undefined) {
    return null;
  }

  return `${newNote}${newOctave.toString()}`;
}

/**
 * Get the step size (in semitones) for a given note and direction
 */
function getDiatonicStepSize(
  noteSequence: string[],
  diatonicSteps: Record<string, number>,
  index: number,
  isAscending: boolean
): number {
  if (isAscending) {
    const noteName = noteSequence[index];
    return noteName !== undefined ? (diatonicSteps[noteName] ?? 1) : 1;
  }
  const prevIndex = (index - 1 + 7) % 7;
  const prevNoteName = noteSequence[prevIndex];
  return prevNoteName !== undefined ? (diatonicSteps[prevNoteName] ?? 1) : 1;
}

/**
 * Check if position is within segment bounds
 */
function isPositionInSegment(
  notePosition: number,
  currentPos: number,
  segmentEnd: number
): boolean {
  return notePosition >= currentPos && notePosition < segmentEnd;
}

/**
 * Hook providing ABC notation parsing and conversion utilities
 */
export function useAbcNotation(): AbcNotationUtils {
  /**
   * Parse ABC notation back to standard note format (e.g., "^c'" -> "C#5")
   */
  const parseAbcNote = useCallback((abcNote: string): { pitch: string; octave: number } | null => {
    // Remove duration info (numbers and slashes after the note)
    const noteOnly = abcNote.replace(/[0-9/]+$/, '');

    if (noteOnly === '' || noteOnly === 'z') {
      return null; // Rest
    }

    // Extract accidental
    const { accidental, noteChar } = extractAccidental(noteOnly);

    // Get base note
    const baseNote = noteChar.replace(/[',]/g, '');

    // Determine octave
    const octave = calculateOctave(baseNote, noteChar);

    const pitch = baseNote.toUpperCase() + accidental;

    return { pitch, octave };
  }, []);

  /**
   * Transpose a note by a number of semitones
   */
  const transposeNote = useCallback((note: string, semitones: number): string => {
    const noteRegex = /^([A-G])([#b]?)(\d+)$/;
    const match = note.match(noteRegex);

    if (!match) {
      return note; // Invalid format, return unchanged
    }

    const [, noteName, accidental, octaveStr] = match;

    const isInvalidNote =
      noteName === undefined || noteName === '' || octaveStr === undefined || octaveStr === '';
    if (isInvalidNote) {
      return note; // Invalid format, return unchanged
    }

    const octave = parseInt(octaveStr);

    // Convert to MIDI note number
    const midiNote = noteToMidi(noteName, accidental ?? '', octave);

    // Apply transposition
    const transposedMidi = midiNote + semitones;

    // Convert back to note name
    const newNote = midiToNote(transposedMidi);

    if (newNote === null) {
      return note; // Invalid pitch class, return unchanged
    }

    return newNote;
  }, []);

  /**
   * Convert ABC note step (from drag) to semitones
   * In ABC notation, one step = one staff line/space position
   */
  const stepToSemitones = useCallback((step: number, currentNote: string): number => {
    // Parse the current note to understand the scale context
    const noteRegex = /^([A-G])([#b]?)\d+$/;
    const match = currentNote.match(noteRegex);

    if (!match) {
      return step; // Fallback: treat as chromatic
    }

    const [, noteName] = match;

    if (noteName === undefined || noteName === '') {
      return step; // Fallback: treat as chromatic
    }

    // Define semitone intervals for moving diatonically (major scale pattern)
    const diatonicSteps: Record<string, number> = {
      C: 2,
      D: 2,
      E: 1,
      F: 2,
      G: 2,
      A: 2,
      B: 1,
    };

    const noteSequence = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const direction = step > 0 ? 1 : -1;
    const absSteps = Math.abs(step);
    const isAscending = direction > 0;

    let semitones = 0;
    let currentIndex = noteSequence.indexOf(noteName);

    for (let i = 0; i < absSteps; i++) {
      const stepSize = getDiatonicStepSize(noteSequence, diatonicSteps, currentIndex, isAscending);
      semitones += isAscending ? stepSize : -stepSize;
      currentIndex = (currentIndex + direction + 7) % 7;
    }

    return semitones;
  }, []);

  /**
   * Calculate note index from character position in ABC voice content
   * Parses ABC notation by bar lines and maps position to note index
   */
  const calculateNoteIndex = useCallback((voiceContent: string, notePosition: number): number => {
    const rawSegments = voiceContent.split('|');
    let currentPos = 0;
    let validNoteCount = 0;

    for (let i = 0; i < rawSegments.length; i++) {
      const segment = rawSegments[i];
      if (segment === undefined) continue;

      const segmentEnd = currentPos + segment.length;
      const hasContent = segment.trim() !== '';

      if (isPositionInSegment(notePosition, currentPos, segmentEnd)) {
        return hasContent ? validNoteCount : -1;
      }

      if (hasContent) {
        validNoteCount++;
      }

      currentPos = segmentEnd + 1; // +1 for the | character
    }

    return -1;
  }, []);

  return {
    parseAbcNote,
    transposeNote,
    stepToSemitones,
    calculateNoteIndex,
  };
}
