import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { JazzStandard } from '@/types/jazzStandards';

import { StandardsLibraryPage } from './StandardsLibraryPage';

const mockNavigate = vi.fn();

vi.mock('@/hooks/useStandards');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const { useStandards } = await import('@/hooks/useStandards');

const mockStandards: JazzStandard[] = Array.from({ length: 15 }, (_, i) => ({
  id: `standard-${String(i)}`,
  name: `Standard ${String(i)}`,
  composer: `Composer ${String(i)}`,
  key: 'C',
  chords_original: ['C', 'F', 'G'],
  chords_improvisation: ['C', 'F', 'G'],
  form: 'AABA',
  tempo: 'Medium',
  difficulty: 'beginner' as const,
  description: `Description ${String(i)}`,
}));

describe('StandardsLibraryPage', () => {
  it('displays loading indicator while fetching standards', () => {
    vi.mocked(useStandards).mockReturnValue({
      standards: null,
      error: null,
      isLoading: true,
      refetch: vi.fn(),
    });

    render(<StandardsLibraryPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays 15 standards in grid after successful fetch', async () => {
    vi.mocked(useStandards).mockReturnValue({
      standards: mockStandards,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    render(<StandardsLibraryPage />);

    await waitFor(() => {
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(15);
    });
  });

  it('applies grid layout with 3 columns on desktop', () => {
    vi.mocked(useStandards).mockReturnValue({
      standards: mockStandards,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    render(<StandardsLibraryPage />);

    const grid = screen.getByTestId('standards-grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-3');
  });

  it('displays error message with retry button on fetch failure', () => {
    const mockRefetch = vi.fn();
    vi.mocked(useStandards).mockReturnValue({
      standards: null,
      error: 'Network error occurred',
      isLoading: false,
      refetch: mockRefetch,
    });

    render(<StandardsLibraryPage />);

    expect(screen.getByText(/network error occurred/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls refetch when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRefetch = vi.fn();
    vi.mocked(useStandards).mockReturnValue({
      standards: null,
      error: 'Network error occurred',
      isLoading: false,
      refetch: mockRefetch,
    });

    render(<StandardsLibraryPage />);

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('navigates to detail page when standard card is clicked', async () => {
    const user = userEvent.setup();
    mockNavigate.mockClear();

    const firstStandard = mockStandards[0];
    if (!firstStandard) throw new Error('Mock standard not found');

    vi.mocked(useStandards).mockReturnValue({
      standards: [firstStandard],
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    render(<StandardsLibraryPage />);

    const card = screen.getByRole('article');
    await user.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/experimental/standards/standard-0');
  });

  it('displays page heading', () => {
    vi.mocked(useStandards).mockReturnValue({
      standards: mockStandards,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    render(<StandardsLibraryPage />);

    expect(screen.getByRole('heading', { name: /jazz standards library/i })).toBeInTheDocument();
  });

  it('displays empty state message when no standards are available', () => {
    vi.mocked(useStandards).mockReturnValue({
      standards: [],
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    render(<StandardsLibraryPage />);

    expect(screen.getByText(/no standards available/i)).toBeInTheDocument();
  });
});
