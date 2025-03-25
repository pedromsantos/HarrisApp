export type ScaleType = 'dominant' | 'major';

export type Pattern =
  | 'half_step_up'
  | 'chord_up'
  | 'chord_down'
  | 'triad_up'
  | 'triad_down'
  | 'pivot'
  | 'scale_down'
  | 'third_up'
  | 'third_down';

export type Position = 'Open' | 'C' | 'A' | 'G' | 'E' | 'D' | 'C8' | 'A8' | 'G8' | 'E8';
export interface LineGeneratorRequest {
  from_scale: string;
  to_scale: string;
  patterns: Pattern[];
  position?: Position | number;
}

export interface LineGeneratorResponse {
  lines: string[][];
  tabs: string[][];
  from_scale: string;
  to_scale: string;
}

export interface ErrorResponse {
  error: string;
}
