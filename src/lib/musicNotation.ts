import { AbcNote } from './abcNotation/abcNote';

export const convertToABC = (notes: string[]): string => {
  let abc = 'X:1\n';
  abc += 'T:Generated Line\n';
  abc += 'M:4/4\n';
  abc += 'L:1/8\n';
  abc += 'K:C\n';

  // Map and group notes with proper spacing and bar lines
  const abcNotes = notes
    .map((note, index) => {
      const abcNote = new AbcNote(note).toString();

      if ((index + 1) % 8 === 0) {
        return abcNote + ' |';
      } else if ((index + 1) % 2 === 0) {
        return abcNote + ' ';
      }

      return abcNote;
    })
    .join('');

  abc += abcNotes;
  return abc;
};
