import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineGeneratorResponse } from '../../types/lineGenerator';
import { ErrorMessage } from './results/ErrorMessage';
import { ScaleInfo } from './results/ScaleInfo';
import { LineNotation } from './results/LineNotation';
import { EmptyState } from './results/EmptyState';

export interface ResultsDisplayProps {
  result: LineGeneratorResponse | null;
  error: string | null;
  notationRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, error, notationRefs }) => (
  <Card className="h-fit">
    <CardHeader>
      <CardTitle>Generated Lines</CardTitle>
    </CardHeader>
    <CardContent>
      {error && <ErrorMessage error={error} />}

      {result && (
        <div className="space-y-3">
          <ScaleInfo fromScale={result.from_scale} toScale={result.to_scale} />

          <div className="border rounded-md divide-y divide-border">
            {result.lines.map((line, index) => (
              <LineNotation
                key={index}
                line={line}
                tabData={result.tabs?.[index]}
                notationRef={(el) => (notationRefs.current[index] = el)}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {!result && !error && <EmptyState />}
    </CardContent>
  </Card>
);
