import React, { useEffect, useRef } from 'react';

import { Card } from '@/components/ui/card';
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

        // Trigger initial render after abcjs loads
        if (notationRef.current !== null) {
          try {
            const abcNotation = convertToCounterpointABC(cantusFirmus, counterpoint, intervals);
            abcjs.renderAbc(notationRef.current, abcNotation, {
              responsive: 'resize',
              add_classes: true,
              staffwidth: 700,
            });
          } catch {
            // Silently handle rendering errors
          }
        }
      } catch {
        // Silently handle abcjs loading errors
      }
    };

    void loadAbcjs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (abcjsRef.current !== null && notationRef.current !== null) {
      const abcjs = abcjsRef.current;
      const el = notationRef.current;

      try {
        const abcNotation = convertToCounterpointABC(cantusFirmus, counterpoint, intervals);
        abcjs.renderAbc(el, abcNotation, {
          responsive: 'resize',
          add_classes: true,
          staffwidth: 700,
        });
      } catch {
        // Silently handle rendering errors
      }
    }
  }, [cantusFirmus, counterpoint, intervals]);

  const hasNotes = cantusFirmus.length > 0 || counterpoint.length > 0;

  return (
    <Card>
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
    </Card>
  );
};
