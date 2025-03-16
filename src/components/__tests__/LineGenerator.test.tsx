import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LineGenerator from '../LineGenerator';
import { PATTERNS } from '../lineGenerator-components/constants';
import { useLineGenerator } from '../../hooks/useLineGenerator';

// Mock scrollIntoView for Radix UI components
Element.prototype.scrollIntoView = vi.fn();

vi.mock('../../hooks/useLineGenerator', () => ({
  useLineGenerator: vi.fn(),
}));

vi.mock('abcjs', () => ({
  default: {
    renderAbc: vi.fn(),
  },
}));

describe('LineGenerator', () => {
  const mockGenerateLines = vi.fn();
  const defaultHookReturn = {
    result: null,
    error: null,
    isLoading: false,
    isServerHealthy: true,
    generateLines: mockGenerateLines,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLineGenerator as any).mockReturnValue(defaultHookReturn);
  });

  const selectFromNote = async (note: string) => {
    const fromScaleSection = screen.getByTestId('from-scale-section');
    const trigger = within(fromScaleSection).getByRole('combobox', { name: 'Select note' });
    await userEvent.click(trigger);
    const listbox = await screen.findByRole('listbox');
    const optionElement = within(listbox).getByRole('option', { name: note });
    await userEvent.click(optionElement);
  };

  const selectFromScaleType = async (scaleType: string) => {
    const fromScaleSection = screen.getByTestId('from-scale-section');
    const trigger = within(fromScaleSection).getByRole('combobox', { name: 'Select scale' });
    await userEvent.click(trigger);
    const listbox = await screen.findByRole('listbox');
    const optionElement = within(listbox).getByRole('option', { name: scaleType });
    await userEvent.click(optionElement);
  };

  const selectToNote = async (note: string) => {
    const toScaleSection = screen.getByTestId('to-scale-section');
    const trigger = within(toScaleSection).getByRole('combobox', { name: 'Select note' });
    await userEvent.click(trigger);
    const listbox = await screen.findByRole('listbox');
    const optionElement = within(listbox).getByRole('option', { name: note });
    await userEvent.click(optionElement);
  };

  const selectToScaleType = async (scaleType: string) => {
    const toScaleSection = screen.getByTestId('to-scale-section');
    const trigger = within(toScaleSection).getByRole('combobox', { name: 'Select scale' });
    await userEvent.click(trigger);
    const listbox = await screen.findByRole('listbox');
    const optionElement = within(listbox).getByRole('option', { name: scaleType });
    await userEvent.click(optionElement);
  };

  const addPattern = async (pattern: string) => {
    const availablePatternsSection = screen.getByTestId('available-patterns-section');
    const patternItem = within(availablePatternsSection).getByTestId(
      `pattern-item-${pattern.toLowerCase().replace(/\s+/g, '_')}`
    );
    await userEvent.click(patternItem);
  };

  it('renders scale selectors and pattern lists', () => {
    render(<LineGenerator />);

    // From Scale section
    const fromScaleSection = screen.getByTestId('from-scale-section');
    expect(
      within(fromScaleSection).getByRole('combobox', { name: 'Select note' })
    ).toBeInTheDocument();
    expect(
      within(fromScaleSection).getByRole('combobox', { name: 'Select scale' })
    ).toBeInTheDocument();

    // To Scale section
    const toScaleSection = screen.getByTestId('to-scale-section');
    expect(
      within(toScaleSection).getByRole('combobox', { name: 'Select note' })
    ).toBeInTheDocument();
    expect(
      within(toScaleSection).getByRole('combobox', { name: 'Select scale' })
    ).toBeInTheDocument();

    // Pattern sections
    expect(screen.getByTestId('available-patterns-section')).toBeInTheDocument();
    expect(screen.getByTestId('selected-patterns-section')).toBeInTheDocument();
  });

  it('enables generate button when scales and pattern are selected', async () => {
    render(<LineGenerator />);

    await selectFromScaleType('Major');
    await selectFromNote('C4');
    await selectToScaleType('Major');
    await selectToNote('G4');
    await addPattern(PATTERNS[0]?.replace(/_/g, ' ') || '');

    const generateButton = screen.getByRole('button', { name: /generate/i });
    expect(generateButton).toBeEnabled();
  });

  it('disables generate button when required fields are not selected', () => {
    render(<LineGenerator />);
    const generateButton = screen.getByRole('button', { name: /generate/i });
    expect(generateButton).toBeDisabled();
  });

  it('calls generateLines with selected options when generate is clicked', async () => {
    render(<LineGenerator />);

    await selectFromScaleType('Major');
    await selectFromNote('C4');
    await selectToScaleType('Major');
    await selectToNote('G4');
    await addPattern(PATTERNS[0]?.replace(/_/g, ' ') || '');

    const generateButton = screen.getByRole('button', { name: /generate/i });
    await userEvent.click(generateButton);

    expect(mockGenerateLines).toHaveBeenCalledWith(
      expect.objectContaining({
        from_scale: 'major C4',
        to_scale: 'major G4',
        patterns: expect.arrayContaining([PATTERNS[0]]),
      })
    );
  });

  it('shows loading state when generating lines', () => {
    (useLineGenerator as any).mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<LineGenerator />);
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });

  it('shows error message when generation fails', () => {
    const errorMessage = 'Failed to generate lines';
    (useLineGenerator as any).mockReturnValue({
      ...defaultHookReturn,
      error: errorMessage,
    });

    render(<LineGenerator />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles scale selection changes', async () => {
    render(<LineGenerator />);
    await selectFromScaleType('Major');
    await selectFromNote('D4');

    const generateButton = screen.getByRole('button', { name: /generate/i });
    expect(generateButton).toBeDisabled(); // Should still be disabled without a pattern
  });

  it('handles pattern selection', async () => {
    render(<LineGenerator />);

    if (PATTERNS[0]) {
      const pattern = PATTERNS[0].replace(/_/g, ' ');
      await addPattern(pattern);
      const selectedPatternsSection = screen.getByTestId('selected-patterns-section');
      expect(
        within(selectedPatternsSection).getByTestId(
          `pattern-item-${pattern.toLowerCase().replace(/\s+/g, '_')}`
        )
      ).toBeInTheDocument();
    }
  });

  it('disables form inputs during loading', () => {
    (useLineGenerator as any).mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<LineGenerator />);

    const fromScaleSection = screen.getByTestId('from-scale-section');
    const toScaleSection = screen.getByTestId('to-scale-section');

    within(fromScaleSection)
      .getAllByRole('combobox')
      .forEach((select) => {
        expect(select).toBeDisabled();
      });
    within(toScaleSection)
      .getAllByRole('combobox')
      .forEach((select) => {
        expect(select).toBeDisabled();
      });
  });

  it('disables generate button when server is unhealthy', () => {
    (useLineGenerator as any).mockReturnValue({
      ...defaultHookReturn,
      isServerHealthy: false,
    });

    render(<LineGenerator />);

    const generateButton = screen.getByRole('button', { name: /generate/i });
    expect(generateButton).toBeDisabled();
  });
});
