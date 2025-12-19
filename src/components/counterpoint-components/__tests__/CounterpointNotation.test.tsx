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
  it('renders empty state when no notes', () => {
    render(<CounterpointNotation cantusFirmus={[]} counterpoint={[]} intervals={[]} />);

    expect(
      screen.getByText(/No notes yet. Start by selecting a mode and adding notes with the piano./i)
    ).toBeInTheDocument();
  });

  it('renders notation container when cantus firmus has notes', () => {
    const cantusFirmus = ['C4', 'D4', 'E4'];
    render(<CounterpointNotation cantusFirmus={cantusFirmus} counterpoint={[]} intervals={[]} />);

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  it('renders notation container when counterpoint has notes', () => {
    const counterpoint = ['E4', 'F4', 'G4'];
    render(<CounterpointNotation cantusFirmus={[]} counterpoint={counterpoint} intervals={[]} />);

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
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  it('renders notation container div with correct styling', () => {
    const cantusFirmus = ['C4', 'D4'];
    render(<CounterpointNotation cantusFirmus={cantusFirmus} counterpoint={[]} intervals={[]} />);

    const container = screen.getByTestId('notation-container');
    expect(container).toHaveClass('p-4', 'bg-background', 'rounded', 'overflow-auto');
  });

  it('attempts to render ABC notation when notes are present', () => {
    const cantusFirmus = ['C4', 'D4', 'E4'];
    const counterpoint = ['E4', 'F4', 'G4'];

    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={counterpoint}
        intervals={[]}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });
});
