import { AbcNote } from './abcNotation/abcNote';

export const convertToABC = (notes: string[]): string => {
  let abc = 'X:1\n';
  abc += 'M:4/4\n';
  abc += 'L:1/8\n';
  abc += 'K:C\n';

  const abcNotes = notes
    .map((note, index) => {
      const abcNote = new AbcNote(note).toString();

      if ((index + 1) % 8 === 0) {
        return `${abcNote} |`;
      } else if ((index + 1) % 2 === 0) {
        return `${abcNote} `;
      }

      return abcNote;
    })
    .join('');

  abc += abcNotes;
  return abc;
};
