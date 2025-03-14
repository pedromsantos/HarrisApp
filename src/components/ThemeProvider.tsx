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

      if (storedTheme && ['dark', 'light'].includes(storedTheme)) {
        return storedTheme as Theme;
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }

    // Default to system preference
    const systemTheme = getSystemTheme();
    console.log(`Using system theme as default: ${systemTheme}`);
    return systemTheme;
  });

  // Function to apply theme to document
  const applyTheme = (newTheme: Theme) => {
    try {
      console.log('Applying theme:', newTheme);

      const root = window.document.documentElement;
      // First remove both classes to ensure clean state
      root.classList.remove('light', 'dark');
      // Then add the appropriate class
      root.classList.add(newTheme);
      root.setAttribute('data-theme', newTheme);

      // Force Tailwind to recognize the theme change
      if (newTheme === 'dark') {
        root.style.colorScheme = 'dark';
      } else {
        root.style.colorScheme = 'light';
      }

      console.log(`Theme applied: ${newTheme}`);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  // Controlled function to set theme with validation and logging
  const setTheme = (newTheme: Theme) => {
    console.log(`Setting theme from ${theme} to ${newTheme}`);
    if (!['dark', 'light'].includes(newTheme)) {
      console.error('Invalid theme:', newTheme);
      return;
    }
    setThemeState(newTheme);
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    console.log('Theme changed to:', theme);

    // Immediate DOM update for better perceived performance
    requestAnimationFrame(() => {
      applyTheme(theme);
    });

    try {
      localStorage.setItem(storageKey, theme);
      console.log(`Theme saved to localStorage: ${theme}`);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme, storageKey]);

  // Listen for system theme changes to log, but don't auto-change anymore since we're not using 'system' mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      console.log('System theme preference changed, but not auto-updating theme.');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply initial theme immediately on mount and force a reapplication
  useEffect(() => {
    // Add debugging class
    document.documentElement.classList.add('theme-ready');

    // Force immediate theme application on mount
    applyTheme(theme);

    // No need for the delayed application, it can slow things down
    // Remove the setTimeout for faster initial load

    return () => {
      // No timer to clean up anymore
    };
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

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
