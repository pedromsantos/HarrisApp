import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../ThemeProvider';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('light'); // Set initial theme
    document.documentElement.classList.remove('light', 'dark');
  });

  const renderWithThemeProvider = () => {
    return render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  it('renders with sun icon when theme is light', () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    renderWithThemeProvider();

    const sunCircle = screen.getByRole('button').querySelector('circle[cx="12"][cy="12"][r="4"]');
    expect(sunCircle).toBeInTheDocument();
  });

  it('renders with moon icon when theme is dark', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    renderWithThemeProvider();

    const moonPath = screen
      .getByRole('button')
      .querySelector('path[d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"]');
    expect(moonPath).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    renderWithThemeProvider();

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('ui-theme', 'dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('has correct title attribute based on current theme', () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    renderWithThemeProvider();

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Current theme: light. Click to switch to dark mode.');
  });

  it('has correct button styling', () => {
    renderWithThemeProvider();

    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full', 'w-9', 'h-9', 'border-primary');
  });

  it('uses system preference when no theme is stored', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderWithThemeProvider();

    const moonPath = screen
      .getByRole('button')
      .querySelector('path[d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"]');
    expect(moonPath).toBeInTheDocument();
  });
});
