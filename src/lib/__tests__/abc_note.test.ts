import { AbcNote } from '../abcNotation/abcNote';

describe('abc Note should', () => {
  describe('using octaves', () => {
    type TestTuple = [string, string];

    test.each<TestTuple>([
      ['C0', 'C,,,,'],
      ['C1', 'C,,,'],
      ['C2', 'C,,'],
      ['C3', 'C,'],
      ['C4', "C'"],
      ['C5', "C''"],
      ['C6', "C'''"],
      ['C7', "C''''"],
      ['C8', "C'''''"],
    ])('represent a 1/8 note with octave', (note: string, expected: string) => {
      const abc_note = new AbcNote(note);

      expect(abc_note.toString()).toBe(expected);
    });
  });
});
