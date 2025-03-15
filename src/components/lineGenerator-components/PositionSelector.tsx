import React from 'react';
import { Input } from '../ui/input';

export interface PositionSelectorProps {
  position: number;
  onPositionChange: (position: number) => void;
  isLoading: boolean;
}

export const PositionSelector: React.FC<PositionSelectorProps> = ({
  position,
  onPositionChange,
  isLoading,
}) => (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-2">Guitar Position (0-12)</h3>
    <Input
      type="number"
      value={position}
      onChange={(e) => onPositionChange(parseInt(e.target.value) || 0)}
      min="0"
      max="12"
      disabled={isLoading}
    />
  </div>
);
