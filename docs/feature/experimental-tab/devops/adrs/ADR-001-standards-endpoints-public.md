# ADR-001: Standards Endpoints Require Authentication

**Status**: Accepted (Revised)
**Date**: 2026-03-04 (Revised 2026-03-04)
**Deciders**: Apex (Platform Architect), User Feedback
**Wave**: DEVOPS (Platform Design)

---

## Context

The Standards Library MVP introduces two new GET endpoints:

- GET `/jazz-standards` - Returns all 15 jazz standards
- GET `/jazz-standards/{id}` - Returns single standard by ID

The existing API uses X-API-Key authentication for computational endpoints (POST `/barry-harris/generate-instructions`). We must decide whether standards endpoints require authentication or should be public.

**Key Considerations**:

1. Standards data is public domain (jazz standards, chord progressions, composers)
2. CSF 1 requires frictionless entry (<30 seconds from app open to line generation)
3. API consistency: all feature endpoints use same authentication strategy
4. Frontend already includes API key for line generation endpoint
5. Risk of abuse (DDoS, scraping, API overload)

---

## Decision

**Standards endpoints (GET /jazz-standards\*) REQUIRE AUTHENTICATION (X-API-Key header).**

All feature endpoints (standards + line generation) use consistent authentication strategy.

---

## Rationale

### 1. API Consistency (Primary Driver)

Consistent authentication across all feature endpoints:

- POST `/barry-harris/generate-instructions` → Authenticated
- GET `/jazz-standards` → Authenticated
- GET `/jazz-standards/{id}` → Authenticated
- GET `/health` → Public (monitoring only)

**Benefits**:

- Simple mental model: "feature endpoints require auth, monitoring does not"
- No mixed auth patterns to explain to users
- Consistent error handling (401 Unauthorized)
- Consistent rate limiting strategy (per API key, not per IP)

**Conclusion**: Consistency simplifies architecture and reduces confusion.

### 2. Frontend Integration

Frontend already includes API key for line generation:

```typescript
// Frontend .env
VITE_API_KEY=<user-api-key>
```

Adding authentication to standards endpoints is **zero incremental friction**:

- API key already embedded in frontend bundle
- Same authentication flow for all API calls
- No additional user configuration needed

**Conclusion**: No UX penalty for authenticated standards endpoints.

### 3. Abuse Prevention

Authentication enables better abuse prevention:

- Rate limiting per API key (not per IP)
- Granular blocking (revoke specific keys)
- Usage analytics (per user, not aggregate)
- Audit trails (who accessed what, when)

**Conclusion**: Authentication provides better control than IP-based rate limiting.

### 4. Performance Impact Mitigation

Authenticated endpoints can still use CDN caching:

- Cache-Control headers: `public, max-age=86400` (24 hours)
- CDN caches authenticated responses with `Vary: X-API-Key`
- 95%+ cache hit ratio (standards data rarely changes)
- <100ms response time from edge cache

**Conclusion**: Authentication does not prevent CDN caching for static data.

---

## Consequences

### Positive

- ✅ **API Consistency**: All feature endpoints use same auth strategy (simple mental model)
- ✅ **Better Abuse Prevention**: Per-API-key rate limiting and revocation
- ✅ **Usage Analytics**: Track per-user metrics (standards browsed, generation frequency)
- ✅ **Audit Trails**: Log who accessed what, when (compliance-ready)
- ✅ **No Additional Friction**: Frontend already includes API key for line generation
- ✅ **CDN Caching**: Authenticated responses still cacheable (Vary: X-API-Key)

### Negative

- ⚠️ **API Key Management**: Users must obtain and store API key (acceptable: one-time setup)
- ⚠️ **SEO Impact**: Standards data not crawlable by search engines (acceptable: not a discovery tool)

### Neutral

- 🔀 **Consistent Auth Model**: All feature endpoints authenticated (health endpoint remains public)

---

## Alternatives Considered

### Alternative 1: Public Endpoints (No Authentication)

**Pros**:

- Zero friction for first-time users
- Search engine crawlable (SEO benefit)
- Simpler frontend code (no auth headers)

**Cons**:

- **Inconsistent with existing API** (barry-harris endpoints authenticated)
- Mixed auth model confusing for users
- IP-based rate limiting less granular
- No per-user usage analytics

**Rejected**: Consistency more important than marginal UX improvement. Frontend already has API key for line generation, so no incremental friction.

### Alternative 2: OAuth 2.0 (Social Login)

**Pros**:

- Better user experience than API keys
- User tracking
- Standard protocol

**Cons**:

- Significant development effort (3-5 days)
- Adds friction compared to embedded API key
- Overkill for single-page app

**Rejected**: Implementation complexity not justified for MVP.

### Alternative 3: Hybrid (Public List, Authenticated Detail)

**Pros**:

- Browse without login
- Detail requires auth (data protection)

**Cons**:

- **Most confusing option**: Why auth for detail but not list?
- Standards detail is also public data (no security benefit)
- Partial CDN caching only

**Rejected**: Inconsistent UX, adds complexity with no benefit.

---

## Implementation Notes

### Backend (Cloudflare Workers)

**Authentication Middleware** (src/lib.rs):

```rust
// Standards endpoints use same auth as barry-harris endpoints
if req.path().starts_with("/jazz-standards") && req.method() == Method::Get {
    // Validate X-API-Key header
    if let Some(api_key) = req.headers().get("X-API-Key")? {
        if !is_valid_api_key(api_key) {
            return Response::error("Unauthorized", 401);
        }
    } else {
        return Response::error("X-API-Key header required", 401);
    }
}
```

**CORS Configuration**:

```rust
// Allow X-API-Key header in CORS preflight
response.headers_mut().set("Access-Control-Allow-Headers", "Content-Type, X-API-Key")?;
response.headers_mut().set("Access-Control-Allow-Origin", "https://harrisapp.com")?;
response.headers_mut().set("Access-Control-Max-Age", "86400")?;
```

**Rate Limiting** (Cloudflare Dashboard):

```yaml
Name: standards-rate-limit
Match: api.harrisjazzlines.com/jazz-standards*
Limit: 100 requests per minute per API key
Action: Block (429 Too Many Requests)
Duration: 60 seconds
```

### Frontend

**API Call** (consistent authentication):

```typescript
const fetchStandards = async () => {
    const response = await fetch('https://api.harrisjazzlines.com/jazz-standards', {
        headers: {
            'X-API-Key': import.meta.env.VITE_API_KEY, // Required
        },
    });

    if (response.status === 401) {
        throw new Error('Invalid API key');
    }

    return response.json();
};
```

**Line Generation** (same authentication pattern):

```typescript
const generateLines = async (payload) => {
    const response = await fetch(
        'https://api.harrisjazzlines.com/barry-harris/generate-instructions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': import.meta.env.VITE_API_KEY, // Consistent
            },
            body: JSON.stringify(payload),
        }
    );
    return response.json();
};
```

---

## Compliance

**GDPR**: Not applicable (no personal data collected).
**CCPA**: Not applicable (anonymous access, no user tracking).
**API Rate Limiting**: Compliant (Cloudflare Rate Limiting meets abuse prevention requirements).

---

## References

- CSF 1: Frictionless Entry (<30 seconds)
- [Cloudflare Rate Limiting Docs](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) (public metadata endpoints)
- [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API) (public music data)

---

## Approval

**Proposed**: 2026-03-04
**Reviewed**: TBD
**Approved**: TBD
