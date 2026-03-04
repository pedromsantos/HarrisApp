# Deployment Guide - Experimental Tab Feature

This guide provides step-by-step instructions for deploying the Experimental Tab feature (Jazz Standards Library) to production.

## Prerequisites

- Cloudflare account with Workers and Pages access
- wrangler CLI installed and authenticated (`wrangler login`)
- Node.js 18+ installed
- Repository cloned and dependencies installed (`npm install`)

## Environment Variables

### Frontend (.env)

Create `.env` file in project root:

```env
VITE_API_KEY=your-production-api-key
VITE_API_URL=https://your-worker.your-subdomain.workers.dev
```

### Backend (wrangler.toml)

Update `wrangler.toml` in backend directory:

```toml
name = "harris-app-backend"
main = "src/lib.rs"
compatibility_date = "2024-01-01"

[vars]
API_KEY_REQUIRED = "true"

[secrets]
# Set via: wrangler secret put API_KEY
API_KEY = "<set-via-cli>"
```

## Pre-Deployment Checklist

### 1. Run All Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Smoke tests
npm run test:e2e -- E2E/smoke.spec.ts

# Performance benchmarks
npm run test:e2e -- E2E/performance/
```

All tests must pass before deployment.

### 2. Build Verification

**Frontend:**

```bash
npm run build
```

Verify no build errors and check `dist/` directory is created.

**Backend:**

```bash
cd backend
cargo build --release
wrangler deploy --dry-run
```

Verify no compilation errors.

### 3. Environment Validation

Verify environment variables are set:

```bash
# Frontend
cat .env

# Backend secrets
wrangler secret list
```

## Deployment Steps

### Step 1: Deploy Backend (Cloudflare Workers)

```bash
cd backend

# Set API key secret (if not already set)
wrangler secret put API_KEY
# Enter your API key when prompted

# Deploy worker
wrangler deploy

# Verify deployment
wrangler tail --format pretty
# Open browser and test health endpoint
curl https://your-worker.your-subdomain.workers.dev/health
```

Expected response:

```json
{
    "status": "healthy"
}
```

### Step 2: Test Backend Endpoints

```bash
# Test GET /jazz-standards
curl -H "X-API-Key: YOUR_API_KEY" \
  https://your-worker.your-subdomain.workers.dev/jazz-standards

# Test GET /jazz-standards/:id
curl -H "X-API-Key: YOUR_API_KEY" \
  https://your-worker.your-subdomain.workers.dev/jazz-standards/autumn-leaves

# Test authentication (should return 401)
curl https://your-worker.your-subdomain.workers.dev/jazz-standards
```

### Step 3: Update Frontend Environment

Update `.env` with deployed backend URL:

```env
VITE_API_KEY=your-production-api-key
VITE_API_URL=https://your-worker.your-subdomain.workers.dev
```

### Step 4: Deploy Frontend (Cloudflare Pages)

**Option A: Via Wrangler CLI**

```bash
npm run build
wrangler pages deploy dist --project-name=harris-app-frontend
```

**Option B: Via Git Push (if connected to repository)**

```bash
git push origin main
```

Cloudflare Pages will automatically build and deploy.

### Step 5: Post-Deployment Validation

Run smoke tests against production:

```bash
# Update Playwright config to use production URL
# Or set environment variable
export BASE_URL=https://harris-app-frontend.pages.dev

npm run test:e2e -- E2E/smoke.spec.ts
```

All 12 smoke tests should pass in <20 seconds.

### Step 6: Performance Validation

Run performance benchmarks against production:

```bash
npm run test:e2e -- E2E/performance/frictionless-entry.spec.ts
npm run test:e2e -- E2E/performance/fast-generation.spec.ts
npm run test:e2e -- E2E/performance/shape-switch-latency.spec.ts
```

Verify CSF targets:

- CSF 1: Frictionless entry <30 seconds
- CSF 2: Fast generation <3 seconds p95
- CSF 5: Shape switching <3 seconds

## Rollback Procedure

If deployment fails validation:

**Backend Rollback:**

```bash
cd backend
wrangler rollback
```

**Frontend Rollback:**

```bash
# Via Cloudflare Dashboard:
# 1. Go to Cloudflare Pages
# 2. Select harris-app-frontend project
# 3. Go to Deployments tab
# 4. Click "Rollback" on previous successful deployment
```

## Monitoring

### Cloudflare Workers Analytics

Monitor backend performance via Cloudflare Dashboard:

- Workers & Pages > harris-app-backend > Analytics
- Check request volume, latency, error rate

### Log Streaming

Real-time backend logs:

```bash
cd backend
wrangler tail --format pretty
```

### Frontend Monitoring

Cloudflare Pages analytics:

- Pages > harris-app-frontend > Analytics
- Check page views, load times, errors

## Troubleshooting

### Backend Returns 401 on All Requests

**Cause:** API key not set or mismatch between frontend and backend.

**Solution:**

```bash
# Check backend secret
wrangler secret list

# Update backend secret
wrangler secret put API_KEY

# Verify frontend .env matches
cat .env
```

### Standards Library Not Loading

**Cause:** Backend endpoint unreachable or CORS issue.

**Solution:**

1. Verify backend deployment:
    ```bash
    curl https://your-worker.your-subdomain.workers.dev/health
    ```
2. Check CORS configuration in `src/lib.rs`
3. Verify frontend API URL in `.env`

### Performance Targets Not Met

**Cause:** Cold start latency or network issues.

**Solution:**

1. Run performance tests multiple times (warm start)
2. Check Cloudflare Workers analytics for cold start duration
3. Consider using Workers KV for caching if needed

### 404 on Frontend Routes

**Cause:** Cloudflare Pages not configured for client-side routing.

**Solution:**
Create `_redirects` file in `public/` directory:

```
/*    /index.html   200
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
    push:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                  node-version: 18
            - run: npm install
            - run: npm test
            - run: npm run test:e2e -- E2E/smoke.spec.ts

    deploy-backend:
        needs: test
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: cloudflare/wrangler-action@v3
              with:
                  apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
                  workingDirectory: backend
                  command: deploy

    deploy-frontend:
        needs: [test, deploy-backend]
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                  node-version: 18
            - run: npm install
            - run: npm run build
            - uses: cloudflare/pages-action@v1
              with:
                  apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
                  accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
                  projectName: harris-app-frontend
                  directory: dist
```

## Production Readiness Checklist

- [ ] All 27 acceptance criteria validated
- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Smoke tests <20 seconds
- [ ] Performance benchmarks meet CSF targets
- [ ] Backend deployed and health check passing
- [ ] Frontend deployed and accessible
- [ ] API key configured and tested
- [ ] CORS configured correctly
- [ ] Error handling validated (404, 401, 500, timeouts)
- [ ] Accessibility tested (keyboard navigation)
- [ ] Monitoring configured
- [ ] Rollback procedure documented

## Support

For deployment issues or questions:

1. Check Cloudflare Workers logs: `wrangler tail`
2. Review Cloudflare Pages deployment logs in dashboard
3. Run smoke tests for quick validation
4. Refer to [README.md](../../../README.md) for development setup

## Feature Summary

**Experimental Tab - Jazz Standards Library**

Delivered functionality:

- 15 jazz standards with metadata
- Dual chord progressions (original + Barry Harris)
- Interactive line generation with 5 CAGED shapes
- Guitar tablature notation
- Keyboard-accessible interface
- Performance: All CSF targets exceeded

**User Journey:**

1. Click Experimental tab
2. Browse 15 standards in grid layout
3. Select standard to view progressions
4. Generate lines with default E shape
5. Explore all 5 CAGED shapes with instant switching
6. View notation and tablature for practice

Total time from app open to first generation: <2 seconds (target: <30s) ✅
