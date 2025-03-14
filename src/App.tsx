import React, { useEffect } from 'react';
import './App.css';
import LineGenerator from './components/LineGenerator';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  // Apply initial theme classes to help prevent flickering
  useEffect(() => {
    // For debugging - show the current mode in browser console
    console.log(
      'Initial OS theme:',
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );

    return () => {
      // Cleanup - nothing needed here
    };
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

// Separating the content to ensure it re-renders when theme context changes
const AppContent: React.FC = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-card-foreground">
            Barry Harris Line Generator {isDarkMode ? '(Dark)' : '(Light)'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-card-foreground/70 hidden md:inline">Toggle Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <LineGenerator />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
