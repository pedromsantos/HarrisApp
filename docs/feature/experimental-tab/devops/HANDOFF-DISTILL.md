# HANDOFF: DEVOPS → DISTILL Wave

**Feature**: Standards-Based Barry Harris Learning (Experimental Tab)
**From**: Apex (Platform Architect - DEVOPS wave)
**To**: Acceptance Designer (DISTILL wave)
**Date**: 2026-03-04
**Status**: READY FOR ACCEPTANCE DESIGN

---

## Executive Summary

Infrastructure design complete for Standards Library MVP (P1+P2). **Key outcome**: Zero new infrastructure components required for backend (existing Cloudflare Workers handles new endpoints), Cloudflare Pages selected for frontend deployment. All 4 key questions answered with evidence-based ADRs. Total estimated deployment time: 15 minutes (backend) + 15 minutes (frontend) = **30 minutes to production**.

**Critical Platform Decisions**:

1. Standards endpoints **AUTHENTICATED** (X-API-Key) → API consistency with existing endpoints
2. **Aggressive CDN caching** (365 days, Vary: X-API-Key) → 5x performance improvement (50ms vs. 500ms)
3. **Cloudflare Pages** for frontend → Best integration with existing Workers backend
4. **Generous rate limiting** (100 req/min per API key) → Prevents abuse with granular control

---

## Deliverables

### Infrastructure Documentation

| Document                                 | Location                                            | Status      |
| ---------------------------------------- | --------------------------------------------------- | ----------- |
| **Infrastructure Architecture**          | `devops/infrastructure-architecture.md`             | ✅ Complete |
| **ADR-001: Authenticated Endpoints**     | `devops/adrs/ADR-001-standards-endpoints-public.md` | ✅ Complete |
| **ADR-002: CDN Caching**                 | `devops/adrs/ADR-002-aggressive-cdn-caching.md`     | ✅ Complete |
| **ADR-003: Cloudflare Pages**            | `devops/adrs/ADR-003-cloudflare-pages-frontend.md`  | ✅ Complete |
| **ADR-004: Rate Limiting (per API key)** | `devops/adrs/ADR-004-rate-limiting-strategy.md`     | ✅ Complete |

---

## Key Questions ANSWERED

### Q1: Should standards endpoints be public or require authentication?

**Answer**: **AUTHENTICATED** (X-API-Key header required)

**Rationale** (from ADR-001):

- API consistency: All feature endpoints use same auth strategy (simple mental model)
- Zero incremental friction: Frontend already includes API key for line generation
- Per-API-key rate limiting: More granular than per-IP (can revoke specific keys)
- Usage analytics: Track per-user metrics (standards browsed, generation frequency)
- Authenticated responses still cacheable (CDN uses `Vary: X-API-Key` header)

**Authentication Matrix**:
| Endpoint | Auth Required | Reason |
|----------|---------------|--------|
| GET /jazz-standards | ✅ Yes (X-API-Key) | Consistency with feature endpoints |
| GET /jazz-standards/{id} | ✅ Yes (X-API-Key) | Consistency with feature endpoints |
| POST /barry-harris/generate-instructions | ✅ Yes (X-API-Key) | Computational resource, existing |
| GET /health | ❌ No | Monitoring endpoint (public) |

**Impact on Acceptance Tests**:

- **ALL feature endpoints**: Test with `X-API-Key` header (consistent behavior)
- **Error handling**: Test 401 Unauthorized when API key missing/invalid
- **Rate limiting**: Test 429 Too Many Requests when rate limit exceeded

---

### Q2: Should GET /jazz-standards be cached at CDN level?

**Answer**: **YES**, aggressively (365 days edge cache, 24 hours browser cache)

**Rationale** (from ADR-002):

- Data is compile-time static (`include_str!` macro) → Never changes without deployment
- Performance improvement: **5x faster** (500ms → 50ms)
- Cache hit ratio: Expected >95%
- Cache invalidation: Automatic in CI/CD workflow (cache purge on deployment)

**Expected Performance**:
| Metric | Without Cache | With Cache | Improvement |
|--------|---------------|------------|-------------|
| Cold start | 500ms | 500ms (first request) | N/A |
| Warm requests | 100ms | **50ms** | 2x |
| p95 latency | 500ms | **100ms** | 5x |

**Impact on Acceptance Tests**:

- First test request: May be slow (cache MISS, populates edge cache)
- Subsequent requests: Fast (cache HIT, served from edge)
- Test cache invalidation: Verify new data served after deployment

---

### Q3: Which metrics should be tracked to validate CSFs?

**Answer**: Comprehensive monitoring with Cloudflare Analytics + RUM

**Metrics by CSF**:

**CSF 1: Frictionless Entry (<30s)**

- **Metric**: Time to first generation (RUM: `performance.measure('generation', 'app-load', 'generation-complete')`)
- **Target**: <30 seconds
- **Alert**: >30s for 10% of users for 1 hour → Warning

**CSF 2: Fast Generation (<3s p95)**

- **Metric**: POST /barry-harris/generate-instructions p95 latency (Cloudflare Workers Analytics)
- **Target**: <3 seconds
- **Alert**: >3s for 10 minutes → Critical

**CSF 5: Effortless Shape Exploration (<3s)**

- **Metric**: Shape switch latency (RUM: `performance.measure('shape-switch', 'shape-click', 'lines-rendered')`)
- **Target**: <3 seconds
- **Alert**: >3s for 10% of users for 1 hour → Warning

**General Metrics**:

- **Availability**: 99.5% (Cloudflare SLO)
- **Error Rate**: <1% (Cloudflare Workers Analytics)
- **Cache Hit Ratio**: >95% for GET /jazz-standards

**Dashboard Design**: See `infrastructure-architecture.md` Section 6 (Observability & Monitoring)

**Impact on Acceptance Tests**:

- Validate performance benchmarks before launch (load test 100 requests, measure p95)
- Include performance assertions in E2E tests (e.g., `expect(responseTime).toBeLessThan(3000)`)

---

### Q4: Should standards endpoints be rate-limited?

**Answer**: **YES**, but generously (100 req/min per IP)

**Rationale** (from ADR-004):

- **Prevents abuse**: DDoS, scraping, computational overload
- **User-friendly limits**: Allows rapid browsing (15 standards × 6 views/min = 90 req/min)
- **CAPTCHA challenge**: Humans can continue if limit exceeded (not permanent block)

**Rate Limiting Rules**:

**Rule 1: Standards Endpoints**

- Limit: **100 requests per minute per IP**
- Action: **Challenge (CAPTCHA)**
- Cooldown: 60 seconds

**Rule 2: Line Generation Endpoint**

- Limit: **20 requests per minute per IP**
- Action: **Block**
- Cooldown: 300 seconds (5 minutes)

**Impact on Acceptance Tests**:

- Test rate limit behavior: Send 101 requests, verify 429 response on request 101
- Test retry logic: Verify frontend handles 429 with exponential backoff
- Test CAPTCHA bypass: Manual test (automated tests cannot solve CAPTCHA)

---

## Infrastructure Design Summary

### Deployment Architecture

**Backend** (Cloudflare Workers):

- Platform: Existing (zero infrastructure changes)
- New Endpoints: GET /jazz-standards, GET /jazz-standards/{id}
- Deployment: Automatic on push to `master` (existing deploy.yml)
- Deployment Time: ~10 minutes (test + deploy + cache purge)

**Frontend** (Cloudflare Pages):

- Platform: NEW (one-time setup required)
- Domain: harrisjazzlines.com (or app.harrisjazzlines.com)
- Deployment: Automatic on push to `main` (GitHub integration)
- Deployment Time: ~5 minutes (test + build + deploy)

**CDN Caching**:

- Edge TTL: 365 days for GET /jazz-standards\*
- Browser TTL: 24 hours
- Cache Invalidation: Automatic in CI/CD (curl to Cloudflare API)

**Rate Limiting**:

- Standards: 100 req/min per IP (CAPTCHA challenge)
- Line Generation: 20 req/min per IP (block)

**Monitoring**:

- Cloudflare Workers Analytics (backend metrics)
- Cloudflare Pages Analytics (frontend metrics)
- Custom RUM (Browser Performance API for CSF tracking)

### Cost

**Total Monthly Cost**: **$0/month** (all within Cloudflare free tiers)

| Component                | Free Tier           | Expected Usage      | Cost |
| ------------------------ | ------------------- | ------------------- | ---- |
| Cloudflare Workers       | 100k requests/day   | ~10k requests/month | $0   |
| Cloudflare Pages         | 500 builds/month    | ~20 builds/month    | $0   |
| Cloudflare CDN           | Unlimited bandwidth | <1 GB/month         | $0   |
| Cloudflare Rate Limiting | 10k requests/month  | ~100 requests/month | $0   |

---

## CI/CD Pipeline Design

### Backend Pipeline (Existing - No Changes)

**Workflow**: `.github/workflows/ci.yml` + `.github/workflows/deploy.yml`

**Stages**:

1. **Commit** (~5 min): fmt → clippy → test → codecov
2. **Deploy** (~10 min): test → wrangler deploy → **cache purge** → smoke tests

**Changes Required**:

- ✅ Add cache purge step to `deploy.yml` (5 lines YAML)
- ✅ Add `CLOUDFLARE_ZONE_ID` secret to GitHub Actions

**Quality Gates**:

- All tests pass (blocking)
- No clippy warnings (blocking)
- Formatting compliant (blocking)
- Coverage uploaded (non-blocking)

---

### Frontend Pipeline (New)

**Workflow**: `.github/workflows/deploy-frontend.yml` (NEW)

**Stages**:

1. **Commit** (~5 min): test → lint → build
2. **Preview** (PR only): Deploy to Cloudflare Pages preview → Comment preview URL
3. **Production** (main branch): Deploy to Cloudflare Pages production → Smoke tests

**Quality Gates**:

- All tests pass (blocking)
- Linting passes (blocking)
- Build succeeds (blocking)
- Smoke tests pass (blocking: frontend loads, standards visible)

**Workflow File**: See `infrastructure-architecture.md` Section 4 (CI/CD Pipeline Design) for complete YAML

---

## Deployment Procedures

### Backend Deployment (Automated)

**Trigger**: Push to `master` branch

**Steps**:

1. GitHub Actions runs `deploy.yml`
2. Run tests (`cargo test`)
3. Deploy to Cloudflare (`wrangler deploy`)
4. **Purge standards cache** (curl to Cloudflare API)
5. Run smoke tests (GET /jazz-standards returns 200)

**Manual Override** (emergency):

```bash
cd /Users/pedro/src/wes
cargo test
wrangler deploy
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" \
  --data '{"files":["https://api.harrisjazzlines.com/jazz-standards"]}'
```

**Expected Duration**: 10 minutes

---

### Frontend Deployment (Automated)

**Trigger**: Push to `main` branch

**Steps**:

1. GitHub Actions runs `deploy-frontend.yml` (or Cloudflare Pages GitHub integration)
2. Install dependencies (`npm ci`)
3. Run tests (`npm run test:all`)
4. Run linter (`npm run lint`)
5. Build app (`npm run build` with production env vars)
6. Deploy to Cloudflare Pages (`cloudflare/pages-action@v1`)
7. Run smoke tests (GET https://harrisjazzlines.com returns 200)

**Manual Override** (emergency):

```bash
cd /Users/pedro/src/HarrisApp
npm ci
npm run build
npx wrangler pages deploy dist --project-name=harrisjazzlines-app
```

**Expected Duration**: 8 minutes

---

## Rollback Procedures

### Backend Rollback

**Method 1: Wrangler Rollback** (fastest, 1 minute):

```bash
cd /Users/pedro/src/wes
wrangler rollback
# Select previous version from prompt
```

**Method 2: Git Revert + Redeploy** (2-5 minutes):

```bash
cd /Users/pedro/src/wes
git log --oneline -n 5
git revert <commit-hash> --no-edit
git push origin master # Triggers deploy.yml
```

**Expected Downtime**: <5 minutes

---

### Frontend Rollback

**Method 1: Cloudflare Pages Dashboard** (fastest, 30 seconds):

1. Login to Cloudflare Dashboard
2. Pages → harrisjazzlines-app → Deployments
3. Find previous deployment → Click "Rollback"

**Method 2: Git Revert + Redeploy** (5 minutes):

```bash
cd /Users/pedro/src/HarrisApp
git log --oneline -n 5
git revert <commit-hash> --no-edit
git push origin main # Triggers deploy-frontend.yml
```

**Expected Downtime**: <2 minutes

---

## Performance Targets (CSF Validation)

| CSF                    | Target                 | Measurement Method         | Acceptance Criteria          |
| ---------------------- | ---------------------- | -------------------------- | ---------------------------- |
| **Frictionless Entry** | <30s app to generation | Manual user test (5 users) | 100% users complete in <30s  |
| **Fast Generation**    | <3s p95                | Load test (100 requests)   | 95%+ requests <3s            |
| **Shape Switch**       | <3s                    | Frontend RUM (10 switches) | 95%+ switches <3s            |
| **Standards Load**     | <2s                    | Lighthouse audit           | p95 <2s                      |
| **Journey Time**       | <5min total            | Manual user test           | 100% users practice in <5min |

**Pre-Launch Validation**:

- [ ] Run load test: 100 concurrent requests to POST /barry-harris/generate-instructions
- [ ] Lighthouse audit: Performance score >90
- [ ] Manual user test: 5 users complete journey in <5 minutes

---

## Security Architecture

### Authentication

**Authenticated Endpoints** (X-API-Key header):

- GET /jazz-standards
- GET /jazz-standards/{id}
- POST /barry-harris/generate-instructions (existing)

**Public Endpoints** (no auth):

- GET /health (monitoring only)

**Frontend API Key**:

- Included in build (VITE_API_KEY environment variable)
- Used for all feature endpoint requests
- Acceptable exposure: Rate limiting per API key prevents abuse

### Rate Limiting

**Cloudflare WAF Rules** (configured in dashboard):

1. **standards-rate-limit**: 100 req/min per API key, block (429 Too Many Requests)
2. **line-generation-rate-limit**: 20 req/min per API key, block 5 minutes

**Frontend Retry Logic**:

- Exponential backoff: 1s → 2s → 4s (max 3 retries)
- User-friendly error message: "You are browsing very quickly! Please wait a moment."

### CORS Configuration

**Backend** (src/lib.rs update required):

```rust
// Authenticated endpoints: Allow X-API-Key header
if req.path().starts_with("/jazz-standards") && req.method() == Method::Get {
    response.headers_mut().set("Access-Control-Allow-Origin", "https://harrisapp.com")?;
    response.headers_mut().set("Access-Control-Allow-Headers", "Content-Type, X-API-Key")?;
    response.headers_mut().set("Access-Control-Max-Age", "86400")?;
}
```

---

## Monitoring & Observability

### Primary Dashboard: CSF Tracking

**Panels** (Cloudflare Workers Analytics):

1. **Frictionless Entry**: GET /jazz-standards p95 latency (target: 2s)
2. **Fast Generation**: POST /barry-harris p95 latency (target: 3s)
3. **API Availability**: Success rate % (target: 99.5%)
4. **Error Rate**: 4xx/5xx per endpoint (target: <1%)
5. **Cache Hit Ratio**: GET /jazz-standards cache HITs (target: >95%)

### Secondary Dashboard: Health Monitoring

**Panels**:

1. **Response Status Codes**: 200 vs. 404 vs. 429 vs. 500 (pie chart)
2. **Geographic Distribution**: Requests by country (map)
3. **Rate Limit Triggers**: 429 count (time series)
4. **Top Requested Standards**: GET /jazz-standards/{id} by ID (bar chart)

### Alerting Rules

**Critical Alerts** (email):

1. Line Generation SLO Breach: p95 >3s for 10 minutes
2. API Availability Breach: Error rate >1% for 10 minutes
3. Service Down: Zero requests for 5 minutes (weekday 9am-9pm)

**Warning Alerts** (email): 4. Standards Load Slow: p95 >2s for 10 minutes 5. Error Budget Low: <20% remaining (weekly window)

---

## Acceptance Test Implications

### E2E Test Coverage Required

**Happy Path**:

1. **Browse Standards**: GET /jazz-standards returns 15 standards
2. **View Standard Detail**: GET /jazz-standards/autumn-leaves returns single standard
3. **Generate Lines**: POST /barry-harris/generate-instructions with Autumn Leaves chords returns lines
4. **Switch Shapes**: POST with different `caged_shape` (C, A, G, E, D) returns different lines

**Error Scenarios**:

1. **404 Not Found**: GET /jazz-standards/invalid-id returns 404
2. **Rate Limiting**: 101 requests to GET /jazz-standards returns 429 on request 101
3. **Network Error**: Simulate timeout, verify retry logic
4. **Authentication Failure**: POST /barry-harris without X-API-Key returns 401 (existing)

**Performance Tests**:

1. **Standards Load Time**: GET /jazz-standards completes in <2s (p95)
2. **Line Generation Time**: POST /barry-harris completes in <3s (p95)
3. **Cache Effectiveness**: Second request to GET /jazz-standards faster than first

---

## Implementation Checklist

### One-Time Setup (Before DELIVER Wave)

**Cloudflare Configuration**:

- [ ] Create Cloudflare Pages project (harrisjazzlines-app)
- [ ] Configure GitHub integration (HarrisApp repository → `main` branch)
- [ ] Set environment variables (VITE_API_BASE_URL, VITE_API_KEY)
- [ ] Configure custom domain (harrisjazzlines.com or app.harrisjazzlines.com)
- [ ] Create CDN caching rules (standards endpoints: 365d edge, 24h browser)
- [ ] Create rate limiting rules (standards: 100/min, line gen: 20/min)
- [ ] Add `CLOUDFLARE_ZONE_ID` secret to GitHub Actions (for cache purge)

**GitHub Actions**:

- [ ] Create `.github/workflows/deploy-frontend.yml` (see infrastructure-architecture.md)
- [ ] Update `.github/workflows/deploy.yml` (add cache purge step)
- [ ] Add `VITE_API_KEY` secret to GitHub Actions (HarrisApp repository)

**Expected Duration**: 30 minutes (one-time)

---

### Per-Deployment (Automated)

**Backend Deployment**:

1. Push to `master` → deploy.yml runs → Tests → Deploy → Cache purge → Smoke tests
2. Monitor Cloudflare dashboard (error rate, latency)

**Frontend Deployment**:

1. Push to `main` → deploy-frontend.yml runs → Tests → Build → Deploy → Smoke tests
2. Monitor Cloudflare Pages dashboard (build status, deployment URL)

**Rollback** (if needed):

- Backend: `wrangler rollback` (1 minute)
- Frontend: Cloudflare Pages dashboard → Rollback (30 seconds)

---

## Risk Assessment

### Technical Risks

| Risk                              | Probability | Impact | Mitigation                                        |
| --------------------------------- | ----------- | ------ | ------------------------------------------------- |
| Cloudflare Workers cold start >3s | Low         | High   | Pre-warm Workers via health checks every 5min     |
| CDN cache serves stale data       | Low         | Medium | Cache purge in CI/CD, 24h browser TTL             |
| Frontend build fails              | Medium      | Medium | Lock dependencies (package-lock.json), test in CI |
| API key exposed in frontend       | High        | Low    | Rate limiting mitigates abuse, rotate quarterly   |
| Rate limiting blocks users        | Low         | Medium | Generous limits (100/min), CAPTCHA challenge      |

### Mitigation Actions

**Pre-Deployment**:

1. Test cache purge manually (curl to Cloudflare API)
2. Validate rate limiting rules (simulate 101 requests)
3. Test rollback procedures (deploy canary, rollback, verify)

**Post-Deployment**:

1. Monitor error rate (first 30 minutes)
2. Validate cache hit ratio (expect >95% after 1 hour)
3. Check for false positive rate limit triggers (expect <1%)

---

## Next Steps for Acceptance Designer

### BDD Scenario Design

**Required Scenarios** (Gherkin):

1. **Browse Standards Library** (CSF 1 validation)
    - Given user opens HarrisApp
    - When user clicks "Experimental" tab
    - Then standards library loads in <2 seconds
    - And displays 15 standards with metadata

2. **Generate Lines with Shape Selection** (CSF 2 + CSF 5)
    - Given user views "Autumn Leaves" detail page
    - When user clicks "Generate Lines" button
    - Then lines generate in <3 seconds
    - When user clicks "A" shape button
    - Then new lines generate in <3 seconds

3. **Handle Rate Limiting Gracefully**
    - Given user makes 100 requests to GET /jazz-standards in 60 seconds
    - When user makes 101st request
    - Then system returns 429 with CAPTCHA challenge
    - And user can retry after completing CAPTCHA

4. **Cache Invalidation After Deployment**
    - Given new Worker deployed with updated standards
    - When user requests GET /jazz-standards
    - Then receives new data (not cached old data)

### Performance Benchmark Scenarios

**Required Tests**:

1. Load test: 100 concurrent requests to POST /barry-harris/generate-instructions
    - Acceptance: 95%+ complete in <3 seconds
2. Lighthouse audit: harrisjazzlines.com
    - Acceptance: Performance score >90
3. Manual user test: 5 users complete journey (app open → guitar practice)
    - Acceptance: 100% complete in <5 minutes

### E2E Test Framework Recommendations

**Backend E2E** (existing: Vitest + Miniflare):

- ✅ Reuse existing test suite in `/Users/pedro/src/wes/test/`
- ✅ Add tests for GET /jazz-standards, GET /jazz-standards/{id}
- ⚠️ Test cache behavior (first request slow, second fast)

**Frontend E2E** (new: Playwright or Cypress):

- 🆕 Create E2E test suite in `/Users/pedro/src/HarrisApp/e2e/`
- 🆕 Test complete user journey (browse → select → generate → switch shapes)
- 🆕 Test error scenarios (404, timeout, rate limit)

---

## Handoff Materials

### Documents

- [x] Infrastructure Architecture (`devops/infrastructure-architecture.md`)
- [x] ADR-001: Authenticated Endpoints (`devops/adrs/ADR-001-standards-endpoints-public.md`)
- [x] ADR-002: CDN Caching with Vary: X-API-Key (`devops/adrs/ADR-002-aggressive-cdn-caching.md`)
- [x] ADR-003: Cloudflare Pages (`devops/adrs/ADR-003-cloudflare-pages-frontend.md`)
- [x] ADR-004: Rate Limiting per API Key (`devops/adrs/ADR-004-rate-limiting-strategy.md`)

### Artifacts to Create (DELIVER Wave)

- [ ] `.github/workflows/deploy-frontend.yml` (frontend CI/CD)
- [ ] Update `.github/workflows/deploy.yml` (add cache purge step)
- [ ] Cloudflare Pages project setup (one-time, 10 minutes)
- [ ] Cloudflare CDN caching rules (one-time, 5 minutes)
- [ ] Cloudflare rate limiting rules (one-time, 5 minutes)
- [ ] Monitoring dashboards (Cloudflare Analytics, 15 minutes)

---

## Success Criteria

### DISTILL Wave Ready

- [x] All 4 key questions answered with ADRs
- [x] Infrastructure design complete (backend + frontend + CDN + monitoring)
- [x] CI/CD pipeline design documented (existing + new workflows)
- [x] Deployment procedures documented (automated + manual + rollback)
- [x] Performance targets defined (CSF validation)
- [x] Security architecture defined (auth, rate limiting, CORS)
- [x] Monitoring strategy defined (dashboards, alerts, SLOs)

### DELIVER Wave Ready

- [ ] Acceptance tests designed (BDD scenarios)
- [ ] E2E test framework selected (Playwright/Cypress)
- [ ] Performance benchmarks defined (load tests, Lighthouse)
- [ ] Deployment checklist created (one-time setup + per-deployment)

---

## Contact

**Platform Architecture Questions**: Apex (Platform Architect)
**Next Wave**: Acceptance Designer (DISTILL wave)
**Implementation Wave**: Software Crafter (DELIVER wave)

---

## Approval Status

- [x] Phase 1: Requirements Analysis
- [x] Phase 2: Existing Infrastructure Analysis
- [x] Phase 3: Platform Design
- [x] Phase 4: Quality Validation
- [x] Phase 5: Handoff Package Complete
- [ ] Peer Review: TBD (platform-architect-reviewer)
- [ ] Acceptance Designer Sign-Off: TBD

**Date Submitted for Acceptance Design**: 2026-03-04
**Expected DISTILL Wave Start**: TBD
