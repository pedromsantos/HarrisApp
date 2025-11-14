import React, { useEffect, useRef } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convertToABC } from '@/lib/musicNotation';
import { MaterializedLinesResponse } from '@/types/barryHarrisInstructions';

const preloadABCJS = () => import('abcjs');

interface MaterializedResultsProps {
  materializedLines: MaterializedLinesResponse;
}

const MaterializedResults: React.FC<MaterializedResultsProps> = ({ materializedLines }) => {
  const notationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const abcjsRef = useRef<typeof import('abcjs') | null>(null);

  useEffect(() => {
    const loadAbcjs = async () => {
      try {
        const abcjs = await preloadABCJS();
        abcjsRef.current = abcjs;
      } catch {
        // Silently handle abcjs loading errors
      }
    };

    void loadAbcjs();
  }, []);

  useEffect(() => {
    if (abcjsRef.current && materializedLines) {
      const abcjs = abcjsRef.current;
      materializedLines.lines.forEach((line, index) => {
        const el = notationRefs.current[index];
        if (el) {
          try {
            const abcNotation = convertToABC(line.pitches);
            abcjs.renderAbc(el, abcNotation, {
              responsive: 'resize',
              add_classes: true,
              staffwidth: 500,
            });
          } catch {
            // Silently handle rendering errors
          }
        }
      });
    }
  }, [materializedLines]);

  const handleNotationRef = (el: HTMLDivElement | null, index: number) => {
    notationRefs.current[index] = el;
  };

  const renderTabData = (tab: string[]) => {
    return tab.join('\n');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Materialized Lines</CardTitle>
        <p className="text-sm text-muted-foreground">
          {materializedLines.lines.length} line(s) generated from your selected paths
        </p>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md divide-y divide-border">
          {materializedLines.lines.map((line, index) => (
            <div key={line.id} className="p-3">
              {/* Line metadata */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Line {index + 1}
                </span>
                <span className="text-xs text-muted-foreground">
                  Position: {line.guitar_line.position}
                </span>
              </div>

              {/* Pitch notation */}
              <div className="p-2 rounded-t mb-1 bg-primary/10">
                <code className="text-sm block font-medium text-foreground">
                  {line.pitches.join(', ')}
                </code>
              </div>

              {/* ABC notation rendering */}
              <div
                ref={(el) => handleNotationRef(el, index)}
                data-testid={`notation-container-${String(index)}`}
                className="p-2 mb-1 bg-background rounded overflow-auto"
              />

              {/* Guitar tab */}
              <div className="p-2 rounded-b bg-muted/30">
                <pre className="p-0 m-0 font-mono text-sm overflow-x-auto whitespace-pre text-foreground">
                  {renderTabData(line.guitar_line.tab)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterializedResults;
