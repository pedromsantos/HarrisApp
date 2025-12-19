import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IntervalDisplay } from '@/components/counterpoint-components/IntervalDisplay';

describe('IntervalDisplay', () => {
  it('renders empty state when no intervals', () => {
    render(<IntervalDisplay intervals={[]} cantusFirmusLength={0} counterpointLength={0} />);

    expect(
      screen.getByText(/No intervals calculated yet/i)
    ).toBeInTheDocument();
  });

  it('renders intervals when provided', () => {
    const intervals = ['P1', 'M3', 'P5', 'M6'];
    render(<IntervalDisplay intervals={intervals} cantusFirmusLength={4} counterpointLength={4} />);

    intervals.forEach((interval) => {
      expect(screen.getByText(interval)).toBeInTheDocument();
    });
  });

  it('displays correct number of intervals', () => {
    const intervals = ['P1', 'M3', 'P5'];
    render(<IntervalDisplay intervals={intervals} cantusFirmusLength={3} counterpointLength={3} />);

    expect(screen.getByTestId('interval-0')).toBeInTheDocument();
    expect(screen.getByTestId('interval-1')).toBeInTheDocument();
    expect(screen.getByTestId('interval-2')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<IntervalDisplay intervals={[]} cantusFirmusLength={0} counterpointLength={0} />);

    expect(screen.getByText('Harmonic Intervals')).toBeInTheDocument();
    expect(
      screen.getByText(/Intervals between corresponding Cantus Firmus and Counterpoint notes/i)
    ).toBeInTheDocument();
  });

  it('shows hint when fewer intervals than expected', () => {
    const intervals = ['P1', 'M3'];
    render(<IntervalDisplay intervals={intervals} cantusFirmusLength={5} counterpointLength={5} />);

    expect(
      screen.getByText(/Add more notes to both lines to calculate additional intervals/i)
    ).toBeInTheDocument();
  });

  it('does not show hint when all intervals calculated', () => {
    const intervals = ['P1', 'M3', 'P5'];
    render(<IntervalDisplay intervals={intervals} cantusFirmusLength={3} counterpointLength={3} />);

    expect(
      screen.queryByText(/Add more notes to both lines to calculate additional intervals/i)
    ).not.toBeInTheDocument();
  });
});
