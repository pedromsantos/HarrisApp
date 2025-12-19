import React, { useCallback, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { convertToCounterpointABC } from '@/lib/counterpointNotation';
import { CounterpointMode } from '@/types/counterpoint';

const preloadABCJS = () => import('abcjs');

export interface CounterpointNotationProps {
  cantusFirmus: string[];
  counterpoint: string[];
  intervals: string[];
  mode: CounterpointMode;
  onModeChange: (mode: CounterpointMode) => void;
}

export const CounterpointNotation: React.FC<CounterpointNotationProps> = ({
  cantusFirmus,
  counterpoint,
  intervals,
  mode,
  onModeChange,
}) => {
  const notationRef = useRef<HTMLDivElement | null>(null);
  const abcjsRef = useRef<typeof import('abcjs') | null>(null);

  const handleCounterpointModeClick = useCallback(() => {
    onModeChange('counterpoint');
  }, [onModeChange]);

  const handleCantusFirmusModeClick = useCallback(() => {
    onModeChange('cantus_firmus');
  }, [onModeChange]);

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
        <div className="space-y-4">
          <div className="relative p-4 bg-background rounded overflow-auto min-h-[200px]">
            <div ref={notationRef} data-testid="notation-container" />
            <div className="absolute right-1 top-[40%] flex flex-col gap-2">
              <Button
                onClick={handleCounterpointModeClick}
                variant={mode === 'counterpoint' ? 'default' : 'outline'}
                size="sm"
                data-testid="mode-counterpoint"
              >
                Edit
              </Button>
            </div>
            <div className="absolute right-1 bottom-[18%] flex flex-col gap-2">
              <Button
                onClick={handleCantusFirmusModeClick}
                variant={mode === 'cantus_firmus' ? 'default' : 'outline'}
                size="sm"
                data-testid="mode-cantus-firmus"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          <p>No notes yet. Start by selecting a mode and adding notes with the piano.</p>
        </div>
      )}
    </Card>
  );
};
