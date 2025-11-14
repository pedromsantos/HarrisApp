import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBarryHarrisInstructions } from '@/hooks/useBarryHarrisInstructions';
import {
  BarryLineInstructionDto,
  GuitarPosition,
  PathSelection,
} from '@/types/barryHarrisInstructions';

import ChordInput from './instructionsExplorer-components/ChordInput';
import InstructionsDisplay from './instructionsExplorer-components/InstructionsDisplay';
import MaterializedResults from './instructionsExplorer-components/MaterializedResults';

const GUITAR_POSITIONS: GuitarPosition[] = ['Open', 'C', 'A', 'G', 'E', 'D', 'C8', 'A8', 'G8', 'E8'];

const InstructionsExplorer: React.FC = () => {
  const [chords, setChords] = useState<string[]>(['Dm7', 'G7', 'CMaj7']);
  const [guitarPosition, setGuitarPosition] = useState<GuitarPosition>('E');
  const [selectedPaths, setSelectedPaths] = useState<PathSelection[]>([]);

  const {
    instructions,
    materializedLines,
    error,
    isLoading,
    generateInstructions,
    materializeInstructions,
    clearError,
    clearResults,
  } = useBarryHarrisInstructions();

  const handleGenerateInstructions = async () => {
    clearResults();
    setSelectedPaths([]);

    await generateInstructions({
      chords,
      guitar_position: guitarPosition,
    });
  };

  const handleTogglePathSelection = (
    transitionIndex: number,
    pathId: string,
    instruction: BarryLineInstructionDto
  ) => {
    setSelectedPaths((prev) => {
      const existingIndex = prev.findIndex(
        (s) => s.transitionIndex === transitionIndex && s.pathId === pathId
      );

      if (existingIndex >= 0) {
        // Deselect
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        // Select (replace any existing selection for this transition)
        const filteredPaths = prev.filter((s) => s.transitionIndex !== transitionIndex);
        return [...filteredPaths, { transitionIndex, pathId, instruction }];
      }
    });
  };

  const handleMaterializeSelected = async () => {
    if (selectedPaths.length === 0) return;

    const instructionsToMaterialize = selectedPaths
      .sort((a, b) => a.transitionIndex - b.transitionIndex)
      .map((s) => s.instruction);

    await materializeInstructions({
      instructions: instructionsToMaterialize,
    });
  };

  const isPathSelected = (transitionIndex: number, pathId: string): boolean => {
    return selectedPaths.some(
      (s) => s.transitionIndex === transitionIndex && s.pathId === pathId
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error Display */}
        {error && (
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={clearError}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions Explorer</CardTitle>
            <p className="text-sm text-muted-foreground">
              Generate all possible Barry Harris line paths for your chord progression, then
              explore and select your favorites to materialize.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChordInput chords={chords} onChordsChange={setChords} isLoading={isLoading} />

            {/* Guitar Position Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Guitar Position</label>
              <div className="flex flex-wrap gap-2">
                {GUITAR_POSITIONS.map((position) => (
                  <Button
                    key={position}
                    variant={guitarPosition === position ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGuitarPosition(position)}
                    disabled={isLoading}
                  >
                    {position}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select the fretboard position where you want to play. The API will find the best CAGED shapes for that position.
              </p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateInstructions}
              disabled={isLoading || chords.length < 2}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Instructions...
                </>
              ) : (
                'Generate Instructions'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions Display */}
        {instructions && (
          <>
            <InstructionsDisplay
              instructions={instructions}
              onTogglePathSelection={handleTogglePathSelection}
              isPathSelected={isPathSelected}
            />

            {/* Materialize Button */}
            {selectedPaths.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {selectedPaths.length} path{selectedPaths.length !== 1 ? 's' : ''} selected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Select one path per chord transition, then materialize to see the results
                      </p>
                    </div>
                    <Button
                      onClick={handleMaterializeSelected}
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? 'Materializing...' : 'Materialize Selected Paths'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Materialized Results */}
        {materializedLines && (
          <MaterializedResults materializedLines={materializedLines} />
        )}
      </div>
    </div>
  );
};

export default InstructionsExplorer;
