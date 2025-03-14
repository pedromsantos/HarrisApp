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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lines');
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r" role="alert">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">Server Unavailable</h3>
                  <p className="mt-2 text-red-700">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Left Card - Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Line Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Scale Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">From Scale</h3>
              <div className="flex gap-4">
                <Select
                  value={getScaleType(formData.from_scale)}
                  onValueChange={(value) =>
                    handleScaleChange('from_scale', value, getScaleNote(formData.from_scale))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scale type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCALE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={getScaleNote(formData.from_scale)}
                  onValueChange={(value) =>
                    handleScaleChange('from_scale', getScaleType(formData.from_scale), value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select note" />
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
              </div>
            </div>

            {/* To Scale Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">To Scale</h3>
              <div className="flex gap-4">
                <Select
                  value={getScaleType(formData.to_scale)}
                  onValueChange={(value) =>
                    handleScaleChange('to_scale', value, getScaleNote(formData.to_scale))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scale type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCALE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={getScaleNote(formData.to_scale)}
                  onValueChange={(value) =>
                    handleScaleChange('to_scale', getScaleType(formData.to_scale), value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select note" />
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
              </div>
            </div>

            {/* Patterns Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Patterns</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Available Patterns */}
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Available Patterns</h4>
                  <div className="bg-white rounded-lg border border-gray-200 p-3 h-[200px] overflow-y-auto">
                    {availablePatterns.map((pattern) => (
                      <div
                        key={pattern}
                        className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center hover:border-gray-300 transition-colors"
                      >
                        <span className="text-gray-700 capitalize text-sm">
                          {pattern.split('_').join(' ')}
                        </span>
                        <Button
                          type="button"
                          onClick={() => addPattern(pattern)}
                          disabled={isLoading}
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Patterns */}
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Selected Patterns</h4>
                  <div className="bg-white rounded-lg border border-gray-200 p-3 h-[200px] overflow-y-auto">
                    {formData.patterns.map((pattern, index) => (
                      <div
                        key={pattern}
                        className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center"
                      >
                        <span className="text-gray-700 capitalize text-sm">
                          {pattern.split('_').join(' ')}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            onClick={() => movePatternUp(index)}
                            disabled={index === 0 || isLoading}
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7"
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            onClick={() => movePatternDown(index)}
                            disabled={index === formData.patterns.length - 1 || isLoading}
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7"
                          >
                            ↓
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removePattern(pattern)}
                            variant="destructive"
                            size="sm"
                            disabled={isLoading}
                            className="h-7"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Position Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Position (0-12)</h3>
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

            {/* Generate Button */}
            <Button
              onClick={handleSubmit}
              disabled={formData.patterns.length === 0 || isLoading}
              className="w-full"
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
          </CardContent>
        </Card>

        {/* Right Card - Results */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Lines</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!result && !error && (
              <div className="flex justify-center items-center h-[300px] text-gray-400">
                Generate lines to see the results here
              </div>
            )}

            {result && result.lines && result.tabs && (
              <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                {result.tabs.map((tab, index) => {
                  const line = result.lines[index];
                  return line && line.length > 8 ? (
                    <Card key={index} className="border-gray-200">
                      <CardContent className="p-4">
                        <pre
                          className="font-mono text-sm leading-relaxed tracking-wider overflow-x-auto bg-gray-50 p-3 rounded"
                          style={{
                            fontFamily: "'Courier New', Courier, monospace",
                            letterSpacing: '0.2em',
                          }}
                        >
                          {tab.join('\n')}
                        </pre>
                      </CardContent>
                    </Card>
                  ) : null;
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LineGenerator;
