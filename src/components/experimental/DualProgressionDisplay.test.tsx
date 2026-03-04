import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DualProgressionDisplay } from './DualProgressionDisplay';

describe('DualProgressionDisplay', () => {
  const mockOriginalChords = ['Cm7', 'F7', 'BbMaj7', 'EbMaj7'];
  const mockImprovisationChords = ['Cm7', 'F7', 'BbMaj7'];
  const mockExplanation = 'The Barry Harris approach simplifies the progression by removing the EbMaj7.';

  it.each([['Original Progression'], ['Improvisation Progression']])('displays %s label', (labelText) => {
    render(
      <DualProgressionDisplay
        originalChords={mockOriginalChords}
        improvisationChords={mockImprovisationChords}
        explanation={mockExplanation}
      />
    );

    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  it.each([
    ['original', mockOriginalChords],
    ['improvisation', mockImprovisationChords],
  ] as const)('displays all %s chords as separate elements', (progressionType, chords) => {
    render(
      <DualProgressionDisplay
        originalChords={mockOriginalChords}
        improvisationChords={mockImprovisationChords}
        explanation={mockExplanation}
      />
    );

    chords.forEach((chord) => {
      const chordElements = screen.getAllByText(chord);
      expect(chordElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays explanation text', () => {
    render(
      <DualProgressionDisplay
        originalChords={mockOriginalChords}
        improvisationChords={mockImprovisationChords}
        explanation={mockExplanation}
      />
    );

    expect(screen.getByText(mockExplanation)).toBeInTheDocument();
  });

  it('applies responsive container classes for desktop and mobile layout', () => {
    const { container } = render(
      <DualProgressionDisplay
        originalChords={mockOriginalChords}
        improvisationChords={mockImprovisationChords}
        explanation={mockExplanation}
      />
    );

    // Progressions container should have responsive flex classes
    const outerContainer = container.firstChild as HTMLElement;
    const progressionsContainer = outerContainer.firstChild as HTMLElement;
    expect(progressionsContainer).toHaveClass('flex');
    // Should stack on mobile (flex-col) and go side-by-side on desktop (md:flex-row)
    expect(progressionsContainer.className).toMatch(/flex-col/);
    expect(progressionsContainer.className).toMatch(/md:flex-row/);
  });

  it('displays chords with badge styling', () => {
    render(
      <DualProgressionDisplay
        originalChords={mockOriginalChords}
        improvisationChords={mockImprovisationChords}
        explanation={mockExplanation}
      />
    );

    // Find first chord and check it has badge-like classes (rounded, padding, background)
    const firstChord = screen.getAllByText('Cm7')[0];
    expect(firstChord).toBeDefined();
    if (firstChord) {
      expect(firstChord).toHaveClass('rounded');
      expect(firstChord.className).toMatch(/px-/); // Padding horizontal
      expect(firstChord.className).toMatch(/py-/); // Padding vertical
      expect(firstChord.className).toMatch(/bg-/); // Background color
    }
  });

  it('positions explanation below progressions', () => {
    const { container } = render(
      <DualProgressionDisplay
        originalChords={mockOriginalChords}
        improvisationChords={mockImprovisationChords}
        explanation={mockExplanation}
      />
    );

    // Get all text content to verify order
    const text = container.textContent || '';
    const originalIndex = text.indexOf('Original Progression');
    const improvisationIndex = text.indexOf('Improvisation Progression');
    const explanationIndex = text.indexOf(mockExplanation);

    // Explanation should come after both progression labels
    expect(explanationIndex).toBeGreaterThan(originalIndex);
    expect(explanationIndex).toBeGreaterThan(improvisationIndex);
  });

  it('handles empty chord arrays gracefully', () => {
    render(<DualProgressionDisplay originalChords={[]} improvisationChords={[]} explanation={mockExplanation} />);

    // Should still render labels and explanation without crashing
    expect(screen.getByText('Original Progression')).toBeInTheDocument();
    expect(screen.getByText('Improvisation Progression')).toBeInTheDocument();
    expect(screen.getByText(mockExplanation)).toBeInTheDocument();
  });

  it('applies proper spacing between chord badges', () => {
    render(
      <DualProgressionDisplay
        originalChords={mockOriginalChords}
        improvisationChords={mockImprovisationChords}
        explanation={mockExplanation}
      />
    );

    // Find chord container - should have gap or space classes
    const chordContainers = screen.getAllByText('Cm7').map((el) => el.parentElement);
    const firstContainer = chordContainers[0];

    expect(firstContainer?.className).toMatch(/gap-|space-/);
  });
});
