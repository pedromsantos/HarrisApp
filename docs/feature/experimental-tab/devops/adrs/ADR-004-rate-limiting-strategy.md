# ADR-004: Cloudflare Rate Limiting Strategy

**Status**: Accepted
**Date**: 2026-03-04
**Deciders**: Apex (Platform Architect)
**Wave**: DEVOPS (Platform Design)

---

## Context

The Standards Library MVP introduces authenticated endpoints (GET `/jazz-standards`, GET `/jazz-standards/{id}`) and reuses existing authenticated endpoint (POST `/barry-harris/generate-instructions`). All endpoints require X-API-Key authentication. We must protect against abuse while allowing legitimate use.

**Abuse Scenarios**:

1. **DDoS Attack**: Overwhelming API with requests to cause service degradation
2. **Data Scraping**: Automated bulk downloads of standards data
3. **Computational Abuse**: Excessive line generation requests (expensive operation)
4. **Accidental Overuse**: Buggy frontend causing request loops
5. **API Key Exposure**: Key embedded in frontend bundle could be extracted

**Constraints**:

- Authenticated endpoints (X-API-Key for all feature endpoints)
- Solo developer (minimal operational burden)
- Free tier (Cloudflare Rate Limiting: 10k free requests, then $0.05/10k)

---

## Decision

**Implement Cloudflare Rate Limiting with two rules:**

**Rule 1: Standards Endpoints (Generous Limit)**

- **Match**: `api.harrisjazzlines.com/jazz-standards*`
- **Limit**: **100 requests per minute per API key**
- **Action**: **Block** (429 Too Many Requests)
- **Duration**: 60 seconds

**Rule 2: Line Generation Endpoint (Moderate Limit)**

- **Match**: `api.harrisjazzlines.com/barry-harris/generate-instructions`
- **Limit**: **20 requests per minute per API key**
- **Action**: **Block** (429 Too Many Requests)
- **Duration**: 300 seconds (5 minutes)

---

## Rationale

### 1. Standards Endpoints Rate Limit Calculation

**Legitimate Use Case Analysis**:

- 15 standards in library
- User browses all standards: 1 request for list + 15 requests for details = 16 requests
- User explores multiple times: 16 requests × 5 explorations = 80 requests
- Safety margin: 80 × 1.25 = **100 requests/min**

**Why 100 req/min is generous**:

- Allows rapid browsing (15 standards × 6 views/min = 90 req/min)
- Accommodates buggy clients (retries, duplicates)
- **Human-impossible threshold**: No human can click 100 links in 60 seconds

**Conclusion**: 100 req/min allows all legitimate use, blocks automation.

### 2. Line Generation Endpoint Rate Limit Calculation

**Legitimate Use Case Analysis**:

- CAGED shapes: 5 shapes (C, A, G, E, D)
- User explores all shapes: 5 requests
- User tries multiple standards: 5 requests × 3 standards = 15 requests
- Safety margin: 15 × 1.33 = **20 requests/min**

**Why 20 req/min is moderate**:

- Allows shape exploration (5 shapes × 3 retries = 15 req/min)
- **Blocks bulk automation**: Scripts typically make >100 req/min
- **Computational protection**: Line generation is CPU-intensive (protect Workers from overload)

**Conclusion**: 20 req/min allows legitimate shape exploration, blocks abuse.

### 3. Action Selection (Challenge vs. Block)

**Standards Endpoints: Challenge (CAPTCHA)**

- **Rationale**: Public data, humans should never be permanently blocked
- **Benefit**: Allows humans who exceed limit (e.g., browser auto-refresh bug) to continue
- **Trade-off**: Bots with CAPTCHA solvers can bypass (acceptable: low-value data)

**Line Generation Endpoint: Block**

- **Rationale**: Computational resource, stricter protection needed
- **Benefit**: Prevents automation abuse (no CAPTCHA bypass)
- **Trade-off**: Humans who exceed limit must wait 5 minutes (acceptable: 20/min is very generous)

### 4. Duration Selection

**Standards Endpoints: 60 seconds**

- **Short cooldown**: Encourages retry (user may have legitimate reason)
- **User-friendly**: Minimal disruption (1-minute wait is tolerable)

**Line Generation Endpoint: 300 seconds (5 minutes)**

- **Longer cooldown**: Stronger deterrent for abuse
- **Computational protection**: Prevents rapid retry loops (reduces Worker load)
- **User impact**: Rare (legitimate users unlikely to hit 20 req/min)

---

## Consequences

### Positive

- ✅ **Abuse Protection**: Blocks DDoS, scraping, computational abuse
- ✅ **User-Friendly**: Generous limits allow all legitimate use
- ✅ **Cost**: $0/month (within 10k free requests threshold)
- ✅ **Operational Simplicity**: Cloudflare-managed (no custom logic)
- ✅ **CSF Alignment**: Does not impact frictionless entry (CSF 1)

### Negative

- ⚠️ **Shared IP Risk**: Users behind NAT/VPN may share IP, hit limit collectively
    - **Mitigation**: CAPTCHA challenge allows humans to continue
- ⚠️ **False Positives**: Buggy frontend may trigger rate limit for legitimate user
    - **Mitigation**: Short cooldown (60s), CAPTCHA challenge

### Neutral

- 🔀 **No Per-User Limits**: Rate limiting by IP only (acceptable: anonymous usage)

---

## Alternatives Considered

### Alternative 1: No Rate Limiting

**Pros**:

- Simple (zero config)
- Zero false positives

**Cons**:

- **Vulnerable to DDoS**: API can be overwhelmed
- **Computational abuse**: Expensive line generation requests unchecked
- **Cloudflare Workers costs**: Could exceed free tier (100k requests/day)

**Rejected**: Unacceptable security risk.

### Alternative 2: Stricter Limits (10 req/min standards, 5 req/min line generation)

**Pros**:

- Stronger abuse protection
- Lower Cloudflare Workers usage

**Cons**:

- **Blocks legitimate users**: 10 req/min too low for browsing 15 standards
- **Violates CSF 1**: Frictionless entry compromised (user must wait between requests)

**Rejected**: User experience trade-off unacceptable.

### Alternative 3: Authentication-Based Rate Limiting

**Pros**:

- Granular per-user limits
- Can offer paid tiers (higher limits)

**Cons**:

- **Requires authentication**: Violates ADR-001 (public endpoints)
- **Violates CSF 1**: Authentication adds friction
- **Complexity**: User management, API key distribution

**Rejected**: Contradicts ADR-001 decision.

### Alternative 4: CAPTCHA for All Requests

**Pros**:

- Strongest bot protection

**Cons**:

- **Terrible UX**: CAPTCHA on every request (15+ CAPTCHAs to browse library)
- **Violates CSF 1**: Frictionless entry impossible with CAPTCHA
- **Accessibility**: CAPTCHA excludes users with disabilities

**Rejected**: Unacceptable UX trade-off.

---

## Implementation

### Cloudflare Rate Limiting Configuration

**Step 1: Create Rate Limiting Rules** (Cloudflare Dashboard → Security → WAF → Rate Limiting Rules)

**Rule 1: Standards Endpoints**

```yaml
Name: standards-rate-limit
Description: Generous rate limit for public standards endpoints
Match:
    - Hostname equals: api.harrisjazzlines.com
    - URI Path starts with: /jazz-standards
    - HTTP Method: GET
Characteristics:
    - IP Address
Rate:
    - Requests: 100
    - Period: 60 seconds
Action:
    - Challenge (Managed Challenge - CAPTCHA)
    - Duration: 60 seconds
```

**Rule 2: Line Generation Endpoint**

```yaml
Name: line-generation-rate-limit
Description: Moderate rate limit for computational endpoint
Match:
    - Hostname equals: api.harrisjazzlines.com
    - URI Path equals: /barry-harris/generate-instructions
    - HTTP Method: POST
Characteristics:
    - IP Address
Rate:
    - Requests: 20
    - Period: 60 seconds
Action:
    - Block
    - Duration: 300 seconds (5 minutes)
    - Response: 429 Too Many Requests
```

**Step 2: Configure Error Responses**

**429 Response Body** (standards endpoints):

```json
{
    "error": "Rate limit exceeded",
    "message": "You have exceeded the rate limit of 100 requests per minute. Please complete the CAPTCHA to continue.",
    "retry_after": 60,
    "endpoint": "/jazz-standards"
}
```

**429 Response Body** (line generation endpoint):

```json
{
    "error": "Rate limit exceeded",
    "message": "You have exceeded the rate limit of 20 requests per minute. Please wait 5 minutes before trying again.",
    "retry_after": 300,
    "endpoint": "/barry-harris/generate-instructions"
}
```

### Frontend Handling

**Retry Logic with Exponential Backoff** (src/utils/api.ts):

```typescript
export const fetchWithRetry = async (
    url: string,
    options: RequestInit = {},
    maxRetries = 3
): Promise<Response> => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);

            // Handle rate limiting
            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
                if (i < maxRetries - 1) {
                    const delay = Math.min(1000 * 2 ** i, retryAfter * 1000);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue; // Retry
                }
                throw new Error(`Rate limit exceeded. Please wait ${retryAfter} seconds.`);
            }

            return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
        }
    }
    throw new Error('Max retries exceeded');
};
```

**User-Friendly Error Display** (StandardsLibraryPage.tsx):

```typescript
const [rateLimitError, setRateLimitError] = useState<string | null>(null);

const handleFetchError = (error: Error) => {
    if (error.message.includes('Rate limit')) {
        setRateLimitError('You are browsing very quickly! Please wait a moment and try again.');
    } else {
        setError(error.message);
    }
};
```

---

## Monitoring

**Rate Limit Metrics** (Cloudflare Analytics):

1. **429 Response Count**: Track rate limit triggers per endpoint
    - Target: <1% of total requests
    - Alert: >5% of requests return 429 → Warning (limit may be too strict)

2. **Top Rate-Limited IPs**: Identify repeat offenders
    - Investigation: >100 triggers from single IP → Potential bot, consider blocking

3. **CAPTCHA Challenge Success Rate**: Measure human vs. bot traffic
    - Target: >80% challenge success (indicates humans, not bots)
    - Alert: <50% success → Likely bot attack, consider stricter limits

**Dashboard Panel**: "Rate Limiting Health"

- 429 count (time series, last 7 days)
- Top 10 rate-limited IPs
- CAPTCHA challenge success rate

---

## Validation

**Pre-Deployment**:

1. Configure Cloudflare Rate Limiting rules (Cloudflare Dashboard)
2. Test with curl (simulate rate limit):
    ```bash
    for i in {1..105}; do curl https://api.harrisjazzlines.com/jazz-standards; done
    # Request 101-105 should return 429 with CAPTCHA challenge
    ```
3. Verify frontend retry logic (browser dev tools)

**Post-Deployment**:

1. Monitor 429 response count (expect <1% of requests)
2. Review top rate-limited IPs (investigate anomalies)
3. Validate no false positives reported by users

---

## Escalation Path

**If rate limits are too strict** (>5% of requests return 429):

1. Analyze rate-limited IPs (bot vs. human traffic)
2. Increase limits:
    - Standards: 100 → 200 req/min
    - Line generation: 20 → 50 req/min
3. Monitor for 7 days
4. Adjust based on data

**If abuse continues** (bot traffic bypasses CAPTCHA):

1. Switch from Challenge to Block for standards endpoints
2. Reduce limits:
    - Standards: 100 → 50 req/min
    - Line generation: 20 → 10 req/min
3. Implement IP blocklist for repeat offenders
4. Consider Cloudflare Bot Management (paid feature)

---

## Cost Projection

**Cloudflare Rate Limiting Pricing**:

- Free tier: 10,000 requests/month
- Paid: $0.05 per 10,000 requests

**Expected Usage** (MVP):

- Monthly requests: ~10,000 (33 requests/hour, assuming low traffic)
- Rate limit triggers: ~100 (1% of requests)
- **Cost**: $0/month (within free tier)

**Scale Projection** (1,000 users/month):

- Monthly requests: ~100,000
- Rate limit triggers: ~1,000
- **Cost**: $0.50/month ($0.05 × 10k requests)

---

## References

- [Cloudflare Rate Limiting Documentation](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [RFC 6585: 429 Too Many Requests](https://datatracker.ietf.org/doc/html/rfc6585#section-4)
- ADR-001: Standards Endpoints Require Authentication (X-API-Key)

---

## Approval

**Proposed**: 2026-03-04
**Reviewed**: TBD
**Approved**: TBD
