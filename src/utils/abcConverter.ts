/**
 * Convert pitch names to ABC notation format
 * ABC notation uses letter names with octave indicators
 * C4 = C, C5 = c, C3 = C, (octave indicators: , for lower, ' for higher)
 */
export function pitchesToAbc(pitches: string[]): string {
  if (pitches.length === 0) {
    return 'X:1\nL:1/4\nK:C\nz';
  }

  const abcNotes = pitches.map(convertPitchToAbc);

  return `X:1
L:1/4
K:C
${abcNotes.join(' ')}`;
}

function convertPitchToAbc(pitch: string): string {
  // Parse pitch format like "C4", "Bb3", "F#5"
  const match = pitch.match(/^([A-G])(b|#)?(\d)$/);
  if (!match) {
    return 'z'; // Rest for invalid pitch
  }

  const [, letter, accidental = '', octaveStr] = match;
  const octave = parseInt(octaveStr, 10);

  let abcNote = letter;

  // ABC uses lowercase for higher octaves
  if (octave >= 5) {
    abcNote = letter.toLowerCase();
  } else if (octave >= 4) {
    abcNote = letter;
  } else {
    // Lower octaves use uppercase with comma
    abcNote = letter + ',';
  }

  // Handle accidentals
  if (accidental === '#') {
    abcNote = `^${abcNote}`;
  } else if (accidental === 'b') {
    abcNote = `_${abcNote}`;
  }

  return abcNote;
}
