/* eslint-disable react/jsx-no-bind */
import React, { SVGProps } from 'react';

import { Pattern } from '@/types/lineGenerator';

export interface PatternSelectorProps {
  selectedPatterns: Pattern[];
  availablePatterns: Pattern[];
  onAddPattern: (pattern: Pattern) => void;
  onRemovePattern: (pattern: Pattern) => void;
  onMovePatternUp: (index: number) => void;
  onMovePatternDown: (index: number) => void;
}

interface IconProps extends SVGProps<SVGSVGElement> {
  path: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ path, className = 'h-4 w-4', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const AddIcon: React.FC = () => <Icon path="M12 4v16m8-8H4" className="h-4 w-4 text-primary" />;

const UpArrowIcon: React.FC = () => <Icon path="M5 15l7-7 7 7" />;

const DownArrowIcon: React.FC = () => <Icon path="M19 9l-7 7-7-7" />;

const RemoveIcon: React.FC = () => <Icon path="M6 18L18 6M6 6l12 12" />;

interface PatternItemProps {
  pattern: Pattern;
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
}

const PatternItem: React.FC<PatternItemProps> = ({ pattern, onClick, icon, className = '' }) => (
  <div
    data-testid={`pattern-item-${pattern.toLowerCase().replace(/\s+/g, '_')}`}
    className={`flex items-center justify-between py-1.5 px-3 rounded-md hover:bg-muted cursor-pointer my-1 ${className}`}
    onClick={onClick}
  >
    <span>{pattern.replace(/_/g, ' ')}</span>
    {icon !== null && icon !== undefined && <span className="ml-2">{icon}</span>}
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
      data-testid={`move-up-button-${index}`}
      aria-label="Move pattern up"
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
      data-testid={`move-down-button-${index}`}
      aria-label="Move pattern down"
    >
      <DownArrowIcon />
    </button>
    <button
      type="button"
      onClick={onRemove}
      className="text-destructive cursor-pointer"
      data-testid="pattern-remove-button"
      aria-label="Remove pattern"
    >
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
    <div
      data-testid={`${title.toLowerCase().replace(' ', '-')}-section`}
      className="bg-background dark:bg-card rounded-lg border border-border p-3 h-auto min-h-[350px]"
    >
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
      patterns.map((pattern) => (
        <PatternItem
          key={pattern}
          pattern={pattern}
          onClick={() => {}}
          icon={
            <PatternControls
              index={patterns.indexOf(pattern)}
              totalPatterns={patterns.length}
              onMoveUp={() => onMovePatternUp(patterns.indexOf(pattern))}
              onMoveDown={() => onMovePatternDown(patterns.indexOf(pattern))}
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
