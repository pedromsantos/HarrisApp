import { describe, expect, it } from 'vitest';

import { convertToCounterpointABC, getDurationFromRatio, noteToABC } from '../counterpointNotation';

describe('getDurationFromRatio', () => {
  it('returns "1/4" for ratio less than 0.8', () => {
    expect(getDurationFromRatio(0.5)).toBe('1/4');
  });

  it('returns "4" for ratio between 0.8 and 1.2', () => {
    expect(getDurationFromRatio(0.9)).toBe('4');
    expect(getDurationFromRatio(1.0)).toBe('4');
    expect(getDurationFromRatio(1.1)).toBe('4');
  });

  it('returns "1/2" for ratio between 1.5 and 2.5', () => {
    expect(getDurationFromRatio(1.5)).toBe('1/2');
    expect(getDurationFromRatio(2.0)).toBe('1/2');
    expect(getDurationFromRatio(2.4)).toBe('1/2');
  });

  it('returns "1/4" for ratio between 3.5 and 4.5', () => {
    expect(getDurationFromRatio(3.5)).toBe('1/4');
    expect(getDurationFromRatio(4.0)).toBe('1/4');
    expect(getDurationFromRatio(4.4)).toBe('1/4');
  });

  it('returns "1/4" for ratio greater than 4.5', () => {
    expect(getDurationFromRatio(5.0)).toBe('1/4');
  });
});

describe('noteToABC', () => {
  it('converts note without duration to ABC format', () => {
    expect(noteToABC('C4')).toBe('c');
  });

  it('converts note with duration to ABC format', () => {
    expect(noteToABC('D4', '2')).toBe('d2');
  });

  it('handles note with empty string duration', () => {
    expect(noteToABC('E4', '')).toBe('e');
  });

  it('handles different octaves correctly', () => {
    expect(noteToABC('C3')).toBe('C'); // octave 3 is uppercase
    expect(noteToABC('C4')).toBe('c'); // octave 4 is lowercase
    expect(noteToABC('C5')).toBe("c'"); // octave 5 is lowercase with apostrophe
  });

  it('handles different note names', () => {
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    notes.forEach((noteName) => {
      // Octave 4 produces lowercase letters
      expect(noteToABC(`${noteName}4`)).toBe(noteName.toLowerCase());
    });
  });

  it('handles accidentals', () => {
    expect(noteToABC('C#4')).toBe('^c');
    expect(noteToABC('Db4')).toBe('_d');
  });
});

describe('convertToCounterpointABC', () => {
  it('converts empty arrays to basic ABC structure', () => {
    const result = convertToCounterpointABC([], []);
    expect(result).toContain('V:1 name="CP"');
    expect(result).toContain('V:2 name="CF"');
    expect(result).toContain('z4 |'); // Empty measures
  });

  it('converts single note counterpoint and cantus firmus', () => {
    const cf = ['C4'];
    const cp = ['E4'];

    const result = convertToCounterpointABC(cf, cp);
    expect(result).toContain('V:1 name="CP"');
    expect(result).toContain('V:2 name="CF"');
    expect(result).toContain('c4'); // octave 4 = lowercase
    expect(result).toContain('e4'); // octave 4 = lowercase
  });

  it('adds bar lines between each note in CP line', () => {
    const cf = ['C4', 'D4', 'E4'];
    const cp = ['E4', 'F4', 'G4'];

    const result = convertToCounterpointABC(cf, cp);

    // Should have bar lines between notes
    expect(result).toContain('|');
    const cpLine = result.split('[V:1]')[1].split('[V:2]')[0];
    expect(cpLine).toContain(' | '); // Bar between notes
  });

  it('adds interval annotations in CP line when provided', () => {
    const cf = ['C4', 'D4'];
    const cp = ['E4', 'F4'];
    const intervals = ['M3', 'm3'];

    const result = convertToCounterpointABC(cf, cp, intervals);

    // Should have interval annotations
    expect(result).toContain('"_M3"');
    expect(result).toContain('"_m3"');
  });

  it('handles different note durations with duration parameter', () => {
    const cf = ['C4', 'D4'];
    const cp = ['E4', 'F4'];

    const result = convertToCounterpointABC(cf, cp);

    // All notes should get duration '4' (whole notes)
    expect(result).toContain('c4'); // lowercase for octave 4
    expect(result).toContain('d4');
    expect(result).toContain('e4');
    expect(result).toContain('f4');
  });

  it('handles mixed octaves correctly', () => {
    const cf = ['C3', 'D4', 'E5'];
    const cp = ['E3', 'F4', 'G5'];

    const result = convertToCounterpointABC(cf, cp);

    expect(result).toContain('C4'); // octave 3 is uppercase
    expect(result).toContain('d4'); // octave 4 is lowercase
    expect(result).toContain("e'4"); // octave 5 is lowercase with apostrophe
  });

  it('creates proper ABC structure with header', () => {
    const cf = ['C4'];
    const cp = ['E4'];

    const result = convertToCounterpointABC(cf, cp);

    expect(result).toMatch(/^X:\d+/); // starts with X: reference number
    expect(result).toContain('T:Counterpoint Exercise');
    expect(result).toContain('M:4/4'); // time signature
    expect(result).toContain('L:1/4'); // default note length
    expect(result).toContain('K:C'); // key signature
    expect(result).toContain('V:1 name="CP" clef=treble');
    expect(result).toContain('V:2 name="CF" clef=treble');
    expect(result).toContain('[V:1]'); // voice 1 start
    expect(result).toContain('[V:2]'); // voice 2 start
  });

  it('handles mismatched array lengths', () => {
    const cf = ['C4'];
    const cp = ['E4', 'F4'];

    const result = convertToCounterpointABC(cf, cp);

    // Should handle gracefully without errors
    expect(result).toContain('V:1 name="CP"');
    expect(result).toContain('V:2 name="CF"');
  });

  it('handles empty counterpoint with notes in cantus firmus', () => {
    const cf = ['C4', 'D4'];
    const cp: string[] = [];

    const result = convertToCounterpointABC(cf, cp);

    expect(result).toContain('c4'); // lowercase for octave 4
    expect(result).toContain('d4');
    expect(result).toContain('z4 |'); // Empty CP line
  });

  it('handles intervals array shorter than notes', () => {
    const cf = ['C4', 'D4', 'E4'];
    const cp = ['E4', 'F4', 'G4'];
    const intervals = ['M3']; // Only one interval

    const result = convertToCounterpointABC(cf, cp, intervals);

    // Should handle gracefully
    expect(result).toContain('"_M3"');
    expect(result).toContain('V:1 name="CP"');
  });
});
