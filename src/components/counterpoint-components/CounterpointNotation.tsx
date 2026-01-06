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
  abcjsModule?: typeof import('abcjs'); // Optional for testing
}

export const CounterpointNotation: React.FC<CounterpointNotationProps> = ({
  cantusFirmus,
  counterpoint,
  intervals,
  mode,
  onModeChange,
  onNotesChange,
  abcjsModule,
}) => {
  const notationRef = useRef<HTMLDivElement | null>(null);
  const abcjsRef = useRef<typeof import('abcjs') | null>(null);
  const { transposeNote, stepToSemitones, calculateNoteIndex } = useAbcNotation();
  const [abcString, setAbcString] = useState('');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const dragStateRef = useRef<{
    mode: CounterpointMode | null;
    index: number;
    originalNote: string;
  } | null>(null);

  const dragResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCounterpointModeClick = useCallback(() => {
    onModeChange('counterpoint');
  }, [onModeChange]);

  const handleCantusFirmusModeClick = useCallback(() => {
    onModeChange('cantus_firmus');
  }, [onModeChange]);

  const shouldHandleDrag = useCallback(
    (drag: { step?: number; index?: number } | undefined): boolean => {
      const hasValidStep = drag?.step !== undefined && drag.step !== 0;
      return hasValidStep && onNotesChange !== undefined;
    },
    [onNotesChange]
  );

  const getVoiceLines = useCallback((lines: string[]) => {
    const cpLineIndex = lines.findIndex((line) => line.startsWith('[V:1]'));
    const cfLineIndex = lines.findIndex((line) => line.startsWith('[V:2]'));

    const hasValidIndices = cpLineIndex !== -1 && cfLineIndex !== -1;
    if (!hasValidIndices) return null;

    const cpLine = lines[cpLineIndex];
    const cfLine = lines[cfLineIndex];

    if (cpLine === undefined || cfLine === undefined) return null;

    return { cpLine, cfLine, cpLineIndex, cfLineIndex };
  }, []);

  const determineTargetVoice = useCallback(
    (startChar: number, cpLineStart: number, cfLineStart: number) => {
      const isCounterpointVoice = startChar >= cpLineStart && startChar < cfLineStart;

      if (isCounterpointVoice) {
        return {
          mode: 'counterpoint' as CounterpointMode,
          notes: [...counterpoint],
        };
      }

      return {
        mode: 'cantus_firmus' as CounterpointMode,
        notes: [...cantusFirmus],
      };
    },
    [counterpoint, cantusFirmus]
  );

  const updateDragState = useCallback(
    (targetMode: CounterpointMode, noteIndex: number, currentNote: string) => {
      const current = dragStateRef.current;
      const isNewDrag = current?.mode !== targetMode || current.index !== noteIndex;

      if (isNewDrag) {
        dragStateRef.current = {
          mode: targetMode,
          index: noteIndex,
          originalNote: currentNote,
        };
      }
    },
    []
  );

  const scheduleReset = useCallback(() => {
    if (dragResetTimerRef.current !== null) {
      globalThis.clearTimeout(dragResetTimerRef.current);
    }
    dragResetTimerRef.current = globalThis.setTimeout(() => {
      dragStateRef.current = null;
      dragResetTimerRef.current = null;
      setSelectedNote(null);
    }, 3000); // Keep selection visible for 3 seconds
  }, []);

  const processNoteSelection = useCallback(
    (targetMode: CounterpointMode, noteIndex: number, targetNotes: string[]) => {
      const currentNote = targetNotes[noteIndex];
      if (currentNote === undefined) return null;

      updateDragState(targetMode, noteIndex, currentNote);

      if (dragStateRef.current === null) return null;

      // Show selected note
      setSelectedNote(currentNote);

      return { currentNote, targetNotes };
    },
    [updateDragState]
  );

  const processNoteDrag = useCallback(
    (
      isDragging: boolean,
      drag: { step?: number; index?: number } | undefined,
      currentNote: string,
      targetNotes: string[],
      targetMode: CounterpointMode,
      noteIndex: number
    ) => {
      if (!isDragging || !dragStateRef.current || !drag) return;

      const originalNote = dragStateRef.current.originalNote;
      const semitones = stepToSemitones(-(drag.step ?? 0), originalNote);
      const newNote = transposeNote(originalNote, semitones);

      if (!newNote || newNote === currentNote) return;

      targetNotes[noteIndex] = newNote;
      onNotesChange?.(targetNotes, targetMode);
      setSelectedNote(newNote);
    },
    [stepToSemitones, transposeNote, onNotesChange]
  );

  const clickListener = useCallback(
    (
      abcelem: unknown,
      _tuneNumber: number,
      _classes: string,
      _analysis: unknown,
      drag: { step?: number; index?: number } | undefined
    ) => {
      // Handle both drag and simple clicks
      const isDragging = drag?.step !== undefined && drag.step !== 0;
      if (!onNotesChange) return;
      if (isDragging && !shouldHandleDrag(drag)) return;

      const elem = abcelem as {
        startChar?: number;
        endChar?: number;
        elemType?: string;
        pitches?: Array<{ verticalPos?: number }>;
        abcelem?: { el_type?: string };
      };

      if (elem.startChar === undefined) return;

      const lines = abcString.split('\n');
      const voiceLines = getVoiceLines(lines);
      if (voiceLines === null) return;

      const { cpLine, cfLine } = voiceLines;
      const cpLineStart = abcString.indexOf(cpLine);
      const cfLineStart = abcString.indexOf(cfLine);

      const { mode: targetMode, notes: targetNotes } = determineTargetVoice(
        elem.startChar,
        cpLineStart,
        cfLineStart
      );

      const voiceLine = targetMode === 'counterpoint' ? cpLine : cfLine;
      const voiceLineStart = targetMode === 'counterpoint' ? cpLineStart : cfLineStart;

      const voiceContent = voiceLine.replace(/^\[V:\d\]\s*/, '');
      const prefixLength = voiceLine.length - voiceContent.length;
      const positionInLine = elem.startChar - voiceLineStart;
      const notePosition = Math.max(0, positionInLine - prefixLength);

      const noteIndex = calculateNoteIndex(voiceContent, notePosition);
      if (noteIndex === -1 || noteIndex >= targetNotes.length) return;

      const selectionResult = processNoteSelection(targetMode, noteIndex, targetNotes);
      if (!selectionResult) return;

      const { currentNote } = selectionResult;

      // If dragging, transpose the note
      processNoteDrag(isDragging, drag, currentNote, targetNotes, targetMode, noteIndex);

      scheduleReset();
    },
    [
      abcString,
      shouldHandleDrag,
      getVoiceLines,
      determineTargetVoice,
      calculateNoteIndex,
      processNoteSelection,
      processNoteDrag,
      onNotesChange,
      scheduleReset,
    ]
  );

  useEffect(() => {
    const abcNotation = convertToCounterpointABC(cantusFirmus, counterpoint, intervals);
    setAbcString(abcNotation);
  }, [cantusFirmus, counterpoint, intervals]);

  const getKeyStep = useCallback((e: KeyboardEvent): number | null => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      return e.shiftKey ? 12 : 1; // Shift = octave, normal = semitone
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      return e.shiftKey ? -12 : -1;
    }
    return null;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!dragStateRef.current || !onNotesChange) return;

      const { mode: targetMode, index: noteIndex } = dragStateRef.current;
      if (targetMode === null) return;

      const step = getKeyStep(e);
      if (step === null) return;

      const targetNotes = targetMode === 'counterpoint' ? [...counterpoint] : [...cantusFirmus];
      const currentNote = targetNotes[noteIndex];
      if (currentNote === undefined || currentNote === '') return;

      const newNote = transposeNote(currentNote, step);
      if (!newNote) return;

      targetNotes[noteIndex] = newNote;
      onNotesChange(targetNotes, targetMode);

      // Update drag state and selected note display
      dragStateRef.current.originalNote = newNote;
      setSelectedNote(newNote);
      scheduleReset();
    };

    globalThis.addEventListener('keydown', handleKeyDown);

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [counterpoint, cantusFirmus, transposeNote, onNotesChange, scheduleReset, getKeyStep]);

  useEffect(() => {
    const loadAbcjs = async () => {
      try {
        // Use injected module for testing, or dynamic import for production
        const abcjs = abcjsModule ?? (await preloadABCJS());
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
    const isReady = abcjsRef.current !== null && notationRef.current !== null && abcString !== '';
    if (!isReady) return;

    const abcjs = abcjsRef.current;
    const el = notationRef.current;

    if (abcjs === null || el === null) return;

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
                    {selectedNote !== null && selectedNote !== '' && (
                      <div className="text-center mb-2">
                        <div className="text-xs text-muted-foreground">Selected</div>
                        <div className="text-lg font-bold text-blue-600">{selectedNote}</div>
                        <div className="text-xs text-muted-foreground mt-1">Use ↑↓ arrows</div>
                      </div>
                    )}
                    <fieldset className="inline-flex flex-col gap-2">
                      <legend className="text-sm font-medium">Edit Score</legend>
                      <div className="inline-flex rounded-md shadow-sm">
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
                    </fieldset>
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
