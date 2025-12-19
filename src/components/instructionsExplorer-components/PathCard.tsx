/* eslint-disable react/no-array-index-key */
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PathOptionDto } from '@/types/barryHarrisInstructions';

interface PathCardProps {
  path: PathOptionDto;
  transitionIndex: number;
  isSelected: boolean;
  onToggleSelection: () => void;
}

const PathCard: React.FC<PathCardProps> = ({
  path,
  isSelected,
  onToggleSelection,
}) => {
  const { metadata, instruction } = path;

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'border-primary border-2 bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
      }`}
      onClick={onToggleSelection}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Target: {metadata.target_degree}
        </CardTitle>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>Length: {metadata.path_length}</span>
          <span>{instruction.patterns.length} patterns</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-muted-foreground">Pattern Sequence:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {instruction.patterns.map((pattern, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-1 border-t border-border">
            <span className="text-muted-foreground">From:</span>
            <p className="font-medium">
              {instruction.from_scale.root} {instruction.from_scale.pattern}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">To:</span>
            <p className="font-medium">
              {instruction.to_scale.root} {instruction.to_scale.pattern}
            </p>
          </div>
        </div>
        {isSelected && (
          <div className="mt-3 flex items-center gap-2 text-xs text-primary font-medium">
            <svg
              className="h-4 w-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            Selected
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PathCard;
