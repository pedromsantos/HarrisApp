import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineGeneratorResponse } from '../../types/lineGenerator';

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
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-primary">{result.from_scale}</div>
            <div className="text-sm text-primary text-right">{result.to_scale}</div>
          </div>

          <div className="border rounded-md divide-y divide-border">
            {result.lines.map((line, index) => (
              <div key={index} className="p-3">
                {/* Pitch notation */}
                <div className="p-2 rounded-t mb-1 bg-primary/10">
                  <code className="text-sm block font-medium text-foreground">
                    {line.join(', ')}
                  </code>
                </div>

                {/* Music notation */}
                <div
                  ref={(el) => (notationRefs.current[index] = el)}
                  className="p-2 mb-1 bg-background rounded overflow-auto"
                ></div>

                {/* Tab notation */}
                <div className="p-2 rounded-b bg-muted/30">
                  <pre className="p-0 m-0 font-mono text-sm overflow-x-auto whitespace-pre text-foreground">
                    {result.tabs && result.tabs[index]
                      ? Array.isArray(result.tabs[index])
                        ? (result.tabs[index] as string[]).join('\n') || ''
                        : typeof result.tabs[index] === 'string'
                          ? String(result.tabs[index] || '')
                          : 'Invalid tab format'
                      : 'No tab data available'}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !error && (
        <div className="text-center text-muted-foreground py-8">
          Select your parameters and click "Generate Lines" to create lines based on Barry Harris'
          method.
        </div>
      )}
    </CardContent>
  </Card>
);
