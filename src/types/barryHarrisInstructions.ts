/**
 * Types for Barry Harris Instructions API
 * Endpoints: /barry-harris/generate-instructions and /barry-harris/materialize-instructions
 */

// ============================================================================
// Request Types
// ============================================================================

export interface GenerateInstructionsRequest {
  chords: string[];
  guitar_position: string; // "Open" | "C" | "A" | "G" | "E" | "D" | "C8" | "A8" | "G8" | "E8"
}

export interface MaterializeInstructionsRequest {
  instructions: BarryLineInstructionDto[];
}

// ============================================================================
// Response Types
// ============================================================================

export interface InstructionsResponse {
  transitions: ChordTransitionDto[];
  metadata: InstructionMetadata;
}

export interface MaterializedLinesResponse {
  lines: MaterializedLineDto[];
}

// ============================================================================
// Core DTO Types
// ============================================================================

export interface ChordTransitionDto {
  from_chord: string;
  to_chord: string;
  from_scale: ScaleInfoDto;
  to_scale: ScaleInfoDto;
  possible_paths: PathOptionDto[];
}

export interface PathOptionDto {
  path_id: string;
  instruction: BarryLineInstructionDto;
  metadata: PathMetadataDto;
}

export interface BarryLineInstructionDto {
  id: string;
  from_scale: ScaleInfoDto;
  to_scale: ScaleInfoDto;
  patterns: string[];
  guitar_settings: GuitarSettingsDto;
}

export interface ScaleInfoDto {
  root: string;
  pattern: string; // "Major" | "Minor" | "Dominant" | "MinorSixthDiminished"
}

export interface GuitarSettingsDto {
  caged_shape: string;
  tuning: string; // "StandardTuning" | "DropD"
}

export interface PathMetadataDto {
  path_length: number;
  target_degree: string; // "I" | "III" | "V" | "VII"
  pattern: string;
}

export interface InstructionMetadata {
  original_chords: string[];
  total_transitions: number;
  total_paths: number;
}

export interface MaterializedLineDto {
  id: string;
  pitches: string[];
  guitar_line: GuitarLineDetailDto;
}

export interface GuitarLineDetailDto {
  tab: string[];
  position: string;
}

// ============================================================================
// UI Helper Types
// ============================================================================

export interface PathSelection {
  transitionIndex: number;
  pathId: string;
  instruction: BarryLineInstructionDto;
}

export type CAGEDShape = 'C' | 'A' | 'G' | 'E' | 'D';
export type GuitarPosition = 'Open' | 'C' | 'A' | 'G' | 'E' | 'D' | 'C8' | 'A8' | 'G8' | 'E8';
