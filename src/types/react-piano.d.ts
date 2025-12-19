declare module 'react-piano' {
  import { FC } from 'react';

  export interface NoteRange {
    first: number;
    last: number;
  }

  export interface KeyboardShortcut {
    key: string;
    midiNumber: number;
  }

  export interface PianoProps {
    noteRange: NoteRange;
    playNote: (midiNumber: number) => void;
    stopNote: (midiNumber: number) => void;
    width?: number;
    keyboardShortcuts?: KeyboardShortcut[];
    disabled?: boolean;
    gliss?: boolean;
  }

  export const Piano: FC<PianoProps>;

  export const MidiNumbers: {
    fromNote: (note: string) => number;
    getAttributes: (midiNumber: number) => {
      note: string;
      pitchName: string;
      octave: number;
      midiNumber: number;
      isAccidental: boolean;
    };
    NATURAL_MIDI_NUMBERS: number[];
  };
}

declare module 'react-piano/dist/styles.css' {
  const content: { [className: string]: string };
  export default content;
}
