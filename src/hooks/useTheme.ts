import { useContext } from 'react';

import { ThemeContext, ThemeProviderState } from '@/contexts/ThemeContext';

export function useTheme(): ThemeProviderState {
  return useContext(ThemeContext);
}
