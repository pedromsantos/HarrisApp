/* eslint-disable import/no-relative-parent-imports */
import React, { useCallback } from 'react';

import { Input } from '@/components/ui/input';

export interface PositionSelectorProps {
  position: number;
  onPositionChange: (position: number) => void;
  isLoading: boolean;
}

export const PositionSelector: React.FC<PositionSelectorProps> = ({
  position,
  onPositionChange,
  isLoading,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onPositionChange(parseInt(e.target.value) || 0);
    },
    [onPositionChange]
  );

  return (
    <div data-testid="position-selector">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Guitar Position (0-12)</h3>
      <Input
        type="number"
        value={position}
        onChange={handleChange}
        min="0"
        max="12"
        disabled={isLoading}
        data-testid="position-input"
        aria-label="Guitar Position"
      />
    </div>
  );
};
