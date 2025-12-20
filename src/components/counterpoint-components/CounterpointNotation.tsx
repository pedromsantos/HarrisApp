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
        <div className="p-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="align-middle pr-4">
                  <div ref={notationRef} data-testid="notation-container" />
                </td>
                <td className="align-middle w-20">
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm font-medium pt-16">Edit Score</span>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                      <Button
                        onClick={handleCounterpointModeClick}
                        variant={mode === 'counterpoint' ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-r-none"
                        data-testid="mode-counterpoint"
                      >
                        CP
                      </Button>
                      <Button
                        onClick={handleCantusFirmusModeClick}
                        variant={mode === 'cantus_firmus' ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-l-none border-l-0"
                        data-testid="mode-cantus-firmus"
                      >
                        CF
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          <p>No notes yet. Start by selecting a mode and adding notes with the piano.</p>
        </div>
      )}
    </Card>
  );
};
