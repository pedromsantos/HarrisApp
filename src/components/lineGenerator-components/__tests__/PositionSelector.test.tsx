import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PositionSelector } from '../PositionSelector';

describe('PositionSelector', () => {
  const mockProps = {
    position: 5,
    onPositionChange: vi.fn(),
    isLoading: false,
  };

  it('renders with initial position value', () => {
    render(<PositionSelector {...mockProps} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('5');
  });

  it('calls onPositionChange when value changes', () => {
    render(<PositionSelector {...mockProps} />);
    const input = screen.getByRole('spinbutton');
    input && fireEvent.change(input, { target: { value: '7' } });
    expect(mockProps.onPositionChange).toHaveBeenCalledWith(7);
  });

  it('handles empty input by setting position to 0', () => {
    render(<PositionSelector {...mockProps} />);
    const input = screen.getByRole('spinbutton');
    input && fireEvent.change(input, { target: { value: '' } });
    expect(mockProps.onPositionChange).toHaveBeenCalledWith(0);
  });

  it('disables input when isLoading is true', () => {
    render(<PositionSelector {...mockProps} isLoading={true} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('renders with correct label', () => {
    render(<PositionSelector {...mockProps} />);
    expect(screen.getByText('Guitar Position (0-12)')).toBeInTheDocument();
  });

  it('has min and max attributes set correctly', () => {
    render(<PositionSelector {...mockProps} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.min).toBe('0');
    expect(input.max).toBe('12');
  });
});
