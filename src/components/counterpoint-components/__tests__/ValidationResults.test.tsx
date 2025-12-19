import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ValidationResults } from '@/components/counterpoint-components/ValidationResults';
import { ValidationResult } from '@/types/counterpoint';

describe('ValidationResults', () => {
  it('renders loading state when validating', () => {
    render(<ValidationResults validation={null} isValidating={true} />);

    expect(screen.getByText(/Validating counterpoint/i)).toBeInTheDocument();
  });

  it('renders empty state when no validation', () => {
    render(<ValidationResults validation={null} isValidating={false} />);

    expect(screen.getByText(/No validation yet/i)).toBeInTheDocument();
  });

  it('renders valid result with no violations', () => {
    const validation: ValidationResult = {
      species: 'first',
      isValid: true,
      errorCount: 0,
      warningCount: 0,
      violations: [],
    };

    render(<ValidationResults validation={validation} isValidating={false} />);

    expect(screen.getByText('✓ Valid')).toBeInTheDocument();
    expect(screen.getByText('Species: first')).toBeInTheDocument();
    expect(screen.getByText(/No violations found/i)).toBeInTheDocument();
  });

  it('renders invalid result with errors', () => {
    const validation: ValidationResult = {
      species: 'first',
      isValid: false,
      errorCount: 2,
      warningCount: 1,
      violations: [
        {
          severity: 'Error',
          rule: 'Parallel Fifths',
          position: 3,
          description: 'Parallel perfect fifths detected',
          suggestion: 'Change the second voice motion',
        },
        {
          severity: 'Error',
          rule: 'Invalid Interval',
          position: 5,
          description: 'Augmented fourth is not allowed',
          suggestion: null,
        },
        {
          severity: 'Warning',
          rule: 'Large Leap',
          position: 2,
          description: 'Large leap should be approached by step',
          suggestion: 'Consider smaller intervals',
        },
      ],
    };

    render(<ValidationResults validation={validation} isValidating={false} />);

    expect(screen.getByText('✗ Invalid')).toBeInTheDocument();
    expect(screen.getByText('Species: first')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Error count
    expect(screen.getByText('1')).toBeInTheDocument(); // Warning count
  });

  it('renders all violations with correct details', () => {
    const validation: ValidationResult = {
      species: 'second',
      isValid: false,
      errorCount: 1,
      warningCount: 0,
      violations: [
        {
          severity: 'Error',
          rule: 'Parallel Octaves',
          position: 4,
          description: 'Parallel perfect octaves detected',
          suggestion: 'Change voice leading',
        },
      ],
    };

    render(<ValidationResults validation={validation} isValidating={false} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Note 5')).toBeInTheDocument(); // position + 1
    expect(screen.getByText('Parallel Octaves')).toBeInTheDocument();
    expect(screen.getByText('Parallel perfect octaves detected')).toBeInTheDocument();
    expect(screen.getByText(/Change voice leading/i)).toBeInTheDocument();
  });

  it('renders violations without position', () => {
    const validation: ValidationResult = {
      species: 'first',
      isValid: false,
      errorCount: 1,
      warningCount: 0,
      violations: [
        {
          severity: 'Error',
          rule: 'Invalid Cadence',
          position: null,
          description: 'Final cadence is not valid',
          suggestion: 'End on unison or octave',
        },
      ],
    };

    render(<ValidationResults validation={validation} isValidating={false} />);

    expect(screen.getByText('Invalid Cadence')).toBeInTheDocument();
    expect(screen.queryByText(/Note/)).not.toBeInTheDocument();
  });

  it('renders violations without suggestion', () => {
    const validation: ValidationResult = {
      species: 'first',
      isValid: false,
      errorCount: 1,
      warningCount: 0,
      violations: [
        {
          severity: 'Error',
          rule: 'Invalid Interval',
          position: 2,
          description: 'Tritone is forbidden',
          suggestion: null,
        },
      ],
    };

    render(<ValidationResults validation={validation} isValidating={false} />);

    expect(screen.getByText('Tritone is forbidden')).toBeInTheDocument();
    expect(screen.queryByText(/💡/)).not.toBeInTheDocument();
  });

  it('renders title', () => {
    render(<ValidationResults validation={null} isValidating={false} />);

    expect(screen.getByText('Validation Results')).toBeInTheDocument();
  });
});
