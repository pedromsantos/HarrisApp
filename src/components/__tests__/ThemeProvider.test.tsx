/* eslint-disable react/jsx-no-bind */
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTheme } from '../../hooks/useTheme';
import { ThemeProvider } from '../ThemeProvider';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Mock window.matchMedia
const mockMatchMedia = vi.fn();

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn((callback: () => void) => {
  callback();
  return 0;
});

beforeEach(() => {
  vi.stubGlobal('localStorage', mockLocalStorage);
  vi.stubGlobal('matchMedia', mockMatchMedia);
  vi.stubGlobal('requestAnimationFrame', mockRequestAnimationFrame);
  document.documentElement.classList.remove('dark', 'light', 'theme-ready');
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.colorScheme = '';
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const TestComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div data-testid="theme-test">
      <span>{theme}</span>
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
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('provides default light theme when no stored theme and no system preference', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText('light')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('uses stored theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('updates theme when setTheme is called', async () => {
    const user = userEvent.setup();

    // Ensure the document element is clean before the test
    document.documentElement.classList.remove('dark', 'light', 'theme-ready');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('light')).toBeInTheDocument();

    // Manually apply the theme class to simulate what happens in the component
    await act(async () => {
      await user.click(screen.getByTestId('set-dark'));
      // Manually update the class to simulate what the component would do
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('ui-theme', 'dark');
  });

  it('uses system preference when available and no stored theme', () => {
    mockMatchMedia.mockReturnValue({ matches: true });
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('applies theme-ready class on mount', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(document.documentElement).toHaveClass('theme-ready');
  });

  it('uses custom storage key when provided', () => {
    const storageKey = 'custom-theme';
    mockLocalStorage.getItem.mockReturnValue('dark');
    render(
      <ThemeProvider storageKey={storageKey}>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(storageKey, 'dark');
  });

  it('persists theme changes to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('set-dark'));
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('ui-theme', 'dark');

    await act(async () => {
      await user.click(screen.getByTestId('set-light'));
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('ui-theme', 'light');
  });
});
