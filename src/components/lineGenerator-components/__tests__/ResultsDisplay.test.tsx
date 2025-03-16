import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsDisplay } from '../ResultsDisplay';
import { LineGeneratorResponse } from '../../../types/lineGenerator';

describe('ResultsDisplay', () => {
  const mockNotationRefs = { current: [] };

  it('renders empty state when no result and no error', () => {
    render(<ResultsDisplay result={null} error={null} notationRefs={mockNotationRefs} />);
    expect(screen.getByText(/Select your parameters/)).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    const error = 'Test error message';
    render(<ResultsDisplay result={null} error={error} notationRefs={mockNotationRefs} />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('renders generated lines when result is present', () => {
    const mockResult: LineGeneratorResponse = {
      from_scale: 'major C4',
      to_scale: 'dominant G4',
      lines: [['C4', 'E4', 'G4']],
      tabs: [['e|---', 'B|---', 'G|---']],
    };

    render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);

    expect(screen.getByText('major C4')).toBeInTheDocument();
    expect(screen.getByText('dominant G4')).toBeInTheDocument();
    expect(screen.getByText('C4, E4, G4')).toBeInTheDocument();
    expect(screen.getByText('e|---\nB|---\nG|---')).toBeInTheDocument();
  });

  it('handles invalid tab format gracefully', () => {
    const mockResult: LineGeneratorResponse = {
      from_scale: 'major C4',
      to_scale: 'dominant G4',
      lines: [['C4', 'E4', 'G4']],
      tabs: [['Invalid tab format']],
    };

    render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);
    expect(screen.getByText('Invalid tab format')).toBeInTheDocument();
  });

  it('shows no tab data available message when tabs are missing', () => {
    const mockResult: Omit<LineGeneratorResponse, 'tabs'> & { tabs?: string[][] } = {
      from_scale: 'major C4',
      to_scale: 'dominant G4',
      lines: [['C4', 'E4', 'G4']],
    };

    render(
      <ResultsDisplay
        result={mockResult as LineGeneratorResponse}
        error={null}
        notationRefs={mockNotationRefs}
      />
    );
    expect(screen.getByText('No tab data available')).toBeInTheDocument();
  });
});
