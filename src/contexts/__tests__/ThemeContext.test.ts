import { describe, expect, it } from 'vitest';

import { ThemeContext } from '../ThemeContext';

describe('ThemeContext', () => {
  it('exports ThemeContext', () => {
    expect(ThemeContext).toBeDefined();
  });

  it('context has Provider', () => {
    expect(ThemeContext.Provider).toBeDefined();
  });

  it('context has Consumer', () => {
    expect(ThemeContext.Consumer).toBeDefined();
  });
});
