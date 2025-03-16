import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PatternSelector } from '../PatternSelector';
import { PATTERNS } from '../constants';
import { Pattern } from '../../../types/lineGenerator';

describe('PatternSelector', () => {
  // Ensure we have at least 4 patterns for our tests
  const selectedPatterns = PATTERNS.slice(0, 2) as [Pattern, Pattern];
  const availablePatterns = PATTERNS.slice(2) as Pattern[];

  const mockProps = {
    selectedPatterns,
    availablePatterns,
    onAddPattern: vi.fn(),
    onRemovePattern: vi.fn(),
    onMovePatternUp: vi.fn(),
    onMovePatternDown: vi.fn(),
  };

  beforeEach(() => {
    expect(selectedPatterns.length).toBeGreaterThanOrEqual(2);
    expect(availablePatterns.length).toBeGreaterThanOrEqual(2);
  });

  it('renders available and selected patterns', () => {
    render(<PatternSelector {...mockProps} />);

    const firstAvailable = availablePatterns[0]?.replace(/_/g, ' ');
    const secondAvailable = availablePatterns[1]?.replace(/_/g, ' ');
    expect(firstAvailable && screen.getByText(firstAvailable)).toBeInTheDocument();
    expect(secondAvailable && screen.getByText(secondAvailable)).toBeInTheDocument();

    const firstSelected = selectedPatterns[0]?.replace(/_/g, ' ');
    const secondSelected = selectedPatterns[1]?.replace(/_/g, ' ');
    expect(firstSelected && screen.getByText(firstSelected)).toBeInTheDocument();
    expect(secondSelected && screen.getByText(secondSelected)).toBeInTheDocument();
  });

  it('calls onAddPattern when clicking an available pattern', () => {
    render(<PatternSelector {...mockProps} />);
    const firstAvailable = availablePatterns[0]?.replace(/_/g, ' ');
    if (!firstAvailable) throw new Error('First available pattern is undefined');

    const pattern = screen.getByText(firstAvailable);
    fireEvent.click(pattern);
    expect(mockProps.onAddPattern).toHaveBeenCalledWith(availablePatterns[0]);
  });

  it('calls onRemovePattern when clicking remove button', () => {
    render(<PatternSelector {...mockProps} />);
    const removeButtons = screen
      .getAllByRole('button')
      .filter((button) => button.innerHTML.includes('M6 6l12 12'));
    expect(removeButtons.length).toBeGreaterThan(0);
    const removeButton = removeButtons[0] as HTMLElement;
    fireEvent.click(removeButton);
    expect(mockProps.onRemovePattern).toHaveBeenCalledWith(selectedPatterns[0]);
  });

  it('calls onMovePatternUp when clicking up arrow', () => {
    render(<PatternSelector {...mockProps} />);
    const upButtons = screen
      .getAllByRole('button')
      .filter((button) => button.innerHTML.includes('M5 15l7-7 7 7'));
    expect(upButtons.length).toBeGreaterThan(1);
    const upButton = upButtons[1] as HTMLElement;
    fireEvent.click(upButton); // Click second pattern's up button
    expect(mockProps.onMovePatternUp).toHaveBeenCalledWith(1);
  });

  it('calls onMovePatternDown when clicking down arrow', () => {
    render(<PatternSelector {...mockProps} />);
    const downButtons = screen
      .getAllByRole('button')
      .filter((button) => button.innerHTML.includes('M19 9l-7 7-7-7'));
    expect(downButtons.length).toBeGreaterThan(0);
    const downButton = downButtons[0] as HTMLElement;
    fireEvent.click(downButton); // Click first pattern's down button
    expect(mockProps.onMovePatternDown).toHaveBeenCalledWith(0);
  });

  it('disables up button for first pattern and down button for last pattern', () => {
    render(<PatternSelector {...mockProps} />);

    const buttons = screen.getAllByRole('button');
    const firstUpButton = buttons.find(
      (button) =>
        button.innerHTML.includes('M5 15l7-7 7 7') && button.className.includes('opacity-30')
    );
    const lastDownButton = buttons.find(
      (button) =>
        button.innerHTML.includes('M19 9l-7 7-7-7') && button.className.includes('opacity-30')
    );

    expect(firstUpButton).toBeDefined();
    expect(lastDownButton).toBeDefined();
  });

  it('shows empty state when no patterns are selected', () => {
    render(<PatternSelector {...mockProps} selectedPatterns={[]} />);
    expect(screen.getByText('No patterns selected')).toBeInTheDocument();
  });
});
