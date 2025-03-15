import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the possible theme values
export type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

// Create context
const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, storageKey = 'ui-theme', ...props }: ThemeProviderProps) {
  // Helper to get system theme preference
  const getSystemTheme = (): Theme => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  };

  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to get the theme from localStorage first
    const storedTheme = localStorage.getItem(storageKey);

    if (storedTheme && ['dark', 'light'].includes(storedTheme)) {
      return storedTheme as Theme;
    }

    // Default to system preference
    const systemTheme = getSystemTheme();
    return systemTheme;
  });

  // Function to apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    root.setAttribute('data-theme', newTheme);

    if (newTheme === 'dark') {
      root.style.colorScheme = 'dark';
    } else {
      root.style.colorScheme = 'light';
    }
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
  }, []);

  // Expose theme context
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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
