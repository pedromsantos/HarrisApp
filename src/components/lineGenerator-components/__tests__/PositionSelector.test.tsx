import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PositionSelector } from '../PositionSelector';

describe('PositionSelector', () => {
  const mockProps = {
    position: 5,
    onPositionChange: vi.fn(),
    isLoading: false,
  };

  const setup = () => {
    const user = userEvent.setup();
    return { user };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial position value', () => {
    render(<PositionSelector {...mockProps} />);
    const input = screen.getByRole('spinbutton');
    expect((input as HTMLInputElement).value).toBe('5');
  });

  it('updates position when value changes', async () => {
    const { user } = setup();
    render(<PositionSelector {...mockProps} />);

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '7');

    expect(mockProps.onPositionChange).toHaveBeenCalled();
  });

  it('handles empty input by setting position to 0', async () => {
    const { user } = setup();
    render(<PositionSelector {...mockProps} />);

    const input = screen.getByRole('spinbutton');
    await user.clear(input);

    expect(mockProps.onPositionChange).toHaveBeenCalledWith(0);
  });

  it('disables input when isLoading is true', () => {
    render(<PositionSelector {...mockProps} isLoading={true} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
  });

  it('renders with correct label', () => {
    render(<PositionSelector {...mockProps} />);
    expect(screen.getByText('Guitar Position (0-12)')).toBeInTheDocument();
  });

  it('has min and max attributes set correctly', () => {
    render(<PositionSelector {...mockProps} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '12');
  });

  it('enforces min and max values', async () => {
    const { user } = setup();
    render(<PositionSelector {...mockProps} />);
    const input = screen.getByRole('spinbutton');

    await user.clear(input);
    await user.type(input, '13');

    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '12');
  });

  it('maintains accessibility attributes', () => {
    render(<PositionSelector {...mockProps} />);
    const input = screen.getByRole('spinbutton');

    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min');
    expect(input).toHaveAttribute('max');
    expect(input.parentElement).toHaveTextContent('Guitar Position (0-12)');
  });

  it('handles keyboard interactions correctly', async () => {
    const { user } = setup();
    render(<PositionSelector {...mockProps} />);

    const input = screen.getByRole('spinbutton');

    await user.clear(input);
    await user.type(input, '5');
    await user.keyboard('{ArrowUp}');

    expect(mockProps.onPositionChange).toHaveBeenCalled();
  });

  it('handles non-numeric input correctly', async () => {
    const { user } = setup();
    render(<PositionSelector {...mockProps} />);

    const input = screen.getByRole('spinbutton');

    await user.clear(input);
    expect(mockProps.onPositionChange).toHaveBeenCalledWith(0);
  });
});
