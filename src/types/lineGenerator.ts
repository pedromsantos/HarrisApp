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

export interface LineGeneratorRequest {
  from_scale: string;
  to_scale: string;
  patterns: Pattern[];
  position?: number;
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
