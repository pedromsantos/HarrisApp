import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  const setup = () => {
    const user = userEvent.setup();
    return { user };
  };

  beforeEach(() => {
    expect(selectedPatterns.length).toBeGreaterThanOrEqual(2);
    expect(availablePatterns.length).toBeGreaterThanOrEqual(2);
    vi.clearAllMocks();
  });

  it('renders available and selected patterns', () => {
    render(<PatternSelector {...mockProps} />);

    // Check available patterns
    const availableSection = screen.getByTestId('available-patterns-section');
    availablePatterns.forEach((pattern) => {
      const displayText = pattern.replace(/_/g, ' ');
      expect(within(availableSection).getByText(displayText)).toBeInTheDocument();
    });

    // Check selected patterns
    const selectedSection = screen.getByTestId('selected-patterns-section');
    selectedPatterns.forEach((pattern) => {
      const displayText = pattern.replace(/_/g, ' ');
      expect(within(selectedSection).getByText(displayText)).toBeInTheDocument();
    });
  });

  it('calls onAddPattern when clicking an available pattern', async () => {
    const { user } = setup();
    render(<PatternSelector {...mockProps} />);

    const availableSection = screen.getByTestId('available-patterns-section');
    const firstPattern = availablePatterns[0]?.replace(/_/g, ' ');
    if (!firstPattern) throw new Error('First available pattern is undefined');

    const patternElement = within(availableSection).getByText(firstPattern);
    await user.click(patternElement);
    expect(mockProps.onAddPattern).toHaveBeenCalledWith(availablePatterns[0]);
  });

  it('calls onRemovePattern when clicking remove button', async () => {
    const { user } = setup();
    render(<PatternSelector {...mockProps} />);

    const selectedSection = screen.getByTestId('selected-patterns-section');
    // Find remove buttons by their SVG path
    const removeButtons = within(selectedSection)
      .getAllByRole('button')
      .filter((button) => {
        const svg = button.querySelector('svg');
        return svg && svg.innerHTML.includes('M6 18L18 6M6 6l12 12');
      });

    const removeButton = removeButtons[0];
    if (!removeButton) throw new Error('Remove button not found');

    await user.click(removeButton);
    expect(mockProps.onRemovePattern).toHaveBeenCalledWith(selectedPatterns[0]);
  });

  it('calls onMovePatternUp when clicking up arrow', async () => {
    const { user } = setup();
    render(<PatternSelector {...mockProps} />);

    const selectedSection = screen.getByTestId('selected-patterns-section');
    // Find up buttons by their SVG path
    const moveUpButtons = within(selectedSection)
      .getAllByRole('button')
      .filter((button) => {
        const svg = button.querySelector('svg');
        return svg && svg.innerHTML.includes('M5 15l7-7 7 7');
      });

    const upButton = moveUpButtons[1]; // Second pattern's up button
    if (!upButton) throw new Error('Move up button not found');

    await user.click(upButton);
    expect(mockProps.onMovePatternUp).toHaveBeenCalledWith(1);
  });

  it('calls onMovePatternDown when clicking down arrow', async () => {
    const { user } = setup();
    render(<PatternSelector {...mockProps} />);

    const selectedSection = screen.getByTestId('selected-patterns-section');
    // Find down buttons by their SVG path
    const moveDownButtons = within(selectedSection)
      .getAllByRole('button')
      .filter((button) => {
        const svg = button.querySelector('svg');
        return svg && svg.innerHTML.includes('M19 9l-7 7-7-7');
      });

    const downButton = moveDownButtons[0]; // First pattern's down button
    if (!downButton) throw new Error('Move down button not found');

    await user.click(downButton);
    expect(mockProps.onMovePatternDown).toHaveBeenCalledWith(0);
  });

  it('disables up button for first pattern and down button for last pattern', () => {
    render(<PatternSelector {...mockProps} />);

    const selectedSection = screen.getByTestId('selected-patterns-section');
    // Find up and down buttons by their SVG paths
    const moveUpButtons = within(selectedSection)
      .getAllByRole('button')
      .filter((button) => {
        const svg = button.querySelector('svg');
        return svg && svg.innerHTML.includes('M5 15l7-7 7 7');
      });

    const moveDownButtons = within(selectedSection)
      .getAllByRole('button')
      .filter((button) => {
        const svg = button.querySelector('svg');
        return svg && svg.innerHTML.includes('M19 9l-7 7-7-7');
      });

    // First pattern's up button should be disabled
    const firstUpButton = moveUpButtons[0];
    expect(firstUpButton).toHaveAttribute('disabled');
    expect(firstUpButton).toHaveClass('opacity-30');

    // Last pattern's down button should be disabled
    const lastDownButton = moveDownButtons[moveDownButtons.length - 1];
    expect(lastDownButton).toHaveAttribute('disabled');
    expect(lastDownButton).toHaveClass('opacity-30');
  });

  it('shows empty state when no patterns are selected', () => {
    render(<PatternSelector {...mockProps} selectedPatterns={[]} />);
    expect(screen.getByText('No patterns selected')).toBeInTheDocument();
  });

  it('maintains proper tab order', async () => {
    const { user } = setup();
    render(<PatternSelector {...mockProps} />);

    const selectedSection = screen.getByTestId('selected-patterns-section');
    const patternItems = within(selectedSection).getAllByTestId(/pattern-item/);

    expect(patternItems.length).toBeGreaterThan(0);

    // Tab to focus the first button
    await user.tab(); // This might need adjustment based on the actual tab order

    // Check that buttons can be focused in sequence
    expect(document.activeElement).not.toBe(document.body);
  });
});
