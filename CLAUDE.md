# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HarrisApp is a Barry Harris Line Generator - a web application that generates jazz guitar lines using Barry Harris harmonic concepts. The app consists of a React frontend with TypeScript and a backend proxy server that communicates with a Rust-based music theory API.

**Key Technologies:**

- Frontend: React 19 + TypeScript + Vite + TailwindCSS 4
- Backend: Express.js (dev) / Cloudflare Worker (production)
- Music Notation: ABC.js for rendering musical notation
- Testing: Vitest (unit), Playwright (E2E, visual, performance)
- Build: Vite with SWC compiler

## Development Commands

### Setup and Running

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run server:install

# Start both frontend and backend
npm run dev

# Start frontend only (requires backend running separately)
npm run dev:front

# Start backend only
npm run dev:backend
```

### Testing

```bash
# Run all unit tests
npm run test:all

# Run tests with coverage
npm run test:coverage

# Open coverage report in browser
npm run test:coverage:open

# Run E2E tests
npm run test:e2e

# Run visual regression tests
npm run test:visual

# Update visual snapshots
npm run test:visual:update

# Run performance tests
npm run test:perf

# Run specific test file (unit tests)
npx vitest run path/to/test.test.tsx

# Run tests in watch mode
npx vitest

# Debug E2E tests
npx playwright test --debug
```

### Linting and Type Checking

```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Type check without emitting files
npx tsc --noEmit
```

### Building

```bash
# Build frontend for production
npm run build

# Build backend
npm run server:build

# Preview production build locally
npm run preview
```

### Cloudflare Worker Deployment

```bash
# Start worker in development mode
npm run worker:dev

# Deploy worker to development environment
npm run worker:deploy

# Deploy worker to production
npm run worker:deploy:prod

# Set API key secret
npm run worker:secret
```

## Architecture

### Request Flow

```
User Input → LineGenerator Component → useLineGenerator Hook → Backend Proxy/Worker → Harris API (Rust)
                                                ↓
                                        State Update & Display
                                                ↓
                                    ABC.js Renders Music Notation
```

### Frontend Architecture

**Core Component: `LineGenerator`** (`src/components/LineGenerator.tsx`)

- Main orchestrator component for the line generation feature
- Manages form state, API calls, and music notation rendering
- Integrates sub-components for scales, patterns, positions, and results

**Sub-Components** (`src/components/lineGenerator-components/`):

- `ScaleSelector`: Handles dominant and major scale input
- `PatternSelector`: Interactive pattern selection with drag-and-drop reordering
- `PositionSelector`: Guitar position/fret selection
- `ResultsDisplay`: Shows generated lines with ABC.js notation and tablature

**Custom Hook: `useLineGenerator`** (`src/hooks/useLineGenerator.ts`)

- Manages API communication with backend
- Handles loading states, errors, and server health checks
- Routes to `/api/*` in development (proxied by Vite)
- Routes to Cloudflare Worker URL in production

**API Configuration:**

- Development: Vite proxy forwards `/api/*` to `http://localhost:3001`
- Production: Direct calls to Cloudflare Worker (configured via `VITE_API_URL`)

### Backend Architecture

**Dual Backend Setup:**

1. **Development**: Express.js server (`server/src/index.ts`)
   - Runs on port 3001
   - Stores API key in `.env` file
   - Proxies requests to Harris Jazz Lines API
   - Adds authentication headers automatically

2. **Production**: Cloudflare Worker (`server/src/worker.ts`)
   - Serverless deployment
   - API key stored as Cloudflare secret
   - Same API interface as Express server
   - Configured via `server/wrangler.toml`

**Key Endpoints:**

- `GET /health` - Health check with API key status
- `POST /api/lines` - Generate jazz lines (main endpoint)
- `GET /api/scale/notes?scale=C7` - Get notes for a specific scale

### Type System

**Core Types** (`src/types/lineGenerator.ts`):

- `Pattern`: Union type of available pattern types (e.g., 'half_step_up', 'chord_down', 'pivot')
- `Position`: Guitar positions (Open, C, A, G, E, D, C8, A8, G8, E8)
- `LineGeneratorRequest`: API request format
- `LineGeneratorResponse`: API response with lines and tablature

### Path Aliases

The project uses TypeScript path aliases (configured in `tsconfig.json`):

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`
- `@/hooks/*` → `src/hooks/*`
- `@/contexts/*` → `src/contexts/*`
- `@/types/*` → `src/types/*`

Always use these aliases when importing files within the src directory.

## Testing Strategy

### Test Types and Locations

1. **Unit Tests**: Colocated in `__tests__` directories next to source files
   - Component tests: `src/components/__tests__/*.test.tsx`
   - Hook tests: `src/hooks/__tests__/*.test.ts`
   - Use `@testing-library/react` and `vitest`

2. **Integration Tests**: `src/components/__tests__/integration/`
   - Test component interactions and data flow

3. **E2E Tests**: `E2E/*.spec.ts`
   - Full user workflows with Playwright
   - Run against dev server on port 5173

4. **Visual Tests**: `src/components/__tests__/visual/*.visual.test.tsx`
   - Screenshot-based regression testing
   - Configured with 0.2 threshold for differences

5. **Performance Tests**: `src/components/__tests__/performance/*.perf.test.ts`
   - Measure rendering performance and bundle size

### Test Configuration

- **Vitest**: Configured in `vitest.config.ts`
  - Excludes: E2E, performance, visual tests
  - Coverage provider: v8
  - Environment: jsdom

- **Playwright**: Configured in `playwright.config.ts`
  - Three projects: E2E Tests, Visual Tests, Performance Tests
  - Automatic dev server startup
  - Retries: 2 attempts on failure

## Code Style and Conventions

### TypeScript

- **Strict mode enabled** with comprehensive type checking
- All compiler options configured for maximum safety
- No implicit any, returns, or this
- Explicit return types recommended for complex functions
- Use proper generic typing for reusable components

### React Patterns

- **Functional components with hooks** (no class components)
- Use `React.FC` type annotation for components
- Prefer `useCallback` for event handlers to prevent re-renders
- Use `useMemo` for expensive calculations
- Lazy load heavy components (e.g., ABC.js)

### Styling

- **TailwindCSS** for all styling
- Use `cn()` utility from `@/lib/utils` to merge class names
- Component variants managed with `class-variance-authority`
- Theme support: Dark/light mode via `ThemeProvider`
- Radix UI for accessible primitives

### Import Organization

ESLint enforces import order via `eslint-plugin-simple-import-sort`:

1. React imports
2. External packages
3. Internal imports (using @ aliases)
4. Relative imports
5. Type imports

## Security Requirements

### API Key Management

**Critical**: The Harris Jazz Lines API key must NEVER be exposed to the client.

- **Development**: Store in `server/.env` (never commit)
- **Production**: Store as Cloudflare Worker secret (`wrangler secret put WES_API_KEY`)
- **Frontend**: Always route API calls through backend proxy/worker
- **Never** include API keys in client-side code or environment variables

### Backend Proxy Pattern

All API requests MUST go through the backend:

```typescript
// ✅ Correct: Uses backend proxy
const response = await fetch('/api/lines', { ... });

// ❌ Wrong: Direct API call exposes need for API key
const response = await fetch('https://api.harrisjazzlines.com/lines', {
  headers: { 'Authorization': `Bearer ${API_KEY}` } // Never do this!
});
```

## Music Notation with ABC.js

### How It Works

1. **Lazy Loading**: ABC.js is loaded asynchronously to reduce initial bundle size
2. **Conversion**: Backend returns note arrays (e.g., `["C", "E", "G"]`)
3. **ABC Notation**: `convertToABC()` in `src/lib/musicNotation.ts` converts to ABC format
4. **Rendering**: `abcjs.renderAbc()` renders to SVG in DOM elements

### ABC Notation Format

HarrisApp uses a specific ABC notation format:

```
X:1
T:Generated Line
M:4/4
L:1/4
K:C
[notes here]
```

### Performance Considerations

- ABC.js is lazy-loaded on component mount
- Each line renders in a separate div with a ref
- Rendering is wrapped in try-catch to handle errors gracefully
- Use `responsive: 'resize'` option for mobile compatibility

## Common Development Tasks

### Adding a New Pattern Type

1. Add pattern to `Pattern` union type in `src/types/lineGenerator.ts`
2. Update `PATTERNS` array in `src/components/lineGenerator-components/constants.ts`
3. Add human-readable label to `patternLabels` in `PatternSelector.tsx`
4. Backend API should already support the pattern (Rust implementation)

### Modifying API Requests

1. Update types in `src/types/lineGenerator.ts` if request/response format changes
2. Modify `useLineGenerator` hook if new endpoints needed
3. Update backend proxy servers (both Express and Worker) to handle new endpoints
4. Add error handling for new failure cases

### Working with Music Notation

- All music notation logic is in `src/lib/musicNotation.ts`
- ABC.js types are defined in `src/types/abcjs.d.ts`
- Test notation rendering with various note combinations
- Consider edge cases: accidentals, octave boundaries, empty lines

### Theme Integration

When adding new components:

- Use Tailwind's dark mode classes (`dark:*`)
- Test both light and dark themes
- Follow existing component patterns from `src/components/ui/`
- Ensure accessibility with proper ARIA labels

## Deployment Architecture

### Development Environment

- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:3001` (Express server)
- API calls automatically proxied via Vite config

### Production Environment

- Frontend: Cloudflare Pages (or any static host)
- Backend: Cloudflare Worker
- Environment variable: `VITE_API_URL` points to Worker URL
- API key stored as Cloudflare secret

See `DEPLOYMENT.md` for detailed deployment instructions.

## Performance Targets

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Main bundle size: < 500KB
- ABC.js lazy-loaded to reduce initial load

## Browser Requirements

- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- ES2020 support (async/await, optional chaining)
- Web Audio API (for ABC.js)
- CSS Grid and Flexbox
- LocalStorage (for theme persistence)

## Troubleshooting Common Issues

### Build Errors

```bash
rm -rf node_modules package-lock.json
npm install
rm -rf node_modules/.vite
npm run dev
```

### API Connection Issues

- Verify backend server is running on port 3001
- Check `.env` file exists in `server/` directory
- Test health endpoint: `curl http://localhost:3001/health`
- Check browser console for CORS errors

### Music Notation Not Rendering

- Verify ABC.js loaded successfully (check browser console)
- Test with simpler note arrays
- Check ABC notation format in `convertToABC()` function

### TypeScript Errors

```bash
npx tsc --noEmit  # Check for type errors
# In VS Code: Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

## Important Notes

- Node.js version: >= 22.16.0 (specified in engines field)
- API rate limit: 100 requests/minute (Harris Jazz Lines API)
- The project uses a monorepo structure with both frontend and backend
- Git pre-commit hooks run Prettier on staged TS/TSX files
- All React components use React 19 features
