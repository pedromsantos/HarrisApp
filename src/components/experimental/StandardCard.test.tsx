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

  it.each([
    ['standard name', 'Autumn Leaves'],
    ['composer name', 'Joseph Kosma'],
    ['key signature', 'Gm'],
    ['tempo', 'Medium'],
    ['form', 'AABA'],
  ])('displays %s', (fieldName, expectedContent) => {
    const { onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    expect(screen.getByRole('article')).toHaveTextContent(expectedContent);
  });

  it.each([
    ['beginner', 'bg-green-100', 'text-green-800'],
    ['intermediate', 'bg-yellow-100', 'text-yellow-800'],
    ['advanced', 'bg-red-100', 'text-red-800'],
  ] as const)('displays difficulty badge with correct color for %s', (difficulty, bgColorClass, textColorClass) => {
    const { onClickMock } = setup();
    const standard = { ...mockStandard, difficulty };
    render(<StandardCard standard={standard} onClick={onClickMock} />);

    const badge = screen.getByText(difficulty);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(bgColorClass, textColorClass);
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

  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
  ])('is keyboard accessible with %s key', async (keyName, keyInput) => {
    const { user, onClickMock } = setup();
    render(<StandardCard standard={mockStandard} onClick={onClickMock} />);

    const card = screen.getByRole('article');
    card.focus();
    await user.keyboard(keyInput);

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
