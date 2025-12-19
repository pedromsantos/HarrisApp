import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CounterpointMode } from '@/types/counterpoint';

export interface ModeSelectorProps {
  mode: CounterpointMode;
  onModeChange: (mode: CounterpointMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onModeChange,
}) => {
  const handleSetCantusFirmus = useCallback(() => {
    onModeChange('cantus_firmus');
  }, [onModeChange]);

  const handleSetCounterpoint = useCallback(() => {
    onModeChange('counterpoint');
  }, [onModeChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Input Mode</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select which line you want to input notes for
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button
            onClick={handleSetCantusFirmus}
            variant={mode === 'cantus_firmus' ? 'default' : 'outline'}
            className="flex-1"
            data-testid="mode-cantus-firmus"
          >
            Cantus Firmus
          </Button>
          <Button
            onClick={handleSetCounterpoint}
            variant={mode === 'counterpoint' ? 'default' : 'outline'}
            className="flex-1"
            data-testid="mode-counterpoint"
          >
            Counterpoint
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
