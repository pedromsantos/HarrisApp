import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModeSelector } from '@/components/counterpoint-components/ModeSelector';

describe('ModeSelector', () => {
  const mockProps = {
    mode: 'cantus_firmus' as const,
    onModeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with cantus firmus mode selected', () => {
    render(<ModeSelector {...mockProps} />);

    const cfButton = screen.getByTestId('mode-cantus-firmus');
    expect(cfButton).toBeInTheDocument();
    expect(cfButton).toHaveClass('bg-primary');
  });

  it('renders with counterpoint mode selected', () => {
    render(<ModeSelector {...mockProps} mode="counterpoint" />);

    const cpButton = screen.getByTestId('mode-counterpoint');
    expect(cpButton).toBeInTheDocument();
  });

  it('calls onModeChange when cantus firmus button clicked', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();

    render(<ModeSelector {...mockProps} mode="counterpoint" onModeChange={onModeChange} />);

    const cfButton = screen.getByTestId('mode-cantus-firmus');
    await user.click(cfButton);

    expect(onModeChange).toHaveBeenCalledWith('cantus_firmus');
  });

  it('calls onModeChange when counterpoint button clicked', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();

    render(<ModeSelector {...mockProps} onModeChange={onModeChange} />);

    const cpButton = screen.getByTestId('mode-counterpoint');
    await user.click(cpButton);

    expect(onModeChange).toHaveBeenCalledWith('counterpoint');
  });

  it('renders title and description', () => {
    render(<ModeSelector {...mockProps} />);

    expect(screen.getByText('Input Mode')).toBeInTheDocument();
    expect(screen.getByText('Select which line you want to input notes for')).toBeInTheDocument();
  });
});
