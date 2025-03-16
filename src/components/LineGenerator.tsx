import React, { useState, useRef, useCallback } from 'react';
import { LineGeneratorRequest, Pattern } from '../types/lineGenerator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { convertToABC } from '../lib/musicNotation';

const preloadABCJS = () => import('abcjs');
let preloadPromise: Promise<typeof import('abcjs')> | null = null;

import { PATTERNS } from './lineGenerator-components/constants';
import { ScaleSelector } from './lineGenerator-components/ScaleSelector';
import { PositionSelector } from './lineGenerator-components/PositionSelector';
import { PatternSelector } from './lineGenerator-components/PatternSelector';
import { ResultsDisplay } from './lineGenerator-components/ResultsDisplay';

import { useLineGenerator } from '../hooks/useLineGenerator';

const LineGenerator: React.FC = () => {
  const [formData, setFormData] = useState<LineGeneratorRequest>({
    from_scale: 'dominant G3',
    to_scale: 'major C4',
    patterns: [],
    position: 3,
  });
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[]>(PATTERNS);
  const notationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isRenderingNotation, setIsRenderingNotation] = useState(false);

  const { result, error, isLoading, isServerHealthy, generateLines } = useLineGenerator();

  const startPreload = useCallback(() => {
    if (!preloadPromise) {
      preloadPromise = preloadABCJS();
    }
  }, []);

  const renderNotation = useCallback(async () => {
    if (result?.lines && !isRenderingNotation) {
      setIsRenderingNotation(true);
      try {
        // Use the preloaded module if available
        const abcjs = await (preloadPromise || preloadABCJS());
        result.lines.forEach((line, index) => {
          if (notationRefs.current && index < notationRefs.current.length) {
            const container = notationRefs.current[index];
            if (container) {
              const abcNotation = convertToABC(line);
              abcjs.renderAbc(container, abcNotation, {
                responsive: 'resize',
                add_classes: true,
                staffwidth: 500,
              });
            }
          }
        });
      } catch (error) {
        console.error('Failed to load notation renderer:', error);
      } finally {
        setIsRenderingNotation(false);
      }
    }
  }, [result, isRenderingNotation]);

  React.useEffect(() => {
    renderNotation();
  }, [renderNotation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startPreload(); // Start preloading when form is submitted
    await generateLines(formData);
  };

  const handleScaleChange = (field: 'from_scale' | 'to_scale', type: string, note: string) => {
    startPreload(); // Start preloading when user changes scales
    setFormData((prev) => ({
      ...prev,
      [field]: `${type} ${note}`,
    }));
  };

  const addPattern = (pattern: Pattern) => {
    startPreload(); // Start preloading when user adds patterns
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

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {/* Left Card - Inputs */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Line Generation input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScaleSelector
              fromScale={formData.from_scale}
              toScale={formData.to_scale}
              onFromScaleChange={(type: string, note: string) =>
                handleScaleChange('from_scale', type, note)
              }
              onToScaleChange={(type: string, note: string) =>
                handleScaleChange('to_scale', type, note)
              }
              isLoading={isLoading}
            />

            <PositionSelector
              position={formData.position || 0}
              onPositionChange={(position: number) =>
                setFormData((prev) => ({ ...prev, position }))
              }
              isLoading={isLoading}
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
                onClick={handleSubmit}
                disabled={formData.patterns.length === 0 || isLoading || isServerHealthy === false}
                className="w-full py-6 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                {isLoading ? (
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

        <ResultsDisplay result={result} error={error} notationRefs={notationRefs} />
      </div>
    </div>
  );
};

export default LineGenerator;
