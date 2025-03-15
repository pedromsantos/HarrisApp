import { Pattern, ScaleType } from '../../types/lineGenerator';

export const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const OCTAVES = ['3', '4', '5'];
export const SCALE_TYPES: ScaleType[] = ['dominant', 'major'];
export const PATTERNS: Pattern[] = [
  'half_step_up',
  'chord_up',
  'chord_down',
  'triad_up',
  'triad_down',
  'pivot',
  'scale_down',
  'third_up',
  'third_down',
];
