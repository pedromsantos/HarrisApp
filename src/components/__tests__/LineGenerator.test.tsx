import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LineGenerator from '../LineGenerator';
import { PATTERNS } from '../lineGenerator-components/constants';
import { useLineGenerator } from '../../hooks/useLineGenerator';

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

  it('renders all form components', () => {
    render(<LineGenerator />);

    expect(screen.getByText('Line Generation input')).toBeInTheDocument();
    expect(screen.getByText('From Scale')).toBeInTheDocument();
    expect(screen.getByText('To Scale')).toBeInTheDocument();
    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Generate Lines')).toBeInTheDocument();
  });

  it('handles scale selection changes', () => {
    render(<LineGenerator />);

    const selects = screen.getAllByRole('combobox');
    const fromScaleSelect = selects[0];
    const fromNoteSelect = selects[1];

    if (fromScaleSelect && fromNoteSelect) {
      fireEvent.change(fromScaleSelect, { target: { value: 'major' } });
      fireEvent.change(fromNoteSelect, { target: { value: 'D4' } });
    }

    const generateButton = screen.getByText('Generate Lines');
    expect(generateButton).toBeEnabled();
  });

  it('handles pattern selection', () => {
    render(<LineGenerator />);

    if (PATTERNS[0]) {
      const pattern = PATTERNS[0].replace(/_/g, ' ');
      const patternElement = screen.getByText(pattern);
      fireEvent.click(patternElement);

      expect(screen.getByText(pattern)).toBeInTheDocument();
    }
  });

  it('handles form submission', async () => {
    render(<LineGenerator />);

    if (PATTERNS[0]) {
      const pattern = PATTERNS[0].replace(/_/g, ' ');
      const patternElement = screen.getByText(pattern);
      fireEvent.click(patternElement);

      const generateButton = screen.getByText('Generate Lines');
      fireEvent.click(generateButton);

      expect(mockGenerateLines).toHaveBeenCalledWith(
        expect.objectContaining({
          from_scale: 'dominant G3',
          to_scale: 'major C4',
          patterns: expect.arrayContaining([PATTERNS[0]]),
          position: 3,
        })
      );
    }
  });

  it('disables generate button when no patterns are selected', () => {
    render(<LineGenerator />);

    const generateButton = screen.getByText('Generate Lines');
    expect(generateButton).toBeDisabled();
  });

  it('shows loading state during generation', () => {
    (useLineGenerator as any).mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<LineGenerator />);

    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('disables form inputs during loading', () => {
    (useLineGenerator as any).mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<LineGenerator />);

    const selects = screen.getAllByRole('combobox');
    selects.forEach((select) => {
      expect(select).toBeDisabled();
    });
  });

  it('disables generate button when server is unhealthy', () => {
    (useLineGenerator as any).mockReturnValue({
      ...defaultHookReturn,
      isServerHealthy: false,
    });

    render(<LineGenerator />);

    const generateButton = screen.getByText('Generate Lines');
    expect(generateButton).toBeDisabled();
  });
});
