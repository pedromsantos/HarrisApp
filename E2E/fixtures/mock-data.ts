export const mockScales = {
  fromScale: {
    note: 'C4',
    type: 'Major',
  },
  toScale: {
    note: 'G4',
    type: 'Major',
  },
};

export const mockPatterns = [
  { id: 'half-step-up', name: 'Half Step Up' },
  { id: 'chord-up', name: 'Chord Up' },
  { id: 'chord-down', name: 'Chord Down' },
  { id: 'triad-up', name: 'Triad Up' },
  { id: 'triad-down', name: 'Triad Down' },
];

export const mockGuitarPositions = [
  { id: 'C', name: 'C' },
  { id: 'A8', name: 'A8' },
  { id: 'G', name: 'G' },
  { id: 'E', name: 'E' },
  { id: 'D', name: 'D' },
];

export const mockGeneratedLine = {
  patterns: ['Half Step Up', 'Chord Down'],
  pitches: ['C4', 'Db4', 'E4', 'G4'],
  notation: 'C4 Db4 E4 G4',
};
