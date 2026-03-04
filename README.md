# HarrisApp - Jazz Theory Practice Application

A modern web application for jazz musicians to practice Barry Harris concepts with interactive line generation, CAGED shape exploration, and jazz standards library.

## Features

### Experimental Tab - Jazz Standards Library

The Experimental tab provides access to a curated library of 15 jazz standards with Barry Harris-inspired melodic line generation.

**Key Features:**

- Browse 15 classic jazz standards with metadata (composer, key, tempo, form, difficulty)
- View dual chord progressions (original and Barry Harris improvisation-friendly)
- Generate melodic lines using Barry Harris patterns across all 5 CAGED shapes
- Interactive shape exploration with instant regeneration (<3 seconds)
- Guitar tablature notation for each generated line
- Keyboard-accessible interface with full ARIA support

**Critical Success Factors:**

- CSF 1: Frictionless entry (<30 seconds from app open to first generation)
- CSF 2: Fast generation (<3 seconds p95 latency)
- CSF 5: Instant shape switching (<3 seconds per shape change)

## Tech Stack

**Frontend:**

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- abcjs for music notation rendering
- Playwright for E2E testing
- Vitest for unit testing

**Backend:**

- Rust (Cloudflare Workers)
- Compile-time JSON loading for zero-latency standards data
- Barry Harris melodic pattern generation

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Rust toolchain (for backend development)
- wrangler CLI (for backend deployment)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your-api-key-here
VITE_API_URL=http://localhost:8787
```

### Running the Application

**Frontend development server:**

```bash
npm run dev
```

Runs on http://localhost:5173

**Backend development (Cloudflare Worker):**

```bash
wrangler dev
```

Runs on http://localhost:8787

## Testing

### Unit Tests (Vitest)

Run all unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### E2E Tests (Playwright)

Run all E2E tests:

```bash
npm run test:e2e
```

Run specific test file:

```bash
npm run test:e2e -- E2E/standards-library/complete-user-journey.spec.ts
```

Run tests in headed mode (see browser):

```bash
npm run test:e2e -- --headed
```

Run tests in UI mode (interactive):

```bash
npm run test:e2e -- --ui
```

### Performance Tests

Run CSF validation benchmarks:

```bash
npm run test:e2e -- E2E/performance/
```

Individual performance tests:

```bash
# CSF 1: Frictionless entry
npm run test:e2e -- E2E/performance/frictionless-entry.spec.ts

# CSF 2: Fast generation
npm run test:e2e -- E2E/performance/fast-generation.spec.ts

# CSF 5: Shape switching
npm run test:e2e -- E2E/performance/shape-switch-latency.spec.ts
```

### Smoke Tests

Run fast smoke tests for CI/CD validation:

```bash
npm run test:e2e -- E2E/smoke.spec.ts
```

Executes in <20 seconds, covering critical paths.

### Accessibility Tests

Run keyboard navigation tests:

```bash
npm run test:e2e -- E2E/accessibility/keyboard-navigation.spec.ts
```

## Building

### Frontend Build

```bash
npm run build
```

Outputs to `dist/` directory.

### Backend Build

```bash
wrangler deploy --dry-run
```

## Deployment

See [DEPLOYMENT.md](docs/feature/experimental-tab/deliver/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment

**Frontend (Cloudflare Pages):**

```bash
npm run build
wrangler pages deploy dist
```

**Backend (Cloudflare Workers):**

```bash
cd backend
wrangler deploy
```

## Project Structure

```
/
├── E2E/                          # Playwright E2E tests
│   ├── accessibility/            # Keyboard navigation tests
│   ├── performance/              # CSF benchmark tests
│   ├── standards-library/        # User journey tests
│   └── smoke.spec.ts             # Fast CI smoke tests
├── src/
│   ├── api/                      # API client for backend
│   ├── components/
│   │   └── experimental/         # Standards library components
│   ├── hooks/                    # Custom React hooks
│   ├── pages/
│   │   └── experimental/         # Standards pages
│   └── types/                    # TypeScript type definitions
├── docs/feature/experimental-tab/ # Feature documentation
└── playwright.config.ts          # Playwright configuration
```

## Acceptance Criteria Validation

All 27 acceptance criteria from the feature roadmap have been validated:

**Phase 1: Backend API** (Steps 01-01 to 01-05)

- ✅ Jazz standards data models with metadata
- ✅ Service layer loading 15 standards from JSON
- ✅ GET /jazz-standards endpoint (200 OK)
- ✅ GET /jazz-standards/:id endpoint (200 OK, 404 for invalid)
- ✅ Authentication and error handling (401, 500)

**Phase 2: Frontend Components** (Steps 02-01 to 02-10)

- ✅ TypeScript types matching backend models
- ✅ useStandards and useStandardDetail hooks with loading/error states
- ✅ StandardCard with difficulty badges and hover effects
- ✅ DualProgressionDisplay with responsive layout
- ✅ ShapeSelector with ARIA pressed states
- ✅ LineDisplay with abcjs notation rendering
- ✅ StandardsLibraryPage with grid layout
- ✅ StandardDetailPage with orchestration
- ✅ Navigation with Experimental tab

**Phase 3: Integration and E2E** (Steps 03-01 to 03-12)

- ✅ Playwright setup and fixtures
- ✅ Walking Skeleton 1: First-time user journey (<30s)
- ✅ Walking Skeleton 2: Returning user URL access
- ✅ Shape exploration across multiple standards
- ✅ API timeout recovery with retry
- ✅ Rate limit handling with countdown
- ✅ Library load failure with retry
- ✅ 404 and 401 boundary scenarios
- ✅ Keyboard navigation with focus indicators
- ✅ CSF performance benchmarks (all targets met)
- ✅ Smoke tests for CI/CD (<2 minutes)
- ✅ Documentation and handoff

## Performance Metrics

Based on E2E test results:

- **Standards Library Load:** <1 second (target: <2s) ✅
- **Line Generation:** <100ms average (target: <3s p95) ✅
- **Shape Switching:** <50ms average (target: <3s) ✅
- **Total Journey Time:** <2 seconds (target: <30s) ✅

All CSF targets significantly exceeded.

## Contributing

This project follows Outside-In TDD with London School approach:

1. Write acceptance test first (RED)
2. Implement with unit tests (RED-GREEN-REFACTOR)
3. Commit on green
4. No test modifications to make them pass

See [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

## License

Copyright © 2026. All rights reserved.
