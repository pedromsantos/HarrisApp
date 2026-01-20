import '@testing-library/jest-dom';

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import { cleanup, configure } from '@testing-library/react';
import { afterEach, beforeAll, expect, vi } from 'vitest';

// Configure React act() environment for testing BEFORE any React code runs
// This flag tells React that we're in a testing environment that supports act()
beforeAll(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});

// Also set it immediately for synchronous access
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Configure React Testing Library
configure({
  // Increase async timeout for complex interactions
  asyncUtilTimeout: 5000,
});

// Extend Vitest's expect with jest-dom matchers
declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;

  namespace Vi {
    interface Assertion<T = any>
      extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
    interface AsymmetricMatchersContaining
      extends TestingLibraryMatchers<typeof expect.stringContaining, unknown> {}
  }
}

// Mock pointer capture API
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();
Element.prototype.hasPointerCapture = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof ResizeObserver;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
  takeRecords = vi.fn(() => []);
} as unknown as typeof IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Suppress known React Testing Library + React 19 act() warnings
// This is a known issue: https://github.com/testing-library/react-testing-library/issues/1413
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('The current testing environment is not configured to support act') ||
      message.includes('inside a test was not wrapped in act'))
  ) {
    return; // Suppress these specific warnings
  }
  originalConsoleError.apply(console, args);
};

// Mock ABCJS
vi.mock('abcjs', () => ({
  default: {
    renderAbc: vi.fn(),
  },
}));

// Add custom matchers
expect.extend({
  toHaveBeenCalledOnceWith(received: any, ...args: any[]) {
    const pass =
      received.mock.calls.length === 1 &&
      JSON.stringify(received.mock.calls[0]) === JSON.stringify(args);

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to have been called once with ${args}`
          : `expected ${received} to have been called once with ${args}`,
    };
  },
});
