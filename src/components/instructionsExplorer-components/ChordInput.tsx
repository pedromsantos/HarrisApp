/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-deprecated */
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

interface ChordInputProps {
  chords: string[];
  onChordsChange: (chords: string[]) => void;
  isLoading: boolean;
}

const ChordInput: React.FC<ChordInputProps> = ({ chords, onChordsChange, isLoading }) => {
  const [newChord, setNewChord] = useState('');

  const handleAddChord = () => {
    if (newChord.trim()) {
      onChordsChange([...chords, newChord.trim()]);
      setNewChord('');
    }
  };

  const handleRemoveChord = (index: number) => {
    onChordsChange(chords.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddChord();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Chord Progression</label>

      {/* Chord List */}
      <div className="flex flex-wrap gap-2">
        {chords.map((chord, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm"
          >
            <span>{chord}</span>
            <button
              onClick={() => { handleRemoveChord(index); }}
              disabled={isLoading}
              className="hover:text-primary-foreground disabled:opacity-50"
              aria-label={`Remove ${chord}`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add Chord Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newChord}
          onChange={(e) => { setNewChord(e.target.value); }}
          onKeyPress={handleKeyPress}
          placeholder="Enter chord (e.g., Dm7, G7, CMaj7)"
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          onClick={handleAddChord}
          disabled={isLoading || !newChord.trim()}
          size="sm"
        >
          Add Chord
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Need at least 2 chords. Common formats: Dm7, G7, CMaj7, Am7b5, etc.
      </p>
    </div>
  );
};

export default ChordInput;
