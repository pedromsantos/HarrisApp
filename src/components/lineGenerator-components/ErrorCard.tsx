import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ErrorCardProps {
  error: string | null;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error }) => {
  if (error === null || error === '') return null;

  return (
    <Card className="mb-4 border-destructive bg-destructive/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-destructive">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-destructive">{error}</p>
      </CardContent>
    </Card>
  );
};
