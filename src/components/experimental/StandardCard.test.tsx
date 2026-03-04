import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { JazzStandard } from '@/types/jazzStandards';

import { StandardCard } from './StandardCard';

const MOCK_STANDARD_ID = 'autumn-leaves';

describe('StandardCard', () => {
  const mockStandard: JazzStandard = {
    id: MOCK_STANDARD_ID,
    name: 'Autumn Leaves',
    composer: 'Joseph Kosma',
    key: 'Gm',
    chords_original: ['Cm7', 'F7', 'BbMaj7'],
    chords_improvisation: ['Cm7', 'F7', 'BbMaj7'],
    form: 'AABA',
    tempo: 'Medium',
    difficulty: 'beginner',
    description: 'A timeless jazz standard',
  };

  const setup = () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();
    return { user, onClickMock };
  };

  it('displays standard name', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    expect(screen.getByRole('article')).toHaveTextContent('Autumn Leaves');
  });

  it('displays composer name', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    expect(screen.getByRole('article')).toHaveTextContent('Joseph Kosma');
  });

  it('displays key signature', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    expect(screen.getByRole('article')).toHaveTextContent('Gm');
  });

  it('displays tempo', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    expect(screen.getByRole('article')).toHaveTextContent('Medium');
  });

  it('displays form', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    expect(screen.getByRole('article')).toHaveTextContent('AABA');
  });

  it('displays difficulty badge with green color for beginner', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    const badge = screen.getByText('beginner');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('displays difficulty badge with yellow color for intermediate', () => {
    const { onClickMock } = setup();
    const intermediateStandard = { ...mockStandard, difficulty: 'intermediate' as const };
    render(<StandardCard standard={intermediateStandard} onClick={onClickMock} />);

    const badge = screen.getByText('intermediate');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('displays difficulty badge with red color for advanced', () => {
    const { onClickMock } = setup();
    const advancedStandard = { ...mockStandard, difficulty: 'advanced' as const };
    render(<StandardCard standard={advancedStandard} onClick={onClickMock} />);

    const badge = screen.getByText('advanced');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('fires onClick callback with standard ID when clicked', async () => {
    const { user, onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    const card = screen.getByRole('article');
    await user.click(card);

    expect(onClickMock).toHaveBeenCalledWith(MOCK_STANDARD_ID);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('has hover effect indicating clickability', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    const card = screen.getByRole('article');
    expect(card).toHaveClass('cursor-pointer');
    expect(card).toHaveClass('hover:shadow-lg');
  });

  it('is keyboard accessible with Enter key', async () => {
    const { user, onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    const card = screen.getByRole('article');
    card.focus();
    await user.keyboard('{Enter}');

    expect(onClickMock).toHaveBeenCalledWith(MOCK_STANDARD_ID);
  });

  it('is keyboard accessible with Space key', async () => {
    const { user, onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    const card = screen.getByRole('article');
    card.focus();
    await user.keyboard(' ');

    expect(onClickMock).toHaveBeenCalledWith(MOCK_STANDARD_ID);
  });

  it('has proper ARIA label for accessibility', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label', 'Autumn Leaves by Joseph Kosma');
  });

  it('is focusable with tabindex', () => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('tabindex', '0');
  });
});
