import React, { useCallback } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Position } from '@/types/lineGenerator';

export interface PositionSelectorProps {
  position: Position;
  onPositionChange: (position: Position) => void;
  isLoading: boolean;
}

export const PositionSelector: React.FC<PositionSelectorProps> = ({
  position,
  onPositionChange,
  isLoading,
}) => {
  const positions: Position[] = ['Open', 'C', 'A', 'G', 'E', 'D', 'C8', 'A8', 'G8', 'E8'];

  const handleChange = useCallback(
    (value: string) => {
      onPositionChange(value as Position);
    },
    [onPositionChange]
  );

  return (
    <div data-testid="position-selector">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Guitar Position</h3>
      <Select
        value={position}
        onValueChange={handleChange}
        disabled={isLoading}
        data-testid="position-select"
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select position" />
        </SelectTrigger>
        <SelectContent>
          {positions.map((pos) => (
            <SelectItem key={pos} value={pos}>
              {pos}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
