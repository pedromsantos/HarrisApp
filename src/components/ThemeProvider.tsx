import React, { useEffect, useState } from 'react';

import { ThemeContext } from '../contexts/ThemeContext';
import { Theme } from '../types/theme';

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps): React.ReactElement {
  const getSystemTheme = (): Theme => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  };

  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey);

    if (storedTheme !== null && storedTheme !== '' && ['dark', 'light'].includes(storedTheme)) {
      return storedTheme as Theme;
    }

    return getSystemTheme();
  });

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    root.setAttribute('data-theme', newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      applyTheme(theme);
    });

    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  useEffect(() => {
    document.documentElement.classList.add('theme-ready');

    applyTheme(theme);

    return () => {};
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}
