import React from 'react';
import './App.css';
import LineGenerator from './components/LineGenerator';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-card-foreground">Barry Harris Line Generator</h1>
            <ThemeToggle />
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
    </ThemeProvider>
  );
};

export default App;
