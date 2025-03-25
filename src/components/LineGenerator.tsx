/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useRef, useState } from 'react';

import { useLineGenerator } from '@/hooks/useLineGenerator';
import { convertToABC } from '@/lib/musicNotation';
import { LineGeneratorRequest, Pattern, Position } from '@/types/lineGenerator';

import { PATTERNS } from './lineGenerator-components/constants';
import { ErrorCard } from './lineGenerator-components/ErrorCard';
import { PatternSelector } from './lineGenerator-components/PatternSelector';
import { PositionSelector } from './lineGenerator-components/PositionSelector';
import { ResultsDisplay } from './lineGenerator-components/ResultsDisplay';
import { ScaleSelector } from './lineGenerator-components/ScaleSelector';
import { ServerErrorCard } from './lineGenerator-components/ServerErrorCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const preloadABCJS = () => import('abcjs');

const positionToNumber = (position: Position): number => {
  const positionMap: Record<Position, number> = {
    Open: 0,
    C: 1,
    A: 2,
    G: 3,
    E: 4,
    D: 5,
    C8: 6,
    A8: 7,
    G8: 8,
    E8: 9,
  };

  return positionMap[position];
};

const LineGenerator: React.FC = () => {
  const [formData, setFormData] = useState<LineGeneratorRequest>({
    from_scale: 'dominant G3',
    to_scale: 'major C4',
    patterns: [],
    position: 'Open',
  });
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[]>(PATTERNS);
  const notationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isLoading, setLocalIsLoading] = useState(false);
  const abcjsRef = useRef<typeof import('abcjs') | null>(null);

  const {
    result,
    error,
    isLoading: apiLoading,
    isServerHealthy,
    generateLines,
    checkServerHealth,
  } = useLineGenerator();

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

  const handleNotationRef = (el: HTMLDivElement | null, index: number, line: string[]) => {
    notationRefs.current[index] = el;

    if (el && abcjsRef.current) {
      try {
        const abcNotation = convertToABC(line);
        abcjsRef.current.renderAbc(el, abcNotation, {
          responsive: 'resize',
          add_classes: true,
          staffwidth: 500,
        });
      } catch {
        // Silently handle rendering errors
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || apiLoading) return;

    notationRefs.current = [];

    setLocalIsLoading(true);

    try {
      const position = formData.position ?? 'Open';
      const positionNumber = positionToNumber(position as Position);

      const apiRequest = {
        from_scale: formData.from_scale,
        to_scale: formData.to_scale,
        patterns: formData.patterns,
        position: positionNumber,
      } as LineGeneratorRequest;

      await generateLines(apiRequest);
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleScaleChange = (field: 'from_scale' | 'to_scale', type: string, note: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: `${type.toLowerCase()} ${note}`,
    }));
  };

  const addPattern = (pattern: Pattern) => {
    setFormData((prev) => ({
      ...prev,
      patterns: [...prev.patterns, pattern],
    }));
    setAvailablePatterns((prev) => prev.filter((p) => p !== pattern));
  };

  const removePattern = (pattern: Pattern) => {
    setFormData((prev) => ({
      ...prev,
      patterns: prev.patterns.filter((p) => p !== pattern),
    }));
    setAvailablePatterns((prev) => [...prev, pattern]);
  };

  const movePatternUp = (index: number) => {
    if (index === 0) return;
    const newPatterns = [...formData.patterns];
    const temp = newPatterns[index] as Pattern;
    newPatterns[index] = newPatterns[index - 1] as Pattern;
    newPatterns[index - 1] = temp;
    setFormData((prev) => ({ ...prev, patterns: newPatterns }));
  };

  const movePatternDown = (index: number) => {
    if (index === formData.patterns.length - 1) return;
    const newPatterns = [...formData.patterns];
    const temp = newPatterns[index] as Pattern;
    newPatterns[index] = newPatterns[index + 1] as Pattern;
    newPatterns[index + 1] = temp;
    setFormData((prev) => ({ ...prev, patterns: newPatterns }));
  };

  const isComponentLoading = isLoading || apiLoading;

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:col-span-2">
          <ServerErrorCard
            isServerHealthy={isServerHealthy}
            onRetry={() => void checkServerHealth()}
          />
          <ErrorCard error={error} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Line Generation input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScaleSelector
                fromScale={formData.from_scale}
                toScale={formData.to_scale}
                onFromScaleChange={(type: string, note: string) => {
                  handleScaleChange('from_scale', type, note);
                }}
                onToScaleChange={(type: string, note: string) => {
                  handleScaleChange('to_scale', type, note);
                }}
                isLoading={isComponentLoading}
              />

              <PositionSelector
                position={(formData.position ?? 'Open') as Position}
                onPositionChange={(position: Position) => {
                  setFormData((prev) => ({ ...prev, position }));
                }}
                isLoading={isComponentLoading}
              />

              <PatternSelector
                selectedPatterns={formData.patterns}
                availablePatterns={availablePatterns}
                onAddPattern={addPattern}
                onRemovePattern={removePattern}
                onMovePatternUp={movePatternUp}
                onMovePatternDown={movePatternDown}
              />

              <div className="mt-6">
                <Button
                  onClick={(e) => void handleSubmit(e)}
                  disabled={
                    formData.patterns.length === 0 ||
                    isComponentLoading ||
                    isServerHealthy === false
                  }
                  className="w-full py-6 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow relative z-[60]"
                >
                  {isComponentLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    'Generate Lines'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <ResultsDisplay result={result} error={error} onNotationRef={handleNotationRef} />
        </div>
      </div>
    </div>
  );
};

export default LineGenerator;
