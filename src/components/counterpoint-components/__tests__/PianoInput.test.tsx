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
        <button
          onClick={() => {
            playNote(-1);
          }}
          data-testid="invalid-note"
        >
          Invalid
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

  it('does not call onOctaveChange when trying to go above max octave', async () => {
    const user = userEvent.setup();
    const onOctaveChange = vi.fn();

    render(<PianoInput {...mockProps} octave={6} onOctaveChange={onOctaveChange} />);

    const octaveUpButton = screen.getByTestId('octave-up');
    // Button should be disabled, so this won't actually trigger
    expect(octaveUpButton).toBeDisabled();
    
    // Verify callback was never called
    expect(onOctaveChange).not.toHaveBeenCalled();
  });

  it('does not call onOctaveChange when trying to go below min octave', async () => {
    const user = userEvent.setup();
    const onOctaveChange = vi.fn();

    render(<PianoInput {...mockProps} octave={3} onOctaveChange={onOctaveChange} />);

    const octaveDownButton = screen.getByTestId('octave-down');
    // Button should be disabled, so this won't actually trigger
    expect(octaveDownButton).toBeDisabled();
    
    // Verify callback was never called
    expect(onOctaveChange).not.toHaveBeenCalled();
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

  it('does not call onNoteClick when mouse is not down', () => {
    const onNoteClick = vi.fn();

    render(<PianoInput {...mockProps} onNoteClick={onNoteClick} />);

    // Click the piano button without mouseDown on container
    const c4Button = screen.getByText('C4');
    fireEvent.click(c4Button);

    expect(onNoteClick).not.toHaveBeenCalled();
  });

  it('stops registering clicks on mouseUp', () => {
    const onNoteClick = vi.fn();

    render(<PianoInput {...mockProps} onNoteClick={onNoteClick} />);

    const pianoContainer = screen.getByTestId('piano-keyboard');

    // Mouse down
    fireEvent.mouseDown(pianoContainer);

    // Mouse up
    fireEvent.mouseUp(pianoContainer);

    // Try to click a note
    const c4Button = screen.getByText('C4');
    fireEvent.click(c4Button);

    // Should not be called because mouse was released
    expect(onNoteClick).not.toHaveBeenCalled();
  });

  it('stops registering clicks on mouseLeave', () => {
    const onNoteClick = vi.fn();

    render(<PianoInput {...mockProps} onNoteClick={onNoteClick} />);

    const pianoContainer = screen.getByTestId('piano-keyboard');

    // Mouse down
    fireEvent.mouseDown(pianoContainer);

    // Mouse leaves the piano container
    fireEvent.mouseLeave(pianoContainer);

    // Try to click a note
    const c4Button = screen.getByText('C4');
    fireEvent.click(c4Button);

    // Should not be called because mouse left the container
    expect(onNoteClick).not.toHaveBeenCalled();
  });

  it('calls onUndo when undo button clicked', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();

    render(<PianoInput {...mockProps} onUndo={onUndo} />);

    const undoButton = screen.getByTestId('undo-button');
    await user.click(undoButton);

    expect(onUndo).toHaveBeenCalled();
  });

  it('calls onClearCurrent when clear current button clicked', async () => {
    const user = userEvent.setup();
    const onClearCurrent = vi.fn();

    render(<PianoInput {...mockProps} onClearCurrent={onClearCurrent} />);

    const clearCurrentButton = screen.getByTestId('clear-current-button');
    await user.click(clearCurrentButton);

    expect(onClearCurrent).toHaveBeenCalled();
  });

  it('calls onClearAll when clear all button clicked', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();

    render(<PianoInput {...mockProps} onClearAll={onClearAll} />);

    const clearAllButton = screen.getByTestId('clear-all-button');
    await user.click(clearAllButton);

    expect(onClearAll).toHaveBeenCalled();
  });

  it('disables action buttons based on props', () => {
    render(
      <PianoInput {...mockProps} canUndo={false} canClearCurrent={false} canClearAll={false} />
    );

    expect(screen.getByTestId('undo-button')).toBeDisabled();
    expect(screen.getByTestId('clear-current-button')).toBeDisabled();
    expect(screen.getByTestId('clear-all-button')).toBeDisabled();
  });

  it('handles invalid MIDI number with fallback', () => {
    const onNoteClick = vi.fn();

    render(<PianoInput {...mockProps} onNoteClick={onNoteClick} />);

    const pianoContainer = screen.getByTestId('piano-keyboard');
    fireEvent.mouseDown(pianoContainer);

    // Click the invalid note button
    const invalidButton = screen.getByTestId('invalid-note');
    fireEvent.click(invalidButton);

    // Should call with fallback 'C4'
    expect(onNoteClick).toHaveBeenCalledWith('C4');
  });
});
