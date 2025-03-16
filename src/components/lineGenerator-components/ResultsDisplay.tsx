import React from 'react';

import { LineGeneratorResponse } from '../../types/lineGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const EmptyState: React.FC = () => (
  <div className="text-center text-muted-foreground py-8">
    Select your parameters and click "Generate Lines" to create lines based on Barry Harris' method.
  </div>
);

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4" role="alert">
      <p>{error}</p>
    </div>
  );
};

interface ScaleInfoProps {
  fromScale: string;
  toScale: string;
}

const ScaleInfo: React.FC<ScaleInfoProps> = ({ fromScale, toScale }) => (
  <div className="grid grid-cols-2 gap-2">
    <div className="text-sm text-primary">{fromScale}</div>
    <div className="text-sm text-primary text-right">{toScale}</div>
  </div>
);

interface LineNotationProps {
  line: string[];
  tabData: string[] | string | undefined;
  notationRef: (el: HTMLDivElement | null) => void;
  index: number;
}

const LineNotation: React.FC<LineNotationProps> = ({ line, tabData, notationRef, index }) => {
  const renderTabData = () => {
    if (!tabData) return 'No tab data available';
    if (Array.isArray(tabData)) return tabData.join('\n');
    if (typeof tabData === 'string') return tabData;
    return 'Invalid tab format';
  };

  return (
    <div key={index} className="p-3">
      {/* Pitch notation */}
      <div className="p-2 rounded-t mb-1 bg-primary/10">
        <code className="text-sm block font-medium text-foreground">{line.join(', ')}</code>
      </div>

      {/* Music notation */}
      <div ref={notationRef} className="p-2 mb-1 bg-background rounded overflow-auto"></div>

      {/* Tab notation */}
      <div className="p-2 rounded-b bg-muted/30">
        <pre className="p-0 m-0 font-mono text-sm overflow-x-auto whitespace-pre text-foreground">
          {renderTabData()}
        </pre>
      </div>
    </div>
  );
};

// Main ResultsDisplay Component
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
