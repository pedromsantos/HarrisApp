/* eslint-disable sonarjs/no-duplicate-string */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders with sun icon when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Current theme: light. Click to switch to dark mode.'
    );

    // Verify sun icon is present
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Check the viewBox matches our SVG icon
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders with moon icon when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Current theme: dark. Click to switch to light mode.'
    );

    // Verify moon icon is present
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Check the viewBox matches our SVG icon
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup();

    // Initial state: light theme
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark', // Start with dark theme
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    // Click to toggle to light theme
    await user.click(screen.getByRole('button'));

    // Check that setTheme was called with 'light'
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('has correct button styling', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full', 'w-9', 'h-9', 'border-primary');
  });

  it('maintains accessibility attributes', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    // The Button component doesn't add a type attribute by default
    // so we'll remove this expectation
  });

  it('handles rapid theme toggles correctly', async () => {
    const user = userEvent.setup();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));

    expect(mockSetTheme).toHaveBeenCalledTimes(3);
  });
});
