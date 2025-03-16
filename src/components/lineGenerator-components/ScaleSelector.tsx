import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { NOTES, OCTAVES, SCALE_TYPES } from './constants';

export interface ScaleSelectorProps {
  fromScale: string;
  toScale: string;
  onFromScaleChange: (type: string, note: string) => void;
  onToScaleChange: (type: string, note: string) => void;
  isLoading: boolean;
}

export const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  fromScale,
  toScale,
  onFromScaleChange,
  onToScaleChange,
  isLoading,
}) => {
  const getScaleType = (scale: string): string => {
    const parts = scale.split(' ');
    return (parts[0] ?? SCALE_TYPES[0]) as string;
  };

  const getScaleNote = (scale: string): string => {
    const parts = scale.split(' ');
    return (parts[1] ?? `${NOTES[0]}${OCTAVES[0]}`) as string;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">From Scale</h3>
        <div className="flex gap-2">
          <Select
            value={getScaleNote(fromScale)}
            onValueChange={(value) => onFromScaleChange(getScaleType(fromScale), value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Note" />
            </SelectTrigger>
            <SelectContent>
              {NOTES.map((note) =>
                OCTAVES.map((octave) => (
                  <SelectItem key={`${note}${octave}`} value={`${note}${octave}`}>
                    {note}
                    {octave}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Select
            value={getScaleType(fromScale)}
            onValueChange={(value) => onFromScaleChange(value, getScaleNote(fromScale))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Scale type" />
            </SelectTrigger>
            <SelectContent>
              {SCALE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">To Scale</h3>
        <div className="flex gap-2">
          <Select
            value={getScaleNote(toScale)}
            onValueChange={(value) => onToScaleChange(getScaleType(toScale), value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Note" />
            </SelectTrigger>
            <SelectContent>
              {NOTES.map((note) =>
                OCTAVES.map((octave) => (
                  <SelectItem key={`${note}${octave}`} value={`${note}${octave}`}>
                    {note}
                    {octave}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Select
            value={getScaleType(toScale)}
            onValueChange={(value) => onToScaleChange(value, getScaleNote(toScale))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Scale type" />
            </SelectTrigger>
            <SelectContent>
              {SCALE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
