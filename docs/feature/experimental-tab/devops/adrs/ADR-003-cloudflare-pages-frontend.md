# ADR-003: Cloudflare Pages for Frontend Deployment

**Status**: Accepted
**Date**: 2026-03-04
**Deciders**: Apex (Platform Architect)
**Wave**: DEVOPS (Platform Design)

---

## Context

HarrisApp (React SPA) currently has no production deployment infrastructure. We must select a frontend hosting platform for the Standards Library MVP.

**Requirements**:

- React 19 + Vite build output (`npm run build` → `dist/` directory)
- Custom domain (`harrisjazzlines.com` or `app.harrisjazzlines.com`)
- CDN for fast global delivery
- CI/CD integration (automated deployment on push to `main`)
- Zero-downtime deployments with rollback capability
- Environment variable management (VITE_API_BASE_URL, VITE_API_KEY)

**Constraints**:

- Backend already on Cloudflare Workers (api.harrisjazzlines.com)
- Solo developer (minimal operational complexity preferred)
- Budget: $0/month (free tier required for MVP)

---

## Decision

**Deploy HarrisApp to Cloudflare Pages** with automatic GitHub integration.

**Domain**: `harrisjazzlines.com` (primary) or `app.harrisjazzlines.com` (alternative)
**Build**: `npm run build`
**Output**: `dist/`
**Deployment Trigger**: Push to `main` branch (automatic via GitHub integration)

---

## Rationale

### 1. Cloudflare Ecosystem Integration

**Benefits of same platform (Workers + Pages)**:

- **Shared edge network**: Frontend and backend served from same Cloudflare edge locations (lower latency)
- **Simplified DNS**: Single Cloudflare DNS management (api.harrisjazzlines.com + harrisjazzlines.com)
- **Unified monitoring**: Single dashboard for Workers + Pages analytics
- **No CORS complexity**: Same edge network, easier origin configuration
- **Cost**: $0 (both within Cloudflare free tier)

**Alternative (separate platform)**:

- Requires CORS configuration (Workers → Vercel/Netlify)
- Separate DNS management (Cloudflare for API, other for frontend)
- Two monitoring dashboards
- No cost benefit (Vercel/Netlify free tiers similar)

**Conclusion**: Cloudflare Pages provides best integration with existing Workers backend.

### 2. Performance

**Cloudflare Pages Performance**:

- Global CDN: 200+ edge locations
- Automatic asset optimization (compression, minification)
- HTTP/3 support (faster than HTTP/2)
- Smart Tiered Caching (multi-layer edge cache)
- Expected p95 latency: <100ms globally

**Competitors**:

- Vercel: Similar performance (global CDN, HTTP/3)
- Netlify: Similar performance (global CDN)
- GitHub Pages: Slower (limited edge locations, no HTTP/3)

**Conclusion**: Cloudflare Pages matches best-in-class performance.

### 3. Developer Experience

**Cloudflare Pages DX**:

- ✅ **GitHub integration**: Automatic deployment on push (zero config)
- ✅ **Preview deployments**: Every PR gets preview URL
- ✅ **Instant rollback**: Click to rollback in dashboard (30 seconds)
- ✅ **Build logs**: Visible in dashboard + GitHub Actions
- ✅ **Environment variables**: Managed in dashboard (production + preview)

**Competitors**:

- Vercel: Excellent DX (similar features)
- Netlify: Excellent DX (similar features)
- GitHub Pages: Poor DX (manual deployment, no preview, no rollback)

**Conclusion**: Cloudflare Pages matches best DX (equivalent to Vercel/Netlify).

### 4. Cost

**Cloudflare Pages Free Tier**:

- 500 builds/month
- Unlimited requests
- Unlimited bandwidth
- **Cost**: $0/month for MVP

**Competitors**:

- Vercel Free: 100 builds/month, unlimited bandwidth → $0
- Netlify Free: 300 builds/month, 100 GB bandwidth → $0
- GitHub Pages: Unlimited builds, unlimited bandwidth → $0

**Conclusion**: All free tiers sufficient for MVP. Cloudflare offers most generous build limit.

### 5. Operational Simplicity

**Solo developer considerations**:

- Single platform (Cloudflare) for API + frontend
- Single login (Cloudflare dashboard)
- Single billing (even if upgrading beyond free tier)
- Minimal context switching

**Alternative (multi-platform)**:

- Two platforms (Cloudflare for API, Vercel/Netlify for frontend)
- Two dashboards
- Two billing accounts
- More cognitive load

**Conclusion**: Single platform reduces operational complexity for solo developer.

---

## Consequences

### Positive

- ✅ **Performance**: Global CDN with <100ms p95 latency
- ✅ **Integration**: Seamless with existing Cloudflare Workers backend
- ✅ **Cost**: $0/month (free tier sufficient for MVP)
- ✅ **DX**: Automatic deployments, preview URLs, instant rollback
- ✅ **Simplicity**: Single platform for all infrastructure

### Negative

- ⚠️ **Vendor Lock-in**: Cloudflare-specific (but static SPA portable to any host)
- ⚠️ **Build Limitations**: 500 builds/month (acceptable for MVP, ~16 builds/day)

### Neutral

- 🔀 **No Server-Side Rendering**: Static SPA only (acceptable: React client-side rendering)
- 🔀 **No Edge Functions**: Cloudflare Pages supports Workers integration (future enhancement)

---

## Alternatives Considered

### Alternative 1: Vercel

**Pros**:

- Excellent DX (preview deployments, instant rollback)
- Performance (global CDN, HTTP/3)
- Free tier: 100 builds/month, unlimited bandwidth

**Cons**:

- **Separate platform**: Requires CORS, separate DNS, two dashboards
- Lower build limit (100 vs. 500)
- No integration benefit with Cloudflare Workers

**Rejected**: No advantage over Cloudflare Pages, worse integration.

### Alternative 2: Netlify

**Pros**:

- Excellent DX (preview deployments, instant rollback)
- Performance (global CDN)
- Free tier: 300 builds/month, 100 GB bandwidth

**Cons**:

- **Separate platform**: Requires CORS, separate DNS, two dashboards
- Bandwidth limit (100 GB vs. unlimited)
- No integration benefit with Cloudflare Workers

**Rejected**: No advantage over Cloudflare Pages, worse integration.

### Alternative 3: GitHub Pages

**Pros**:

- Free (unlimited builds, unlimited bandwidth)
- Simple (push to gh-pages branch)

**Cons**:

- **Poor DX**: Manual deployment, no preview URLs, no rollback
- **Limited CDN**: Slower edge distribution than Cloudflare/Vercel/Netlify
- **No custom domain HTTPS** without Cloudflare proxy (defeats purpose)
- **Missing CSF 1**: Slower page load times (>2s possible)

**Rejected**: Unacceptable UX and performance trade-offs.

### Alternative 4: AWS S3 + CloudFront

**Pros**:

- Full control
- AWS ecosystem (if expanding to AWS services)

**Cons**:

- **Complex setup**: S3 bucket, CloudFront distribution, Route53, ACM certificate
- **Manual deployment**: Requires custom CI/CD workflow
- **Cost**: $0.50-$5/month (CloudFront + S3)
- **Operational burden**: Too complex for solo developer

**Rejected**: Over-engineered for static SPA, higher cost and complexity.

---

## Implementation

### Cloudflare Pages Setup (One-Time)

**Step 1: Create Pages Project**

1. Login to Cloudflare Dashboard
2. Navigate to Pages
3. Click "Create a project"
4. Connect GitHub account
5. Select `HarrisApp` repository
6. Configure:
    - **Production branch**: `main`
    - **Build command**: `npm run build`
    - **Build output directory**: `dist`
    - **Framework preset**: React (Vite)

**Step 2: Configure Environment Variables**

- `VITE_API_BASE_URL`: `https://api.harrisjazzlines.com`
- `VITE_API_KEY`: (production API key from secrets)
- `NODE_ENV`: `production`

**Step 3: Configure Custom Domain**

1. Add custom domain: `harrisjazzlines.com` (or `app.harrisjazzlines.com`)
2. Cloudflare automatically provisions SSL certificate (Let's Encrypt)
3. DNS: CNAME record added automatically

**Expected Duration**: 10 minutes (one-time setup)

### CI/CD Integration

**Option 1: GitHub Integration (Recommended)**

- Automatic: Push to `main` triggers deployment (zero config)
- Preview: Every PR gets preview URL (e.g., `pr-123.harrisjazzlines.pages.dev`)
- No `.github/workflows/` file needed (Cloudflare handles deployment)

**Option 2: GitHub Actions (Manual Control)**

- Create `.github/workflows/deploy-frontend.yml` (custom deployment logic)
- Use `cloudflare/pages-action@v1` (manual control over deployment)
- Benefits: Custom smoke tests, advanced workflows
- Trade-off: More complex, less automatic

**Selected**: Option 1 (GitHub Integration) for MVP. Option 2 available for future customization.

### Deployment Flow

**Production Deployment**:

1. Push to `main` branch
2. Cloudflare automatically triggers build
3. Build runs: `npm ci && npm run build`
4. Build output (`dist/`) uploaded to Cloudflare Pages
5. Atomic deployment (instant cutover)
6. Previous version retained for rollback

**Expected Duration**: 3-5 minutes (per deployment)

### Rollback Procedure

**Method 1: Cloudflare Dashboard** (fastest):

1. Login to Cloudflare Dashboard
2. Navigate to Pages → harrisjazzlines-app
3. Click "Deployments" tab
4. Find previous successful deployment
5. Click "Rollback to this deployment"

**Expected Duration**: 30 seconds

**Method 2: Git Revert**:

1. `git revert <commit-hash>`
2. `git push origin main`
3. Automatic redeployment with reverted code

**Expected Duration**: 5 minutes

---

## Validation

### Pre-Deployment Checklist

- [ ] Cloudflare Pages project created
- [ ] GitHub integration configured
- [ ] Environment variables set (VITE_API_BASE_URL, VITE_API_KEY)
- [ ] Custom domain configured (harrisjazzlines.com)
- [ ] SSL certificate provisioned (automatic)

### Post-Deployment Validation

**Smoke Tests**:

1. Visit `https://harrisjazzlines.com` → Page loads
2. Navigate to "Experimental" tab → Standards library visible
3. Click standard → Detail page loads
4. Generate lines → API call succeeds

**Performance Validation**:

1. Lighthouse audit: Performance score >90
2. Page load time: <2 seconds (p95)
3. Time to Interactive: <3 seconds (p95)

---

## Monitoring

**Cloudflare Pages Analytics** (included):

- Page views
- Unique visitors
- Page load time (p50, p95, p99)
- Geographic distribution
- Deployment history

**Custom Metrics** (optional):

- Real User Monitoring (RUM) via Browser Performance API
- Track time to first generation (CSF 1)
- Track shape switch latency (CSF 5)

---

## Migration Path (Future)

If requirements change:

- **Cloudflare → Vercel**: Export `dist/`, deploy to Vercel (1-day migration)
- **Cloudflare → Netlify**: Export `dist/`, deploy to Netlify (1-day migration)
- **Cloudflare → AWS**: S3 + CloudFront setup (2-3 days migration)

**Risk Mitigation**: Static SPA portable to any platform (no vendor lock-in).

---

## References

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Production Build](https://react.dev/learn/start-a-new-react-project)

---

## Approval

**Proposed**: 2026-03-04
**Reviewed**: TBD
**Approved**: TBD
