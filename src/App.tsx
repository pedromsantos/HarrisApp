import './App.css';

import React, { useEffect } from 'react';

import LineGenerator from './components/LineGenerator';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto py-3 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-card-foreground">Barry Harris Line Generator</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-card-foreground/70 hidden md:inline">Toggle Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
          <div className="px-4 py-2 sm:px-0">
            <LineGenerator />
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add('performance-transitions');

    return () => {
      document.documentElement.classList.remove('performance-transitions');
    };
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
