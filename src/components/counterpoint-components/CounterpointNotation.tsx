import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAbcNotation } from '@/hooks/useAbcNotation';
import { convertToCounterpointABC } from '@/lib/counterpointNotation';
import { CounterpointMode } from '@/types/counterpoint';

const preloadABCJS = () => import('abcjs');

export interface CounterpointNotationProps {
  cantusFirmus: string[];
  counterpoint: string[];
  intervals: string[];
  mode: CounterpointMode;
  onModeChange: (mode: CounterpointMode) => void;
  onNotesChange?: (notes: string[], mode: CounterpointMode) => void;
}

export const CounterpointNotation: React.FC<CounterpointNotationProps> = ({
  cantusFirmus,
  counterpoint,
  intervals,
  mode,
  onModeChange,
  onNotesChange,
}) => {
  const notationRef = useRef<HTMLDivElement | null>(null);
  const abcjsRef = useRef<typeof import('abcjs') | null>(null);
  const { transposeNote, stepToSemitones } = useAbcNotation();
  const [abcString, setAbcString] = useState('');

  const dragStateRef = useRef<{
    mode: CounterpointMode | null;
    index: number;
    originalNote: string;
  } | null>(null);

  const dragResetTimerRef = useRef<number | null>(null);

  const handleCounterpointModeClick = useCallback(() => {
    onModeChange('counterpoint');
  }, [onModeChange]);

  const handleCantusFirmusModeClick = useCallback(() => {
    onModeChange('cantus_firmus');
  }, [onModeChange]);

  const calculateNoteIndex = useCallback((voiceContent: string, notePosition: number): number => {
    const rawSegments = voiceContent.split('|');
    let currentPos = 0;
    let validNoteCount = 0;

    for (let i = 0; i < rawSegments.length; i++) {
      const segment = rawSegments[i];
      if (segment === undefined) continue;

      const segmentEnd = currentPos + segment.length;
      const hasContent = segment.trim() !== '';

      if (notePosition >= currentPos && notePosition < segmentEnd) {
        return hasContent ? validNoteCount : -1;
      }

      if (hasContent) {
        validNoteCount++;
      }

      currentPos = segmentEnd + 1; // +1 for the | character
    }

    return -1;
  }, []);

  const clickListener = useCallback(
    (
      abcelem: unknown,
      _tuneNumber: number,
      _classes: string,
      _analysis: unknown,
      drag: { step?: number; index?: number } | undefined
    ) => {
      if (drag?.step === undefined || drag.step === 0 || !onNotesChange) {
        return;
      }

      const elem = abcelem as {
        startChar?: number;
        endChar?: number;
        elemType?: string;
        pitches?: Array<{ verticalPos?: number }>;
        abcelem?: { el_type?: string };
      };

      const lines = abcString.split('\n');
      const cpLineIndex = lines.findIndex((line) => line.startsWith('[V:1]'));
      const cfLineIndex = lines.findIndex((line) => line.startsWith('[V:2]'));

      if (cpLineIndex === -1 || cfLineIndex === -1 || elem.startChar === undefined) {
        return;
      }

      const startChar = elem.startChar;
      const cpLine = lines[cpLineIndex];
      const cfLine = lines[cfLineIndex];

      if (cpLine === undefined || cfLine === undefined) {
        return;
      }

      const cpLineStart = abcString.indexOf(cpLine);
      const cfLineStart = abcString.indexOf(cfLine);

      let targetMode: CounterpointMode;
      let targetNotes: string[];
      let voiceLine: string;
      let voiceLineStart: number;

      if (startChar >= cpLineStart && startChar < cfLineStart) {
        targetMode = 'counterpoint';
        targetNotes = [...counterpoint];
        voiceLine = cpLine;
        voiceLineStart = cpLineStart;
      } else {
        // Cantus Firmus voice
        targetMode = 'cantus_firmus';
        targetNotes = [...cantusFirmus];
        voiceLine = cfLine;
        voiceLineStart = cfLineStart;
      }

      const voiceContent = voiceLine.replace(/^\[V:\d\]\s*/, '');
      const prefixLength = voiceLine.length - voiceContent.length;
      const positionInLine = startChar - voiceLineStart;
      const notePosition = Math.max(0, positionInLine - prefixLength);

      const noteIndex = calculateNoteIndex(voiceContent, notePosition);

      if (noteIndex === -1 || noteIndex >= targetNotes.length) {
        return;
      }

      const currentNote = targetNotes[noteIndex];
      if (currentNote === undefined) {
        return;
      }

      const current = dragStateRef.current;

      const isNewDrag = current?.mode !== targetMode || current.index !== noteIndex;

      if (isNewDrag) {
        dragStateRef.current = {
          mode: targetMode,
          index: noteIndex,
          originalNote: currentNote,
        };
      }

      if (dragStateRef.current === null) {
        return;
      }

      const originalNote = dragStateRef.current.originalNote;

      const semitones = stepToSemitones(-drag.step, originalNote);
      const newNote = transposeNote(originalNote, semitones);

      targetNotes[noteIndex] = newNote;

      onNotesChange(targetNotes, targetMode);

      if (dragResetTimerRef.current !== null) {
        window.clearTimeout(dragResetTimerRef.current);
      }
      dragResetTimerRef.current = window.setTimeout(() => {
        dragStateRef.current = null;
        dragResetTimerRef.current = null;
      }, 200);
    },
    [
      abcString,
      counterpoint,
      cantusFirmus,
      onNotesChange,
      transposeNote,
      stepToSemitones,
      calculateNoteIndex,
    ]
  );

  useEffect(() => {
    const abcNotation = convertToCounterpointABC(cantusFirmus, counterpoint, intervals);
    setAbcString(abcNotation);
  }, [cantusFirmus, counterpoint, intervals]);

  useEffect(() => {
    return () => {
      if (dragResetTimerRef.current !== null) {
        window.clearTimeout(dragResetTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadAbcjs = async () => {
      try {
        const abcjs = await preloadABCJS();
        abcjsRef.current = abcjs;

        if (notationRef.current !== null) {
          try {
            abcjs.renderAbc(notationRef.current, abcString, {
              responsive: 'resize',
              add_classes: true,
              staffwidth: 700,
              clickListener: onNotesChange ? clickListener : undefined,
              dragging: onNotesChange !== undefined,
              selectionColor: '#3b82f6',
              dragColor: '#10b981',
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
    if (abcjsRef.current !== null && notationRef.current !== null && abcString !== '') {
      const abcjs = abcjsRef.current;
      const el = notationRef.current;

      try {
        abcjs.renderAbc(el, abcString, {
          responsive: 'resize',
          add_classes: true,
          staffwidth: 700,
          clickListener: onNotesChange ? clickListener : undefined,
          dragging: onNotesChange !== undefined,
          selectionColor: '#3b82f6',
          dragColor: '#10b981',
        });
      } catch {
        // Silently handle rendering errors
      }
    }
  }, [abcString, clickListener, onNotesChange]);

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
