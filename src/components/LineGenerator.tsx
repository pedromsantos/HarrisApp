import React, { useState, useEffect } from 'react';
import {
  LineGeneratorRequest,
  LineGeneratorResponse,
  Pattern,
  ScaleType,
} from '../types/lineGenerator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';

const API_BASE_URL = 'https://barry-harris-line-generator.pedro-santos-personal.workers.dev';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const OCTAVES = ['3', '4', '5'];
const SCALE_TYPES: ScaleType[] = ['dominant', 'major'];
const PATTERNS: Pattern[] = [
  'half_step_up',
  'chord_up',
  'chord_down',
  'triad_up',
  'triad_down',
  'pivot',
  'scale_down',
  'third_up',
  'third_down',
];

const LineGenerator: React.FC = () => {
  const [formData, setFormData] = useState<LineGeneratorRequest>({
    from_scale: 'dominant G3',
    to_scale: 'major C4',
    patterns: [],
    position: 3,
  });
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[]>(PATTERNS);
  const [result, setResult] = useState<LineGeneratorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerHealthy, setIsServerHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      console.log('Checking server health...');
      const response = await fetch(`${API_BASE_URL}/health`);
      console.log('Health check response:', response.status, response.statusText);
      setIsServerHealthy(response.ok);
    } catch (err) {
      console.error('Health check failed:', err);
      setIsServerHealthy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/lines`);
      console.log('Request data:', formData);

      const response = await fetch(`${API_BASE_URL}/lines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);
      console.log('Tab data:', data.tabs);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lines');
      }

      // Validate the response structure
      if (!data.lines || !Array.isArray(data.lines)) {
        throw new Error('Invalid response format: missing or invalid lines data');
      }

      // If tabs is missing but we have lines, create an empty tabs array
      if (!data.tabs) {
        console.warn('Tab data missing from API response, creating empty tabs array');
        data.tabs = data.lines.map(() => []);
      }

      setResult(data);
    } catch (err) {
      console.error('Generation error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError(
            'Unable to connect to the server. Please check your internet connection and try again. ' +
              'If the problem persists, the service might be temporarily unavailable.'
          );
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleScaleChange = (field: 'from_scale' | 'to_scale', type: string, note: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: `${type} ${note}`,
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

  const getScaleType = (scale: string): string => {
    const parts = scale.split(' ');
    return (parts[0] ?? SCALE_TYPES[0]) as string;
  };

  const getScaleNote = (scale: string): string => {
    const parts = scale.split(' ');
    return (parts[1] ?? `${NOTES[0]}${OCTAVES[0]}`) as string;
  };

  if (isServerHealthy === false) {
    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div
              className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-r"
              role="alert"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400 dark:text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                    Server Unavailable
                  </h3>
                  <p className="mt-2 text-red-700 dark:text-red-300">
                    The line generator service is currently unavailable. Please try again later.
                  </p>
                </div>
              </div>
              <Button onClick={checkServerHealth} className="mt-4 w-full" variant="destructive">
                Retry Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {/* Left Card - Inputs */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Line Generation input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* From Scale and To Scale in a row to save vertical space */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* From Scale Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">From Scale</h3>
                <div className="flex gap-2">
                  <Select
                    value={getScaleNote(formData.from_scale)}
                    onValueChange={(value) =>
                      handleScaleChange('from_scale', getScaleType(formData.from_scale), value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Note" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTES.map((note) =>
                        OCTAVES.map((octave) => (
                          <SelectItem key={`${note}${octave}`} value={`${note}${octave}`}>
                            {note}
                            {octave}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Select
                    value={getScaleType(formData.from_scale)}
                    onValueChange={(value) =>
                      handleScaleChange('from_scale', value, getScaleNote(formData.from_scale))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Scale type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCALE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* To Scale Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">To Scale</h3>
                <div className="flex gap-2">
                  <Select
                    value={getScaleNote(formData.to_scale)}
                    onValueChange={(value) =>
                      handleScaleChange('to_scale', getScaleType(formData.to_scale), value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Note" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTES.map((note) =>
                        OCTAVES.map((octave) => (
                          <SelectItem key={`${note}${octave}`} value={`${note}${octave}`}>
                            {note}
                            {octave}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Select
                    value={getScaleType(formData.to_scale)}
                    onValueChange={(value) =>
                      handleScaleChange('to_scale', value, getScaleNote(formData.to_scale))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Scale type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCALE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Position Section - standalone without Generate button */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Guitar Position (0-12)
              </h3>
              <Input
                type="number"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: parseInt(e.target.value) || 0 }))
                }
                min="0"
                max="12"
                disabled={isLoading}
              />
            </div>

            {/* Patterns Section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Patterns</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Available Patterns */}
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Available Patterns</h4>
                  <div className="bg-background dark:bg-card rounded-lg border border-border p-3 h-auto min-h-[350px]">
                    {availablePatterns.map((pattern) => (
                      <div
                        key={pattern}
                        className="flex items-center justify-between py-1.5 px-3 rounded-md hover:bg-muted cursor-pointer my-1"
                        onClick={() => addPattern(pattern)}
                      >
                        <span className="text-sm">{pattern.replace(/_/g, ' ')}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Patterns */}
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Selected Patterns</h4>
                  <div className="bg-background dark:bg-card rounded-lg border border-border p-3 h-auto min-h-[350px]">
                    {formData.patterns.map((pattern, index) => (
                      <div
                        key={`${pattern}-${index}`}
                        className="flex items-center justify-between py-1.5 px-3 rounded-md hover:bg-muted my-1"
                      >
                        <span className="text-sm">{pattern.replace(/_/g, ' ')}</span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => movePatternUp(index)}
                            disabled={index === 0}
                            className={`text-primary ${
                              index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => movePatternDown(index)}
                            disabled={index === formData.patterns.length - 1}
                            className={`text-primary ${
                              index === formData.patterns.length - 1
                                ? 'opacity-30 cursor-not-allowed'
                                : 'cursor-pointer'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removePattern(pattern)}
                            className="text-destructive cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {formData.patterns.length === 0 && (
                      <div className="text-muted-foreground text-sm italic text-center py-8">
                        No patterns selected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button - Prominently displayed at the bottom */}
            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                disabled={formData.patterns.length === 0 || isLoading}
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

        {/* Right Card - Results */}
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

                      {/* Tab notation */}
                      <div className="p-2 rounded-b bg-muted/30">
                        <pre className="p-0 m-0 font-mono text-sm overflow-x-auto whitespace-pre text-foreground">
                          {result.tabs && result.tabs[index]
                            ? Array.isArray(result.tabs[index])
                              ? result.tabs[index]?.join('\n') || ''
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
                Select your parameters and click "Generate Lines" to create lines based on Barry
                Harris' method.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LineGenerator;
