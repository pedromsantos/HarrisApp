import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Show the next theme that will be selected, not the current theme
  const getNextTheme = (): 'dark' | 'light' | 'system' => {
    if (theme === 'dark') return 'light';
    if (theme === 'light') return 'system';
    return 'dark';
  };

  const toggleTheme = () => {
    console.log('Current theme before toggle:', theme, '(resolved:', resolvedTheme, ')');
    // Cycle through themes: dark → light → system → dark
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
    console.log(
      'Theme changed to:',
      theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
    );
  };

  // Render the current theme's icon (not the next theme)
  // This helps users identify what mode they're currently in
  const getIconForCurrentTheme = () => {
    // For system mode, show computer icon
    if (theme === 'system') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
          <line x1="2" x2="22" y1="20" y2="20" />
        </svg>
      );
    }

    // For explicit dark/light mode, show the icon for the current mode
    if (theme === 'dark') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 border-primary"
      title={`Current theme: ${theme} (${resolvedTheme}). Click to change to ${getNextTheme()}.`}
    >
      {getIconForCurrentTheme()}
    </Button>
  );
}
