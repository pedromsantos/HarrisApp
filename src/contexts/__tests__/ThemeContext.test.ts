import { describe, it, expect } from 'vitest';
import { ThemeContext } from '../ThemeContext';

describe('ThemeContext', () => {
  it('exports ThemeContext', () => {
    expect(ThemeContext).toBeDefined();
  });

  it('has correct initial state with light theme', () => {
    expect(ThemeContext._currentValue).toBeDefined();
    expect(ThemeContext._currentValue.theme).toBe('light');
  });

  it('has setTheme function in initial state', () => {
    expect(ThemeContext._currentValue.setTheme).toBeDefined();
    expect(typeof ThemeContext._currentValue.setTheme).toBe('function');
  });

  it('setTheme function returns null by default', () => {
    const result = ThemeContext._currentValue.setTheme('dark');
    expect(result).toBeNull();
  });

  it('context can be consumed', () => {
    expect(ThemeContext.Provider).toBeDefined();
    expect(ThemeContext.Consumer).toBeDefined();
  });
});
