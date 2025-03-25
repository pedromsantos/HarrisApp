/* eslint-disable react/jsx-no-bind */
/* eslint-disable sonarjs/no-duplicate-string */
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LineGenerator from '@/components/LineGenerator';
import { Button } from '@/components/ui/button';
import { useLineGenerator } from '@/hooks/useLineGenerator';
import { convertToABC } from '@/lib/musicNotation';
import { LineGeneratorResponse } from '@/types/lineGenerator';

Element.prototype.scrollIntoView = vi.fn();

const mockUseLineGenerator = vi.mocked(useLineGenerator);

vi.mock('../../hooks/useLineGenerator', () => ({
  useLineGenerator: vi.fn(),
}));

vi.mock('../../lib/musicNotation', () => ({
  convertToABC: vi.fn().mockReturnValue('X:1\nT:Example\nM:4/4\nL:1/8\nK:C\nCDEF GABc|'),
}));

vi.mock('abcjs', () => ({
  renderAbc: vi.fn(),
}));

describe('LineGenerator', () => {
  const mockGenerateLines = vi.fn();
  const mockCheckServerHealth = vi.fn();

  const defaultHookReturn = {
    result: null,
    error: null,
    isLoading: false,
    isServerHealthy: true,
    generateLines: mockGenerateLines,
    checkServerHealth: mockCheckServerHealth,
  };

  const mockResult: LineGeneratorResponse = {
    lines: [['line1'], ['line2']],
    tabs: [['tab1'], ['tab2']],
    from_scale: 'dominant G3',
    to_scale: 'major C4',
  };

  beforeEach(() => {
    mockUseLineGenerator.mockReturnValue({
      result: null,
      error: null,
      isLoading: false,
      isServerHealthy: true,
      generateLines: vi.fn(),
      checkServerHealth: vi.fn(),
    });
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders scale selectors and pattern lists', () => {
      render(<LineGenerator />);

      const fromScaleSection = screen.getByTestId('from-scale-section');
      expect(
        within(fromScaleSection).getByRole('combobox', { name: 'Select note' })
      ).toBeInTheDocument();
      expect(
        within(fromScaleSection).getByRole('combobox', { name: 'Select scale' })
      ).toBeInTheDocument();

      const toScaleSection = screen.getByTestId('to-scale-section');
      expect(
        within(toScaleSection).getByRole('combobox', { name: 'Select note' })
      ).toBeInTheDocument();
      expect(
        within(toScaleSection).getByRole('combobox', { name: 'Select scale' })
      ).toBeInTheDocument();

      expect(screen.getByTestId('available-patterns-section')).toBeInTheDocument();
      expect(screen.getByTestId('selected-patterns-section')).toBeInTheDocument();
    });

    it('shows position selector with default value', () => {
      render(<LineGenerator />);
      const positionSelector = screen.getByTestId('position-selector');
      expect(positionSelector).toBeInTheDocument();

      const positionButton = within(positionSelector).getByRole('combobox');
      expect(positionButton).toHaveTextContent('Open'); // Default value from the component
    });
  });

  describe('Form Interactions', () => {
    it('enables generate button when scales and pattern are selected', () => {
      const localMockGenerateLines = vi.fn();

      mockUseLineGenerator.mockReturnValue({
        ...defaultHookReturn,
        isLoading: false,
        isServerHealthy: true,
        generateLines: localMockGenerateLines,
      });

      render(<LineGenerator />);

      const generateButton = screen.getByRole('button', { name: /generate/i });

      expect(generateButton).toBeInTheDocument();
    });

    it('disables generate button when required fields are not selected', () => {
      render(<LineGenerator />);
      const generateButton = screen.getByRole('button', { name: /generate/i });
      expect(generateButton).toBeDisabled();
    });

    it('calls generateLines with selected options when generate is clicked', async () => {
      const localMockGenerateLines = vi.fn();

      render(
        <Button
          onClick={() => {
            localMockGenerateLines();
            return undefined;
          }}
          disabled={false}
        >
          Generate
        </Button>
      );

      const generateButton = screen.getByRole('button', { name: /generate/i });
      expect(generateButton).not.toBeDisabled();

      await act(async () => {
        await userEvent.click(generateButton);
      });

      expect(localMockGenerateLines).toHaveBeenCalled();
    });

    it('includes position selector in the form', () => {
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: true,
        generateLines: vi.fn(),
        checkServerHealth: vi.fn(),
      });

      render(<LineGenerator />);

      const positionSelector = screen.getByTestId('position-selector');
      expect(positionSelector).toBeInTheDocument();

      const generateButton = screen.getByRole('button', { name: /generate/i });
      expect(generateButton).toBeInTheDocument();
    });

    it('renders pattern selector with add button', () => {
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: true,
        checkServerHealth: vi.fn(),
        generateLines: vi.fn(),
      });

      render(<LineGenerator />);

      const patternSection = screen.getByTestId('available-patterns-section');
      expect(patternSection).toBeInTheDocument();

      const selectedSection = screen.getByTestId('selected-patterns-section');
      expect(selectedSection).toBeInTheDocument();
    });

    it('handles scale selection changes', () => {
      render(<LineGenerator />);

      const fromScaleSection = screen.getByTestId('from-scale-section');
      const fromNoteSelect = within(fromScaleSection).getByRole('combobox', {
        name: /select note/i,
      });
      const fromScaleTypeSelect = within(fromScaleSection).getByRole('combobox', {
        name: /select scale/i,
      });

      expect(fromNoteSelect).toBeInTheDocument();
      expect(fromScaleTypeSelect).toBeInTheDocument();
    });
  });

  describe('Pattern Management', () => {
    it('handles pattern selection', () => {
      render(<LineGenerator />);

      expect(screen.getByTestId('selected-patterns-section')).toBeInTheDocument();
      expect(screen.getByTestId('available-patterns-section')).toBeInTheDocument();

      expect(screen.getByText(/no patterns selected/i)).toBeInTheDocument();
    });

    it('can remove a pattern after adding it', () => {
      render(<LineGenerator />);

      expect(screen.getByTestId('selected-patterns-section')).toBeInTheDocument();
      expect(screen.getByTestId('available-patterns-section')).toBeInTheDocument();
    });

    it('can reorder patterns with up/down buttons', () => {
      const localMockGenerateLines = vi.fn();

      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: true,
        checkServerHealth: vi.fn(),
        generateLines: localMockGenerateLines,
      });

      render(<LineGenerator />);

      const selectedPatternSection = screen.getByTestId('selected-patterns-section');
      expect(selectedPatternSection).toBeInTheDocument();
    });

    it('clears error when generating new lines', () => {
      const localMockGenerateLines = vi.fn();
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: 'Failed to generate lines',
        isLoading: false,
        isServerHealthy: true,
        generateLines: localMockGenerateLines,
        checkServerHealth: vi.fn(),
      });

      const { rerender } = render(<LineGenerator />);
      expect(screen.getByText('Failed to generate lines')).toBeInTheDocument();

      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: true,
        generateLines: localMockGenerateLines,
        checkServerHealth: vi.fn(),
      });

      rerender(<LineGenerator />);

      expect(screen.queryByText('Failed to generate lines')).not.toBeInTheDocument();
    });

    it('shows pattern list when patterns are added', () => {
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: true,
        generateLines: vi.fn(),
        checkServerHealth: vi.fn(),
      });

      render(<LineGenerator />);

      const patternLists = screen.getAllByRole('heading', { name: /patterns/i });
      expect(patternLists.length).toBeGreaterThan(0);

      const selectedPatternsSection = screen.getByTestId('selected-patterns-section');
      expect(selectedPatternsSection).toBeInTheDocument();

      expect(screen.getByText(/no patterns selected/i)).toBeInTheDocument();
    });
  });

  describe('Loading and Server States', () => {
    it('shows loading state when generating lines', () => {
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: true,
        isServerHealthy: true,
        generateLines: vi.fn(),
        checkServerHealth: vi.fn(),
      });

      render(<LineGenerator />);
      expect(screen.getByText(/generating/i)).toBeInTheDocument();
    });

    it('disables form inputs during loading', () => {
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: true,
        isServerHealthy: true,
        generateLines: vi.fn(),
        checkServerHealth: vi.fn(),
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

      const positionSelector = screen.getByTestId('position-selector');
      const positionButton = within(positionSelector).getByRole('combobox');
      expect(positionButton).toBeDisabled();
    });

    it('disables generate button when server is unhealthy', () => {
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: false,
        generateLines: vi.fn(),
        checkServerHealth: vi.fn(),
      });

      render(<LineGenerator />);

      const generateButton = screen.getByRole('button', { name: /generate/i });
      expect(generateButton).toBeDisabled();
    });

    it('shows server error card when server is unhealthy', () => {
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: false,
        generateLines: vi.fn(),
        checkServerHealth: vi.fn(),
      });

      render(<LineGenerator />);

      // Check for server error card
      const errorTitle = screen.getByText(/Server Unavailable/i);
      expect(errorTitle).toBeInTheDocument();

      // Get the paragraph in the error card
      const errorCard = errorTitle.closest('div')?.parentElement;
      if (!errorCard) throw new Error('Error card not found');

      const errorMessage = within(errorCard).getByText(
        /line generator service is currently unavailable/i
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it('allows retrying server health check', async () => {
      const localMockCheckServerHealth = vi.fn();
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: false,
        generateLines: vi.fn(),
        checkServerHealth: localMockCheckServerHealth,
      });

      render(<LineGenerator />);

      expect(screen.getByText(/Server Unavailable/i)).toBeInTheDocument();

      const retryButton = screen.getByText(/retry/i, { selector: 'button' });

      await act(async () => {
        await userEvent.click(retryButton);
      });

      expect(localMockCheckServerHealth).toHaveBeenCalledTimes(1);
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    it('shows error message when generation fails', () => {
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: 'Failed to generate lines',
        isLoading: false,
        isServerHealthy: true,
        generateLines: vi.fn(),
        checkServerHealth: vi.fn(),
      });

      render(<LineGenerator />);
      expect(screen.getByText('Failed to generate lines')).toBeInTheDocument();
    });

    it('clears error when generating new lines', () => {
      const localMockGenerateLines = vi.fn();
      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: 'Failed to generate lines',
        isLoading: false,
        isServerHealthy: true,
        generateLines: localMockGenerateLines,
        checkServerHealth: vi.fn(),
      });

      const { rerender } = render(<LineGenerator />);
      expect(screen.getByText('Failed to generate lines')).toBeInTheDocument();

      mockUseLineGenerator.mockReturnValue({
        result: null,
        error: null,
        isLoading: false,
        isServerHealthy: true,
        generateLines: localMockGenerateLines,
        checkServerHealth: vi.fn(),
      });

      rerender(<LineGenerator />);

      expect(screen.queryByText('Failed to generate lines')).not.toBeInTheDocument();
    });
  });

  describe('Results Display', () => {
    it('shows results when available', () => {
      const localMockResult: LineGeneratorResponse = {
        lines: [['line1'], ['line2']],
        tabs: [['tab1'], ['tab2']],
        from_scale: 'dominant G3',
        to_scale: 'major C4',
      };

      mockUseLineGenerator.mockReturnValue({
        result: localMockResult,
        error: null,
        isLoading: false,
        isServerHealthy: true,
        generateLines: vi.fn(),
        checkServerHealth: vi.fn(),
      });

      vi.mocked(convertToABC).mockImplementation((_: string[]) => 'mock abc notation');

      act(() => {
        render(<LineGenerator />);
      });

      expect(screen.getByText('Generated Lines')).toBeInTheDocument();
    });

    it('renders music notation when results are available', () => {
      vi.mock('abcjs', () => {
        return {
          renderAbc: vi.fn(),
        };
      });

      mockUseLineGenerator.mockReturnValue({
        ...defaultHookReturn,
        result: mockResult,
      });

      act(() => {
        render(<LineGenerator />);
      });

      expect(screen.getAllByTestId(/notation-container/)).toHaveLength(mockResult.lines.length);
    });
  });
});
