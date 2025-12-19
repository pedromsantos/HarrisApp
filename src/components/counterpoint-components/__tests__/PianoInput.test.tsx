/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PianoInput } from '@/components/counterpoint-components/PianoInput';

// Mock react-piano
vi.mock('react-piano', () => ({
  Piano: ({ playNote }: { playNote: (midiNumber: number) => void }) => {
    return (
      <div data-testid="piano-mock">
        <button
          onClick={() => {
            playNote(60);
          }}
        >
          C4
        </button>
        <button
          onClick={() => {
            playNote(64);
          }}
        >
          E4
        </button>
        <button
          onClick={() => {
            playNote(67);
          }}
        >
          G4
        </button>
      </div>
    );
  },
  MidiNumbers: {
    fromNote: (note: string) => {
      const noteMap: Record<string, number> = {
        c3: 48,
        c4: 60,
        c5: 72,
        c6: 84,
      };
      return noteMap[note.toLowerCase()] ?? 60;
    },
  },
}));

// Mock react-piano CSS
vi.mock('react-piano/dist/styles.css', () => ({}));

describe('PianoInput', () => {
  const mockProps = {
    onNoteClick: vi.fn(),
    onOctaveChange: vi.fn(),
    octave: 4,
    onUndo: vi.fn(),
    onClearCurrent: vi.fn(),
    onClearAll: vi.fn(),
    canUndo: true,
    canClearCurrent: true,
    canClearAll: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders piano component', () => {
    render(<PianoInput {...mockProps} />);

    expect(screen.getByTestId('piano-keyboard')).toBeInTheDocument();
    expect(screen.getByTestId('piano-mock')).toBeInTheDocument();
  });

  it('displays current octave', () => {
    render(<PianoInput {...mockProps} octave={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onOctaveChange when octave up clicked', async () => {
    const user = userEvent.setup();
    const onOctaveChange = vi.fn();

    render(<PianoInput {...mockProps} octave={4} onOctaveChange={onOctaveChange} />);

    const octaveUpButton = screen.getByTestId('octave-up');
    await user.click(octaveUpButton);

    expect(onOctaveChange).toHaveBeenCalledWith(5);
  });

  it('calls onOctaveChange when octave down clicked', async () => {
    const user = userEvent.setup();
    const onOctaveChange = vi.fn();

    render(<PianoInput {...mockProps} octave={4} onOctaveChange={onOctaveChange} />);

    const octaveDownButton = screen.getByTestId('octave-down');
    await user.click(octaveDownButton);

    expect(onOctaveChange).toHaveBeenCalledWith(3);
  });

  it('disables octave up button at max octave', () => {
    render(<PianoInput {...mockProps} octave={6} />);

    const octaveUpButton = screen.getByTestId('octave-up');
    expect(octaveUpButton).toBeDisabled();
  });

  it('disables octave down button at min octave', () => {
    render(<PianoInput {...mockProps} octave={3} />);

    const octaveDownButton = screen.getByTestId('octave-down');
    expect(octaveDownButton).toBeDisabled();
  });

  it('does not disable octave up button when below max', () => {
    render(<PianoInput {...mockProps} octave={5} />);

    const octaveUpButton = screen.getByTestId('octave-up');
    expect(octaveUpButton).not.toBeDisabled();
  });

  it('does not disable octave down button when above min', () => {
    render(<PianoInput {...mockProps} octave={4} />);

    const octaveDownButton = screen.getByTestId('octave-down');
    expect(octaveDownButton).not.toBeDisabled();
  });

  it('calls onNoteClick when piano key is clicked with mouse down', () => {
    const onNoteClick = vi.fn();

    render(<PianoInput {...mockProps} onNoteClick={onNoteClick} />);

    // Simulate mouseDown on the piano container to enable note clicks
    const pianoContainer = screen.getByTestId('piano-keyboard');
    fireEvent.mouseDown(pianoContainer);

    // Click the mocked piano C4 button directly with fireEvent to avoid timing issues
    const c4Button = screen.getByText('C4');
    fireEvent.click(c4Button);

    expect(onNoteClick).toHaveBeenCalledWith('C4');
  });

  it('renders action buttons', () => {
    render(<PianoInput {...mockProps} />);

    expect(screen.getByTestId('undo-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-current-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-all-button')).toBeInTheDocument();
  });
});
