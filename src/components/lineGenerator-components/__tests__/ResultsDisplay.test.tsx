/* eslint-disable sonarjs/no-duplicate-string */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResultsDisplay } from '@/components/lineGenerator-components/ResultsDisplay';
import { LineGeneratorResponse } from '@/types/lineGenerator';

describe('ResultsDisplay', () => {
  const mockNotationRefs = { current: [] };

  it('renders empty state when no result and no error', () => {
    render(<ResultsDisplay result={null} error={null} notationRefs={mockNotationRefs} />);
    expect(
      screen.getByText(/Select your parameters and click "Generate Lines"/)
    ).toBeInTheDocument();
  });

  it('renders scale information correctly', () => {
    const mockResult: LineGeneratorResponse = {
      from_scale: 'C major',
      to_scale: 'G dominant',
      lines: [['C4', 'E4', 'G4']],
      tabs: [['e|---']],
    };

    render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);

    const scaleInfo = screen.getByText('C major').parentElement;
    expect(scaleInfo).toHaveClass('grid', 'grid-cols-2', 'gap-2');
    expect(screen.getByText('C major')).toHaveClass('text-primary');
    expect(screen.getByText('G dominant')).toHaveClass('text-primary', 'text-right');
  });

  describe('tab notation rendering', () => {
    it('renders array of tab lines correctly', () => {
      const mockResult: LineGeneratorResponse = {
        from_scale: 'C major',
        to_scale: 'G dominant',
        lines: [['C4', 'E4', 'G4']],
        tabs: [['e|---', 'B|---', 'G|---']],
      };

      render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);

      const tabContent = screen.getByText(/e\|---/);
      expect(tabContent).toBeInTheDocument();
      expect(tabContent.textContent).toBe('e|---\nB|---\nG|---');

      const preElement = tabContent.closest('pre');
      expect(preElement).toHaveClass('whitespace-pre');
    });

    it('renders single string tab correctly', () => {
      const mockResult: LineGeneratorResponse = {
        from_scale: 'C major',
        to_scale: 'G dominant',
        lines: [['C4', 'E4', 'G4']],
        tabs: [['e|---3---5---7---|']],
      };

      render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);

      const tabContent = screen.getByText('e|---3---5---7---|');
      expect(tabContent).toBeInTheDocument();

      const preElement = tabContent.closest('pre');
      expect(preElement).toHaveClass('whitespace-pre');
    });

    it('handles missing tab data gracefully', () => {
      const mockResult: LineGeneratorResponse = {
        from_scale: 'C major',
        to_scale: 'G dominant',
        lines: [['C4', 'E4', 'G4']],
        tabs: [],
      };

      render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);
      expect(screen.getByText('Invalid tab format')).toBeInTheDocument();
    });

    it('handles invalid tab format gracefully', () => {
      const mockResult = {
        from_scale: 'C major',
        to_scale: 'G dominant',
        lines: [['C4', 'E4', 'G4']],
        tabs: [{ invalid: 'format' }],
      } as unknown as LineGeneratorResponse;

      render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);
      expect(screen.getByText('Invalid tab format')).toBeInTheDocument();
    });
  });

  describe('pitch notation rendering', () => {
    it('renders pitch notation correctly', () => {
      const mockResult: LineGeneratorResponse = {
        from_scale: 'C major',
        to_scale: 'G dominant',
        lines: [['C4', 'E4', 'G4']],
        tabs: [['e|---']],
      };

      render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);

      const pitchNotation = screen.getByText('C4, E4, G4');
      expect(pitchNotation).toHaveClass('text-sm', 'font-medium', 'text-foreground');

      const container = pitchNotation.closest('div');
      expect(container).toHaveClass('bg-primary/10');
    });

    it('handles multiple lines correctly', () => {
      const mockResult: LineGeneratorResponse = {
        from_scale: 'C major',
        to_scale: 'G dominant',
        lines: [
          ['C4', 'E4', 'G4'],
          ['G4', 'B4', 'D5'],
        ],
        tabs: [['e|---'], ['e|---']],
      };

      render(<ResultsDisplay result={mockResult} error={null} notationRefs={mockNotationRefs} />);

      expect(screen.getByText('C4, E4, G4')).toBeInTheDocument();
      expect(screen.getByText('G4, B4, D5')).toBeInTheDocument();
    });
  });
});
