# Counterpoint Feature Implementation Plan

## Overview

This document outlines the implementation plan for adding a Counterpoint Composer feature to the HarrisApp. The feature will allow users to compose counterpoint exercises by inputting cantus firmus and counterpoint lines using a piano keyboard interface, with real-time ABC notation rendering, interval display, and validation via the existing Rust API.

## Design Goals

1. **Single, clean UI** with parallel staff notation rendering
2. **Unified piano keyboard** for both cantus firmus and counterpoint input
3. **Real-time visual feedback** with ABC.js notation rendering
4. **Interval display** showing harmonic intervals between CF and CP lines
5. **API-based validation** using existing `/api/counterpoint/evaluate` endpoint
6. **In-memory save/load** for exercise management (data lost on page close)
7. **Pre-loaded example** to demonstrate functionality on first load

## UI Design

```txt
┌─────────────────────────────────────────────────────────────────────┐
│  COUNTERPOINT COMPOSER                                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─ Musical Notation ────────────────────────────────────────────┐  │
│  │  Counterpoint: ♩ ♩ ♩ ♩ ♩ ♩ ♩                                  │  │
│  │  Cantus Firmus: 𝅝 𝅝 𝅝 𝅝 𝅝 𝅝 𝅝                                  │  │
│  │  Intervals: M3 M3 M3 M3 M3 M3 P8                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─ Validation Results ───────────────────────────────────────────┐ │
│  │ Species: First (1:1) • Status: ✓ Valid                         │ │
│  │ ✓ No errors found                                              │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─ Piano Input ──────────────────────────────────────────────────┐ │
│  │ [Cantus Firmus] [Counterpoint] ← Mode selector                 │ │
│  │ Piano Keyboard (C3-C6)                                         │ │
│  │ Octave: [< 4 >] [Undo] [Clear Current] [Clear All]             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [Validate] [Save Exercise] [Load Saved] [Export ABC]               │
└─────────────────────────────────────────────────────────────────────┘
```

## Architecture

### File Structure

```txt
src/
├── components/
│   ├── Counterpoint.tsx                    # Main page component
│   └── counterpoint-components/
│       ├── CounterpointNotation.tsx        # ABC.js dual-voice rendering
│       ├── IntervalDisplay.tsx             # Interval labels below staves
│       ├── PianoInput.tsx                  # Wraps react-piano library
│       ├── ValidationResults.tsx           # Error/warning display
│       ├── ModeSelector.tsx                # CF/CP toggle buttons
│       ├── constants.ts                    # Pre-loaded examples
│       └── __tests__/
│           ├── CounterpointNotation.test.tsx
│           ├── IntervalDisplay.test.tsx
│           ├── PianoInput.test.tsx
│           ├── ValidationResults.test.tsx
│           └── ModeSelector.test.tsx
│
├── hooks/
│   └── useCounterpoint.ts                  # State management + API logic
│       └── __tests__/
│           └── useCounterpoint.test.ts
│
├── types/
│   └── counterpoint.ts                     # TypeScript interfaces
│
└── lib/
    └── counterpointNotation.ts             # ABC conversion helpers
        └── __tests__/
            └── counterpointNotation.test.ts
```

### Component Hierarchy

```typescript
<Counterpoint>                              // Main page component
  <Card>
    <CounterpointNotation                   // ABC.js rendering
      cantusFirmus={state.cantusFirmus}
      counterpoint={state.counterpoint}
    />
    <IntervalDisplay                        // Shows harmonic intervals
      cantusFirmus={state.cantusFirmus}
      counterpoint={state.counterpoint}
    />
  </Card>

  <Card>
    <ValidationResults                      // Error/warning display
      validation={state.validation}
    />
  </Card>

  <Card>
    <ModeSelector                           // CF/CP toggle
      mode={state.mode}
      onModeChange={setMode}
    />
    <PianoInput                             // Wraps react-piano
      onNoteClick={addNote}
      onOctaveChange={setOctave}
      octave={state.octave}
    />
    <div className="actions">
      <Button onClick={undoNote}>Undo Last</Button>
      <Button onClick={clearCurrentLine}>Clear Current Line</Button>
      <Button onClick={clearAll}>Clear All</Button>
    </div>
  </Card>

  <div className="action-bar">
    <Button onClick={validate}>Validate Counterpoint</Button>
    <Button onClick={saveExercise}>Save Exercise</Button>
    <Button onClick={loadExercise}>Load Saved</Button>
    <Button onClick={exportABC}>Export ABC</Button>
  </div>
</Counterpoint>
```

## Implementation Details

### 1. TypeScript Types

**File:** `src/types/counterpoint.ts`

```typescript
export type CounterpointMode = 'cantus_firmus' | 'counterpoint';

export interface Violation {
  severity: 'Error' | 'Warning';
  rule: string;
  position: number | null;
  description: string;
  suggestion: string | null;
}

export interface ValidationResult {
  species: string;
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  violations: Violation[];
}

export interface CounterpointState {
  mode: CounterpointMode;
  cantusFirmus: string[]; // e.g., ["C4", "D4", "E4"]
  counterpoint: string[]; // e.g., ["E4", "F4", "G4"]
  intervals: string[]; // e.g., ["M3", "M3", "M3"]
  validation: ValidationResult | null;
  octave: number; // Current piano octave (3-6)
  savedExercises: SavedExercise[];
}

export interface SavedExercise {
  id: string;
  name: string;
  timestamp: number;
  cantusFirmus: string[];
  counterpoint: string[];
  validation?: ValidationResult;
}

export interface EvaluateCounterpointRequest {
  cantus_firmus: string[];
  counterpoint: string[];
}

export interface EvaluateCounterpointResponse {
  species: string;
  is_valid: boolean;
  error_count: number;
  warning_count: number;
  violations: ViolationDto[];
}

export interface ViolationDto {
  severity: string;
  rule: string;
  position: number | null;
  description: string;
  suggestion: string | null;
}
```

### 2. Custom Hook: `useCounterpoint`

**File:** `src/hooks/useCounterpoint.ts`

Manages state and API calls for counterpoint composition.

```typescript
interface UseCounterpointReturn {
  state: CounterpointState;
  addNote: (note: string) => void;
  undoNote: () => void;
  setMode: (mode: CounterpointMode) => void;
  setOctave: (octave: number) => void;
  clearCurrentLine: () => void;
  clearAll: () => void;
  validate: () => Promise<void>;
  saveExercise: (name: string) => void;
  loadExercise: (id: string) => void;
  exportABC: () => void;
  isValidating: boolean;
  error: string | null;
}
```

**API Integration:**

- `POST /api/counterpoint/evaluate` - Validate counterpoint
- `GET /api/pitch/interval?pitch1=C4&pitch2=E4` - Calculate intervals

**Key Functions:**

- `addNote()` - Adds note to current mode (CF or CP)
- `undoNote()` - Removes last note from current line
- `validate()` - Calls API to validate counterpoint
- `calculateIntervals()` - Fetches intervals via API for display

### 3. Piano Component

**Library:** `react-piano` (https://github.com/kevinsqi/react-piano)

**Installation:**

```bash
npm install react-piano
```

**File:** `src/components/counterpoint-components/PianoInput.tsx`

Wraps `react-piano` with custom styling and integration:

- C3-C6 range (4 octaves)
- Octave selector
- Keyboard shortcuts (built-in)
- Dark mode support
- Converts MIDI numbers to pitch strings (e.g., 60 → "C4")

### 4. ABC.js Integration

**File:** `src/lib/counterpointNotation.ts`

Extends existing ABC notation helpers to support dual-voice rendering.

```typescript
export const convertToCounterpointABC = (
  cantusFirmus: string[],
  counterpoint: string[]
): string => {
  const ratio = counterpoint.length / cantusFirmus.length;
  const cpDuration = getDurationFromRatio(ratio);

  return `
X:1
T:Counterpoint Exercise
M:4/4
L:1/4
K:C
V:1 name="CP" clef=treble
V:2 name="CF" clef=treble
[V:1] ${counterpoint.map((n) => noteToABC(n, cpDuration)).join(' ')} |
[V:2] ${cantusFirmus.map((n) => noteToABC(n, '2')).join(' ')} |
`;
};

const getDurationFromRatio = (ratio: number): string => {
  if (ratio >= 3.5 && ratio <= 4.5) return '1/4'; // Third species
  if (ratio >= 1.5 && ratio <= 2.5) return '1/2'; // Second species
  if (ratio >= 0.8 && ratio <= 1.2) return '2'; // First species
  return '1/4'; // Default to quarter notes
};
```

### 5. Interval Display

**File:** `src/components/counterpoint-components/IntervalDisplay.tsx`

Displays harmonic intervals below the notation staff.

- Fetches intervals via API: `GET /api/pitch/interval?pitch1=C4&pitch2=E4`
- Shows short format: M3, P5, m6, P8, etc.
- Aligns with note positions using CSS Grid
- Shows "—" for missing note pairs
- Handles loading and error states

### 6. Validation Results

**File:** `src/components/counterpoint-components/ValidationResults.tsx`

Displays validation feedback with clear visual hierarchy:

**Valid State:**

```
Species: First (1:1) • Status: ✓ Valid
✓ No errors found - excellent work!
```

**Invalid State:**

```
Species: First (1:1) • Status: ✗ 2 Errors, 1 Warning

Errors:
• Position 3: Consecutive octaves
  💡 Try contrary motion instead
• Position 5: Invalid leap (M7) not resolved

Warnings:
• Positions 1-4: Too many consecutive thirds
```

### 7. Pre-loaded Example

**File:** `src/components/counterpoint-components/constants.ts`

```typescript
export const DEFAULT_EXAMPLE = {
  cantusFirmus: ['C4', 'D4', 'E4', 'F4', 'E4', 'D4', 'C4'],
  counterpoint: ['E4', 'F4', 'G4', 'A4', 'G4', 'F4', 'E4'],
};
```

This example loads on first page visit, providing immediate visual demonstration.

### 8. In-Memory Save/Load

Simple in-memory storage using component state:

```typescript
const [savedExercises, setSavedExercises] = useState<SavedExercise[]>([]);

const saveExercise = (name: string) => {
  const exercise: SavedExercise = {
    id: crypto.randomUUID(),
    name,
    timestamp: Date.now(),
    cantusFirmus: state.cantusFirmus,
    counterpoint: state.counterpoint,
    validation: state.validation,
  };
  setSavedExercises([...savedExercises, exercise]);
};

const loadExercise = (id: string) => {
  const exercise = savedExercises.find((e) => e.id === id);
  if (exercise) {
    // Load into state
  }
};
```

Data is lost when page is closed - no persistence required.

### 9. ABC Export

Download counterpoint as ABC notation file:

```typescript
const exportABC = () => {
  const abc = convertToCounterpointABC(state.cantusFirmus, state.counterpoint);
  const blob = new Blob([abc], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'counterpoint-exercise.abc';
  a.click();
  URL.revokeObjectURL(url);
};
```

## Code Style Guidelines

Following existing project patterns:

### Component Structure

```typescript
/* eslint-disable react/jsx-no-bind */
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComponentProps {
  prop1: string;
  onAction: () => void;
}

const Component: React.FC<ComponentProps> = ({ prop1, onAction }) => {
  // Component logic

  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  );
};

export default Component;
```

### Hook Structure

```typescript
import { useCallback, useState } from 'react';

export const useCustomHook = () => {
  const [state, setState] = useState<StateType>(initialState);

  const action = useCallback(() => {
    // Action logic
  }, [dependencies]);

  return {
    state,
    action,
  };
};
```

### Import Order

1. React imports
2. External packages
3. Internal imports using @ aliases
4. Relative imports
5. Type imports

### Path Aliases

Always use path aliases for imports:

- `@/components/*`
- `@/hooks/*`
- `@/lib/*`
- `@/types/*`

## Testing Strategy

### Unit Tests

**File:** `src/hooks/__tests__/useCounterpoint.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useCounterpoint } from '../useCounterpoint';

describe('useCounterpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default example', () => {
    const { result } = renderHook(() => useCounterpoint());
    expect(result.current.state.cantusFirmus.length).toBeGreaterThan(0);
  });

  it('adds note to cantus firmus when in CF mode', () => {
    const { result } = renderHook(() => useCounterpoint());
    act(() => {
      result.current.setMode('cantus_firmus');
      result.current.addNote('C4');
    });
    expect(result.current.state.cantusFirmus).toContain('C4');
  });

  // ... more tests
});
```

### Component Tests

**File:** `src/components/counterpoint-components/__tests__/PianoInput.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PianoInput } from '../PianoInput';

describe('PianoInput', () => {
  const mockOnNoteClick = vi.fn();

  it('renders piano keyboard', () => {
    render(<PianoInput onNoteClick={mockOnNoteClick} octave={4} />);
    expect(screen.getByTestId('piano-keyboard')).toBeInTheDocument();
  });

  it('calls onNoteClick when key is pressed', async () => {
    const user = userEvent.setup();
    render(<PianoInput onNoteClick={mockOnNoteClick} octave={4} />);
    // Test interaction
  });
});
```

### Integration Tests

**File:** `src/components/__tests__/integration/Counterpoint.integration.test.tsx`

Tests full workflow:

1. Load default example
2. Switch to counterpoint mode
3. Add notes via piano
4. Validate counterpoint
5. Display results

### Visual Tests

**File:** `src/components/__tests__/visual/Counterpoint.visual.test.tsx`

Screenshot-based regression testing for:

- Empty state
- With notation rendered
- Validation results display
- Dark mode

### Test Coverage Requirements

Following existing patterns:

- Minimum 80% code coverage
- All user interactions tested
- Error states covered
- Loading states covered
- API call mocking

## Implementation Sequence

### Phase 1: Foundation (Types + API Integration)

1. ✅ Create `src/types/counterpoint.ts`
2. ✅ Install `react-piano` library
3. ✅ Create `src/hooks/useCounterpoint.ts` with basic state management
4. ✅ Add tests for `useCounterpoint` hook

### Phase 2: Core Components

5. ✅ Create `src/lib/counterpointNotation.ts` with ABC helpers
6. ✅ Add tests for ABC conversion
7. ✅ Create `PianoInput` component wrapping react-piano
8. ✅ Add tests for `PianoInput`
9. ✅ Create `ModeSelector` component
10. ✅ Add tests for `ModeSelector`

### Phase 3: Display Components

11. ✅ Create `CounterpointNotation` component with ABC.js
12. ✅ Add tests for `CounterpointNotation`
13. ✅ Create `IntervalDisplay` component with API integration
14. ✅ Add tests for `IntervalDisplay`
15. ✅ Create `ValidationResults` component
16. ✅ Add tests for `ValidationResults`

### Phase 4: Main Page + Integration

17. ✅ Create main `Counterpoint` page component
18. ✅ Add integration tests
19. ✅ Update `src/components/Navigation.tsx` to add Counterpoint link
20. ✅ Update `src/App.tsx` to add Counterpoint route

### Phase 5: Features

21. ✅ Implement in-memory save/load functionality
22. ✅ Add pre-loaded example data
23. ✅ Implement ABC export functionality
24. ✅ Add visual regression tests
25. ✅ Add E2E tests with Playwright

### Phase 6: Polish

26. ✅ Dark mode styling verification
27. ✅ Mobile responsive testing
28. ✅ Accessibility testing
29. ✅ Performance testing
30. ✅ Documentation updates

## API Endpoints Used

### 1. Counterpoint Evaluation

```
POST /api/counterpoint/evaluate
Content-Type: application/json

Request:
{
  "cantus_firmus": ["C4", "D4", "E4", "F4", "E4", "D4", "C4"],
  "counterpoint": ["E4", "F4", "G4", "A4", "G4", "F4", "E4"]
}

Response:
{
  "species": "First",
  "is_valid": true,
  "error_count": 0,
  "warning_count": 0,
  "violations": []
}
```

### 2. Interval Calculation

```
GET /api/pitch/interval?pitch1=C4&pitch2=E4

Response:
{
  "interval": "M3"
}
```

**Note:** Backend proxy already handles all `/api/*` endpoints, no changes needed.

## Accessibility Requirements

- Keyboard navigation support
- ARIA labels for all interactive elements
- Screen reader support for validation results
- Focus management
- Color contrast compliance (WCAG AA)

## Performance Considerations

- Lazy load react-piano library
- Debounce interval API calls (batch requests)
- Memoize ABC notation conversion
- Optimize ABC.js rendering (single call per update)

## Browser Compatibility

Same as existing project:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements (Not in MVP)

1. LocalStorage persistence
2. Audio playback of counterpoint
3. Highlight violations in notation
4. Pre-made cantus firmus library
5. MIDI keyboard input support
6. Real-time validation (debounced)
7. Export to MIDI/MusicXML
8. Share exercises via URL

## Success Criteria

- [ ] Users can input cantus firmus via piano keyboard
- [ ] Users can input counterpoint line via piano keyboard
- [ ] Both lines render in parallel staff notation
- [ ] Intervals display correctly below staves
- [ ] Validation returns comprehensive feedback
- [ ] Users can save/load exercises in memory
- [ ] Export to ABC notation works
- [ ] All tests pass with >80% coverage
- [ ] Feature works in light and dark mode
- [ ] Feature is responsive on mobile devices

## References

- ABC Notation Standard: http://abcnotation.com/
- react-piano Library: https://github.com/kevinsqi/react-piano
- Counterpoint API: `/Users/pedro/src/wes/src/api/counterpoint_handlers.rs`
- OpenAPI Spec: `openapi.yaml` (lines 574-606)
- Project Guidelines: `CLAUDE.md`
