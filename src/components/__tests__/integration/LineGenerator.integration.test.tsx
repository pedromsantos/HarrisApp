import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LineGenerator from '../../LineGenerator';

// Mock ABCJS
vi.mock('abcjs', () => ({
  renderAbc: vi.fn(),
}));

// Mock the API call
const mockGenerateLines = vi.fn();
vi.mock('../../../hooks/useLineGenerator', () => ({
  useLineGenerator: () => ({
    result: null,
    error: null,
    isLoading: false,
    isServerHealthy: true,
    generateLines: mockGenerateLines.mockImplementation(() => ({
      lines: ['test line 1', 'test line 2'],
      tabs: [['e|---'], ['e|---']],
      from_scale: 'dominant G3',
      to_scale: 'dominant G3',
    })),
  }),
}));

describe('LineGenerator Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
  });

  const setup = (
    options: { isLoading?: boolean; error?: string | null } = { isLoading: false, error: null }
  ) => {
    if (options.isLoading === true) {
      mockGenerateLines.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    }

    if (options.error !== null) {
      mockGenerateLines.mockRejectedValueOnce(new Error(options.error));
    }

    const user = userEvent.setup();
    const utils = render(<LineGenerator />);
    return { user, ...utils };
  };

  const openSelect = async (user: ReturnType<typeof userEvent.setup>, button: HTMLElement) => {
    await user.click(button);
    // Wait for listbox to be visible
    await screen.findByRole('listbox');
  };

  const selectOption = async (user: ReturnType<typeof userEvent.setup>, value: string) => {
    // Find option within the listbox
    const listbox = screen.getByRole('listbox');
    const option = within(listbox).getByText(value);
    await user.click(option);
  };

  const getScaleSection = (name: string): HTMLElement => {
    const section = screen.getByTestId(`${name.toLowerCase()}-scale-section`);
    if (section === null) {
      throw new Error(`Could not find section for ${name}`);
    }
    return section;
  };

  const getSelectsFromSection = (section: HTMLElement): [HTMLElement, HTMLElement] => {
    const selects = within(section).getAllByRole('combobox');
    if (selects.length < 2) {
      throw new Error('Could not find both select elements in section');
    }
    return [selects[0], selects[1]] as [HTMLElement, HTMLElement];
  };

  const getPatternText = (element: HTMLElement): string => {
    return element.textContent ?? '';
  };

  const clickElement = async (
    user: ReturnType<typeof userEvent.setup>,
    element: Element | null | undefined
  ) => {
    if (!element) {
      throw new Error('Element not found');
    }
    await user.click(element);
  };

  const getPatternElements = (): HTMLElement[] => {
    const patternsSection = screen.getByTestId('available-patterns-section');
    const patterns = within(patternsSection).getAllByTestId(/pattern-item/);
    if (!patterns.length) {
      throw new Error('No pattern elements found');
    }
    return patterns;
  };

  const getPatternPair = (patterns: HTMLElement[]): [HTMLElement, HTMLElement] => {
    if (patterns.length < 2) {
      throw new Error('Not enough patterns available');
    }
    const first = patterns[0];
    const second = patterns[1];
    if (!first || !second) {
      throw new Error('Could not get pattern pair');
    }
    return [first, second];
  };

  const getSelectedPatternsSection = (): HTMLElement => {
    return screen.getByTestId('selected-patterns-section');
  };

  const getSelectedPatterns = (): HTMLElement[] => {
    const selectedPatternsSection = getSelectedPatternsSection();
    // If there are no patterns selected, the section will contain a message
    const text = selectedPatternsSection.textContent ?? '';
    if (text.includes('No patterns selected')) {
      return [];
    }
    // Otherwise, find all pattern items
    return within(selectedPatternsSection).getAllByTestId(/pattern-item/);
  };

  const selectScales = async (
    user: ReturnType<typeof userEvent.setup>,
    fromScale: { type: string; note: string },
    toScale: { type: string; note: string }
  ) => {
    const fromScaleSection = getScaleSection('from');
    const toScaleSection = getScaleSection('to');

    const [fromNoteSelect, fromScaleTypeSelect] = getSelectsFromSection(fromScaleSection);
    const [toNoteSelect, toScaleTypeSelect] = getSelectsFromSection(toScaleSection);

    // Select from scale
    await openSelect(user, fromScaleTypeSelect);
    await selectOption(user, fromScale.type);

    await openSelect(user, fromNoteSelect);
    await selectOption(user, fromScale.note);

    // Select to scale
    await openSelect(user, toScaleTypeSelect);
    await selectOption(user, toScale.type);

    await openSelect(user, toNoteSelect);
    await selectOption(user, toScale.note);
  };

  it('completes full generation flow successfully', async () => {
    const { user } = setup();

    // Select scales
    await selectScales(user, { type: 'Dominant', note: 'G3' }, { type: 'Dominant', note: 'G3' });

    // Select patterns
    const patterns = getPatternElements();
    await clickElement(user, patterns[0]); // Select first pattern

    // Generate lines
    const generateButton = screen.getByRole('button', { name: /generate lines/i });
    await clickElement(user, generateButton);

    // Verify results
    expect(mockGenerateLines).toHaveBeenCalledWith({
      from_scale: 'dominant G3',
      to_scale: 'dominant G3',
      patterns: expect.any(Array) as unknown as string[],
      position: expect.any(Number) as unknown as number,
    });
  });

  it('handles form validation correctly', async () => {
    const { user } = setup();

    // Try to submit without selecting patterns
    const generateButton = screen.getByRole('button', { name: /generate lines/i });
    expect(generateButton).toBeDisabled();

    // Select a pattern
    const patterns = getPatternElements();
    await clickElement(user, patterns[0]);
    expect(generateButton).toBeEnabled();

    // Verify form validation messages
    expect(screen.queryByText(/please select at least one pattern/i)).not.toBeInTheDocument();
  });

  it('handles pattern reordering', async () => {
    const { user } = setup();

    // Add two patterns
    const patterns = getPatternElements();
    const [firstPattern, secondPattern] = getPatternPair(patterns);

    await clickElement(user, firstPattern);
    await clickElement(user, secondPattern);

    // Verify initial order
    const selectedPatterns = getSelectedPatterns();
    if (selectedPatterns.length < 2) {
      throw new Error('Not enough selected patterns for reordering test');
    }

    const firstPatternText = getPatternText(firstPattern);
    const secondPatternText = getPatternText(secondPattern);

    expect(selectedPatterns[0]).toHaveTextContent(firstPatternText);
    expect(selectedPatterns[1]).toHaveTextContent(secondPatternText);

    // Test reordering - find the up arrow button by its SVG path
    const selectedPattern = selectedPatterns[1];
    if (!selectedPattern) {
      throw new Error('Second pattern not found');
    }

    // Find the button with the up arrow icon
    const buttons = within(selectedPattern).getAllByRole('button');
    const upButton = buttons.find((button) => {
      const svg = button.querySelector('svg');
      return (svg?.innerHTML ?? '').includes('M5 15l7-7 7 7');
    });

    if (!upButton) {
      throw new Error('Up button not found');
    }

    await user.click(upButton);

    const reorderedPatterns = getSelectedPatterns();
    expect(reorderedPatterns[0]).toHaveTextContent(secondPatternText);
    expect(reorderedPatterns[1]).toHaveTextContent(firstPatternText);
  });
});
