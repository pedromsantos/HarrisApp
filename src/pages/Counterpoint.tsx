/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';

import { CounterpointNotation } from '@/components/counterpoint-components/CounterpointNotation';
import { PianoInput } from '@/components/counterpoint-components/PianoInput';
import { ValidationResults } from '@/components/counterpoint-components/ValidationResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCounterpoint } from '@/hooks/useCounterpoint';

const Counterpoint: React.FC = () => {
  const {
    state,
    addNote,
    undoNote,
    setMode,
    setOctave,
    clearCurrentLine,
    clearAll,
    validate,
    calculateIntervals,
    isValidating,
    error,
  } = useCounterpoint();

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error Display */}
        {error !== null && error !== '' && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-destructive"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Music Notation with Intervals */}
        <CounterpointNotation
          cantusFirmus={state.cantusFirmus}
          counterpoint={state.counterpoint}
          intervals={state.intervals}
          mode={state.mode}
          onModeChange={setMode}
        />

        {/* Validation Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={calculateIntervals}
                variant="default"
                disabled={
                  state.cantusFirmus.length === 0 || state.counterpoint.length === 0 || isValidating
                }
                data-testid="calculate-intervals-button"
              >
                Calculate Intervals
              </Button>
              <Button
                onClick={validate}
                variant="default"
                disabled={
                  state.cantusFirmus.length === 0 || state.counterpoint.length === 0 || isValidating
                }
                data-testid="validate-button"
              >
                {isValidating ? 'Validating...' : 'Validate Counterpoint'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Validation Results */}
        <ValidationResults validation={state.validation} isValidating={isValidating} />

        {/* Piano Input with Mode Selector */}
        <PianoInput
          onNoteClick={addNote}
          onOctaveChange={setOctave}
          octave={state.octave}
          onUndo={undoNote}
          onClearCurrent={clearCurrentLine}
          onClearAll={clearAll}
          canUndo={
            state.mode === 'cantus_firmus'
              ? state.cantusFirmus.length > 0
              : state.counterpoint.length > 0
          }
          canClearCurrent={
            state.mode === 'cantus_firmus'
              ? state.cantusFirmus.length > 0
              : state.counterpoint.length > 0
          }
          canClearAll={state.cantusFirmus.length > 0 || state.counterpoint.length > 0}
        />
      </div>
    </div>
  );
};

export default Counterpoint;
