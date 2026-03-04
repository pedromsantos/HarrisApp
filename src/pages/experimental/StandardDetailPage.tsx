import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DualProgressionDisplay } from '@/components/experimental/DualProgressionDisplay';
import { LineDisplay } from '@/components/experimental/LineDisplay';
import { ShapeSelector } from '@/components/experimental/ShapeSelector';
import { useBarryHarrisInstructions } from '@/hooks/useBarryHarrisInstructions';
import { useStandardDetail } from '@/hooks/useStandardDetail';
import type { BarryLineInstructionDto, CAGEDShape } from '@/types/barryHarrisInstructions';
import { NotFoundPage } from './NotFoundPage';

export function StandardDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { standard, error: standardError, isLoading: standardLoading, isNotFound } = useStandardDetail(id ?? '');

  const {
    materializedLines,
    error: barryError,
    isLoading: barryLoading,
    isTimedOut: barryTimedOut,
    isRateLimited: barryRateLimited,
    rateLimitSecondsRemaining: barryRateLimitSeconds,
    generateInstructions,
    materializeInstructions,
    retry: barryRetry,
  } = useBarryHarrisInstructions();

  const [selectedShape, setSelectedShape] = useState<CAGEDShape>('E');
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateLines = useCallback(async () => {
    if (!standard) return;

    const result = await generateInstructions({
      chords: standard.chords_improvisation,
      guitar_position: selectedShape,
    });

    if (result) {
      setHasGenerated(true);

      // Automatically materialize the first instruction from the first transition
      const firstTransition = result.transitions[0];
      const firstPath = firstTransition?.possible_paths[0];

      if (firstPath) {
        const instructionsToMaterialize: BarryLineInstructionDto[] = [firstPath.instruction];
        await materializeInstructions({ instructions: instructionsToMaterialize });
      }
    }
  }, [standard, selectedShape, generateInstructions, materializeInstructions]);

  const handleShapeChange = useCallback((newShape: CAGEDShape) => {
    setSelectedShape(newShape);
  }, []);

  // Trigger regeneration when shape changes after initial generation
  useEffect(() => {
    if (hasGenerated && standard) {
      void handleGenerateLines();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShape]);

  if (standardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading standard...</p>
      </div>
    );
  }

  if (isNotFound) {
    return <NotFoundPage />;
  }

  if (standardError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{standardError}</p>
      </div>
    );
  }

  if (!standard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Standard not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back navigation */}
      <div className="mb-6">
        <Link to="/experimental/standards" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2">
          &larr; Back to Library
        </Link>
      </div>

      {/* Standard Title and Info */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{standard.name}</h1>
        <p className="text-gray-600">
          {standard.composer} | Key: {standard.key} | {standard.form} | {standard.tempo}
        </p>
      </div>

      {/* Dual Progression Display */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chord Progressions</h2>
        <DualProgressionDisplay
          originalChords={standard.chords_original}
          improvisationChords={standard.chords_improvisation}
          explanation={standard.description}
        />
      </div>

      {/* Generate Lines Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Generated Lines</h2>
          <button
            onClick={() => void handleGenerateLines()}
            disabled={barryLoading}
            className="rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {barryLoading ? 'Generating...' : 'Generate Lines'}
          </button>
        </div>

        {/* Shape Selector - Only shown after first generation */}
        {hasGenerated && materializedLines && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Select CAGED Shape</h3>
            <ShapeSelector activeShape={selectedShape} onShapeChange={handleShapeChange} isLoading={barryLoading} />
          </div>
        )}

        {/* Rate Limit Message */}
        {barryRateLimited && barryError && (
          <div className="rounded-lg border border-orange-300 bg-orange-50 p-4 mb-6">
            <p className="text-sm text-orange-800 mb-2">{barryError}</p>
            {barryRateLimitSeconds !== null && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-orange-700">Time remaining:</span>
                <span data-testid="rate-limit-countdown" className="text-sm font-semibold text-orange-900">
                  {barryRateLimitSeconds}
                </span>
                <span className="text-sm text-orange-700">seconds</span>
              </div>
            )}
          </div>
        )}

        {/* Timeout Message */}
        {barryTimedOut && barryLoading && !barryRateLimited && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 mb-6">
            <p className="text-sm text-yellow-800 mb-2">Generation is taking longer than expected</p>
            <div className="flex items-center gap-4">
              <div data-testid="loading-indicator" className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800"></div>
                <span className="text-sm text-yellow-700">Still loading...</span>
              </div>
              <button
                onClick={() => void barryRetry()}
                className="rounded-md bg-yellow-600 px-4 py-1.5 text-sm text-white font-medium hover:bg-yellow-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {barryError && !barryRateLimited && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-700">{barryError}</p>
          </div>
        )}

        {/* Materialized Lines Display */}
        {materializedLines && materializedLines.lines.length > 0 && (
          <div className="space-y-6">
            {materializedLines.lines.map((line) => (
              <div key={line.id} className="rounded-lg border border-gray-300 p-6 bg-white">
                <LineDisplay line={line} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
