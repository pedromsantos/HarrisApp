import React from 'react';
import { Pattern } from '../../types/lineGenerator';

export interface PatternSelectorProps {
  selectedPatterns: Pattern[];
  availablePatterns: Pattern[];
  onAddPattern: (pattern: Pattern) => void;
  onRemovePattern: (pattern: Pattern) => void;
  onMovePatternUp: (index: number) => void;
  onMovePatternDown: (index: number) => void;
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  selectedPatterns,
  availablePatterns,
  onAddPattern,
  onRemovePattern,
  onMovePatternUp,
  onMovePatternDown,
}) => (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-2">Patterns</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Available Patterns */}
      <div>
        <h4 className="text-xs text-muted-foreground mb-1">Available Patterns</h4>
        <div className="bg-background dark:bg-card rounded-lg border border-border p-3 h-auto min-h-[350px]">
          {availablePatterns.map((pattern) => (
            <div
              key={pattern}
              className="flex items-center justify-between py-1.5 px-3 rounded-md hover:bg-muted cursor-pointer my-1"
              onClick={() => onAddPattern(pattern)}
            >
              <span className="text-sm">{pattern.replace(/_/g, ' ')}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Patterns */}
      <div>
        <h4 className="text-xs text-muted-foreground mb-1">Selected Patterns</h4>
        <div className="bg-background dark:bg-card rounded-lg border border-border p-3 h-auto min-h-[350px]">
          {selectedPatterns.map((pattern, index) => (
            <div
              key={`${pattern}-${index}`}
              className="flex items-center justify-between py-1.5 px-3 rounded-md hover:bg-muted my-1"
            >
              <span className="text-sm">{pattern.replace(/_/g, ' ')}</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => onMovePatternUp(index)}
                  disabled={index === 0}
                  className={`text-primary ${
                    index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onMovePatternDown(index)}
                  disabled={index === selectedPatterns.length - 1}
                  className={`text-primary ${
                    index === selectedPatterns.length - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onRemovePattern(pattern)}
                  className="text-destructive cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {selectedPatterns.length === 0 && (
            <div className="text-muted-foreground text-sm italic text-center py-8">
              No patterns selected
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
