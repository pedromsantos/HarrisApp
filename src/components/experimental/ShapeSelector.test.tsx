import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { CAGEDShape } from '@/types/jazzStandards';

import { ShapeSelector } from './ShapeSelector';

const ALL_SHAPES: CAGEDShape[] = ['C', 'A', 'G', 'E', 'D'];

describe('ShapeSelector', () => {
  const setup = () => {
    const user = userEvent.setup();
    const onShapeChangeMock = vi.fn();
    return { user, onShapeChangeMock };
  };

  it('renders five CAGED shape buttons', () => {
    const { onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="C" onShapeChange={onShapeChangeMock} isLoading={false} />);

    ALL_SHAPES.forEach((shape) => {
      expect(screen.getByRole('button', { name: shape })).toBeInTheDocument();
    });
  });

  it('marks active shape button with primary color', () => {
    const { onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="G" onShapeChange={onShapeChangeMock} isLoading={false} />);

    const activeButton = screen.getByRole('button', { name: 'G' });
    expect(activeButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('marks inactive shape buttons with secondary color', () => {
    const { onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="G" onShapeChange={onShapeChangeMock} isLoading={false} />);

    const inactiveShapes: CAGEDShape[] = ['C', 'A', 'E', 'D'];
    inactiveShapes.forEach((shape) => {
      const button = screen.getByRole('button', { name: shape });
      expect(button).toHaveClass('bg-gray-200', 'text-gray-800');
    });
  });

  it('fires onShapeChange callback with selected shape when clicked', async () => {
    const { user, onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="C" onShapeChange={onShapeChangeMock} isLoading={false} />);

    const buttonA = screen.getByRole('button', { name: 'A' });
    await user.click(buttonA);

    expect(onShapeChangeMock).toHaveBeenCalledWith('A');
    expect(onShapeChangeMock).toHaveBeenCalledTimes(1);
  });

  it('disables all buttons during loading state', () => {
    const { onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="C" onShapeChange={onShapeChangeMock} isLoading={true} />);

    ALL_SHAPES.forEach((shape) => {
      const button = screen.getByRole('button', { name: shape });
      expect(button).toBeDisabled();
    });
  });

  it('does not fire onShapeChange when disabled button is clicked', async () => {
    const { user, onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="C" onShapeChange={onShapeChangeMock} isLoading={true} />);

    const buttonA = screen.getByRole('button', { name: 'A' });
    await user.click(buttonA);

    expect(onShapeChangeMock).not.toHaveBeenCalled();
  });

  it('is keyboard accessible with Tab navigation', async () => {
    const { user, onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="C" onShapeChange={onShapeChangeMock} isLoading={false} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'C' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'A' })).toHaveFocus();
  });

  it('is keyboard accessible with Space key activation', async () => {
    const { user, onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="C" onShapeChange={onShapeChangeMock} isLoading={false} />);

    const buttonE = screen.getByRole('button', { name: 'E' });
    buttonE.focus();
    await user.keyboard(' ');

    expect(onShapeChangeMock).toHaveBeenCalledWith('E');
  });

  it('is keyboard accessible with Enter key activation', async () => {
    const { user, onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="C" onShapeChange={onShapeChangeMock} isLoading={false} />);

    const buttonD = screen.getByRole('button', { name: 'D' });
    buttonD.focus();
    await user.keyboard('{Enter}');

    expect(onShapeChangeMock).toHaveBeenCalledWith('D');
  });

  it('sets aria-pressed="true" for active shape button', () => {
    const { onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="A" onShapeChange={onShapeChangeMock} isLoading={false} />);

    const activeButton = screen.getByRole('button', { name: 'A' });
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets aria-pressed="false" for inactive shape buttons', () => {
    const { onShapeChangeMock } = setup();
    render(<ShapeSelector activeShape="A" onShapeChange={onShapeChangeMock} isLoading={false} />);

    const inactiveShapes: CAGEDShape[] = ['C', 'G', 'E', 'D'];
    inactiveShapes.forEach((shape) => {
      const button = screen.getByRole('button', { name: shape });
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
