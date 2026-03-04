# HANDOFF: DESIGN → DEVOPS Wave

**Feature**: Standards-Based Barry Harris Learning (Experimental Tab)
**From**: Morgan (Solution Architect)
**To**: Platform Architect (DEVOPS wave)
**Date**: 2026-03-04
**Status**: READY FOR PEER REVIEW → DEVOPS

---

## Executive Summary

Architecture complete for Standards Library MVP (P1 + P2). Zero backend changes to line generation API (reused). Two new GET endpoints for standards data. Six new React components. Estimated delivery: 2-3 weeks.

**Critical Success Factors**:

- Frictionless entry: <30 seconds app open → generation
- Fast generation: <3 seconds API response (p95)
- Effortless shape exploration: <3 seconds per switch

---

## Deliverables

### Architecture Documentation

| Document                          | Location                                                | Status                    |
| --------------------------------- | ------------------------------------------------------- | ------------------------- |
| **Architecture Design**           | `design/architecture.md`                                | ✅ Complete               |
| **C4 Diagrams**                   | Embedded in architecture.md                             | ✅ Complete (L1, L2, L3)  |
| **ADR-001: Development Paradigm** | `design/adrs/ADR-001-development-paradigm-selection.md` | ✅ Complete               |
| **ADR-002: No Repository Layer**  | `design/adrs/ADR-002-no-repository-layer.md`            | ✅ Complete               |
| **ADR-003-008**                   | Embedded in architecture.md                             | ✅ Complete (6 more ADRs) |

---

## Architecture Overview

### System Context (C4 Level 1)

**Key External Systems**:

- **Wes API**: Backend providing standards data + line generation (Rust/Cloudflare Workers)
- **ABC.js**: Client-side library for musical notation rendering (MIT license)

**Key Integration Points**:

- Frontend → Wes API: HTTPS/JSON (GET /jazz-standards, POST /barry-harris/generate-instructions)
- Frontend → abcjs: JS import for ABC notation rendering

---

### New Components

#### Frontend (6 new components)

1. **StandardsLibraryPage.tsx** - List view with 15 standards (grid layout)
2. **StandardCard.tsx** - Individual standard display (name, composer, difficulty, metadata)
3. **StandardDetailPage.tsx** - Orchestrator (progressions, shape selector, lines)
4. **DualProgressionDisplay.tsx** - Original + Barry Harris simplified progressions with explanation
5. **ShapeSelector.tsx** - CAGED shape buttons (C, A, G, E, D) with active state
6. **LineDisplay.tsx** - ABC notation + tablature rendering (reuses existing abcjs integration)

**Hooks** (2 new):

- `useStandards` - Fetch all standards (GET /jazz-standards)
- `useStandardDetail` - Fetch single standard by ID (GET /jazz-standards/{id})

---

#### Backend (3 new modules + 1 reused)

**NEW**:

1. **jazz_standards_handlers.rs** - HTTP handlers (GET /jazz-standards, GET /jazz-standards/{id})
2. **jazz_standards_service.rs** - Business logic (load standards, filter by ID)
3. **jazz_standards_models.rs** - Data models (JazzStandard DTO)

**REUSED** (no changes):

- **Line Generation API** - POST /barry-harris/generate-instructions (existing, supports `caged_shape` parameter)

---

## Key Architecture Decisions

### ADR-001: Development Paradigm

**Decision**: Continue with OOP + Functional React Hooks (frontend), Object-Oriented (backend)

**Rationale**: Consistency with existing codebase, faster delivery (2-3 weeks vs. 4-6 weeks for FP refactor)

---

### ADR-002: No Repository Layer

**Decision**: Load standards directly in service layer via `include_str!` (compile-time file inclusion)

**Rationale**: Static data (15 standards), no persistence needed, YAGNI principle, faster than runtime file I/O

**Migration Path**: If V3 adds user-generated standards, refactor to repository pattern (3-5 days estimated)

---

### ADR-003: Reuse Existing Line Generation API

**Decision**: Reuse `/barry-harris/generate-instructions` endpoint (no changes)

**Rationale**: Endpoint already supports `caged_shape` parameter ("C", "A", "G", "E", "D"), proven implementation

---

### ADR-004: URL State for Standard Selection

**Decision**: Use URL params: `/experimental/standards/{id}` (e.g., `/experimental/standards/autumn-leaves`)

**Rationale**: Shareable URLs, browser back/forward support, RESTful convention

---

### ADR-005: No Side-by-Side Shape Comparison (MVP)

**Decision**: Defer side-by-side comparison to V2, MVP uses sequential shape switching

**Rationale**: Faster MVP delivery, validates sequential switching UX first

---

### ADR-006: Client-Side ABC Rendering (abcjs)

**Decision**: Continue using abcjs for client-side ABC notation rendering

**Rationale**: Already integrated, MIT license, fast rendering, no backend changes

---

### ADR-007: No Pattern Labels in MVP

**Decision**: Generate lines without pattern labels in MVP (P3 deferred to V2)

**Rationale**: Focus on core value (standards + shapes), faster delivery

---

### ADR-008: Default Shape Selection (E Shape)

**Decision**: Default to E shape for initial line generation

**Rationale**: E shape most common for jazz standards (domain expertise), avoids decision paralysis

---

## API Specification

### New Endpoints

#### 1. GET /jazz-standards

**Description**: Returns all 15 jazz standards

**Response** (200 OK):

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
    // ... 14 more
]
```

---

#### 2. GET /jazz-standards/{id}

**Description**: Returns single jazz standard by ID

**Path Parameter**: `id` (e.g., "autumn-leaves")

**Response** (200 OK): Same as above (single object)

**Error Responses**:

- 404: "Standard not found"
- 500: "Failed to load standard: {error}"

---

### Existing Endpoint (Reused)

#### 3. POST /barry-harris/generate-instructions

**Description**: Generates Barry Harris lines (EXISTING, NO CHANGES)

**Request**:

```json
{
    "chords": ["Cm7", "F7", "BbMaj7", "Am7b5", "D7", "Gm7"],
    "caged_shape": "E",
    "guitar_position": "E"
}
```

**Response** (200 OK): See OpenAPI spec at `/Users/pedro/src/wes/openapi.yaml`

---

## Data Source

**Location**: `/Users/pedro/src/wes/data/jazz-standards.json`

**Status**: ✅ EXISTS (15 standards with dual progressions)

**Access**: Compile-time inclusion via `include_str!` macro (no runtime file I/O)

---

## Technology Stack

### Frontend

| Technology   | Version | License    | Purpose                  |
| ------------ | ------- | ---------- | ------------------------ |
| React        | 19.x    | MIT        | UI framework             |
| TypeScript   | 5.x     | Apache 2.0 | Type safety              |
| React Router | v7      | MIT        | Routing                  |
| Tailwind CSS | v4      | MIT        | Styling                  |
| Radix UI     | Latest  | MIT        | Accessible components    |
| abcjs        | 6.x     | MIT        | Music notation rendering |

---

### Backend

| Technology         | Version | License                | Purpose                |
| ------------------ | ------- | ---------------------- | ---------------------- |
| Rust               | 1.85+   | MIT/Apache 2.0         | Programming language   |
| Cloudflare Workers | Latest  | Proprietary (platform) | Serverless runtime     |
| worker crate       | Latest  | MIT/Apache 2.0         | Cloudflare Workers SDK |
| serde              | 1.x     | MIT/Apache 2.0         | JSON serialization     |

---

## Implementation Roadmap

### Phase 1: Backend - Jazz Standards API (1 week)

**Scope**: Implement GET /jazz-standards and GET /jazz-standards/{id}

**Key Tasks**:

1. Create `jazz_standards_models.rs` (data models)
2. Create `jazz_standards_service.rs` (business logic with `include_str!`)
3. Create `jazz_standards_handlers.rs` (HTTP handlers)
4. Update `lib.rs` router (add new routes)
5. Write unit tests (service)
6. Write E2E tests (API endpoints)

**Acceptance Criteria**:

- [ ] GET /jazz-standards returns 15 standards
- [ ] GET /jazz-standards/autumn-leaves returns single standard
- [ ] GET /jazz-standards/invalid returns 404
- [ ] All tests pass (unit + E2E)

---

### Phase 2: Frontend - Standards Library UI (1 week)

**Scope**: Implement standards list + detail pages

**Key Tasks**:

1. Create `useStandards` hook (fetch all standards)
2. Create `useStandardDetail` hook (fetch single standard)
3. Create 6 new components (StandardsLibraryPage, StandardCard, StandardDetailPage, DualProgressionDisplay, ShapeSelector, LineDisplay)
4. Update `Navigation.tsx` (add "Experimental" tab)
5. Update `App.tsx` (add routes: `/experimental`, `/experimental/standards/:id`)

**Acceptance Criteria**:

- [ ] "Experimental" tab visible in navigation
- [ ] Standards library displays 15 standards
- [ ] Click standard → Navigate to detail page
- [ ] Dual progressions visible with explanation
- [ ] Generate Lines button triggers API call

---

### Phase 3: Integration & Testing (1 week)

**Scope**: Connect frontend to backend, test E2E flows

**Key Tasks**:

1. Connect `useStandards` to GET /jazz-standards
2. Connect `useStandardDetail` to GET /jazz-standards/{id}
3. Connect line generation to existing API (POST /barry-harris/generate-instructions)
4. Test shape switching (C, A, G, E, D)
5. Test error handling (timeout, network error, 404)
6. Test loading states (standards, standard detail, line generation)
7. Write E2E tests (Vitest + Miniflare)
8. Performance testing (measure CSFs)

**Acceptance Criteria**:

- [ ] All 15 MVP user stories pass acceptance criteria
- [ ] All 5 CSFs met (frictionless entry <30s, generation <3s, etc.)
- [ ] Error handling verified (timeout, retry, 404)
- [ ] E2E tests pass (all scenarios green)

---

## Quality Gates

### Performance

- [ ] Standards load <2 seconds
- [ ] Line generation <3 seconds (p95)
- [ ] Shape switching <3 seconds
- [ ] Total journey time <5 minutes (app open → guitar practice)

---

### Functional

- [ ] All 15 standards displayed with correct metadata
- [ ] Dual progressions visible (original + improvisation)
- [ ] Shape selector functional (C, A, G, E, D)
- [ ] ABC notation renders correctly
- [ ] Error handling with retry buttons

---

### User Story Coverage

| Epic                      | Stories | Status                     |
| ------------------------- | ------- | -------------------------- |
| Epic 1: Standards Library | 1.1-1.5 | ✅ Architecture covers all |
| Epic 2: Shape Exploration | 2.1-2.3 | ✅ Architecture covers all |
| Epic 3: Practice Flow     | 3.1-3.2 | ✅ Architecture covers all |
| Epic 4: Error Handling    | 4.1-4.3 | ✅ Architecture covers all |
| Epic 5: Performance       | 5.1-5.2 | ✅ Architecture covers all |

**All 15 MVP user stories covered** ✓

---

## File Structure

### Frontend (New Files)

```
/Users/pedro/src/HarrisApp/src/
├── pages/
│   └── experimental/
│       ├── StandardsLibraryPage.tsx (NEW)
│       └── StandardDetailPage.tsx (NEW)
├── components/
│   └── experimental/
│       ├── StandardCard.tsx (NEW)
│       ├── DualProgressionDisplay.tsx (NEW)
│       ├── ShapeSelector.tsx (NEW)
│       └── LineDisplay.tsx (NEW)
├── hooks/
│   ├── useStandards.ts (NEW)
│   └── useStandardDetail.ts (NEW)
└── types/
    └── jazzStandards.ts (NEW)
```

---

### Backend (New Files)

```
/Users/pedro/src/wes/src/
├── infrastructure/
│   ├── driving/
│   │   └── http/
│   │       ├── jazz_standards_handlers.rs (NEW)
│   │       └── models/
│   │           └── jazz_standards_models.rs (NEW)
└── services/
    └── jazz_standards_service.rs (NEW)
```

**Note**: No repository layer (ADR-002). Service loads JSON via `include_str!`.

---

## Risks & Mitigations

### Risk 1: Standards Library Insufficient

**Probability**: Low (15 standards covers common learning tunes)

**Impact**: Users request standards not in library

**Mitigation**: Track requests. If >20% users request missing standards in first month, prioritize P4 (Custom Input) to V2.

---

### Risk 2: API Response Time >3s

**Probability**: Low (existing API meets performance targets)

**Impact**: Violates CSF 2 (Fast Generation)

**Mitigation**: Load testing during Phase 3. Optimize if needed (caching, parallel processing).

---

### Risk 3: ABC Rendering Failures

**Probability**: Low (abcjs already proven in LineGenerator)

**Impact**: Users cannot see notation

**Mitigation**: Error boundary around abcjs rendering, fallback to text display.

---

## Next Steps

1. **Peer Review**: solution-architect-reviewer (Atlas) reviews architecture + ADRs
2. **DEVOPS Wave**: Platform architect designs infrastructure (CI/CD, deployment, monitoring)
3. **DISTILL Wave**: Acceptance designer creates BDD scenarios from user stories
4. **DELIVER Wave**: Software crafter implements using TDD (London School)

---

## Questions for Platform Architect

1. **API Key Management**: Current auth uses `X-API-Key` header. Standards endpoints public or authenticated?
2. **Caching Strategy**: Should GET /jazz-standards be cached at CDN level (data never changes)?
3. **Monitoring**: Which metrics should be tracked for CSFs (p95 response time, error rate)?
4. **Rate Limiting**: Should standards endpoints be rate-limited (prevent abuse)?

---

## Contact

**Architecture Questions**: Morgan (Solution Architect)
**Peer Review**: Atlas (Solution Architect Reviewer) - PENDING
**DEVOPS Handoff**: Platform Architect (next wave)

---

## Approval Status

- [ ] Peer Review Complete (Atlas)
- [ ] ADRs Approved
- [ ] Architecture Validated
- [ ] Ready for DEVOPS Wave

**Date Submitted for Review**: 2026-03-04
**Expected Review Completion**: TBD
