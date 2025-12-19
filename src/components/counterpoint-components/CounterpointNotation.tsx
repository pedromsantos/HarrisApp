/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convertToCounterpointABC } from '@/lib/counterpointNotation';

const preloadABCJS = () => import('abcjs');

export interface CounterpointNotationProps {
  cantusFirmus: string[];
  counterpoint: string[];
  intervals: string[];
}

export const CounterpointNotation: React.FC<CounterpointNotationProps> = ({
  cantusFirmus,
  counterpoint,
  intervals,
}) => {
  const notationRef = useRef<HTMLDivElement | null>(null);
  const abcjsRef = useRef<typeof import('abcjs') | null>(null);

  useEffect(() => {
    const loadAbcjs = async () => {
      try {
        const abcjs = await preloadABCJS();
        abcjsRef.current = abcjs;
      } catch {
        // Silently handle abcjs loading errors
      }
    };

    void loadAbcjs();
  }, []);

  useEffect(() => {
    if (abcjsRef.current !== null && notationRef.current !== null) {
      const abcjs = abcjsRef.current;
      const el = notationRef.current;

      try {
        const abcNotation = convertToCounterpointABC(cantusFirmus, counterpoint);
        abcjs.renderAbc(el, abcNotation, {
          responsive: 'resize',
          add_classes: true,
          staffwidth: 700,
        });
      } catch {
        // Silently handle rendering errors
      }
    }
  }, [cantusFirmus, counterpoint]);

  const hasNotes = cantusFirmus.length > 0 || counterpoint.length > 0;
  const hasIntervals = intervals.length > 0;
  const minLength = Math.min(cantusFirmus.length, counterpoint.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Music Notation</CardTitle>
        <p className="text-sm text-muted-foreground">
          Top staff: Counterpoint | Bottom staff: Cantus Firmus
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasNotes ? (
          <div
            ref={notationRef}
            data-testid="notation-container"
            className="p-4 bg-background rounded overflow-auto min-h-[200px]"
          />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No notes yet. Start by selecting a mode and adding notes with the piano.</p>
          </div>
        )}

        {/* Harmonic Intervals */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Harmonic Intervals</h3>
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
            <p className="text-sm text-muted-foreground">
              No intervals calculated yet. Add notes to both lines and click &quot;Calculate
              Intervals&quot;.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
