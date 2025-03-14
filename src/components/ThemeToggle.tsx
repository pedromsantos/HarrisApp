import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    console.log('Current theme before toggle:', theme);
    // Toggle between dark and light modes only
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Setting theme to:', newTheme);
    setTheme(newTheme);
  };

  // Render the current theme's icon
  const renderIcon = () => {
    if (theme === 'dark') {
      // Moon icon for dark mode
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
      // Sun icon for light mode
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
      title={`Current theme: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode.`}
    >
      {renderIcon()}
    </Button>
  );
}
