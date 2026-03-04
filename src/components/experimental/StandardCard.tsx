import React, { useCallback } from 'react';

import type { Difficulty, JazzStandard } from '@/types/jazzStandards';

interface StandardCardProps {
  standard: JazzStandard;
  onClick: (id: string) => void;
}

const difficultyColors: Record<Difficulty, { bg: string; text: string }> = {
  beginner: { bg: 'bg-green-100', text: 'text-green-800' },
  intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  advanced: { bg: 'bg-red-100', text: 'text-red-800' },
};

export function StandardCard({ standard, onClick }: StandardCardProps): React.ReactElement {
  const handleClick = useCallback(() => {
    onClick(standard.id);
  }, [onClick, standard.id]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick(standard.id);
      }
    },
    [onClick, standard.id]
  );

  const difficultyStyle = difficultyColors[standard.difficulty];

  return (
    <article
      className="cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-lg"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${standard.name} by ${standard.composer}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{standard.name}</h3>
          <p className="text-sm text-gray-600">{standard.composer}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyStyle.bg} ${difficultyStyle.text}`}>
          {standard.difficulty}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <div>
          <span className="font-medium">Key:</span> {standard.key}
        </div>
        <div>
          <span className="font-medium">Tempo:</span> {standard.tempo}
        </div>
        <div>
          <span className="font-medium">Form:</span> {standard.form}
        </div>
      </div>
    </article>
  );
}
