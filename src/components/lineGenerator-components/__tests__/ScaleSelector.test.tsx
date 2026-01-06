/* eslint-disable sonarjs/no-duplicate-string, @typescript-eslint/require-await */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { NOTES, OCTAVES, SCALE_TYPES } from '@/components/lineGenerator-components/constants';
import { ScaleSelector } from '@/components/lineGenerator-components/ScaleSelector';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const defaultProps = {
  fromScale: 'dominant G3',
  toScale: 'dominant C4',
  onFromScaleChange: vi.fn(),
  onToScaleChange: vi.fn(),
  isLoading: false,
};

const setup = () => {
  const user = userEvent.setup();
  return { user };
};

const getScaleSection = (heading: string) => {
  return screen.getByTestId(`${heading.toLowerCase().replace(' ', '-')}-section`);
};

const selectOption = async (
  user: ReturnType<typeof userEvent.setup>,
  trigger: HTMLElement,
  value: string
) => {
  await user.click(trigger);
  const listbox = screen.getByRole('listbox');
  await user.click(within(listbox).getByRole('option', { name: value }));
};

describe('ScaleSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial scale values', () => {
    render(<ScaleSelector {...defaultProps} />);

    const fromSection = getScaleSection('from scale');
    const toSection = getScaleSection('to scale');

    expect(within(fromSection).getByRole('combobox', { name: 'Select note' })).toHaveTextContent(
      'G3'
    );
    expect(within(fromSection).getByRole('combobox', { name: 'Select scale' })).toHaveTextContent(
      'Dominant'
    );
    expect(within(toSection).getByRole('combobox', { name: 'Select note' })).toHaveTextContent(
      'C4'
    );
    expect(within(toSection).getByRole('combobox', { name: 'Select scale' })).toHaveTextContent(
      'Dominant'
    );
  });

  it('allows changing from scale values', async () => {
    const { user } = setup();
    render(<ScaleSelector {...defaultProps} />);
    const fromScaleSection = getScaleSection('from scale');

    const noteSelect = within(fromScaleSection).getByRole('combobox', { name: 'Select note' });
    const typeSelect = within(fromScaleSection).getByRole('combobox', { name: 'Select scale' });

    await selectOption(user, noteSelect, 'C4');
    expect(defaultProps.onFromScaleChange).toHaveBeenCalledWith('dominant', 'C4');

    await selectOption(user, typeSelect, 'Major');
    expect(defaultProps.onFromScaleChange).toHaveBeenCalledWith('major', 'G3');
  });

  it('allows changing to scale values', async () => {
    const { user } = setup();
    render(<ScaleSelector {...defaultProps} />);
    const toScaleSection = getScaleSection('to scale');

    const noteSelect = within(toScaleSection).getByRole('combobox', { name: 'Select note' });
    const typeSelect = within(toScaleSection).getByRole('combobox', { name: 'Select scale' });

    await selectOption(user, noteSelect, 'G4');
    expect(defaultProps.onToScaleChange).toHaveBeenCalledWith('dominant', 'G4');

    await selectOption(user, typeSelect, 'Major');
    expect(defaultProps.onToScaleChange).toHaveBeenCalledWith('major', 'C4');
  });

  it('renders all available notes and scale types', async () => {
    const { user } = setup();
    render(<ScaleSelector {...defaultProps} />);
    const fromScaleSection = getScaleSection('from scale');

    const noteSelect = within(fromScaleSection).getByRole('combobox', { name: 'Select note' });

    await user.click(noteSelect);
    const listbox = screen.getByRole('listbox');

    for (const note of NOTES) {
      for (const octave of OCTAVES) {
        const optionText = `${note}${octave}`;
        expect(within(listbox).getByRole('option', { name: optionText })).toBeInTheDocument();
      }
    }

    await user.keyboard('{Escape}');

    const scaleSelect = within(fromScaleSection).getByRole('combobox', { name: 'Select scale' });

    await user.click(scaleSelect);

    for (const type of SCALE_TYPES) {
      const displayText = type.charAt(0).toUpperCase() + type.slice(1);
      expect(screen.getByRole('option', { name: displayText })).toBeInTheDocument();
    }
  });

  it('disables all selects when isLoading is true', () => {
    render(<ScaleSelector {...defaultProps} isLoading={true} />);

    const fromSection = getScaleSection('from scale');
    const toSection = getScaleSection('to scale');

    [fromSection, toSection].forEach((section) => {
      const selects = within(section).getAllByRole('combobox');
      selects.forEach((select) => {
        expect(select).toBeDisabled();
      });
    });
  });

  it('maintains accessibility attributes', () => {
    render(<ScaleSelector {...defaultProps} />);

    const fromSection = getScaleSection('from scale');
    const toSection = getScaleSection('to scale');

    [fromSection, toSection].forEach((section) => {
      expect(within(section).getByRole('combobox', { name: 'Select note' })).toHaveAttribute(
        'aria-label',
        'Select note'
      );
      expect(within(section).getByRole('combobox', { name: 'Select scale' })).toHaveAttribute(
        'aria-label',
        'Select scale'
      );
    });
  });

  it('handles empty scale string gracefully in scale type parsing', async () => {
    const onFromScaleChange = vi.fn();
    render(<ScaleSelector {...defaultProps} fromScale="" onFromScaleChange={onFromScaleChange} />);

    // Component should still render without crashing
    const fromSection = getScaleSection('from scale');
    expect(fromSection).toBeInTheDocument();
  });

  it('handles malformed scale string in scale note parsing', async () => {
    const onFromScaleChange = vi.fn();
    // Scale with no note part should use fallback
    render(
      <ScaleSelector {...defaultProps} fromScale="Major" onFromScaleChange={onFromScaleChange} />
    );

    const fromSection = getScaleSection('from scale');
    expect(fromSection).toBeInTheDocument();
  });
});
