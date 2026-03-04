import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type {
  BarryLineInstructionDto,
  InstructionsResponse,
  MaterializedLinesResponse,
} from '@/types/barryHarrisInstructions';
import type { JazzStandard } from '@/types/jazzStandards';

import { StandardDetailPage } from './StandardDetailPage';

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock('@/hooks/useStandardDetail');
vi.mock('@/hooks/useBarryHarrisInstructions');

// Mock abcjs to prevent rendering errors in tests
vi.mock('abcjs', () => ({
  renderAbc: vi.fn((element: HTMLElement) => {
    const svgElement = document.createElement('svg');
    svgElement.setAttribute('data-testid', 'abc-svg');
    element.appendChild(svgElement);
    return {};
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

const { useStandardDetail } = await import('@/hooks/useStandardDetail');
const { useBarryHarrisInstructions } = await import('@/hooks/useBarryHarrisInstructions');

const mockStandard: JazzStandard = {
  id: 'autumn-leaves',
  name: 'Autumn Leaves',
  composer: 'Joseph Kosma',
  key: 'Gm',
  chords_original: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7'],
  chords_improvisation: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7'],
  form: 'AABA',
  tempo: 'Medium',
  difficulty: 'beginner',
  description: 'A classic jazz standard',
};

const mockInstruction: BarryLineInstructionDto = {
  id: 'instruction-1',
  from_scale: { root: 'C', pattern: 'Minor' },
  to_scale: { root: 'F', pattern: 'Dominant' },
  patterns: ['HalfStepUp', 'ChordDown'],
  guitar_settings: { caged_shape: 'E', tuning: 'StandardTuning' },
};

const mockInstructionsResponse: InstructionsResponse = {
  transitions: [
    {
      from_chord: 'Cm7',
      to_chord: 'F7',
      from_scale: { root: 'C', pattern: 'Minor' },
      to_scale: { root: 'F', pattern: 'Dominant' },
      possible_paths: [
        {
          path_id: 'path-1',
          instruction: mockInstruction,
          metadata: { path_length: 8, target_degree: 'I', pattern: 'HalfStepUp' },
        },
      ],
    },
  ],
  metadata: { original_chords: ['Cm7', 'F7'], total_transitions: 1, total_paths: 1 },
};

const mockMaterializedResponse: MaterializedLinesResponse = {
  lines: [
    {
      id: 'line-1',
      pitches: ['C4', 'D4', 'E4', 'F4'],
      guitar_line: { tab: ['3', '5', '7', '8'], position: 'E' },
    },
  ],
};

describe('StandardDetailPage', () => {
  it('loads and displays standard by ID from URL parameter', async () => {
    mockUseParams.mockReturnValue({ id: 'autumn-leaves' });

    vi.mocked(useStandardDetail).mockReturnValue({
      standard: mockStandard,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: null,
      materializedLines: null,
      error: null,
      isLoading: false,
      generateInstructions: vi.fn(),
      materializeInstructions: vi.fn(),
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    render(<StandardDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Autumn Leaves')).toBeInTheDocument();
    });
  });

  it('displays dual progressions immediately after standard loads', async () => {
    mockUseParams.mockReturnValue({ id: 'autumn-leaves' });

    vi.mocked(useStandardDetail).mockReturnValue({
      standard: mockStandard,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: null,
      materializedLines: null,
      error: null,
      isLoading: false,
      generateInstructions: vi.fn(),
      materializeInstructions: vi.fn(),
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    render(<StandardDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/original progression/i)).toBeInTheDocument();
      expect(screen.getByText(/improvisation progression/i)).toBeInTheDocument();
    });
  });

  it('triggers API call with default E shape when Generate Lines button is clicked', async () => {
    const user = userEvent.setup();
    mockUseParams.mockReturnValue({ id: 'autumn-leaves' });

    const mockGenerateInstructions = vi.fn().mockResolvedValue(mockInstructionsResponse);
    const mockMaterializeInstructions = vi.fn().mockResolvedValue(mockMaterializedResponse);

    vi.mocked(useStandardDetail).mockReturnValue({
      standard: mockStandard,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: null,
      materializedLines: null,
      error: null,
      isLoading: false,
      generateInstructions: mockGenerateInstructions,
      materializeInstructions: mockMaterializeInstructions,
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    render(<StandardDetailPage />);

    const generateButton = screen.getByRole('button', { name: /generate lines/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockGenerateInstructions).toHaveBeenCalledWith({
        chords: mockStandard.chords_improvisation,
        guitar_position: 'E',
      });
    });
  });

  it('hides shape selector before generation and shows it after', async () => {
    const user = userEvent.setup();
    mockUseParams.mockReturnValue({ id: 'autumn-leaves' });

    const mockGenerateInstructions = vi.fn().mockResolvedValue(mockInstructionsResponse);
    const mockMaterializeInstructions = vi.fn().mockResolvedValue(mockMaterializedResponse);

    vi.mocked(useStandardDetail).mockReturnValue({
      standard: mockStandard,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    // Hook starts with no lines
    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: null,
      materializedLines: null,
      error: null,
      isLoading: false,
      generateInstructions: mockGenerateInstructions,
      materializeInstructions: mockMaterializeInstructions,
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    render(<StandardDetailPage />);

    // Shape selector should not be visible initially
    expect(screen.queryByRole('group', { name: /caged shape selector/i })).not.toBeInTheDocument();

    // Update hook to return materialized lines
    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: mockInstructionsResponse,
      materializedLines: mockMaterializedResponse,
      error: null,
      isLoading: false,
      generateInstructions: mockGenerateInstructions,
      materializeInstructions: mockMaterializeInstructions,
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    // Click generate button to trigger hasGenerated state change
    const generateButton = screen.getByRole('button', { name: /generate lines/i });
    await user.click(generateButton);

    // Shape selector should now be visible
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /caged shape selector/i })).toBeInTheDocument();
    });
  });

  it('triggers regeneration with new shape when shape selector is clicked', async () => {
    const user = userEvent.setup();
    mockUseParams.mockReturnValue({ id: 'autumn-leaves' });

    const mockGenerateInstructions = vi.fn().mockResolvedValue(mockInstructionsResponse);
    const mockMaterializeInstructions = vi.fn().mockResolvedValue(mockMaterializedResponse);

    vi.mocked(useStandardDetail).mockReturnValue({
      standard: mockStandard,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    // Start with no lines
    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: null,
      materializedLines: null,
      error: null,
      isLoading: false,
      generateInstructions: mockGenerateInstructions,
      materializeInstructions: mockMaterializeInstructions,
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    render(<StandardDetailPage />);

    // Update hook to return materialized lines
    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: mockInstructionsResponse,
      materializedLines: mockMaterializedResponse,
      error: null,
      isLoading: false,
      generateInstructions: mockGenerateInstructions,
      materializeInstructions: mockMaterializeInstructions,
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    // First, generate lines to show shape selector
    const generateButton = screen.getByRole('button', { name: /generate lines/i });
    await user.click(generateButton);

    // Wait for shape selector to appear
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /caged shape selector/i })).toBeInTheDocument();
    });

    // Clear the mock to check for new calls
    mockGenerateInstructions.mockClear();

    // Click on shape 'C'
    const shapeC = screen.getByRole('button', { name: 'C' });
    await user.click(shapeC);

    // Should trigger regeneration with new shape
    await waitFor(() => {
      expect(mockGenerateInstructions).toHaveBeenCalledWith({
        chords: mockStandard.chords_improvisation,
        guitar_position: 'C',
      });
    });
  });

  it('displays Back to Library link that navigates to standards list', () => {
    mockUseParams.mockReturnValue({ id: 'autumn-leaves' });

    vi.mocked(useStandardDetail).mockReturnValue({
      standard: mockStandard,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: null,
      materializedLines: null,
      error: null,
      isLoading: false,
      generateInstructions: vi.fn(),
      materializeInstructions: vi.fn(),
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    render(<StandardDetailPage />);

    const backLink = screen.getByRole('link', { name: /back to library/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/experimental/standards');
  });

  it('displays loading state while fetching standard', () => {
    mockUseParams.mockReturnValue({ id: 'autumn-leaves' });

    vi.mocked(useStandardDetail).mockReturnValue({
      standard: null,
      error: null,
      isLoading: true,
      refetch: vi.fn(),
    });

    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: null,
      materializedLines: null,
      error: null,
      isLoading: false,
      generateInstructions: vi.fn(),
      materializeInstructions: vi.fn(),
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    render(<StandardDetailPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error message when standard fails to load', () => {
    mockUseParams.mockReturnValue({ id: 'autumn-leaves' });

    vi.mocked(useStandardDetail).mockReturnValue({
      standard: null,
      error: 'Failed to load standard',
      isLoading: false,
      refetch: vi.fn(),
    });

    vi.mocked(useBarryHarrisInstructions).mockReturnValue({
      instructions: null,
      materializedLines: null,
      error: null,
      isLoading: false,
      generateInstructions: vi.fn(),
      materializeInstructions: vi.fn(),
      clearError: vi.fn(),
      clearResults: vi.fn(),
    });

    render(<StandardDetailPage />);

    expect(screen.getByText(/failed to load standard/i)).toBeInTheDocument();
  });
});
