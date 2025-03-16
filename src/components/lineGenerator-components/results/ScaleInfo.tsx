import React from 'react';

interface ScaleInfoProps {
  fromScale: string;
  toScale: string;
}

export const ScaleInfo: React.FC<ScaleInfoProps> = ({ fromScale, toScale }) => (
  <div className="grid grid-cols-2 gap-2">
    <div className="text-sm text-primary">{fromScale}</div>
    <div className="text-sm text-primary text-right">{toScale}</div>
  </div>
);
