/* eslint-disable react/jsx-no-bind */
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineGeneratorResponse } from '@/types/lineGenerator';

const EmptyState: React.FC = () => (
  <div className="text-center text-muted-foreground py-8">
    Select your parameters and click &quot;Generate Lines&quot; to create lines based on Barry
    Harris&apos; method.
  </div>
);

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
  onNotationRef: (el: HTMLDivElement | null, index: number, line: string[]) => void;
  index: number;
}

const LineNotation: React.FC<LineNotationProps> = ({ line, tabData, onNotationRef, index }) => {
  const renderTabData = () => {
    if (Array.isArray(tabData)) return tabData.join('\n');
    if (typeof tabData === 'string') return tabData;
    return 'Invalid tab format';
  };

  return (
    <div key={`${line.join('-')}-${String(index)}`} className="p-3">
      {/* Pitch notation */}
      <div className="p-2 rounded-t mb-1 bg-primary/10">
        <code className="text-sm block font-medium text-foreground">{line.join(', ')}</code>
      </div>

      <div
        ref={(el) => {
          onNotationRef(el, index, line);
        }}
        data-testid={`notation-container-${String(index)}`}
        className="p-2 mb-1 bg-background rounded overflow-auto"
      ></div>

      <div className="p-2 rounded-b bg-muted/30">
        <pre className="p-0 m-0 font-mono text-sm overflow-x-auto whitespace-pre text-foreground">
          {renderTabData()}
        </pre>
      </div>
    </div>
  );
};

export interface ResultsDisplayProps {
  result: LineGeneratorResponse | null;
  error: string | null;
  onNotationRef: (el: HTMLDivElement | null, index: number, line: string[]) => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, error, onNotationRef }) => (
  <Card className="h-fit">
    <CardHeader>
      <CardTitle>Generated Lines</CardTitle>
    </CardHeader>
    <CardContent>
      {result && (
        <div className="space-y-3">
          <ScaleInfo fromScale={result.from_scale} toScale={result.to_scale} />

          <div className="border rounded-md divide-y divide-border">
            {result.lines.map((line, index) => (
              <LineNotation
                key={line.join('-')}
                line={line}
                tabData={result.tabs[index]}
                onNotationRef={onNotationRef}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {result === null && error === null && <EmptyState />}
    </CardContent>
  </Card>
);
