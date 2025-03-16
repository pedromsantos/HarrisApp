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

const AddIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-primary"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const UpArrowIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const DownArrowIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const RemoveIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface PatternItemProps {
  pattern: Pattern;
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
}

const PatternItem: React.FC<PatternItemProps> = ({ pattern, onClick, icon, className = '' }) => (
  <div
    className={`flex items-center justify-between py-1.5 px-3 rounded-md hover:bg-muted cursor-pointer my-1 ${className}`}
    onClick={onClick}
  >
    <span className="text-sm">{pattern.replace(/_/g, ' ')}</span>
    {icon}
  </div>
);

interface PatternControlsProps {
  index: number;
  totalPatterns: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

const PatternControls: React.FC<PatternControlsProps> = ({
  index,
  totalPatterns,
  onMoveUp,
  onMoveDown,
  onRemove,
}) => (
  <div className="flex space-x-2">
    <button
      type="button"
      onClick={onMoveUp}
      disabled={index === 0}
      className={`text-primary ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <UpArrowIcon />
    </button>
    <button
      type="button"
      onClick={onMoveDown}
      disabled={index === totalPatterns - 1}
      className={`text-primary ${
        index === totalPatterns - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <DownArrowIcon />
    </button>
    <button type="button" onClick={onRemove} className="text-destructive cursor-pointer">
      <RemoveIcon />
    </button>
  </div>
);

interface PatternListProps {
  title: string;
  children: React.ReactNode;
}

const PatternList: React.FC<PatternListProps> = ({ title, children }) => (
  <div>
    <h4 className="text-xs text-muted-foreground mb-1">{title}</h4>
    <div className="bg-background dark:bg-card rounded-lg border border-border p-3 h-auto min-h-[350px]">
      {children}
    </div>
  </div>
);

const AvailablePatterns: React.FC<{
  patterns: Pattern[];
  onAddPattern: (pattern: Pattern) => void;
}> = ({ patterns, onAddPattern }) => (
  <PatternList title="Available Patterns">
    {patterns.map((pattern) => (
      <PatternItem
        key={pattern}
        pattern={pattern}
        onClick={() => onAddPattern(pattern)}
        icon={<AddIcon />}
      />
    ))}
  </PatternList>
);

const SelectedPatterns: React.FC<{
  patterns: Pattern[];
  onRemovePattern: (pattern: Pattern) => void;
  onMovePatternUp: (index: number) => void;
  onMovePatternDown: (index: number) => void;
}> = ({ patterns, onRemovePattern, onMovePatternUp, onMovePatternDown }) => (
  <PatternList title="Selected Patterns">
    {patterns.length === 0 ? (
      <div className="text-muted-foreground text-sm italic text-center py-8">
        No patterns selected
      </div>
    ) : (
      patterns.map((pattern, index) => (
        <PatternItem
          key={`${pattern}-${index}`}
          pattern={pattern}
          onClick={() => {}}
          icon={
            <PatternControls
              index={index}
              totalPatterns={patterns.length}
              onMoveUp={() => onMovePatternUp(index)}
              onMoveDown={() => onMovePatternDown(index)}
              onRemove={() => onRemovePattern(pattern)}
            />
          }
        />
      ))
    )}
  </PatternList>
);

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
      <AvailablePatterns patterns={availablePatterns} onAddPattern={onAddPattern} />
      <SelectedPatterns
        patterns={selectedPatterns}
        onRemovePattern={onRemovePattern}
        onMovePatternUp={onMovePatternUp}
        onMovePatternDown={onMovePatternDown}
      />
    </div>
  </div>
);
