import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the possible theme values
export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light'; // Add this to track the actual applied theme
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light',
};

// Create context
const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  // Helper to get system theme preference
  const getSystemTheme = (): 'dark' | 'light' => {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (error) {
      console.error('Error detecting system theme:', error);
    }
    return 'light';
  };

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      // Try to get the theme from localStorage first
      const storedTheme = localStorage.getItem(storageKey);
      console.log('Stored theme from localStorage:', storedTheme);

      if (storedTheme && ['dark', 'light', 'system'].includes(storedTheme)) {
        return storedTheme as Theme;
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }

    console.log(`Using default theme: ${defaultTheme}`);
    return defaultTheme;
  });

  // Track the actual resolved theme (dark or light)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(
    theme === 'system' ? getSystemTheme() : (theme as 'dark' | 'light')
  );

  // Function to apply theme to document
  const applyTheme = (newTheme: Theme) => {
    try {
      console.log('Applying theme:', newTheme);
      const resolved = newTheme === 'system' ? getSystemTheme() : (newTheme as 'dark' | 'light');
      setResolvedTheme(resolved);

      const root = window.document.documentElement;
      // First remove both classes to ensure clean state
      root.classList.remove('light', 'dark');
      // Then add the appropriate class
      root.classList.add(resolved);
      root.setAttribute('data-theme', resolved);

      // Force Tailwind to recognize the theme change
      if (resolved === 'dark') {
        root.style.colorScheme = 'dark';
      } else {
        root.style.colorScheme = 'light';
      }

      console.log(`Theme applied: ${resolved} (from ${newTheme})`);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  // Controlled function to set theme with validation and logging
  const setTheme = (newTheme: Theme) => {
    console.log(`Setting theme from ${theme} to ${newTheme}`);
    if (!['dark', 'light', 'system'].includes(newTheme)) {
      console.error('Invalid theme:', newTheme);
      return;
    }
    setThemeState(newTheme);
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    console.log('Theme changed to:', theme);
    applyTheme(theme);

    try {
      localStorage.setItem(storageKey, theme);
      console.log(`Theme saved to localStorage: ${theme}`);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme, storageKey]);

  // Listen for system theme changes if using 'system' theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      console.log('System theme preference changed, current theme:', theme);
      if (theme === 'system') {
        console.log('Applying system theme change');
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply initial theme immediately on mount and force a reapplication
  useEffect(() => {
    // Add debugging class
    document.documentElement.classList.add('theme-ready');

    // Force immediate theme application on mount
    applyTheme(theme);

    // Apply theme again after a small delay to ensure it sticks
    const timer = setTimeout(() => {
      console.log('Reapplying theme after delay');
      applyTheme(theme);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Expose theme context with both the theme setting and resolved theme
  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
