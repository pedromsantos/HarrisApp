import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServerErrorCardProps {
  isServerHealthy: boolean | null;
  onRetry: () => void;
}

export const ServerErrorCard: React.FC<ServerErrorCardProps> = ({ isServerHealthy, onRetry }) => {
  if (isServerHealthy !== false) return null;

  return (
    <Card className="mb-4 border-destructive bg-destructive/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-destructive">Server Unavailable</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-destructive mb-4">
          The line generator service is currently unavailable. Please try again later.
        </p>
        <Button variant="destructive" onClick={onRetry} className="w-full">
          Retry Connection
        </Button>
      </CardContent>
    </Card>
  );
};
