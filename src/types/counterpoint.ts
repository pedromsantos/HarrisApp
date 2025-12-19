export type CounterpointMode = 'cantus_firmus' | 'counterpoint';

export interface Violation {
  severity: 'Error' | 'Warning';
  rule: string;
  position: number | null;
  description: string;
  suggestion: string | null;
}

export interface ValidationResult {
  species: string;
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  violations: Violation[];
}

export interface CounterpointState {
  mode: CounterpointMode;
  cantusFirmus: string[];
  counterpoint: string[];
  intervals: string[];
  validation: ValidationResult | null;
  octave: number;
  savedExercises: SavedExercise[];
}

export interface SavedExercise {
  id: string;
  name: string;
  timestamp: number;
  cantusFirmus: string[];
  counterpoint: string[];
  validation?: ValidationResult;
}

export interface EvaluateCounterpointRequest {
  cantus_firmus: string[];
  counterpoint: string[];
}

export interface EvaluateCounterpointResponse {
  species: string;
  is_valid: boolean;
  error_count: number;
  warning_count: number;
  violations: ViolationDto[];
}

export interface ViolationDto {
  severity: string;
  rule: string;
  position: number | null;
  description: string;
  suggestion: string | null;
}

export interface IntervalResponse {
  interval: string;
}
