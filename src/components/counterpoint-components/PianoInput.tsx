/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-no-bind */
import 'react-piano/dist/styles.css';

import React, { useCallback, useRef } from 'react';
import { MidiNumbers, Piano } from 'react-piano';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface PianoInputProps {
  onNoteClick: (note: string) => void;
  onOctaveChange: (octave: number) => void;
  octave: number;
  onUndo: () => void;
  onClearCurrent: () => void;
  onClearAll: () => void;
  canUndo: boolean;
  canClearCurrent: boolean;
  canClearAll: boolean;
}

// Convert MIDI number to pitch string (e.g., 60 -> "C4")
const midiToPitch = (midiNumber: number): string => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midiNumber / 12) - 1;
  const noteIndex = midiNumber % 12;
  const noteName = noteNames[noteIndex];
  if (noteName === undefined) {
    return 'C4'; // Fallback
  }
  return noteName + String(octave);
};

export const PianoInput: React.FC<PianoInputProps> = ({
  onNoteClick,
  onOctaveChange,
  octave,
  onUndo,
  onClearCurrent,
  onClearAll,
  canUndo,
  canClearCurrent,
  canClearAll,
}) => {
  // C3 to C6 range (MIDI 48 to 84)
  const firstNote = MidiNumbers.fromNote('c3');
  const lastNote = MidiNumbers.fromNote('c6');
  const isMouseDownRef = useRef(false);

  const handleNoteOn = useCallback(
    (midiNumber: number) => {
      // Only add note if mouse is actually down (clicked), not just hovering
      if (isMouseDownRef.current) {
        const pitch = midiToPitch(midiNumber);
        onNoteClick(pitch);
      }
    },
    [onNoteClick]
  );

  const handleOctaveUp = useCallback(() => {
    if (octave < 6) {
      onOctaveChange(octave + 1);
    }
  }, [octave, onOctaveChange]);

  const handleOctaveDown = useCallback(() => {
    if (octave > 3) {
      onOctaveChange(octave - 1);
    }
  }, [octave, onOctaveChange]);

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Octave Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Octave:</span>
            <span className="text-lg font-bold">{octave}</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleOctaveDown}
              disabled={octave <= 3}
              size="sm"
              variant="outline"
              data-testid="octave-down"
            >
              Octave -
            </Button>
            <Button
              onClick={handleOctaveUp}
              disabled={octave >= 6}
              size="sm"
              variant="outline"
              data-testid="octave-up"
            >
              Octave +
            </Button>
          </div>
        </div>

        {/* Piano Keyboard */}
        <div className="flex justify-center">
          <div
            className="piano-container rounded-md overflow-hidden border border-border inline-block"
            data-testid="piano-keyboard"
            onMouseDown={() => {
              isMouseDownRef.current = true;
            }}
            onMouseUp={() => {
              isMouseDownRef.current = false;
            }}
            onMouseLeave={() => {
              isMouseDownRef.current = false;
            }}
          >
            <Piano
              noteRange={{ first: firstNote, last: lastNote }}
              playNote={handleNoteOn}
              stopNote={() => {
                /* No-op: we only care about note clicks */
              }}
              width={800}
              keyboardShortcuts={[
                {
                  key: 'a',
                  midiNumber: MidiNumbers.fromNote(`c${octave}`),
                },
                {
                  key: 'w',
                  midiNumber: MidiNumbers.fromNote(`c#${octave}`),
                },
                {
                  key: 's',
                  midiNumber: MidiNumbers.fromNote(`d${octave}`),
                },
                {
                  key: 'e',
                  midiNumber: MidiNumbers.fromNote(`d#${octave}`),
                },
                {
                  key: 'd',
                  midiNumber: MidiNumbers.fromNote(`e${octave}`),
                },
                {
                  key: 'f',
                  midiNumber: MidiNumbers.fromNote(`f${octave}`),
                },
                {
                  key: 't',
                  midiNumber: MidiNumbers.fromNote(`f#${octave}`),
                },
                {
                  key: 'g',
                  midiNumber: MidiNumbers.fromNote(`g${octave}`),
                },
                {
                  key: 'y',
                  midiNumber: MidiNumbers.fromNote(`g#${octave}`),
                },
                {
                  key: 'h',
                  midiNumber: MidiNumbers.fromNote(`a${octave}`),
                },
                {
                  key: 'u',
                  midiNumber: MidiNumbers.fromNote(`a#${octave}`),
                },
                {
                  key: 'j',
                  midiNumber: MidiNumbers.fromNote(`b${octave}`),
                },
              ]}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={onUndo}
            variant="outline"
            size="sm"
            disabled={!canUndo}
            data-testid="undo-button"
          >
            Undo
          </Button>
          <Button
            onClick={onClearCurrent}
            variant="outline"
            size="sm"
            disabled={!canClearCurrent}
            data-testid="clear-current-button"
          >
            Clear Line
          </Button>
          <Button
            onClick={onClearAll}
            variant="outline"
            size="sm"
            disabled={!canClearAll}
            data-testid="clear-all-button"
          >
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
