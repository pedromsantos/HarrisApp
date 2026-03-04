import React, { useEffect, useRef } from 'react';
import * as abcjs from 'abcjs';

import type { MaterializedLineDto } from '../../types/barryHarrisInstructions';
import { pitchesToAbc } from '../../utils/abcConverter';

interface LineDisplayProps {
  line: MaterializedLineDto;
}

export function LineDisplay({ line }: LineDisplayProps): React.ReactElement {
  const abcContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abcContainerRef.current) {
      return;
    }

    // Convert pitches to ABC notation
    const abcNotation = pitchesToAbc(line.pitches);

    // Render ABC notation
    abcjs.renderAbc(abcContainerRef.current, abcNotation, {
      responsive: 'resize',
      add_classes: true,
      staffwidth: 600,
    });
  }, [line.pitches]);

  return (
    <div className="w-full space-y-4">
      {/* ABC Notation Container */}
      <div
        ref={abcContainerRef}
        data-testid="abc-notation-container"
        className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white p-4"
      />

      {/* Tablature Section */}
      <div data-testid="tablature-section" className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Guitar Tablature</h3>
          <span className="text-sm text-gray-600">
            Position: <span className="font-medium text-gray-800">{line.guitar_line.position}</span>
          </span>
        </div>

        {/* Tab Display */}
        {line.guitar_line.tab.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto">
            {line.guitar_line.tab.map((fret, index) => (
              <div key={`fret-${String(index)}`} className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Note {index + 1}</span>
                <span className="mt-1 rounded bg-blue-100 px-3 py-1.5 font-mono text-sm font-medium text-blue-800">
                  {fret}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-gray-500">No tablature available</p>
        )}
      </div>
    </div>
  );
}
