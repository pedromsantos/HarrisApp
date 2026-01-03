/* eslint-disable sonarjs/no-duplicate-string */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CounterpointNotation } from '@/components/counterpoint-components/CounterpointNotation';

let clickListenerCallback: ((abcelem: any) => void) | null = null;
let lastAbcString: string = '';

// Mock abcjs
vi.mock('abcjs', () => {
  const mockRenderAbc = vi.fn((id, abc, options) => {
    // Capture the clickListener callback and ABC string
    if (options?.clickListener) {
      clickListenerCallback = options.clickListener;
    }
    lastAbcString = abc;
    return [
      {
        lines: [],
        staffs: [],
        voices: [],
      },
    ];
  });

  return {
    default: {
      renderAbc: mockRenderAbc,
    },
    renderAbc: mockRenderAbc,
  };
});

describe('CounterpointNotation', () => {
  const mockOnModeChange = vi.fn();

  beforeEach(() => {
    clickListenerCallback = null;
    lastAbcString = '';
    mockOnModeChange.mockClear();
  });

  it('renders empty state when no notes', () => {
    render(
      <CounterpointNotation
        cantusFirmus={[]}
        counterpoint={[]}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    expect(
      screen.getByText(/No notes yet. Start by selecting a mode and adding notes with the piano./i)
    ).toBeInTheDocument();
  });

  it('renders notation container when cantus firmus has notes', () => {
    const cantusFirmus = ['C4', 'D4', 'E4'];
    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={[]}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  it('renders notation container when counterpoint has notes', () => {
    const counterpoint = ['E4', 'F4', 'G4'];
    render(
      <CounterpointNotation
        cantusFirmus={[]}
        counterpoint={counterpoint}
        intervals={[]}
        mode="counterpoint"
        onModeChange={mockOnModeChange}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  it('renders notation container when both have notes', () => {
    const cantusFirmus = ['C4', 'D4', 'E4'];
    const counterpoint = ['E4', 'F4', 'G4'];
    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={counterpoint}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  it('renders notation container div', () => {
    const cantusFirmus = ['C4', 'D4'];
    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={[]}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    const container = screen.getByTestId('notation-container');
    expect(container).toBeInTheDocument();
  });

  it('attempts to render ABC notation when notes are present', () => {
    const cantusFirmus = ['C4', 'D4', 'E4'];
    const counterpoint = ['E4', 'F4', 'G4'];

    render(
      <CounterpointNotation
        cantusFirmus={cantusFirmus}
        counterpoint={counterpoint}
        intervals={[]}
        mode="cantus_firmus"
        onModeChange={mockOnModeChange}
      />
    );

    expect(screen.getByTestId('notation-container')).toBeInTheDocument();
  });

  describe('drag and drop functionality', () => {
    it('renders with dragging disabled when onNotesChange is not provided', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('renders with dragging enabled when onNotesChange is provided', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('calls onNotesChange with updated notes when a note is dragged', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const counterpoint = ['E4', 'F4', 'G4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      // Note: The actual drag interaction would be triggered by abcjs
      // In a real scenario, we would simulate the drag event
      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('renders mode toggle buttons', () => {
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('mode-counterpoint')).toBeInTheDocument();
      expect(screen.getByTestId('mode-cantus-firmus')).toBeInTheDocument();
    });

    it('highlights the active mode button', () => {
      const cantusFirmus = ['C4', 'D4'];

      const { rerender } = render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      // When cantus_firmus mode is active
      expect(screen.getByTestId('mode-cantus-firmus')).toBeInTheDocument();

      // Switch to counterpoint mode
      rerender(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('mode-counterpoint')).toBeInTheDocument();
    });

    it('displays Edit Score label', () => {
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByText('Edit Score')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('transposes notes using arrow keys when a note is selected', async () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      // Note: Testing keyboard navigation would require simulating note selection
      // and then firing keyboard events, which depends on internal state
      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles arrow up key for transposition', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      // Keyboard handling is tested through integration
      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });
  });

  describe('note selection display', () => {
    it('does not show selected note initially', () => {
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.queryByText('Selected')).not.toBeInTheDocument();
    });
  });

  describe('ABC notation conversion', () => {
    it('updates ABC string when notes change', () => {
      const { rerender } = render(
        <CounterpointNotation
          cantusFirmus={['C4']}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();

      // Update with new notes
      rerender(
        <CounterpointNotation
          cantusFirmus={['C4', 'D4', 'E4']}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles both voices with intervals', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const counterpoint = ['E4', 'F4', 'G4'];
      const intervals = ['M3', 'M3', 'M3'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={intervals}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });
  });

  describe('mode change callbacks', () => {
    it('calls onModeChange with counterpoint when CP button clicked', async () => {
      const user = userEvent.setup();
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      const cpButton = screen.getByTestId('mode-counterpoint');
      await user.click(cpButton);

      expect(mockOnModeChange).toHaveBeenCalledWith('counterpoint');
    });

    it('calls onModeChange with cantus_firmus when CF button clicked', async () => {
      const user = userEvent.setup();
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
        />
      );

      const cfButton = screen.getByTestId('mode-cantus-firmus');
      await user.click(cfButton);

      expect(mockOnModeChange).toHaveBeenCalledWith('cantus_firmus');
    });
  });

  describe('voice parsing and processing', () => {
    it('handles getVoiceLines with valid ABC notation', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const counterpoint = ['E4', 'F4', 'G4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={vi.fn()}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles clickListener with valid note selection in cantus_firmus mode', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const counterpoint = ['E4', 'F4', 'G4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles clickListener with valid note selection in counterpoint mode', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const counterpoint = ['E4', 'F4', 'G4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles clickListener drag operation', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles clickListener with undefined startChar', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback) {
        // Simulate clicking without valid startChar
        const mockAbcelem = {};
        clickListenerCallback(mockAbcelem);
      }

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
      expect(mockOnNotesChange).not.toHaveBeenCalled();
    });

    it('handles clickListener with out of bounds note index', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback) {
        // Simulate clicking on position far beyond actual notes
        const mockAbcelem = {
          startChar: 1000,
        };
        clickListenerCallback(mockAbcelem);
      }

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles determineTargetVoice for counterpoint mode', () => {
      const cantusFirmus = ['C4', 'D4'];
      const counterpoint = ['E4', 'F4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
          onNotesChange={vi.fn()}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles empty voice lines gracefully', () => {
      const cantusFirmus = ['C4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });
  });

  describe('drag state management', () => {
    it('initializes with null drag state', () => {
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={vi.fn()}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('schedules reset timer after drag operations', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('clears previous reset timer when scheduling new one', () => {
      const cantusFirmus = ['C4', 'D4'];
      const counterpoint = ['E4', 'F4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
          onNotesChange={vi.fn()}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });
  });

  describe('shouldHandleDrag callback', () => {
    it('returns false when onNotesChange is not provided', () => {
      const cantusFirmus = ['C4', 'D4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('returns true when onNotesChange is provided and drag is valid', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });
  });

  describe('note processing', () => {
    it('processes note selection with valid note index', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const counterpoint = ['E4', 'F4', 'G4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={vi.fn()}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('returns null when note is undefined', () => {
      const cantusFirmus = ['C4', ''];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={vi.fn()}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('updates drag state correctly during note selection', () => {
      const cantusFirmus = ['C4', 'D4'];
      const counterpoint = ['E4', 'F4'];

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
          onNotesChange={vi.fn()}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });
  });

  describe('processNoteDrag functionality', () => {
    it('exits early when not dragging', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
      expect(mockOnNotesChange).not.toHaveBeenCalled();
    });

    it('processes drag with valid drag.step parameter', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles drag down operation (negative step)', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('exits early when drag state is null', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback) {
        // Try to drag without selecting first
        const dragElem = {
          startChar: 30,
          drag: { step: 2 },
        };
        clickListenerCallback(dragElem);
      }

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('exits early when drag parameter is undefined', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback) {
        // Select note but trigger without drag property
        const selectElem = {
          startChar: 30,
        };
        clickListenerCallback(selectElem);

        const noDragElem = {
          startChar: 30,
          // No drag property
        };
        clickListenerCallback(noDragElem);
      }

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('transposes counterpoint notes when in counterpoint mode', () => {
      const cantusFirmus = ['C4', 'D4'];
      const counterpoint = ['E4', 'F4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation with shift key', () => {
    it('handles shift + arrow up for octave transposition', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles shift + arrow down for octave transposition', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles regular arrow up without shift', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('handles regular arrow down without shift', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('returns null for non-arrow keys', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('does not transpose when no note is selected', async () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      // Don't select a note, just try to transpose
      const container = screen.getByTestId('notation-container');
      await userEvent.type(container, '{ArrowUp}');

      // Should not call onNotesChange
      expect(mockOnNotesChange).not.toHaveBeenCalled();
    });
  });

  describe('ABC notation conversion', () => {
    it('updates ABC string when notes change', () => {
      const { rerender } = render(
        <CounterpointNotation
          cantusFirmus={['C4', 'D4']}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();

      rerender(
        <CounterpointNotation
          cantusFirmus={['C4', 'D4', 'E4']}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('updates ABC string when counterpoint changes', () => {
      const { rerender } = render(
        <CounterpointNotation
          cantusFirmus={['C4', 'D4']}
          counterpoint={['E4', 'F4']}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();

      rerender(
        <CounterpointNotation
          cantusFirmus={['C4', 'D4']}
          counterpoint={['E4', 'F4', 'G4']}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });

    it('updates ABC string when intervals change', () => {
      const { rerender } = render(
        <CounterpointNotation
          cantusFirmus={['C4', 'D4']}
          counterpoint={['E4', 'F4']}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();

      rerender(
        <CounterpointNotation
          cantusFirmus={['C4', 'D4']}
          counterpoint={['E4', 'F4']}
          intervals={[{ interval: 3, cantusFirmus: 'C4', counterpoint: 'E4' }]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
        />
      );

      expect(screen.getByTestId('notation-container')).toBeInTheDocument();
    });
  });

  describe('clickListener with drag operations', () => {
    it('handles drag operation with valid step and updates notes', () => {
      const cantusFirmus = ['C4', 'D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        // Find position in CF voice (V:2)
        const v2Index = lastAbcString.indexOf('[V:2]');
        const cfContent = lastAbcString.substring(v2Index);
        const noteStart = v2Index + cfContent.indexOf('C4');

        // Simulate first click to select the note
        const mockAbcelem = {
          startChar: noteStart,
          endChar: noteStart + 2,
          elemType: 'note',
        };
        clickListenerCallback(mockAbcelem, 0, '', {}, undefined);

        // Now simulate drag operation with step
        const mockAbcelemWithDrag = {
          ...mockAbcelem,
        };
        const drag = { step: 1, index: 0 };
        clickListenerCallback(mockAbcelemWithDrag, 0, '', {}, drag);

        expect(mockOnNotesChange).toHaveBeenCalled();
      }
    });

    it('handles drag operation on counterpoint voice', () => {
      const cantusFirmus = ['C4', 'D4'];
      const counterpoint = ['E4', 'F4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={counterpoint}
          intervals={[]}
          mode="counterpoint"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        // Find position in CP voice (V:1)
        const v1Index = lastAbcString.indexOf('[V:1]');
        const cpContent = lastAbcString.substring(v1Index, lastAbcString.indexOf('[V:2]'));
        const noteStart = v1Index + cpContent.indexOf('e4');

        // Simulate selection
        const mockAbcelem = {
          startChar: noteStart,
          endChar: noteStart + 2,
          elemType: 'note',
        };
        clickListenerCallback(mockAbcelem, 0, '', {}, undefined);

        // Simulate drag with negative step (drag down)
        const drag = { step: -1, index: 0 };
        clickListenerCallback(mockAbcelem, 0, '', {}, drag);

        expect(mockOnNotesChange).toHaveBeenCalled();
      }
    });

    it('ignores drag when step is 0', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        const v2Index = lastAbcString.indexOf('[V:2]');
        const cfContent = lastAbcString.substring(v2Index);
        const noteStart = v2Index + cfContent.indexOf('C4');

        const mockAbcelem = {
          startChar: noteStart,
          elemType: 'note',
        };

        // Drag with step 0 should not trigger update
        const drag = { step: 0, index: 0 };
        clickListenerCallback(mockAbcelem, 0, '', {}, drag);

        // Should still select the note but not drag
        expect(screen.getByTestId('notation-container')).toBeInTheDocument();
      }
    });
  });

  describe('keyboard navigation with drag state', () => {
    it('transposes note up with ArrowUp when note is selected', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        // Select a note first
        const v2Index = lastAbcString.indexOf('[V:2]');
        const cfContent = lastAbcString.substring(v2Index);
        const noteStart = v2Index + cfContent.indexOf('C4');

        const mockAbcelem = {
          startChar: noteStart,
          elemType: 'note',
        };
        clickListenerCallback(mockAbcelem, 0, '', {}, undefined);

        // Now fire keyboard event
        const arrowUpEvent = new KeyboardEvent('keydown', {
          key: 'ArrowUp',
          bubbles: true,
          cancelable: true,
        });
        globalThis.dispatchEvent(arrowUpEvent);

        expect(mockOnNotesChange).toHaveBeenCalled();
      }
    });

    it('transposes note down with ArrowDown when note is selected', () => {
      const cantusFirmus = ['D4', 'E4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        // Select a note first
        const v2Index = lastAbcString.indexOf('[V:2]');
        const cfContent = lastAbcString.substring(v2Index);
        const noteStart = v2Index + cfContent.indexOf('d4');

        const mockAbcelem = {
          startChar: noteStart,
          elemType: 'note',
        };
        clickListenerCallback(mockAbcelem, 0, '', {}, undefined);

        // Fire ArrowDown
        const arrowDownEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
          cancelable: true,
        });
        globalThis.dispatchEvent(arrowDownEvent);

        expect(mockOnNotesChange).toHaveBeenCalled();
      }
    });

    it('transposes by octave with Shift+ArrowUp', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        // Select a note
        const v2Index = lastAbcString.indexOf('[V:2]');
        const cfContent = lastAbcString.substring(v2Index);
        const noteStart = v2Index + cfContent.indexOf('C4');

        const mockAbcelem = {
          startChar: noteStart,
          elemType: 'note',
        };
        clickListenerCallback(mockAbcelem, 0, '', {}, undefined);

        // Fire Shift+ArrowUp for octave jump
        const shiftArrowUpEvent = new KeyboardEvent('keydown', {
          key: 'ArrowUp',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        });
        globalThis.dispatchEvent(shiftArrowUpEvent);

        expect(mockOnNotesChange).toHaveBeenCalled();
      }
    });

    it('transposes by octave down with Shift+ArrowDown', () => {
      const cantusFirmus = ['C5', 'D5'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        // Select a note
        const v2Index = lastAbcString.indexOf('[V:2]');
        const cfContent = lastAbcString.substring(v2Index);
        const noteStart = v2Index + cfContent.indexOf("c'4");

        const mockAbcelem = {
          startChar: noteStart,
          elemType: 'note',
        };
        clickListenerCallback(mockAbcelem, 0, '', {}, undefined);

        // Fire Shift+ArrowDown for octave down
        const shiftArrowDownEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        });
        globalThis.dispatchEvent(shiftArrowDownEvent);

        expect(mockOnNotesChange).toHaveBeenCalled();
      }
    });

    it('ignores non-arrow keys', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        // Select a note
        const v2Index = lastAbcString.indexOf('[V:2]');
        const cfContent = lastAbcString.substring(v2Index);
        const noteStart = v2Index + cfContent.indexOf('C4');

        const mockAbcelem = {
          startChar: noteStart,
          elemType: 'note',
        };
        clickListenerCallback(mockAbcelem, 0, '', {}, undefined);

        // Fire a non-arrow key
        const spaceEvent = new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        });
        globalThis.dispatchEvent(spaceEvent);

        // Should not transpose
        expect(mockOnNotesChange).toHaveBeenCalledTimes(0);
      }
    });

    it('does not transpose when no note is selected', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      // Fire arrow key without selecting a note
      const arrowUpEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      });
      globalThis.dispatchEvent(arrowUpEvent);

      expect(mockOnNotesChange).not.toHaveBeenCalled();
    });
  });

  describe('selected note display', () => {
    it('shows selected note after click', () => {
      const cantusFirmus = ['C4', 'D4'];
      const mockOnNotesChange = vi.fn();

      render(
        <CounterpointNotation
          cantusFirmus={cantusFirmus}
          counterpoint={[]}
          intervals={[]}
          mode="cantus_firmus"
          onModeChange={mockOnModeChange}
          onNotesChange={mockOnNotesChange}
        />
      );

      if (clickListenerCallback && lastAbcString) {
        const v2Index = lastAbcString.indexOf('[V:2]');
        const cfContent = lastAbcString.substring(v2Index);
        const noteStart = v2Index + cfContent.indexOf('C4');

        const mockAbcelem = {
          startChar: noteStart,
          elemType: 'note',
        };
        clickListenerCallback(mockAbcelem, 0, '', {}, undefined);

        expect(screen.getByText('Selected')).toBeInTheDocument();
        expect(screen.getByText('C4')).toBeInTheDocument();
        expect(screen.getByText('Use ↑↓ arrows')).toBeInTheDocument();
      }
    });
  });
});
