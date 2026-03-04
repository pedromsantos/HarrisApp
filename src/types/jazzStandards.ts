export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type CAGEDShape = 'C' | 'A' | 'G' | 'E' | 'D';

export interface JazzStandard {
  id: string;
  name: string;
  composer: string;
  key: string;
  chords_original: string[];
  chords_improvisation: string[];
  form: string;
  tempo: string;
  difficulty: Difficulty;
  description: string;
}

export interface Line {
  pitches: string[];
  patterns: string[];
  tab: string[];
}

export interface GenerateLinesRequest {
  from_scale: string;
  to_scale: string;
  patterns: string[];
  position: number;
}

export interface GenerateLinesResponse {
  lines: string[][];
  tabs: string[][];
}
