import React, { useCallback } from 'react';

import type { CAGEDShape } from '@/types/jazzStandards';

interface ShapeSelectorProps {
  activeShape: CAGEDShape;
  onShapeChange: (shape: CAGEDShape) => void;
  isLoading: boolean;
}

const ALL_SHAPES: CAGEDShape[] = ['C', 'A', 'G', 'E', 'D'];

export function ShapeSelector({ activeShape, onShapeChange, isLoading }: ShapeSelectorProps): React.ReactElement {
  const handleClick = useCallback(
    (shape: CAGEDShape) => () => {
      if (!isLoading) {
        onShapeChange(shape);
      }
    },
    [isLoading, onShapeChange]
  );

  return (
    <div className="flex gap-2" role="group" aria-label="CAGED shape selector">
      {ALL_SHAPES.map((shape) => {
        const isActive = shape === activeShape;
        return (
          <button
            key={shape}
            type="button"
            onClick={handleClick(shape)}
            disabled={isLoading}
            aria-pressed={isActive}
            className={`rounded-md px-4 py-2 font-semibold transition-colors ${
              isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {shape}
          </button>
        );
      })}
    </div>
  );
}
