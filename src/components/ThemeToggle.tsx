import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import * as Toggle from '@radix-ui/react-toggle';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Toggle.Root
      pressed={theme === 'dark'}
      onPressedChange={() => toggleTheme()}
      aria-label={`Current theme: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode.`}
      className="rounded-full w-9 h-9 border border-primary inline-flex items-center justify-center bg-background hover:bg-accent"
    >
      {theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    </Toggle.Root>
  );
}
