import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScaleSelector } from '../ScaleSelector';
import { NOTES, OCTAVES, SCALE_TYPES } from '../constants';

describe('ScaleSelector', () => {
  const mockProps = {
    fromScale: 'major C4',
    toScale: 'dominant G4',
    onFromScaleChange: vi.fn(),
    onToScaleChange: vi.fn(),
    isLoading: false,
  };

  it('renders with initial scale values', () => {
    render(<ScaleSelector {...mockProps} />);

    expect(screen.getByText('From Scale')).toBeInTheDocument();
    expect(screen.getAllByText('C4')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Major')[0]).toBeInTheDocument();

    expect(screen.getByText('To Scale')).toBeInTheDocument();
    expect(screen.getAllByText('G4')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Dominant')[0]).toBeInTheDocument();
  });

  it('calls onFromScaleChange when from scale note changes', () => {
    render(<ScaleSelector {...mockProps} />);
    const fromNoteSelect = screen.getAllByRole('combobox')[0];
    fromNoteSelect && fireEvent.change(fromNoteSelect, { target: { value: 'D4' } });
    expect(mockProps.onFromScaleChange).toHaveBeenCalledWith('major', 'D4');
  });

  it('calls onToScaleChange when to scale type changes', () => {
    render(<ScaleSelector {...mockProps} />);
    const toTypeSelect = screen.getAllByRole('combobox')[3];
    toTypeSelect && fireEvent.change(toTypeSelect, { target: { value: 'major' } });
    expect(mockProps.onToScaleChange).toHaveBeenCalledWith('major', 'G4');
  });

  it('disables all selects when isLoading is true', () => {
    render(<ScaleSelector {...mockProps} isLoading={true} />);
    const selects = screen.getAllByRole('combobox');
    selects.forEach((select) => {
      expect(select).toBeDisabled();
    });
  });

  it('renders all available notes and octaves', () => {
    render(<ScaleSelector {...mockProps} />);
    const noteSelect = screen.getAllByRole('combobox')[0];
    noteSelect && fireEvent.click(noteSelect);

    NOTES.forEach((note) => {
      OCTAVES.forEach((octave) => {
        expect(screen.getByText(`${note}${octave}`)).toBeInTheDocument();
      });
    });
  });

  it('renders all available scale types', () => {
    render(<ScaleSelector {...mockProps} />);
    const typeSelect = screen.getAllByRole('combobox')[1];
    typeSelect && fireEvent.click(typeSelect);

    SCALE_TYPES.forEach((type) => {
      expect(screen.getByText(type.charAt(0).toUpperCase() + type.slice(1))).toBeInTheDocument();
    });
  });

  it('maintains separate state for from and to scales', () => {
    render(<ScaleSelector {...mockProps} />);

    const fromNoteSelect = screen.getAllByRole('combobox')[0];
    fromNoteSelect && fireEvent.change(fromNoteSelect, { target: { value: 'D4' } });

    expect(screen.getAllByText('G4')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Dominant')[0]).toBeInTheDocument();
  });
});
