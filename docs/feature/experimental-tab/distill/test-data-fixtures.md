# Test Data Fixtures: Standards-Based Barry Harris Learning

**Wave**: DISTILL (5 of 6) - Test Data Specification
**Date**: 2026-03-04
**Purpose**: Define test data, fixtures, and mocks for acceptance test implementation

---

## Table of Contents

1. [Jazz Standards Fixtures](#jazz-standards-fixtures)
2. [API Response Fixtures](#api-response-fixtures)
3. [ABC Notation Samples](#abc-notation-samples)
4. [Authentication Tokens](#authentication-tokens)
5. [Performance Baselines](#performance-baselines)
6. [Error Response Fixtures](#error-response-fixtures)
7. [Test Data Management Strategy](#test-data-management-strategy)

---

## Jazz Standards Fixtures

### Source Data

**Location**: `/Users/pedro/src/wes/data/jazz-standards.json`

**Usage**: Backend tests use REAL data file (compiled into WASM via `include_str!`)

**Fixture Strategy**: Frontend tests can mock API responses OR fetch from real backend (depending on test type)

### Fixture Categories

#### Minimal Standard (for fast unit tests)

```json
{
    "id": "test-standard",
    "name": "Test Standard",
    "composer": "Test Composer",
    "key": "C major",
    "chords_original": ["CMaj7", "Dm7", "G7"],
    "chords_improvisation": ["CMaj7", "Dm7", "G7"],
    "form": "AB",
    "tempo": "Medium",
    "difficulty": "beginner",
    "description": "Test description"
}
```

**Use Case**: Unit tests that don't need realistic data

---

#### Autumn Leaves (Primary Test Standard)

```json
{
    "id": "autumn-leaves",
    "name": "Autumn Leaves",
    "composer": "Joseph Kosma",
    "key": "G minor",
    "chords_original": ["Cm7", "F7", "BbMaj7", "EbMaj7", "Am7b5", "D7", "Gm7", "Gm7"],
    "chords_improvisation": ["Cm7", "F7", "BbMaj7", "Am7b5", "D7", "Gm7"],
    "form": "AABA",
    "tempo": "Medium Ballad",
    "difficulty": "beginner",
    "description": "Classic jazz standard, perfect for learning ii-V-I patterns. Simplified version removes EbMaj7 passing chord."
}
```

**Use Case**: Primary test standard for walking skeletons and happy path scenarios

**Why This One**:

- Beginner difficulty (accessible)
- Clear Barry Harris simplification (removes EbMaj7)
- Well-known standard (realistic user choice)
- Medium progression length (6 chords improvisation)

---

#### Blue Bossa (Secondary Test Standard)

```json
{
    "id": "blue-bossa",
    "name": "Blue Bossa",
    "composer": "Kenny Dorham",
    "key": "C minor",
    "chords_original": [
        "Cm7",
        "Fm7",
        "Dm7b5",
        "G7",
        "Cm7",
        "Ebm7",
        "Ab7",
        "DbMaj7",
        "Dm7b5",
        "G7",
        "Cm7",
        "Dm7b5",
        "G7"
    ],
    "chords_improvisation": [
        "Cm7",
        "Fm7",
        "Dm7b5",
        "G7",
        "Cm7",
        "Ebm7",
        "Ab7",
        "DbMaj7",
        "Dm7b5",
        "G7",
        "Cm7",
        "Dm7b5",
        "G7"
    ],
    "form": "AB",
    "tempo": "Medium Bossa",
    "difficulty": "beginner",
    "description": "Popular bossa nova with straightforward harmony, ideal for Barry Harris lines. No simplification needed - progression is already clear."
}
```

**Use Case**: Secondary standard for multi-standard iteration tests

**Why This One**:

- No simplification (tests edge case where chords_original === chords_improvisation)
- Bossa nova (different tempo/feel than Autumn Leaves)
- Longer progression (13 chords)

---

#### Stella By Starlight (Complex Standard)

```json
{
    "id": "stella-by-starlight",
    "name": "Stella By Starlight",
    "composer": "Victor Young",
    "key": "Bb major",
    "form": "AABA",
    "tempo": "Medium Ballad",
    "difficulty": "advanced",
    "chords_original": [
        "Em7b5",
        "A7",
        "Cm7",
        "F7",
        "Fm7",
        "Bb7",
        "EbMaj7",
        "Ab7",
        "BbMaj7",
        "Em7b5",
        "A7",
        "Dm7",
        "Bbm7",
        "Eb7",
        "FMaj7",
        "Em7b5",
        "A7",
        "Am7b5",
        "D7",
        "Gm7",
        "C7",
        "Am7b5",
        "D7",
        "G7",
        "C7",
        "F7",
        "Cm7",
        "F7"
    ],
    "chords_improvisation": [
        "Em7b5",
        "A7",
        "Cm7",
        "F7",
        "Fm7",
        "Bb7",
        "EbMaj7",
        "Ab7",
        "BbMaj7",
        "Em7b5",
        "A7",
        "Dm7",
        "Bbm7",
        "Eb7",
        "FMaj7",
        "Em7b5",
        "A7",
        "Am7b5",
        "D7",
        "Gm7",
        "C7",
        "Am7b5",
        "D7",
        "G7",
        "C7",
        "F7",
        "Cm7",
        "F7"
    ],
    "description": "Complex harmony moving through multiple keys, challenging for line generation No simplification needed - progression is already clear."
}
```

**Use Case**: Advanced difficulty testing, timeout scenario testing (complex progression may take longer)

**Why This One**:

- Advanced difficulty (tests user perception of difficulty)
- Very long progression (28 chords)
- Complex harmony (stress tests line generation algorithm)

---

## API Response Fixtures

### GET /jazz-standards (Success)

```json
[
    {
        "id": "autumn-leaves",
        "name": "Autumn Leaves",
        "composer": "Joseph Kosma",
        "key": "G minor",
        "chords_original": ["Cm7", "F7", "BbMaj7", "EbMaj7", "Am7b5", "D7", "Gm7", "Gm7"],
        "chords_improvisation": ["Cm7", "F7", "BbMaj7", "Am7b5", "D7", "Gm7"],
        "form": "AABA",
        "tempo": "Medium Ballad",
        "difficulty": "beginner",
        "description": "Classic jazz standard, perfect for learning ii-V-I patterns. Simplified version removes EbMaj7 passing chord."
    }
    // ... 14 more standards (use real data from jazz-standards.json)
]
```

**HTTP Status**: 200 OK
**Content-Type**: application/json
**Headers**:

- `CF-Cache-Status: HIT` (after first request)
- `Cache-Control: public, max-age=86400`

---

### GET /jazz-standards/{id} (Success)

```json
{
    "id": "autumn-leaves",
    "name": "Autumn Leaves",
    "composer": "Joseph Kosma",
    "key": "G minor",
    "chords_original": ["Cm7", "F7", "BbMaj7", "EbMaj7", "Am7b5", "D7", "Gm7", "Gm7"],
    "chords_improvisation": ["Cm7", "F7", "BbMaj7", "Am7b5", "D7", "Gm7"],
    "form": "AABA",
    "tempo": "Medium Ballad",
    "difficulty": "beginner",
    "description": "Classic jazz standard, perfect for learning ii-V-I patterns. Simplified version removes EbMaj7 passing chord."
}
```

**HTTP Status**: 200 OK
**Content-Type**: application/json

---

### POST /barry-harris/generate-instructions (Success)

**Request**:

```json
{
    "chords": ["Cm7", "F7", "BbMaj7", "Am7b5", "D7", "Gm7"],
    "caged_shape": "E",
    "guitar_position": "E"
}
```

**Response**:

```json
{
    "transitions": [
        {
            "from_chords": ["Cm7", "F7"],
            "to_chords": ["BbMaj7"],
            "from_scale": "F Dominant",
            "to_scale": "Bb Major",
            "possible_paths": [
                {
                    "instruction": {
                        "discovered_pitches": ["C4", "Eb4", "G4", "Bb4", "A4", "F4", "D4"],
                        "patterns": ["ChordUp", "ScaleDown"],
                        "source_degree": 1,
                        "target_degree": 3,
                        "abc_notation": "C4 Eb4 G4 Bb4 A4 F4 D4",
                        "tab": "e|-----3-----6-----8-----10----|\nB|-----4-----6-----8-----10----|\n..."
                    },
                    "metadata": {
                        "path_length": 7,
                        "pattern_count": 2,
                        "difficulty": "intermediate"
                    }
                }
            ]
        }
        // ... more transitions
    ]
}
```

**HTTP Status**: 200 OK
**Content-Type**: application/json

---

## ABC Notation Samples

### Simple E Shape Line (Autumn Leaves, Cm7 → F7 → BbMaj7)

```abc
X:1
T:Autumn Leaves - E Shape
M:4/4
L:1/4
K:Bb
"Cm7"C E G _B | "F7"A F _E C | "BbMaj7"D F _B d |
```

**Use Case**: Basic ABC rendering test

---

### Complex A Shape Line (Stella By Starlight excerpt)

```abc
X:1
T:Stella By Starlight - A Shape
M:4/4
L:1/8
K:Bb
"Em7b5"E2 G2 _B2 d2 | "A7"c4 A4 | "Cm7"C2 _E2 G2 c2 | "F7"_B4 F4 |
```

**Use Case**: Multi-measure ABC rendering test

---

### Minimal ABC for Unit Tests

```abc
X:1
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

**Use Case**: Fast unit tests for ABC rendering logic

---

## Authentication Tokens

### Valid API Keys

**Production Key** (stored in GitHub Secrets):

```
VITE_API_KEY=<actual-production-key>
```

**Test Keys** (for local development):

```
TEST_API_KEY_VALID=test-key-12345
TEST_API_KEY_VALID_ALT=test-key-67890
```

**Invalid Test Keys**:

```
TEST_API_KEY_INVALID=invalid-key-xxxxx
TEST_API_KEY_EXPIRED=expired-key-12345
```

### Authentication Headers

**Valid Request**:

```typescript
{
  'X-API-Key': 'test-key-12345',
  'Content-Type': 'application/json'
}
```

**Missing API Key**:

```typescript
{
  'Content-Type': 'application/json'
  // Missing X-API-Key
}
```

**Invalid API Key**:

```typescript
{
  'X-API-Key': 'invalid-key-xxxxx',
  'Content-Type': 'application/json'
}
```

---

## Performance Baselines

### Expected Latencies (p95)

```yaml
# Backend API Endpoints
GET /jazz-standards:
    cache_hit: <100ms
    cache_miss: <500ms
    p95_target: <500ms

GET /jazz-standards/{id}:
    cache_hit: <100ms
    cache_miss: <500ms
    p95_target: <500ms

POST /barry-harris/generate-instructions:
    warm_start: <1s
    cold_start: <3s
    p95_target: <3s

# Frontend Metrics
Initial Page Load:
    FCP: <2s
    TTI: <3s
    p95_target: <3s

Standards Library Load:
    Time to interactive: <2s
    p95_target: <2s

Shape Switch:
    API call + render: <3s
    p95_target: <3s

# Complete User Journeys
Frictionless Entry:
    App open to first generation: <30s
    target: <30s

Shape Exploration:
    Per shape switch: <3s
    5 shapes total: <20s
    target: <3s per switch
```

### Test Data for Load Testing

**Request Distribution**:

```yaml
Standards:
    - autumn-leaves: 20%
    - blue-bossa: 15%
    - all-the-things-you-are: 10%
    - solar: 10%
    - summertime: 10%
    - take-the-a-train: 10%
    - cantaloupe-island: 5%
    - stella-by-starlight: 5%
    - afternoon-in-paris: 5%
    - black-orpheus: 5%
    - so-what: 3%
    - there-will-never-be-another-you: 2%

CAGED Shapes:
    - E: 30%
    - A: 25%
    - G: 20%
    - C: 15%
    - D: 10%

# Rationale: Weighted by expected user preferences (E shape most common)
```

---

## Error Response Fixtures

### 401 Unauthorized (Missing API Key)

```json
{
    "error": "Unauthorized",
    "message": "Missing or invalid API key",
    "status": 401
}
```

**HTTP Status**: 401 Unauthorized

---

### 404 Not Found (Invalid Standard ID)

```json
{
    "error": "Not Found",
    "message": "Standard not found",
    "status": 404
}
```

**HTTP Status**: 404 Not Found

---

### 429 Too Many Requests (Rate Limit)

```json
{
    "error": "Too Many Requests",
    "message": "Rate limit exceeded. Please try again in 60 seconds.",
    "status": 429,
    "retry_after": 60
}
```

**HTTP Status**: 429 Too Many Requests
**Headers**:

- `Retry-After: 60`

---

### 500 Internal Server Error

```json
{
    "error": "Internal Server Error",
    "message": "Unable to generate lines. Please try again.",
    "status": 500
}
```

**HTTP Status**: 500 Internal Server Error

---

### Timeout Simulation

**Frontend Timeout Logic**:

```typescript
// Simulate timeout after 5 seconds
const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), 5000)
);

const response = await Promise.race([fetch(url, options), timeoutPromise]);
```

**Test Scenario**: Use this to trigger timeout error handling in frontend tests

---

## Test Data Management Strategy

### Backend Tests (Rust + Vitest + Miniflare)

**Strategy**: Use REAL implementations with REAL data

```typescript
// test/standards-endpoints.e2e.test.ts
import { makeRequest, authHeaders } from './test-utils';

describe('Standards API Endpoints', () => {
    it('should return all 15 standards', async () => {
        const response = await makeRequest('/jazz-standards', {
            method: 'GET',
            headers: authHeaders,
        });

        expect(response.status).toBe(200);
        const standards = await response.json();
        expect(standards).toHaveLength(15);
        expect(standards[0]).toHaveProperty('id');
        expect(standards[0]).toHaveProperty('name');
    });
});
```

**Data Source**: Compiled `jazz-standards.json` via `include_str!` in Rust

**Advantages**:

- Tests real backend implementation
- No mocks needed for domain logic
- Catches data schema issues

---

### Frontend Tests (React + Vitest)

**Strategy**: Mock API responses for fast unit tests, use real API for E2E tests

#### Unit Tests (Mocked)

```typescript
// src/hooks/useStandards.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useStandards } from './useStandards';
import { vi } from 'vitest';

vi.mock('../api/client', () => ({
    fetchStandards: vi
        .fn()
        .mockResolvedValue([{ id: 'autumn-leaves', name: 'Autumn Leaves' /* ... */ }]),
}));

describe('useStandards hook', () => {
    it('should fetch standards on mount', async () => {
        const { result } = renderHook(() => useStandards());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.standards).toHaveLength(1);
        expect(result.current.standards[0].name).toBe('Autumn Leaves');
    });
});
```

**Data Source**: Inline fixture data (minimal)

---

#### E2E Tests (Real API)

```typescript
// test/e2e/standards-library.test.ts
import { test, expect } from '@playwright/test';

test('complete user journey from browse to practice', async ({ page }) => {
    await page.goto('https://harrisjazzlines.com/experimental');

    // Real API calls happen here
    await expect(page.locator('.standard-card')).toHaveCount(15);

    await page.click('text=Autumn Leaves');
    await expect(page).toHaveURL(/autumn-leaves/);

    await page.click('button:has-text("Generate Lines")');
    await expect(page.locator('.abc-notation')).toBeVisible({ timeout: 5000 });
});
```

**Data Source**: Real backend API (production or staging)

---

### Test Data Lifecycle

**Setup**:

1. Backend tests: No setup needed (data compiled into WASM)
2. Frontend unit tests: Mock API client before tests
3. Frontend E2E tests: Ensure backend is running (local or staging)

**Teardown**:

1. Backend tests: No teardown needed (stateless)
2. Frontend unit tests: Clear mocks after each test (`vi.clearAllMocks()`)
3. Frontend E2E tests: No teardown needed (read-only operations)

**Data Consistency**:

- Single source of truth: `/Users/pedro/src/wes/data/jazz-standards.json`
- Frontend mocks should mirror real data structure
- Update mocks when real data changes

---

## Test Data File Locations

```
/Users/pedro/src/wes/
├── data/
│   └── jazz-standards.json                    # Source of truth (15 standards)
├── test/
│   ├── fixtures/
│   │   ├── standards.fixture.ts               # Shared test fixtures
│   │   ├── api-responses.fixture.ts           # Mock API responses
│   │   └── abc-notation.fixture.ts            # ABC notation samples
│   ├── test-utils.ts                          # Helper functions (makeRequest, authHeaders)
│   └── standards-endpoints.e2e.test.ts        # Backend E2E tests

/Users/pedro/src/HarrisApp/
├── test/
│   ├── e2e/
│   │   └── standards-library.test.ts          # Playwright E2E tests
│   └── fixtures/
│       ├── standards.mock.ts                  # Frontend mock data
│       └── api-client.mock.ts                 # Mock API client
└── src/
    └── hooks/
        └── useStandards.test.ts               # Unit tests with mocks
```

---

## Summary

**Key Principles**:

1. Backend tests use REAL data (compiled from `jazz-standards.json`)
2. Frontend unit tests use MOCKS (fast execution)
3. Frontend E2E tests use REAL API (production-like validation)
4. Single source of truth for test data (`jazz-standards.json`)
5. Mocks mirror real data structure
6. Authentication tokens stored in environment variables (never committed)

**Next Steps**:

1. Create `fixtures/` directories in test folders
2. Extract common fixtures into shared files
3. Implement mock API client for frontend unit tests
4. Configure Playwright for E2E tests with real API
5. Document test data updates in CHANGELOG when `jazz-standards.json` changes
