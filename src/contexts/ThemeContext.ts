import { createContext } from 'react';

import { Theme } from '@/types/theme';

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

export const ThemeContext = createContext<ThemeProviderState>(initialState);
