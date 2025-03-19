/* eslint-disable react/jsx-no-bind */
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

interface ScaleUtils {
  getScaleType: (scale: string) => string;
  getScaleNote: (scale: string) => string;
}

const useScaleUtils = (): ScaleUtils => ({
  getScaleType: (scale: string): string => {
    const parts = scale.split(' ');
    return (parts[0] ?? SCALE_TYPES[0]) as string;
  },
  getScaleNote: (scale: string): string => {
    const parts = scale.split(' ');
    return parts[1] ?? `${NOTES[0]}${OCTAVES[0]}`;
  },
});

interface NoteSelectProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

const NoteSelect: React.FC<NoteSelectProps> = ({ value, onChange, isDisabled = false }) => (
  <Select value={value} onValueChange={onChange} disabled={isDisabled}>
    <SelectTrigger aria-label="Select note">
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
);

interface ScaleTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

const ScaleTypeSelect: React.FC<ScaleTypeSelectProps> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <Select value={value} onValueChange={onChange} disabled={isDisabled}>
    <SelectTrigger aria-label="Select scale">
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
);

interface ScaleConfigProps {
  title: string;
  scale: string;
  onScaleChange: (type: string, note: string) => void;
  isDisabled?: boolean;
}

const ScaleConfig: React.FC<ScaleConfigProps> = ({
  title,
  scale,
  onScaleChange,
  isDisabled = false,
}) => {
  const { getScaleType, getScaleNote } = useScaleUtils();

  return (
    <div data-testid={`${title.toLowerCase().replace(' ', '-')}-section`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="flex gap-2">
        <NoteSelect
          value={getScaleNote(scale)}
          onChange={(value) => onScaleChange(getScaleType(scale), value)}
          isDisabled={isDisabled}
        />
        <ScaleTypeSelect
          value={getScaleType(scale)}
          onChange={(value) => onScaleChange(value, getScaleNote(scale))}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};

export const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  fromScale,
  toScale,
  onFromScaleChange,
  onToScaleChange,
  isLoading,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <ScaleConfig
      title="From Scale"
      scale={fromScale}
      onScaleChange={onFromScaleChange}
      isDisabled={isLoading}
    />
    <ScaleConfig
      title="To Scale"
      scale={toScale}
      onScaleChange={onToScaleChange}
      isDisabled={isLoading}
    />
  </div>
);
