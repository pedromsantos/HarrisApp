# Test Implementation Plan: Standards-Based Barry Harris Learning

**Wave**: DISTILL (5 of 6) - Implementation Guidance for DELIVER Wave
**Date**: 2026-03-04
**Purpose**: Provide software-crafter with concrete plan for implementing acceptance tests

---

## Table of Contents

1. [Test Framework Setup](#test-framework-setup)
2. [Test File Structure](#test-file-structure)
3. [Mocking Strategy](#mocking-strategy)
4. [CI/CD Integration](#cicd-integration)
5. [Implementation Sequence](#implementation-sequence)
6. [Step Definition Examples](#step-definition-examples)
7. [Test Execution Commands](#test-execution-commands)
8. [Troubleshooting Guide](#troubleshooting-guide)

---

## Test Framework Setup

### Backend Tests (Wes API)

**Framework**: Vitest + Miniflare (existing)

**Location**: `/Users/pedro/src/wes/test/`

**Dependencies** (already installed):

```json
{
    "devDependencies": {
        "vitest": "^2.1.8",
        "miniflare": "^3.20241106.2",
        "@cloudflare/workers-types": "^4.20250110.0"
    }
}
```

**Setup Status**: ✅ Already configured (no changes needed)

**Test Utilities** (existing):

- `test/test-utils.ts` - `makeRequest`, `authHeaders`, `TEST_API_KEY`
- `vitest.config.ts` - Vitest configuration

---

### Frontend E2E Tests (HarrisApp)

**Framework**: Playwright (NEW - needs installation)

**Location**: `/Users/pedro/src/HarrisApp/test/e2e/`

**Installation**:

```bash
cd /Users/pedro/src/HarrisApp
npm install -D @playwright/test@latest
npx playwright install chromium
```

**Configuration**: Create `playwright.config.ts`

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './test/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:5173',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
    },
});
```

**Why Playwright**:

- ✅ Official recommendation for React testing (React docs)
- ✅ Built-in test runner (no Jest dependency)
- ✅ Automatic waiting and retry logic
- ✅ Screenshot and trace capture on failure
- ✅ Multi-browser support (Chromium, Firefox, WebKit)

---

### Frontend Unit Tests (React Components)

**Framework**: Vitest + React Testing Library (existing)

**Location**: `/Users/pedro/src/HarrisApp/src/`

**Dependencies** (already installed):

```json
{
    "devDependencies": {
        "vitest": "latest",
        "@testing-library/react": "latest",
        "@testing-library/user-event": "latest"
    }
}
```

**Setup Status**: ✅ Already configured (existing tests use this stack)

---

## Test File Structure

### Backend Test Organization

```
/Users/pedro/src/wes/
├── test/
│   ├── fixtures/
│   │   ├── standards.fixture.ts          # Standard data fixtures
│   │   ├── api-responses.fixture.ts      # Mock API response shapes
│   │   └── abc-notation.fixture.ts       # ABC notation samples
│   │
│   ├── standards-endpoints.e2e.test.ts   # NEW: GET /jazz-standards, GET /jazz-standards/{id}
│   ├── line-generation.e2e.test.ts       # EXISTING: Reused for POST /barry-harris/...
│   │
│   ├── test-utils.ts                     # EXISTING: Shared utilities
│   └── vitest.config.ts                  # EXISTING: Configuration
```

---

### Frontend Test Organization

```
/Users/pedro/src/HarrisApp/
├── test/
│   ├── e2e/
│   │   ├── standards-library/
│   │   │   ├── complete-user-journey.test.ts      # Walking skeleton 1
│   │   │   ├── returning-user-url.test.ts         # Walking skeleton 2
│   │   │   ├── shape-exploration.test.ts          # Shape exploration flow
│   │   │   ├── api-timeout-recovery.test.ts       # Error flow 1
│   │   │   ├── rate-limit-handling.test.ts        # Error flow 2
│   │   │   ├── library-load-failure.test.ts       # Error flow 3
│   │   │   └── fixtures.ts                        # Shared E2E fixtures
│   │   │
│   │   └── performance/
│   │       ├── frictionless-entry.test.ts         # CSF 1 benchmark
│   │       ├── fast-generation.test.ts            # CSF 2 benchmark
│   │       └── shape-switch-latency.test.ts       # CSF 5 benchmark
│   │
│   └── fixtures/
│       ├── standards.mock.ts                      # Frontend mock data
│       └── api-client.mock.ts                     # Mock API client
│
├── src/
│   ├── hooks/
│   │   ├── useStandards.ts
│   │   ├── useStandards.test.ts                   # Unit test (mocked)
│   │   ├── useStandardDetail.ts
│   │   └── useStandardDetail.test.ts              # Unit test (mocked)
│   │
│   └── components/
│       └── experimental/
│           ├── StandardCard.tsx
│           ├── StandardCard.test.tsx              # Component test (mocked)
│           ├── ShapeSelector.tsx
│           └── ShapeSelector.test.tsx             # Component test (mocked)
```

---

## Mocking Strategy

### Backend: NO MOCKS (Use Real Implementations)

**Philosophy**: London School TDD with real domain objects

**What to Use**:

- ✅ Real `JazzStandardsService`
- ✅ Real `JazzStandardsRepository` (with compiled `jazz-standards.json`)
- ✅ Real `BarryLineGenerator` (existing)
- ✅ Real Rust domain objects

**What to Mock**:

- ❌ Nothing in backend tests (use real implementations)

**Example**:

```typescript
// test/standards-endpoints.e2e.test.ts
import { makeRequest, authHeaders } from './test-utils';

describe('Standards API Endpoints', () => {
    it('should return all 15 standards', async () => {
        // NO MOCKS - hits real backend via Miniflare
        const response = await makeRequest('/jazz-standards', {
            method: 'GET',
            headers: authHeaders,
        });

        expect(response.status).toBe(200);
        const standards = await response.json();
        expect(standards).toHaveLength(15);
    });
});
```

---

### Frontend Unit Tests: MOCK API CLIENT

**Philosophy**: Fast unit tests with isolated components

**What to Mock**:

- ✅ API client (`fetchStandards`, `fetchStandardById`, `generateLines`)
- ✅ Router navigation (`useNavigate`, `useParams`)
- ✅ External libraries (abcjs rendering - test integration separately)

**What NOT to Mock**:

- ❌ React hooks (use real `useState`, `useEffect`)
- ❌ Domain logic (if any in frontend)
- ❌ Component structure

**Mock API Client Example**:

```typescript
// test/fixtures/api-client.mock.ts
import { vi } from 'vitest';

export const mockFetchStandards = vi.fn().mockResolvedValue([
    {
        id: 'autumn-leaves',
        name: 'Autumn Leaves',
        composer: 'Joseph Kosma',
        key: 'G minor',
        chords_original: ['Cm7', 'F7', 'BbMaj7', 'EbMaj7', 'Am7b5', 'D7', 'Gm7'],
        chords_improvisation: ['Cm7', 'F7', 'BbMaj7', 'Am7b5', 'D7', 'Gm7'],
        form: 'AABA',
        tempo: 'Medium Ballad',
        difficulty: 'beginner',
        description: 'Classic jazz standard...',
    },
]);

export const mockFetchStandardById = vi.fn((id: string) => {
    const standards = mockFetchStandards.mock.results[0]?.value || [];
    return Promise.resolve(standards.find((s: any) => s.id === id));
});

export const mockGenerateLines = vi.fn().mockResolvedValue({
    transitions: [
        {
            from_chords: ['Cm7', 'F7'],
            to_chords: ['BbMaj7'],
            possible_paths: [
                {
                    instruction: {
                        discovered_pitches: ['C4', 'Eb4', 'G4', 'Bb4', 'A4', 'F4', 'D4'],
                        patterns: ['ChordUp', 'ScaleDown'],
                        abc_notation: 'C4 Eb4 G4 Bb4 A4 F4 D4',
                        tab: 'e|-----3-----6-----8-----|\n...',
                    },
                },
            ],
        },
    ],
});
```

**Usage in Hook Test**:

```typescript
// src/hooks/useStandards.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useStandards } from './useStandards';
import { vi } from 'vitest';
import { mockFetchStandards } from '../../test/fixtures/api-client.mock';

vi.mock('../api/client', () => ({
    fetchStandards: mockFetchStandards,
}));

describe('useStandards hook', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch standards on mount', async () => {
        const { result } = renderHook(() => useStandards());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(mockFetchStandards).toHaveBeenCalledTimes(1);
        expect(result.current.standards).toHaveLength(1);
        expect(result.current.standards[0].name).toBe('Autumn Leaves');
    });

    it('should handle error gracefully', async () => {
        mockFetchStandards.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useStandards());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeTruthy();
        expect(result.current.error?.message).toBe('Network error');
    });
});
```

---

### Frontend E2E Tests: REAL API (No Mocks)

**Philosophy**: Validate complete system integration

**What to Use**:

- ✅ Real backend API (local dev server or staging)
- ✅ Real frontend React app
- ✅ Real browser (Chromium via Playwright)
- ✅ Real network requests

**What NOT to Mock**:

- ❌ API calls
- ❌ Browser behavior
- ❌ Network conditions (use Playwright network throttling instead)

**Example**:

```typescript
// test/e2e/standards-library/complete-user-journey.test.ts
import { test, expect } from '@playwright/test';

test.describe('Walking Skeleton: Complete First-Time User Journey', () => {
  test('user completes journey from discovery to guitar practice', async ({ page }) => {
    // Navigate to app (REAL frontend)
    await page.goto('/');

    // Click Experimental tab
    await page.click('text=Experimental');
    await expect(page).toHaveURL(/\/experimental/);

    // Wait for standards to load (REAL API call)
    await expect(page.locator('.standard-card')).toHaveCount(15, { timeout: 5000 });

    // Click Autumn Leaves
    await page.click('text=Autumn Leaves');
    await expect(page).toHaveURL(/\/experimental\/standards\/autumn-leaves/);

    // Verify dual progressions visible
    await expect(page.locator('text=Original Progression')).toBeVisible();
    await expect(page.locator('text=Improvisation Progression')).toBeVisible();

    // Click Generate Lines (REAL API call)
    await page.click('button:has-text("Generate Lines")');

    // Wait for lines to render
    await expect(page.locator('.abc-notation')).toBeVisible({ timeout: 5000 });

    // Verify shape selector visible
    await expect(page.locator('button:has-text("C")")).toBeVisible();
    await expect(page.locator('button:has-text("A")').getAttribute('aria-pressed')).resolves.toBe('false');
    await expect(page.locator('button:has-text("E")').getAttribute('aria-pressed')).resolves.toBe('true');

    // Click A shape (REAL API call)
    await page.click('button:has-text("A")');
    await expect(page.locator('button:has-text("A")').getAttribute('aria-pressed')).resolves.toBe('true');

    // Verify journey completed
    const journeyTime = await page.evaluate(() => performance.now());
    expect(journeyTime).toBeLessThan(30000); // <30s CSF
  });
});
```

---

## CI/CD Integration

### Backend CI (Existing)

**File**: `.github/workflows/ci.yml` (no changes needed)

**Jobs**:

- `fmt`: Rustfmt check
- `clippy`: Linting
- `test`: Runs ALL tests including new standards endpoint tests

**New tests will automatically run** when added to `test/` directory.

---

### Backend CD (Existing)

**File**: `.github/workflows/deploy.yml` (minor update needed)

**Current Flow**:

1. Run tests
2. Deploy to Cloudflare Workers

**Recommended Addition** (post-deployment smoke tests):

```yaml
# Add after deploy step
- name: Post-Deploy Smoke Tests
  run: |
      sleep 10  # Wait for deployment propagation
      npm test -- test/smoke.e2e.test.ts
  env:
      API_BASE_URL: https://api.harrisjazzlines.com
      X_API_KEY: ${{ secrets.VITE_API_KEY }}
```

---

### Frontend CI (NEW Workflow)

**File**: `.github/workflows/deploy-frontend.yml` (created by DEVOPS wave)

**Jobs**:

```yaml
test:
    - npm ci
    - npm run test:all # Unit tests (mocked)
    - npm run lint
    - npm run build

deploy-preview:
    - Deploy to Cloudflare Pages preview
    - Run E2E tests against preview (OPTIONAL)

deploy-production:
    - Deploy to Cloudflare Pages production
    - Run smoke tests against production
```

**E2E Tests in CI**:

```yaml
# Optional: Run E2E tests against preview deployment
- name: E2E Tests (Preview)
  run: |
      npx playwright test
  env:
      BASE_URL: ${{ steps.deploy-preview.outputs.url }}
      VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
```

---

## Implementation Sequence

### Phase 1: Backend Acceptance Tests (Week 1, Days 1-2)

**Objective**: Implement and pass backend endpoint tests (TDD outer loop)

**Sequence**:

1. **Create test file**: `test/standards-endpoints.e2e.test.ts`
2. **Write FIRST test** (RED): GET /jazz-standards returns 15 standards
3. **Implement backend** (GREEN): Create handlers, service, repository
4. **Refactor**: Clean up code
5. **Commit on GREEN**
6. **Write SECOND test** (RED): GET /jazz-standards/{id} returns single standard
7. **Implement** (GREEN): Add handler for detail endpoint
8. **Refactor & Commit**
9. **Write ERROR tests** (RED): 404, 401 scenarios
10. **Implement error handling** (GREEN)
11. **Commit on GREEN**

**Files to Create**:

- `test/standards-endpoints.e2e.test.ts`
- `src/infrastructure/driving/http/jazz_standards_handlers.rs`
- `src/services/jazz_standards_service.rs`
- `src/infrastructure/driven/jazz_standards_repository.rs`
- `src/infrastructure/driving/http/models/jazz_standards_models.rs`

**Expected Duration**: 1-2 days (TDD cycles)

---

### Phase 2: Frontend Unit Tests (Week 1, Days 3-4)

**Objective**: Implement React hooks and components with mocked API

**Sequence**:

1. **Create mock API client**: `test/fixtures/api-client.mock.ts`
2. **Write hook test** (RED): `useStandards.test.ts`
3. **Implement hook** (GREEN): `useStandards.ts`
4. **Refactor & Commit**
5. **Write component test** (RED): `StandardCard.test.tsx`
6. **Implement component** (GREEN): `StandardCard.tsx`
7. **Repeat** for all 8 frontend components

**Components to Test** (in order):

1. `useStandards` hook
2. `useStandardDetail` hook
3. `StandardCard` component
4. `DualProgressionDisplay` component
5. `ShapeSelector` component
6. `LineDisplay` component
7. `StandardsLibraryPage` (integration of above)
8. `StandardDetailPage` (integration of above)

**Expected Duration**: 2 days (fast with mocks)

---

### Phase 3: Frontend E2E Tests (Week 1, Days 5-7)

**Objective**: Implement walking skeletons and complete flow tests

**Sequence** (ONE AT A TIME):

1. **Setup Playwright**: `npm install -D @playwright/test && npx playwright install`
2. **Enable FIRST walking skeleton** (mark others @skip):
    - `test/e2e/standards-library/complete-user-journey.test.ts`
3. **Run test** (RED): Test fails (frontend not implemented)
4. **Implement frontend pages** until test passes (GREEN)
5. **Commit on GREEN**
6. **Enable SECOND walking skeleton**:
    - `test/e2e/standards-library/returning-user-url.test.ts`
7. **Implement URL routing** until test passes (GREEN)
8. **Commit on GREEN**
9. **Enable shape exploration scenario**
10. **Implement shape switching** until test passes (GREEN)
11. **Commit on GREEN**
12. **Enable error scenarios one at a time**
13. **Implement error handling** until tests pass (GREEN)

**Files to Create**:

- `playwright.config.ts`
- `test/e2e/standards-library/complete-user-journey.test.ts` (walking skeleton 1)
- `test/e2e/standards-library/returning-user-url.test.ts` (walking skeleton 2)
- `test/e2e/standards-library/shape-exploration.test.ts`
- `test/e2e/standards-library/api-timeout-recovery.test.ts`
- `test/e2e/standards-library/rate-limit-handling.test.ts`
- `test/e2e/standards-library/library-load-failure.test.ts`

**Expected Duration**: 3 days (E2E tests drive implementation)

---

### Phase 4: Performance Benchmarks (Week 2, Days 1-2)

**Objective**: Validate CSF targets with quantitative tests

**Sequence**:

1. **Implement CSF 1 test** (frictionless entry): Manual user testing + automated Playwright
2. **Measure and validate**: <30s target
3. **Implement CSF 2 test** (fast generation): Load test with k6 or Artillery
4. **Measure and validate**: <3s p95 target
5. **Implement CSF 5 test** (shape exploration): Playwright with performance timing
6. **Measure and validate**: <3s per switch target

**Files to Create**:

- `test/e2e/performance/frictionless-entry.test.ts`
- `test/e2e/performance/fast-generation.test.ts`
- `test/e2e/performance/shape-switch-latency.test.ts`
- `test/performance/load-test.k6.js` (if using k6)

**Expected Duration**: 2 days (benchmarking + optimization)

---

### Phase 5: Smoke Tests (Week 2, Day 3)

**Objective**: Create fast post-deployment validation

**Sequence**:

1. **Create smoke test file**: `test/smoke.e2e.test.ts`
2. **Implement 9 critical scenarios** (health, endpoints, auth, frontend)
3. **Integrate into CI/CD**: Add to `deploy.yml` and `deploy-frontend.yml`
4. **Validate execution time**: <2 minutes total

**Files to Create**:

- `test/smoke.e2e.test.ts` (backend + frontend smoke tests)

**Expected Duration**: 1 day

---

## Step Definition Examples

### Backend Test Example (Vitest + Miniflare)

```typescript
// test/standards-endpoints.e2e.test.ts
import { describe, it, expect } from 'vitest';
import { makeRequest, authHeaders, TEST_API_KEY } from './test-utils';

describe('Standards API Endpoints', () => {
    describe('GET /jazz-standards', () => {
        it('should return all 15 standards with valid API key', async () => {
            const response = await makeRequest('/jazz-standards', {
                method: 'GET',
                headers: authHeaders,
            });

            expect(response.status).toBe(200);

            const standards = await response.json();
            expect(Array.isArray(standards)).toBe(true);
            expect(standards).toHaveLength(15);

            // Validate structure of first standard
            const autumnLeaves = standards.find((s: any) => s.id === 'autumn-leaves');
            expect(autumnLeaves).toBeDefined();
            expect(autumnLeaves).toMatchObject({
                id: 'autumn-leaves',
                name: 'Autumn Leaves',
                composer: 'Joseph Kosma',
                key: 'G minor',
                difficulty: 'beginner',
            });
            expect(Array.isArray(autumnLeaves.chords_original)).toBe(true);
            expect(Array.isArray(autumnLeaves.chords_improvisation)).toBe(true);
        });

        it('should return 401 without API key', async () => {
            const response = await makeRequest('/jazz-standards', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Missing X-API-Key
                },
            });

            expect(response.status).toBe(401);
            const error = await response.json();
            expect(error.message).toContain('API key');
        });
    });

    describe('GET /jazz-standards/{id}', () => {
        it('should return single standard by ID', async () => {
            const response = await makeRequest('/jazz-standards/autumn-leaves', {
                method: 'GET',
                headers: authHeaders,
            });

            expect(response.status).toBe(200);

            const standard = await response.json();
            expect(standard.id).toBe('autumn-leaves');
            expect(standard.name).toBe('Autumn Leaves');
        });

        it('should return 404 for non-existent standard', async () => {
            const response = await makeRequest('/jazz-standards/invalid-standard-id', {
                method: 'GET',
                headers: authHeaders,
            });

            expect(response.status).toBe(404);
            const error = await response.json();
            expect(error.message).toContain('not found');
        });
    });
});
```

---

### Frontend Unit Test Example (React Testing Library)

```typescript
// src/hooks/useStandards.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStandards } from './useStandards';

// Mock the API client
vi.mock('../api/client', () => ({
    fetchStandards: vi.fn(),
}));

import { fetchStandards } from '../api/client';

describe('useStandards hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch standards on mount', async () => {
        const mockStandards = [
            { id: 'autumn-leaves', name: 'Autumn Leaves' /* ... */ },
            { id: 'blue-bossa', name: 'Blue Bossa' /* ... */ },
        ];

        (fetchStandards as any).mockResolvedValue(mockStandards);

        const { result } = renderHook(() => useStandards());

        // Initially loading
        expect(result.current.loading).toBe(true);
        expect(result.current.standards).toEqual([]);

        // Wait for fetch to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Validate results
        expect(result.current.standards).toEqual(mockStandards);
        expect(result.current.error).toBeNull();
        expect(fetchStandards).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch errors gracefully', async () => {
        const mockError = new Error('Network error');
        (fetchStandards as any).mockRejectedValue(mockError);

        const { result } = renderHook(() => useStandards());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.standards).toEqual([]);
        expect(result.current.error).toBe(mockError);
    });

    it('should support manual refetch', async () => {
        const mockStandards = [{ id: 'test', name: 'Test' }];
        (fetchStandards as any).mockResolvedValue(mockStandards);

        const { result } = renderHook(() => useStandards());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(fetchStandards).toHaveBeenCalledTimes(1);

        // Trigger refetch
        await result.current.refetch();

        expect(fetchStandards).toHaveBeenCalledTimes(2);
    });
});
```

---

### Frontend E2E Test Example (Playwright)

```typescript
// test/e2e/standards-library/complete-user-journey.test.ts
import { test, expect } from '@playwright/test';

test.describe('Walking Skeleton: Complete First-Time User Journey', () => {
    test('user completes journey from discovery to guitar practice in <30 seconds', async ({
        page,
    }) => {
        const startTime = Date.now();

        // Step 1: Open app
        await page.goto('/');
        await expect(page.locator('nav')).toBeVisible();

        // Step 2: Click Experimental tab
        await page.click('nav >> text=Experimental');
        await expect(page).toHaveURL(/\/experimental/);

        // Step 3: Wait for standards library to load
        await expect(page.locator('h1')).toContainText('Standards Library');
        await expect(page.locator('.standard-card')).toHaveCount(15, { timeout: 5000 });

        // Step 4: Browse standards (verify metadata visible)
        const autumnLeavesCard = page.locator('.standard-card:has-text("Autumn Leaves")');
        await expect(autumnLeavesCard.locator('text=Joseph Kosma')).toBeVisible();
        await expect(autumnLeavesCard.locator('text=beginner')).toBeVisible();

        // Step 5: Select Autumn Leaves
        await autumnLeavesCard.click();
        await expect(page).toHaveURL(/\/experimental\/standards\/autumn-leaves/);

        // Step 6: Verify dual progressions visible
        await expect(page.locator('text=Original Progression')).toBeVisible();
        await expect(page.locator('text=Improvisation Progression')).toBeVisible();
        await expect(page.locator('text=Simplified version removes EbMaj7')).toBeVisible();

        // Step 7: Generate lines (default E shape)
        await page.click('button:has-text("Generate Lines")');
        await expect(page.locator('.loading-indicator')).toBeVisible();
        await expect(page.locator('.abc-notation')).toBeVisible({ timeout: 5000 });

        // Step 8: Verify shape selector visible with E highlighted
        await expect(page.locator('button:has-text("C")')).toBeVisible();
        await expect(page.locator('button:has-text("E")[aria-pressed="true"]')).toBeVisible();

        // Step 9: Switch to A shape
        await page.click('button:has-text("A")');
        await expect(page.locator('button:has-text("A")[aria-pressed="true"]')).toBeVisible({
            timeout: 5000,
        });

        // Validate journey time
        const elapsedTime = Date.now() - startTime;
        expect(elapsedTime).toBeLessThan(30000); // CSF 1: <30 seconds

        // Visual regression (optional)
        await expect(page).toHaveScreenshot('complete-journey-end-state.png');
    });

    test('user journey should feel frictionless (subjective observation)', async ({ page }) => {
        // This test documents the subjective experience
        // Manual observation: No decision paralysis, clear next steps, fast feedback
        // Actual validation: Post-user-testing survey results
    });
});
```

---

## Test Execution Commands

### Backend Tests

```bash
cd /Users/pedro/src/wes

# Run all backend tests
npm test

# Run only standards endpoint tests
npm test -- test/standards-endpoints.e2e.test.ts

# Run with coverage
npm run test:coverage

# Watch mode (TDD)
npm test -- --watch
```

---

### Frontend Unit Tests

```bash
cd /Users/pedro/src/HarrisApp

# Run all unit tests
npm run test:all

# Run specific test file
npm test -- src/hooks/useStandards.test.ts

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage
```

---

### Frontend E2E Tests

```bash
cd /Users/pedro/src/HarrisApp

# Run all E2E tests (headless)
npx playwright test

# Run specific test file
npx playwright test test/e2e/standards-library/complete-user-journey.test.ts

# Run with UI (headed mode)
npx playwright test --headed

# Run with debug mode
npx playwright test --debug

# Run against production
BASE_URL=https://harrisjazzlines.com npx playwright test

# View HTML report
npx playwright show-report
```

---

### Performance Benchmarks

```bash
cd /Users/pedro/src/HarrisApp

# Run performance tests
npx playwright test test/e2e/performance/

# Generate performance report
npm run test:perf:report

# Load testing (if using k6)
k6 run test/performance/load-test.k6.js
```

---

### Smoke Tests

```bash
cd /Users/pedro/src/wes

# Run smoke tests against production
API_BASE_URL=https://api.harrisjazzlines.com npm test -- test/smoke.e2e.test.ts

# Run smoke tests in CI (fast mode)
npm run smoke:ci
```

---

## Troubleshooting Guide

### Issue 1: Backend test fails with "Worker compilation error"

**Symptom**: Vitest can't compile Rust Worker

**Solution**:

```bash
cd /Users/pedro/src/wes
cargo build --release
npm test
```

**Root Cause**: Miniflare requires compiled Worker artifact

---

### Issue 2: Frontend E2E test times out waiting for API

**Symptom**: `await expect(page.locator('.abc-notation')).toBeVisible({ timeout: 5000 })` fails

**Debug Steps**:

1. Check backend is running: `curl http://localhost:8787/health`
2. Check API key is valid in test environment
3. Increase timeout: `{ timeout: 10000 }`
4. Check network tab in Playwright trace

**Solution**:

```typescript
// Increase timeout for slow API responses
test.setTimeout(60000); // 60 seconds

await expect(page.locator('.abc-notation')).toBeVisible({ timeout: 10000 });
```

---

### Issue 3: Mock not being applied in frontend unit test

**Symptom**: Test calls real API instead of mock

**Solution**:

```typescript
// Ensure vi.mock is at TOP of file (before imports)
import { describe, it, expect, vi } from 'vitest';

vi.mock('../api/client', () => ({
    fetchStandards: vi.fn().mockResolvedValue([]),
}));

// THEN import the mocked module
import { useStandards } from './useStandards';
```

**Root Cause**: Vitest hoists `vi.mock` calls, but module must be mocked before import

---

### Issue 4: Rate limit test fails (can't trigger 429)

**Symptom**: Test sends 21 requests but all return 200 OK

**Debug**:

1. Check rate limiting is enabled in backend
2. Verify requests are sequential (not parallel)
3. Check API key is same across all requests

**Solution**:

```typescript
// Ensure requests are sequential (not parallel)
for (let i = 0; i < 21; i++) {
    const response = await page.request.post('/barry-harris/generate-instructions', {
        headers: { 'X-API-Key': 'test-key' },
        data: {
            /* ... */
        },
    });

    if (i < 20) {
        expect(response.status()).toBe(200);
    } else {
        expect(response.status()).toBe(429);
    }
}
```

---

### Issue 5: Walking skeleton takes >30 seconds (fails CSF 1)

**Symptom**: E2E test fails because journey takes too long

**Debug**:

1. Check network latency (use Playwright network tab)
2. Identify slowest step (add performance marks)
3. Check backend cold start time

**Solution**:

```typescript
// Add performance marks to identify bottleneck
await page.evaluate(() => performance.mark('start'));

// ... user actions ...

const duration = await page.evaluate(() => {
    performance.mark('end');
    performance.measure('journey', 'start', 'end');
    return performance.getEntriesByName('journey')[0].duration;
});

console.log(`Journey took ${duration}ms`);
```

**Optimization**:

- Pre-warm backend: Health check every 5 minutes
- Optimize frontend bundle: Code splitting for experimental tab
- Enable CDN caching: Standards endpoint cached at edge

---

## Next Steps for Software Crafter

1. **Read acceptance-tests.feature** - Understand complete business flows
2. **Setup Playwright** - Install and configure E2E framework
3. **Implement backend tests FIRST** - RED-GREEN-REFACTOR for API endpoints
4. **Enable FIRST walking skeleton** - Mark others @skip, implement until green
5. **Commit on GREEN** - Small, frequent commits
6. **Repeat for remaining scenarios** - One at a time, TDD cycle
7. **Validate performance** - Run benchmarks, optimize if needed
8. **Run smoke tests** - Integrate into CI/CD

**Expected Timeline**: 2 weeks (10 working days)

**Success Criteria**:

- All acceptance tests passing
- All CSF targets met (frictionless entry <30s, generation <3s, shape switch <3s)
- Smoke tests run in <2 minutes
- CI/CD integrated and green

---

**Document Status**: Complete
**Handoff Ready**: Yes
**Next Wave**: DELIVER (software-crafter implements tests + production code)
