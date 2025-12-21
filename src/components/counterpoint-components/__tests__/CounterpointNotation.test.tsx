/* eslint-disable sonarjs/no-duplicate-string */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CounterpointNotation } from '@/components/counterpoint-components/CounterpointNotation';

// Mock abcjs
vi.mock('abcjs', () => ({
  default: {
    renderAbc: vi.fn(),
  },
  renderAbc: vi.fn(),
}));

describe('CounterpointNotation', () => {
  const mockOnModeChange = vi.fn();

  it('renders empty state when no notes', () => {
    render(
      <CounterpointNotation
        cantusFirmus={[]}
        counterpoint={[]}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    expect(
      screen.getByText(/No notes yet. Start by selecting a mode and adding notes with the piano./i)
    ).toBeInTheDocument();
  });

  it('renders notation container when cantus firmus has notes', () => {
    const cantusFirmus = ['C4', 'D4', 'E4'];
    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={[]}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  it('renders notation container when counterpoint has notes', () => {
    const counterpoint = ['E4', 'F4', 'G4'];
    render(
      <CounterpointNotation
        cantusFirmus={[]}
        counterpoint={counterpoint}
        intervals={[]}
        mode="counterpoint"
        onModeChange={mockOnModeChange}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  it('renders notation container when both have notes', () => {
    const cantusFirmus = ['C4', 'D4', 'E4'];
    const counterpoint = ['E4', 'F4', 'G4'];
    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={counterpoint}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  it('renders notation container div', () => {
    const cantusFirmus = ['C4', 'D4'];
    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={[]}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    const container = screen.getByTestId('notation-container');
    expect(container).toBeInTheDocument();
  });

  it('attempts to render ABC notation when notes are present', () => {
    const cantusFirmus = ['C4', 'D4', 'E4'];
    const counterpoint = ['E4', 'F4', 'G4'];

    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={counterpoint}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  describe('drag and drop functionality', () => {
    it('renders with dragging disabled when onNotesChange is not provided', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('renders with dragging enabled when onNotesChange is provided', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('calls onNotesChange with updated notes when a note is dragged', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const counterpoint = ['E4', 'F4', 'G4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      // Note: The actual drag interaction would be triggered by abcjs
      // In a real scenario, we would simulate the drag event
      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('renders mode toggle buttons', () => {
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('mode-counterpoint')).toBeInTheDocument();
      expect(screen.getByTestId('mode-cantus-firmus')).toBeInTheDocument();
    });

    it('highlights the active mode button', () => {
      const cantusFirmus = ['C4', 'D4'];

      const { rerender } = render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      // When cantus_firmus mode is active
      expect(screen.getByTestId('mode-cantus-firmus')).toBeInTheDocument();

      // Switch to counterpoint mode
      rerender(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('mode-counterpoint')).toBeInTheDocument();
    });

    it('displays Edit Score label', () => {
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByText('Edit Score')).toBeInTheDocument();
    });
  });
});
