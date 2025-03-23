import { describe, expect, test } from 'vitest';

import { AbcNote } from '@/lib/abcNotation/abcNote';

describe('abc Note should', () => {
  describe('using octaves', () => {
    type TestTuple = [string, string];

    test.each<TestTuple>([
      ['C0', 'C,,,'],
      ['C1', 'C,,'],
      ['C2', 'C,'],
      ['C3', 'C'],
      ['C4', 'c'],
      ['C5', "c'"],
      ['C6', "c''"],
      ['C7', "c'''"],
      ['C8', "c''''"],
    ])('represent a 1/8 note with octave', (note: string, expected: string) => {
      const abc_note = new AbcNote(note);

      expect(abc_note.toString()).toBe(expected);
    });
  });
});
