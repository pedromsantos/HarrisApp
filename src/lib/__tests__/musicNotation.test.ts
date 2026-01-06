import { describe, expect, it } from 'vitest';

import { convertToABC } from '../musicNotation';

describe('convertToABC', () => {
  it('converts empty array to ABC with headers only', () => {
    const result = convertToABC([]);

    expect(result).toContain('X:1');
    expect(result).toContain('M:4/4');
    expect(result).toContain('L:1/8');
    expect(result).toContain('K:C');
  });

  it('converts single note to ABC notation', () => {
    const result = convertToABC(['C4']);

    expect(result).toContain('X:1');
    expect(result).toContain('M:4/4');
    expect(result).toContain('L:1/8');
    expect(result).toContain('K:C');
    expect(result).toContain('C');
  });

  it('converts two notes with space separator', () => {
    const result = convertToABC(['C4', 'D4']);

    expect(result).toContain('cd ');
  });

  it('adds space after every 2 notes', () => {
    const result = convertToABC(['C4', 'D4', 'E4', 'F4']);

    expect(result).toContain('cd ');
    expect(result).toContain('ef ');
  });

  it('adds bar line after every 8 notes', () => {
    const result = convertToABC(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']);

    expect(result).toMatch(/c' \|$/);
  });

  it('handles multiple bars correctly', () => {
    const notes = [
      'C4',
      'D4',
      'E4',
      'F4',
      'G4',
      'A4',
      'B4',
      'C5', // Bar 1
      'D5',
      'E5',
      'F5',
      'G5',
      'A5',
      'B5',
      'C6',
      'D6', // Bar 2
    ];
    const result = convertToABC(notes);

    const bars = result.split('|').filter((bar) => bar.trim());
    expect(bars.length).toBeGreaterThanOrEqual(2);
  });

  it('handles notes that are not multiples of 8', () => {
    const result = convertToABC(['C4', 'D4', 'E4']);

    expect(result).toContain('cd ');
    expect(result).toContain('e');
    expect(result).not.toMatch(/e.*\|/);
  });

  it('handles 7 notes without bar line', () => {
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
    const result = convertToABC(notes);

    expect(result).not.toMatch(/B \|/);
  });

  it('handles exactly 16 notes (2 full bars)', () => {
    const notes = [
      'C4',
      'D4',
      'E4',
      'F4',
      'G4',
      'A4',
      'B4',
      'C5',
      'C5',
      'B4',
      'A4',
      'G4',
      'F4',
      'E4',
      'D4',
      'C4',
    ];
    const result = convertToABC(notes);

    const barCount = (result.match(/\|/g) ?? []).length;
    expect(barCount).toBe(2);
  });

  it('converts different note types correctly', () => {
    const notes = ['C4', 'D#4', 'Eb4', 'F4'];
    const result = convertToABC(notes);

    expect(result).toContain('X:1');
    expect(result).toContain('K:C');
  });

  it('maintains correct spacing for odd number of notes', () => {
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4'];
    const result = convertToABC(notes);

    // Should have 2 spaces (after C-D and E-F pairs)
    const spaceCount = (result.split('\n').pop()?.match(/ /g) ?? []).length;
    expect(spaceCount).toBeGreaterThanOrEqual(2);
  });

  it('formats complete ABC notation structure', () => {
    const notes = ['C4', 'D4', 'E4', 'F4'];
    const result = convertToABC(notes);

    const lines = result.split('\n');
    expect(lines[0]).toBe('X:1');
    expect(lines[1]).toBe('M:4/4');
    expect(lines[2]).toBe('L:1/8');
    expect(lines[3]).toBe('K:C');
    expect(lines[4]).toContain('cd ');
  });

  it('handles notes in different octaves', () => {
    const notes = ['C3', 'C4', 'C5', 'C6'];
    const result = convertToABC(notes);

    expect(result).toContain('K:C');
    // All notes should be converted to ABC notation
    const noteLines = result.split('\n').slice(4).join('');
    expect(noteLines.length).toBeGreaterThan(0);
  });

  it('creates valid ABC notation for melody', () => {
    const melody = ['C4', 'E4', 'G4', 'C5'];
    const result = convertToABC(melody);

    expect(result).toMatch(/X:1\nM:4\/4\nL:1\/8\nK:C\n/);
  });
});
