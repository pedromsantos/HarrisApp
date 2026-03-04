import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { LineDisplay } from './LineDisplay';
import type { MaterializedLineDto } from '../../types/barryHarrisInstructions';

// Mock abcjs with DOM manipulation
vi.mock('abcjs', () => ({
  renderAbc: vi.fn((element: HTMLElement) => {
    // Simulate abcjs rendering by adding a child element
    const svgElement = document.createElement('svg');
    svgElement.setAttribute('data-testid', 'abc-svg');
    element.appendChild(svgElement);
    return {};
  }),
}));

describe('LineDisplay', () => {
  const mockLine: MaterializedLineDto = {
    id: 'line-1',
    pitches: ['C4', 'D4', 'E4', 'F4', 'G4'],
    guitar_line: {
      tab: ['3', '0', '2', '3', '0'],
      position: 'C',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders ABC notation container', () => {
    render(<LineDisplay line={mockLine} />);

    // Should have a container for ABC rendering
    const container = screen.getByTestId('abc-notation-container');
    expect(container).toBeInTheDocument();
  });

  it('renders ABC notation within 1 second', async () => {
    const startTime = Date.now();
    render(<LineDisplay line={mockLine} />);

    await waitFor(
      () => {
        const container = screen.getByTestId('abc-notation-container');
        expect(container.children.length).toBeGreaterThan(0);
      },
      { timeout: 1000 }
    );

    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(1000);
  });

  it('displays tablature below notation', () => {
    render(<LineDisplay line={mockLine} />);

    // Should have tablature section
    const tabSection = screen.getByTestId('tablature-section');
    expect(tabSection).toBeInTheDocument();

    // Should display unique tab values in fret badges
    // Check for "2" which appears only once in the tab array
    const fretBadges = screen.getAllByText('2');
    expect(fretBadges.length).toBeGreaterThanOrEqual(1);

    // Verify tablature section contains fret values
    expect(tabSection.textContent).toContain('3');
    expect(tabSection.textContent).toContain('0');
    expect(tabSection.textContent).toContain('2');
  });

  it('displays guitar position label', () => {
    render(<LineDisplay line={mockLine} />);

    expect(screen.getByText(/position:/i)).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('applies responsive width classes', () => {
    const { container } = render(<LineDisplay line={mockLine} />);

    const outerContainer = container.firstChild as HTMLElement;
    expect(outerContainer.className).toMatch(/w-full/);
  });

  it('re-renders when line changes', async () => {
    const { rerender } = render(<LineDisplay line={mockLine} />);

    const newLine: MaterializedLineDto = {
      id: 'line-2',
      pitches: ['A4', 'B4', 'C5'],
      guitar_line: {
        tab: ['5', '7', '8'],
        position: 'G',
      },
    };

    rerender(<LineDisplay line={newLine} />);

    await waitFor(() => {
      expect(screen.getByText('G')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });
  });

  it('handles empty tablature gracefully', () => {
    const lineWithoutTab: MaterializedLineDto = {
      id: 'line-3',
      pitches: ['C4', 'D4'],
      guitar_line: {
        tab: [],
        position: 'E',
      },
    };

    render(<LineDisplay line={lineWithoutTab} />);

    // Should still render position
    expect(screen.getByText('E')).toBeInTheDocument();
    // Tab section should be empty but present
    const tabSection = screen.getByTestId('tablature-section');
    expect(tabSection).toBeInTheDocument();
  });

  it('applies proper spacing between sections', () => {
    const { container } = render(<LineDisplay line={mockLine} />);

    const outerContainer = container.firstChild as HTMLElement;
    expect(outerContainer.className).toMatch(/space-y-|gap-/);
  });
});
