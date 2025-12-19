/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/no-array-index-key */
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValidationResult, Violation } from '@/types/counterpoint';

export interface ValidationResultsProps {
  validation: ValidationResult | null;
  isValidating: boolean;
}

const ViolationItem: React.FC<{ violation: Violation; index: number }> = ({
  violation,
  index,
}) => {
  const isError = violation.severity === 'Error';
  const bgColor = isError ? 'bg-destructive/10' : 'bg-yellow-500/10';
  const borderColor = isError ? 'border-destructive/30' : 'border-yellow-500/30';
  const textColor = isError ? 'text-destructive' : 'text-yellow-700 dark:text-yellow-500';

  return (
    <div
      className={`p-3 rounded-md border ${bgColor} ${borderColor}`}
      data-testid={`violation-${String(index)}`}
    >
      <div className="flex items-start gap-2">
        <span className={`text-xs font-semibold ${textColor}`}>{violation.severity}</span>
        {violation.position !== null && (
          <span className="text-xs text-muted-foreground">Note {violation.position + 1}</span>
        )}
      </div>
      <p className="text-sm font-medium mt-1">{violation.rule}</p>
      <p className="text-sm text-muted-foreground mt-1">{violation.description}</p>
      {violation.suggestion !== null && violation.suggestion !== '' && (
        <p className="text-xs text-muted-foreground mt-2 italic">💡 {violation.suggestion}</p>
      )}
    </div>
  );
};

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  validation,
  isValidating,
}) => {
  if (isValidating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-3">
              <svg
                className="animate-spin h-5 w-5 text-primary"
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
              <span className="text-sm text-muted-foreground">Validating counterpoint...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (validation === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">
              No validation yet. Add notes to both lines and click &quot;Validate
              Counterpoint&quot;.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Validation Results</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Species: {validation.species}</span>
          <span
            className={validation.isValid ? 'text-green-600 dark:text-green-500' : 'text-destructive'}
          >
            {validation.isValid ? '✓ Valid' : '✗ Invalid'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="flex gap-4 mb-4 p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Errors:</span>
            <span
              className={`text-sm font-semibold ${validation.errorCount > 0 ? 'text-destructive' : 'text-green-600 dark:text-green-500'}`}
            >
              {validation.errorCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Warnings:</span>
            <span
              className={`text-sm font-semibold ${validation.warningCount > 0 ? 'text-yellow-700 dark:text-yellow-500' : 'text-green-600 dark:text-green-500'}`}
            >
              {validation.warningCount}
            </span>
          </div>
        </div>

        {/* Violations */}
        {validation.violations.length > 0 ? (
          <div className="space-y-2">
            {validation.violations.map((violation, index) => (
              <ViolationItem key={index} violation={violation} index={index} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center bg-green-500/10 border border-green-500/30 rounded-md">
            <p className="text-sm text-green-600 dark:text-green-500 font-medium">
              ✓ No violations found! Your counterpoint is valid.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
