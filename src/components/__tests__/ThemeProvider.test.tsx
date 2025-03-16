import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeProvider';

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

const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div data-testid="test-component">
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    document.documentElement.classList.remove('light', 'dark');
  });

  it('provides default light theme when no stored theme and no system preference', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('theme-value').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('uses stored theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('updates theme when setTheme is called', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      getByTestId('set-dark').click();
    });

    expect(getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('ui-theme', 'dark');
  });

  it('uses system preference when available and no stored theme', () => {
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

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies theme-ready class on mount', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('theme-ready')).toBe(true);
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });

  it('uses custom storage key when provided', () => {
    const customKey = 'custom-theme-key';

    render(
      <ThemeProvider storageKey={customKey}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(customKey);
  });
});
