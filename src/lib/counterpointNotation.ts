import { AbcNote } from './abcNotation/abcNote';

export const getDurationFromRatio = (ratio: number): string => {
  if (ratio >= 3.5 && ratio <= 4.5) return '1/4'; // Third species (4:1)
  if (ratio >= 1.5 && ratio <= 2.5) return '1/2'; // Second species (2:1)
  if (ratio >= 0.8 && ratio <= 1.2) return '4'; // First species (1:1) - whole notes
  return '1/4'; // Default to quarter notes
};

export const noteToABC = (note: string, duration?: string): string => {
  const abcNote = new AbcNote(note).toString();

  if (duration === undefined || duration === '') {
    return abcNote;
  }

  // ABC duration format:
  // - '2' means double length (whole note in L:1/4)
  // - '1/2' means half length
  // - '1/4' means quarter length
  return `${abcNote}${duration}`;
};

export const convertToCounterpointABC = (
  cantusFirmus: string[],
  counterpoint: string[],
  intervals: string[] = []
): string => {
  if (cantusFirmus.length === 0 && counterpoint.length === 0) {
    return `X:1
T:Counterpoint Exercise
M:4/4
L:1/4
K:C
V:1 name="CP" clef=treble
V:2 name="CF" clef=treble
[V:1] z4 |
[V:2] z4 |
`;
  }

  const ratio = counterpoint.length / (cantusFirmus.length || 1);
  const cpDuration = getDurationFromRatio(ratio);

  // Convert notes to ABC notation with bar lines between each note
  const cpNotes = counterpoint.length > 0 ? counterpoint.map((n) => noteToABC(n, cpDuration)) : [];

  const cfNotes = cantusFirmus.length > 0 ? cantusFirmus.map((n) => noteToABC(n, cpDuration)) : [];

  // Build CP line with bar lines and intervals as annotations
  const cpLine =
    cpNotes.length > 0
      ? `${cpNotes
          .map((note, i) => {
            const interval = intervals[i] ?? '';
            // Add interval annotation below the note if available
            const annotation = interval !== '' ? `"_${interval}"` : '';
            return `${annotation}${note}`;
          })
          .join(' | ')} |`
      : 'z4 |';

  // Build CF line with bar lines
  const cfLine = cfNotes.length > 0 ? `${cfNotes.join(' | ')} |` : 'z4 |';

  return `X:1
T:Counterpoint Exercise
M:4/4
L:1/4
K:C
V:1 name="CP" clef=treble
V:2 name="CF" clef=treble
[V:1] ${cpLine}
[V:2] ${cfLine}
`;
};
