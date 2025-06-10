# Contributing to HarrisApp

Welcome to HarrisApp! This guide will help you understand the project architecture and how to contribute effectively to our Barry Harris Line Generator application - a sophisticated music theory tool that generates jazz guitar lines using Barry Harris harmonic concepts.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Development Setup](#development-setup)
- [Code Organization](#code-organization)
- [Adding Features](#adding-features)
- [Testing](#testing)
- [Code Style](#code-style)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Production Deployment](#production-deployment)
- [Performance Guidelines](#performance-guidelines)
- [Browser Support](#browser-support)
- [API Reference](#api-reference)
- [Release Process](#release-process)
- [Troubleshooting](#troubleshooting)
- [Code of Conduct](#code-of-conduct)

## Project Overview

HarrisApp is a modern web application for generating jazz guitar lines based on Barry Harris harmonic concepts. The application provides an intuitive interface for musicians to explore advanced jazz theory through interactive line generation, guitar tablature, and music notation display.

### Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS 4 + Radix UI components
- **Music Notation**: ABC.js for rendering musical notation
- **Backend API**: Custom Rust music theory service
- **Testing**: Vitest + Playwright + Testing Library
- **Build Tool**: Vite with SWC for fast builds

## Architecture

### High-Level System Design

```txt
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Vite Dev       │    │   Rust Music    │
│   (React/TS)    │◄──►│   Server         │◄──►│   Theory API    │
│   Browser UI    │    │   + Proxy        │    │   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Static Build   │
                       │   (Deployment)   │
                       └──────────────────┘
```

### Application Architecture

#### 🎵 Core Music Theory Components

- **LineGenerator**: Main component for generating Barry Harris lines
- **Scale Selection**: Dominant and major scale input components
- **Pattern Management**: Interactive pattern selection and reordering
- **Position Selector**: Guitar position/fret selection
- **Music Notation**: ABC.js integration for displaying generated lines

#### 🎨 UI Architecture

- **Theme System**: Dark/light mode with system preference detection
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Component Library**: Radix UI primitives with custom styling

## Development Setup

### Prerequisites

- Node.js 18.18.0+ and npm
- Harris Jazz Lines API key

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd HarrisApp
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Set up the backend proxy server**

   ```bash
   # Install backend dependencies
   npm run server:install

   # Configure API key
   cd server
   cp env.example .env
   # Edit .env and add your API key:
   # WES_API_KEY=your-actual-api-key-here
   ```

4. **Start development servers**

   ```bash
   # Option 1: Start both frontend and backend together
   npm run dev:full

   # Option 2: Start them separately
   npm run dev:backend  # Backend proxy server (port 3001)
   npm run dev          # Frontend dev server (port 5173)
   ```

   This runs:

   - Backend proxy server on `http://localhost:3001` (handles API key securely)
   - Vite dev server on `http://localhost:5173` (frontend with HMR)
   - Automatic proxy configuration from frontend to backend
   - TailwindCSS with live reloading

### Development Architecture

```txt
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │  Vite Dev        │    │  Backend Proxy  │    │   Harris API    │
│   localhost:5173│◄──►│  Server          │◄──►│  localhost:3001 │◄──►│   Production    │
│   React HMR     │    │  + Proxy Config  │    │  + API Key      │    │   Rust Service  │
│   + Live CSS    │    │  + TypeScript    │    │  + Auth Headers │    │   (External)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────────┘
```

## Code Organization

### File Structure

```txt
src/
├── App.tsx                     # Main React application component
├── main.tsx                    # Application entry point
├── index.css                   # Global CSS styles
├── components/                 # React UI components
│   ├── LineGenerator.tsx       #   └─ Main line generator interface
│   ├── ThemeProvider.tsx       #   └─ Theme context provider
│   ├── ThemeToggle.tsx         #   └─ Theme switching component
│   ├── lineGenerator-components/ # Line generator sub-components
│   │   ├── ScaleSelector.tsx   #       └─ Scale selection UI
│   │   ├── PatternSelector.tsx #       └─ Pattern management UI
│   │   ├── PositionSelector.tsx#       └─ Position selection UI
│   │   └── Results.tsx         #       └─ Generated lines display
│   └── ui/                     #   └─ Reusable UI components
│       ├── button.tsx          #       └─ Button variants
│       ├── input.tsx           #       └─ Form inputs
│       ├── select.tsx          #       └─ Select components
│       └── ...                 #       └─ Other UI primitives
├── hooks/                      # Custom React hooks
│   ├── useLineGenerator.ts     #   └─ Line generation logic & API calls
│   └── useTheme.ts             #   └─ Theme management hook
├── types/                      # TypeScript type definitions
│   ├── lineGenerator.ts        #   └─ Core domain types
│   ├── abcjs.d.ts             #   └─ ABC.js type declarations
│   └── theme.ts               #   └─ Theme system types
├── contexts/                   # React context providers
├── lib/                        # Utility functions
│   └── utils.ts               #   └─ General utility functions
└── assets/                     # Static assets (images, icons)
```

### Component Architecture

#### 🎵 **Music Theory Components**

- **Purpose**: Handle music theory logic and API integration
- **Location**: `src/components/LineGenerator.tsx` + sub-components
- **Responsibilities**:
  - Scale and pattern selection
  - API communication with Harris Jazz Lines service
  - Music notation rendering with ABC.js
  - Guitar tablature display

#### 🎨 **UI Components**

- **Purpose**: Reusable interface elements
- **Location**: `src/components/ui/`
- **Responsibilities**:
  - Consistent styling with Tailwind CSS
  - Accessibility features
  - Responsive design patterns
  - Theme support

#### 🔧 **Custom Hooks**

- **Purpose**: Encapsulate stateful logic and side effects
- **Location**: `src/hooks/`
- **Responsibilities**:
  - API state management
  - Theme persistence
  - Complex UI interactions

### Request Flow

```text
👤 User Input → 🎵 LineGenerator → 🔧 useLineGenerator → 🌐 Harris API
                COMPONENT         CUSTOM HOOK          EXTERNAL
                                      |
🎵 Music Display ← 📊 State Update ← 📊 Response ← 🦀 Rust Backend
   COMPONENTS       REACT STATE       JSON API        MUSIC THEORY
```

**Request Processing Steps**:

1. **🎵 UI**: User selects scales, patterns, and position
2. **🔧 Hook**: `useLineGenerator` validates input and manages loading state
3. **🌐 API**: HTTP POST request to `/lines` endpoint
4. **🦀 Backend**: Rust service processes music theory and generates lines
5. **📊 Response**: JSON response with lines and tablature data
6. **🎵 Display**: ABC.js renders musical notation, components show results

## Security

### API Key Management

HarrisApp uses a secure backend proxy architecture to protect the Harris Jazz Lines API key:

#### 🔒 **Security Features**

- **Server-side API key storage**: API keys are never exposed to the client
- **Environment variable protection**: Keys stored in `.env` files (not committed to git)
- **Proxy authentication**: Backend automatically adds authentication headers
- **CORS configuration**: Restricted to allow only frontend requests
- **Error sanitization**: API errors are filtered to prevent information leakage

#### 🚨 **Security Rules**

- **Never commit `.env` files** to version control
- **Never expose API keys** in client-side code
- **Always use the proxy server** for API requests in development
- **Validate all inputs** before sending to the API
- **Handle errors gracefully** without exposing internal details

#### 🔧 **Development vs Production**

**Development (Secure with Proxy)**:

```typescript
// ✅ Good: Uses proxy server (API key stays on server)
const response = await fetch('/api/lines', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

**Production (Deploy with Environment Variables)**:

```bash
# Set API key as environment variable on your deployment platform
WES_API_KEY=your-production-api-key
```

## Adding Features

### Adding New Pattern Types

1. **Define the pattern type in `src/types/lineGenerator.ts`**

   ```typescript
   export type Pattern =
     | 'half_step_up'
     | 'chord_up'
     | 'chord_down'
     | 'triad_up'
     | 'triad_down'
     | 'pivot'
     | 'scale_down'
     | 'third_up'
     | 'third_down'
     | 'new_pattern_type'; // ← Add new pattern here
   ```

2. **Update pattern selector UI in `src/components/lineGenerator-components/PatternSelector.tsx`**

   ```typescript
   const patternLabels: Record<Pattern, string> = {
     // ...existing patterns
     new_pattern_type: 'New Pattern Description',
   };
   ```

3. **Test the pattern integration**
   - The backend API should already support the new pattern
   - Test pattern selection and line generation
   - Verify musical notation renders correctly

### Adding New UI Components

1. **Create component in appropriate directory**

   ```typescript
   // src/components/ui/new-component.tsx
   import React from 'react';
   import { cn } from '@/lib/utils';

   interface NewComponentProps {
     className?: string;
     // Define props with clear types
   }

   export const NewComponent = React.forwardRef<
     HTMLDivElement,
     NewComponentProps
   >(({ className, ...props }, ref) => {
     return (
       <div
         ref={ref}
         className={cn(
           'base-styles', // Base Tailwind classes
           className
         )}
         {...props}
       />
     );
   });

   NewComponent.displayName = 'NewComponent';
   ```

2. **Add component variants using class-variance-authority**

   ```typescript
   import { cva, type VariantProps } from 'class-variance-authority';

   const componentVariants = cva('base-classes', {
     variants: {
       variant: {
         default: 'default-styles',
         secondary: 'secondary-styles',
       },
       size: {
         sm: 'small-styles',
         lg: 'large-styles',
       },
     },
     defaultVariants: {
       variant: 'default',
       size: 'sm',
     },
   });
   ```

### Adding Custom Hooks

1. **Create hook for specific functionality**

   ```typescript
   // src/hooks/useNewFeature.ts
   import { useState, useEffect, useCallback } from 'react';

   interface UseNewFeatureOptions {
     // Define configuration options
   }

   export function useNewFeature(options: UseNewFeatureOptions = {}) {
     const [state, setState] = useState(initialState);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const performAction = useCallback(
       async () => {
         setLoading(true);
         setError(null);

         try {
           // Implement hook logic
           const result = await someAsyncOperation();
           setState(result);
         } catch (err) {
           setError(err instanceof Error ? err.message : 'Unknown error');
         } finally {
           setLoading(false);
         }
       },
       [
         /* dependencies */
       ]
     );

     return {
       state,
       loading,
       error,
       performAction,
     };
   }
   ```

2. **Use in components**

   ```typescript
   import { useNewFeature } from '@/hooks/useNewFeature';

   export const Component = () => {
     const { state, loading, error, performAction } = useNewFeature();

     // Component implementation
   };
   ```

### API Integration Guidelines

#### Error Handling Best Practices

- **Graceful degradation** for API failures
- **User-friendly error messages** for common scenarios
- **Retry mechanisms** for temporary failures
- **Loading states** during API calls

#### Data Validation

- **Type-safe responses** with TypeScript interfaces
- **Runtime validation** for critical data
- **Default values** for optional fields
- **Consistent error response format**

## Testing

### Testing Stack

- **Unit Tests**: Vitest + Testing Library
- **E2E Tests**: Playwright
- **Visual Tests**: Playwright + Screenshots
- **Performance Tests**: Playwright + Performance API

### Running Tests

```bash
# Run all unit tests
npm run test:all

# Run tests with coverage
npm run test:coverage

# View coverage report in browser
npm run test:coverage:open

# Run E2E tests
npm run test:e2e

# Run visual regression tests
npm run test:visual

# Update visual snapshots
npm run test:visual:update

# Run performance tests
npm run test:perf
```

### Test Structure

```txt
src/
├── components/
│   └── __tests__/              # Component unit tests
│       ├── LineGenerator.test.tsx
│       └── ...
├── hooks/
│   └── __tests__/              # Hook unit tests
│       ├── useLineGenerator.test.ts
│       └── ...
└── test/                       # Test utilities and setup
E2E/                            # End-to-end tests
├── e2e.spec.ts                 # E2E test scenarios
└── ...
```

### Testing Guidelines

#### Unit Testing

- **Test user interactions** and component behavior
- **Mock API calls** for consistent testing
- **Test error scenarios** and edge cases
- **Verify accessibility** features work correctly

#### E2E Testing

- **Test complete user workflows** from start to finish
- **Test responsive design** across different screen sizes
- **Verify music notation rendering** works correctly
- **Test theme switching** and persistence

#### Component Testing Best Practices

```typescript
// Good component test example
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LineGenerator } from '../LineGenerator';

describe('LineGenerator', () => {
  test('should generate lines when form is submitted', async () => {
    // Arrange
    render(<LineGenerator />);

    // Act
    fireEvent.change(screen.getByLabelText('From Scale'), {
      target: { value: 'C7' }
    });
    fireEvent.click(screen.getByText('Generate Lines'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Generated Lines')).toBeInTheDocument();
    });
  });
});
```

### Manual Testing Checklist

- [ ] Line generation works with various scale combinations
- [ ] Pattern selection and reordering functions correctly
- [ ] Music notation renders properly
- [ ] Guitar tablature displays accurately
- [ ] Theme switching works across page refreshes
- [ ] Mobile interface is responsive and usable
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader compatibility (test with tools like NVDA)

## Code Style

### TypeScript Guidelines

- **Strict TypeScript** configuration enabled
- **Explicit return types** for complex functions
- **Interface definitions** for all data structures
- **Proper generic usage** for reusable components

```typescript
// Good TypeScript practices
interface LineGeneratorProps {
  initialScale?: string;
  onGenerate?: (result: LineGeneratorResponse) => void;
}

export const LineGenerator: React.FC<LineGeneratorProps> = ({ initialScale = '', onGenerate }) => {
  // Component implementation with proper typing
};
```

### React Best Practices

- **Functional components** with hooks
- **Proper dependency arrays** for useEffect and useCallback
- **Memoization** for expensive computations
- **Error boundaries** for robust error handling

### Styling Guidelines

- **Tailwind CSS** for styling with consistent design tokens
- **CSS modules** for component-specific styles when needed
- **Responsive design** with mobile-first approach
- **Dark mode support** throughout the application

```typescript
// Good styling approach
const buttonClasses = cn(
  'base-button-styles',
  {
    'variant-primary': variant === 'primary',
    'variant-secondary': variant === 'secondary',
  },
  className
);
```

### Accessibility Requirements

- **ARIA labels** for all interactive elements
- **Keyboard navigation** support
- **Focus management** for modal dialogs
- **Screen reader compatibility**
- **Color contrast** meeting WCAG guidelines

## Git Workflow

### Branching Strategy

- **`main`** - Production-ready code, always deployable
- **`develop`** - Integration branch for ongoing development
- **`feature/*`** - Feature branches (e.g., `feature/new-pattern-selector`)
- **`hotfix/*`** - Critical fixes that need immediate deployment
- **`refactor/*`** - Code refactoring and improvements

### Commit Conventions

Follow [Conventional Commits](https://conventionalcommits.org/) for clear commit history:

- **`feat:`** - New features
- **`fix:`** - Bug fixes
- **`docs:`** - Documentation changes
- **`style:`** - Code style changes (formatting, etc.)
- **`refactor:`** - Code refactoring without functional changes
- **`test:`** - Test-related changes
- **`chore:`** - Build process, dependency updates, etc.
- **`perf:`** - Performance improvements

**Examples:**

```bash
feat(line-generator): add diminished chord pattern support
fix(api): resolve authentication header format issue
docs(contributing): add git workflow guidelines
refactor(hooks): extract common API logic to utility functions
test(components): improve LineGenerator test coverage
```

### Workflow Steps

1. **Create feature branch** from `develop`

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** following code style guidelines

3. **Commit changes** using conventional commit format

4. **Push branch** and create Pull Request to `develop`

5. **Code review** and testing by maintainers

6. **Merge to develop** after approval

7. **Release process** merges `develop` to `main`

## Pull Request Process

### Before Submitting

1. **Run the full test suite**

   ```bash
   npm run test:all
   npm run test:e2e
   npm run lint
   ```

2. **Verify code quality**

   ```bash
   npm run lint:fix
   # Ensure no TypeScript errors
   npx tsc --noEmit
   ```

3. **Test manually**
   - Test new features across different browsers
   - Verify responsive design works correctly
   - Test with screen readers if accessibility changes made

### PR Template

```markdown
## Description

Brief description of changes and motivation

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Music Theory Changes

- [ ] New pattern types added
- [ ] Scale handling modifications
- [ ] API integration changes

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Screenshots

Include screenshots for UI changes, especially music notation rendering

## Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code completed
- [ ] Code is properly commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation made
- [ ] Generated no new warnings
- [ ] Tests added that prove the fix is effective or that the feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. **Automated checks** must pass (linting, testing, type checking)
2. **Code review** by project maintainers
3. **Manual testing** of new features
4. **Accessibility review** for UI changes
5. **Performance check** for significant changes

## Production Deployment

### Frontend Deployment

#### Static Site Hosting

The frontend can be deployed to any static hosting service:

- **Netlify** (Recommended)

  ```bash
  npm run build
  # Deploy dist/ folder to Netlify
  ```

- **Vercel**

  ```bash
  npx vercel --prod
  ```

- **GitHub Pages**

  ```bash
  npm run build
  # Deploy dist/ folder to gh-pages branch
  ```

#### Environment Configuration

For production frontend, update API endpoints in build process or use environment variables.

### Backend Deployment

#### Server Hosting Options

**Railway** (Recommended):

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd server
railway deploy
```

**Render**:

- Connect GitHub repository
- Set build command: `cd server && npm install && npm run build`
- Set start command: `cd server && npm start`

**DigitalOcean App Platform**:

- Connect repository
- Configure build and start commands
- Set environment variables

#### Environment Variables for Production

| Variable           | Required | Description               | Example                           |
| ------------------ | -------- | ------------------------- | --------------------------------- |
| `WES_API_KEY`      | ✅ Yes   | Harris Jazz Lines API key | `your-api-key-here`               |
| `WES_API_BASE_URL` | ❌ No    | API base URL              | `https://api.harrisjazzlines.com` |
| `PORT`             | ❌ No    | Server port               | `3001`                            |
| `NODE_ENV`         | ❌ No    | Environment               | `production`                      |

#### SSL/HTTPS Configuration

- Enable HTTPS on your hosting platform
- Update CORS settings in backend for production domain
- Ensure API endpoints use HTTPS

#### Process Management

For VPS deployments, use PM2:

```bash
npm install -g pm2
cd server
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS settings updated for production domain
- [ ] API rate limits configured
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place

## Performance Guidelines

### Frontend Optimization

#### Bundle Size Optimization

- **Target**: Keep main bundle under 500KB
- **Code splitting**: Lazy load ABC.js and heavy components
- **Tree shaking**: Ensure unused code is eliminated
- **Bundle analysis**: Use `npm run build && npx vite-bundle-analyzer dist`

#### Music Theory Performance

```typescript
// ✅ Good: Memoize expensive calculations
const memoizedPatternCalculation = useMemo(() => {
  return calculateComplexPattern(scales, patterns);
}, [scales, patterns]);

// ✅ Good: Debounce rapid user input
const debouncedGenerate = useCallback(
  debounce((data) => generateLines(data), 300),
  []
);
```

#### Component Optimization

```typescript
// ✅ Good: Memoize pattern list components
const PatternItem = React.memo(({ pattern, onMove, onRemove }) => {
  return (
    <div className="pattern-item">
      {/* Component content */}
    </div>
  );
});

// ✅ Good: Lazy load heavy components
const MusicNotation = lazy(() => import('./MusicNotation'));
```

### Backend Optimization

#### API Response Caching

- Cache scale calculations for common inputs
- Implement Redis for session-based caching
- Use HTTP cache headers appropriately

#### Request Optimization

```typescript
// ✅ Good: Implement request debouncing
const debouncedApiCall = debounce(async (data) => {
  return await fetch('/api/lines', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}, 300);
```

#### Rate Limiting

- Monitor Harris Jazz Lines API rate limits (100 req/min)
- Implement exponential backoff for 429 responses
- Queue requests during high traffic

### Performance Monitoring

#### Core Web Vitals Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

#### Monitoring Tools

- Lighthouse CI in GitHub Actions
- Web Vitals reporting in production
- Performance budgets in build process

## Browser Support

### Supported Browsers

| Browser       | Version | Notes           |
| ------------- | ------- | --------------- |
| Chrome        | 90+     | Full support    |
| Firefox       | 88+     | Full support    |
| Safari        | 14+     | Full support    |
| Edge          | 90+     | Full support    |
| Mobile Safari | 14.4+   | Touch-optimized |
| Chrome Mobile | 90+     | Touch-optimized |

### Required Features

- **ES2020** support (async/await, optional chaining)
- **CSS Grid** and **Flexbox**
- **Web Audio API** (for ABC.js music rendering)
- **Fetch API** (for network requests)
- **LocalStorage** (for theme persistence)

### Known Issues

- **Music notation rendering** may be slower on older devices
- **ABC.js** requires modern JavaScript features
- **Touch interactions** optimized for mobile devices
- **Print styles** may need adjustment for notation

### Polyfills

For broader support, consider adding:

```typescript
// Optional polyfills in main.tsx
if (!window.fetch) {
  import('whatwg-fetch');
}
```

## API Reference

### Harris Jazz Lines API Integration

#### Authentication

All requests require authentication header:

```http
Authorization: Bearer {WES_API_KEY}
```

#### Base URL

- **Production**: `https://api.harrisjazzlines.com`
- **Development**: Proxied through `http://localhost:3001/api`

#### Key Endpoints

##### Health Check

```http
GET /health
Response: "OK" (plain text)
```

##### Generate Lines

```http
POST /lines
Content-Type: application/json

Request Body:
{
  "from_scale": "C7",
  "to_scale": "Fmaj7",
  "patterns": ["half_step_up", "chord_down"],
  "position": "Open"
}

Response:
{
  "lines": [["C", "D", "E", "F"]],
  "tabs": [["3", "5", "7", "8"]],
  "from_scale": "C7",
  "to_scale": "Fmaj7"
}
```

##### Scale Notes

```http
GET /scale/notes?scale=C7
Response:
{
  "notes": ["C", "E", "G", "Bb"]
}
```

#### API Error Responses

##### Common Error Responses

```json
// 401 Unauthorized
{
  "code": 401,
  "error": "unauthorized",
  "message": "Missing API key in Authorization header"
}

// 400 Bad Request
{
  "code": 400,
  "error": "invalid_input",
  "message": "Invalid scale format"
}

// 429 Rate Limited
{
  "code": 429,
  "error": "rate_limited",
  "message": "Too many requests"
}
```

#### Rate Limits

- **100 requests per minute** per API key
- **Implement exponential backoff** for 429 responses
- **Monitor usage** to avoid hitting limits

#### API Documentation

- Full specification available in `openapi.yaml`
- Interactive documentation at API base URL
- Contact API maintainers for additional endpoints

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 2.1.0)
- **Breaking changes** increment MAJOR
- **New features** increment MINOR
- **Bug fixes** increment PATCH

### Release Types

#### Major Release (x.0.0)

- Breaking API changes
- Major UI overhauls
- New core features

#### Minor Release (x.y.0)

- New patterns or features
- UI improvements
- Performance enhancements

#### Patch Release (x.y.z)

- Bug fixes
- Security updates
- Documentation improvements

### Release Checklist

#### Pre-Release

- [ ] All tests pass (`npm run test:all`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compiles cleanly (`npx tsc --noEmit`)
- [ ] Performance tests meet targets
- [ ] Security vulnerabilities addressed
- [ ] Browser compatibility verified

#### Documentation

- [ ] `CHANGELOG.md` updated with changes
- [ ] `README.md` updated if needed
- [ ] API documentation updated
- [ ] Migration guide for breaking changes

#### Release Steps

1. **Update version** in `package.json` and `server/package.json`
2. **Create release branch** from `develop`

   ```bash
   git checkout -b release/v1.2.0
   ```

3. **Final testing** and bug fixes
4. **Merge to main** and tag release

   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag v1.2.0
   git push origin main --tags
   ```

5. **Deploy to production**
6. **Merge back to develop**

   ```bash
   git checkout develop
   git merge main
   ```

#### Post-Release

- [ ] Production deployment verified
- [ ] Monitoring dashboards checked
- [ ] User documentation updated
- [ ] Community announcement posted
- [ ] GitHub release notes published

## Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### API Connection Issues

- Verify the Harris Jazz Lines API is accessible
- Check network connectivity and CORS settings
- Review browser console for detailed error messages
- Test API endpoints directly using the `test-api.html` file

#### Music Notation Not Rendering

- Check ABC.js import and initialization
- Verify notation string format is valid
- Check browser console for ABC.js errors
- Test with simpler notation strings

#### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit

# Restart TypeScript language server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

### Debug Tools

#### Development Tools

```bash
# Enable verbose logging
DEBUG=true npm run dev

# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

#### Testing Debug

```bash
# Run specific test file
npx vitest run src/components/__tests__/LineGenerator.test.tsx

# Run tests in watch mode
npx vitest

# Debug E2E tests
npx playwright test --debug
```

### Performance Optimization

- **Lazy load** non-critical components
- **Memoize** expensive calculations
- **Optimize** ABC.js rendering for large scores
- **Monitor** bundle size and loading performance

### Getting Help

1. **Search existing issues** and documentation
2. **Check the test-api.html** file for API testing
3. **Review the OpenAPI specification** for API details
4. **Create detailed bug reports** with reproduction steps
5. **Ask questions** in project discussions

---

## Questions?

If you have questions about contributing, please:

1. Check the project documentation
2. Review existing issues and discussions
3. Test your ideas using the provided `test-api.html` tool
4. Reach out to project maintainers

Thank you for contributing to HarrisApp! 🎵🎸

---

## Appendix

### A1. Music Theory Context

HarrisApp implements Barry Harris harmonic concepts, including:

- **Chromatic movement** in voice leading
- **Diminished chord substitutions**
- **Scale relationships** between dominant and major tonalities
- **Guitar-specific fingering patterns** and positions

### A2. API Integration Details

The application connects to a Rust-based music theory service that provides:

- **Scale analysis** and note generation
- **Pattern application** to harmonic progressions
- **Guitar tablature** calculation
- **ABC notation** generation for musical display

Understanding these concepts will help you contribute more effectively to the music theory aspects of the application.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. This project follows the principles of respect, collaboration, and constructive communication.

### Our Standards

**Positive behaviors include:**

- Being respectful and inclusive in all interactions
- Providing constructive feedback and suggestions
- Focusing on what is best for the community and project
- Showing empathy towards other community members
- Helping others learn and grow
- Acknowledging different perspectives and experiences

**Unacceptable behaviors include:**

- Harassment, discrimination, or intimidation in any form
- Offensive comments related to personal characteristics
- Disruptive or inflammatory language
- Publishing others' private information without permission
- Any conduct that could reasonably be considered inappropriate

### Music Theory Community Values

As a music theory application, we especially value:

- **Educational spirit** - Help others understand Barry Harris concepts
- **Musical diversity** - Welcome different musical backgrounds and perspectives
- **Constructive criticism** - Focus on improving the musical accuracy and usefulness
- **Collaborative learning** - Share knowledge about jazz theory and guitar techniques

### Reporting Issues

If you experience or witness unacceptable behavior:

1. **Document the incident** with as much detail as possible
2. **Report to project maintainers** via email or private message
3. **Provide context** and any relevant screenshots or links
4. **Respect confidentiality** - don't discuss reports publicly

### Enforcement

Project maintainers are responsible for clarifying standards and taking appropriate action in response to unacceptable behavior. This may include:

- Warning the individual
- Temporary suspension from project participation
- Permanent removal from the project community

### Scope

This Code of Conduct applies to:

- All project spaces (GitHub, discussions, pull requests)
- Public events where individuals represent the project
- Private communications when they affect the community

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://contributor-covenant.org/), version 2.1.

---

**Remember**: We're all here to create better music theory tools and learn from each other. Let's keep the focus on making great music software together! 🎵🎸
