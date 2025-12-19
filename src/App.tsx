import './App.css';

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navigation from './components/Navigation';
import { ThemeProvider } from './components/ThemeProvider';
import Counterpoint from './pages/Counterpoint';
// import InstructionsExplorer from './pages/InstructionsExplorer';
import LineGenerator from './pages/LineGenerator';

const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="px-4 py-2 sm:px-0">
              <Routes>
                <Route path="/" element={<LineGenerator />} />
                {/* <Route path="/instructions-explorer" element={<InstructionsExplorer />} /> */}
                <Route path="/counterpoint" element={<Counterpoint />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
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
