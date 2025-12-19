/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ThemeToggle } from './ThemeToggle';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-card shadow">
      <div className="max-w-7xl mx-auto py-3 px-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold text-card-foreground">Barry Harris Line Generator</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-card-foreground/70 hidden md:inline">Toggle Theme</span>
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex gap-4 border-t border-border pt-3">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-primary text-primary-foreground'
                : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Line Generator
          </Link>
          <Link
            to="/instructions-explorer"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/instructions-explorer')
                ? 'bg-primary text-primary-foreground'
                : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Instructions Explorer
          </Link>
          <Link
            to="/counterpoint"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/counterpoint')
                ? 'bg-primary text-primary-foreground'
                : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Counterpoint
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
