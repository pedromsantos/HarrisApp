import React from 'react';

interface DualProgressionDisplayProps {
  originalChords: string[];
  improvisationChords: string[];
  explanation: string;
}

export function DualProgressionDisplay({
  originalChords,
  improvisationChords,
  explanation,
}: DualProgressionDisplayProps): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* Progressions Container - Responsive Layout */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Original Progression */}
        <div className="flex-1">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Original Progression</h3>
          <div className="flex flex-wrap gap-2">
            {originalChords.map((chord, index) => (
              <span
                key={`original-${chord}-${String(index)}`}
                className="rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800"
              >
                {chord}
              </span>
            ))}
          </div>
        </div>

        {/* Improvisation Progression */}
        <div className="flex-1">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Improvisation Progression</h3>
          <div className="flex flex-wrap gap-2">
            {improvisationChords.map((chord, index) => (
              <span
                key={`improvisation-${chord}-${String(index)}`}
                className="rounded bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800"
              >
                {chord}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">{explanation}</p>
      </div>
    </div>
  );
}
