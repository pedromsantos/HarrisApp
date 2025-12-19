/* eslint-disable react/no-array-index-key */
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface IntervalDisplayProps {
  intervals: string[];
  cantusFirmusLength: number;
  counterpointLength: number;
}

export const IntervalDisplay: React.FC<IntervalDisplayProps> = ({
  intervals,
  cantusFirmusLength,
  counterpointLength,
}) => {
  const hasIntervals = intervals.length > 0;
  const minLength = Math.min(cantusFirmusLength, counterpointLength);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Harmonic Intervals</CardTitle>
        <p className="text-sm text-muted-foreground">
          Intervals between corresponding Cantus Firmus and Counterpoint notes
        </p>
      </CardHeader>
      <CardContent>
        {hasIntervals ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {intervals.map((interval, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-primary/10 text-primary border border-primary/20"
                  data-testid={`interval-${String(index)}`}
                >
                  <span className="text-sm font-medium">{interval}</span>
                </div>
              ))}
            </div>
            {intervals.length < minLength && (
              <p className="text-xs text-muted-foreground mt-2">
                💡 Add more notes to both lines to calculate additional intervals
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">
              No intervals calculated yet. Add notes to both Cantus Firmus and Counterpoint, then
              click &quot;Calculate Intervals&quot;.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
