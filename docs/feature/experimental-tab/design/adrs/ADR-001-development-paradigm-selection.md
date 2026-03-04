# ADR-001: Development Paradigm Selection

**Status**: Accepted
**Date**: 2026-03-04
**Decision Makers**: Morgan (Solution Architect)
**Related User Stories**: All MVP stories (infrastructure decision)

---

## Context

HarrisApp codebase uses React 19 with functional components and hooks for state management and side effects. The Wes API backend uses Rust with Object-Oriented patterns (struct-based design with trait implementations). We need to determine the development paradigm for the Standards Library feature to maintain consistency with existing code.

**Current Frontend Patterns**:

- Functional React components (no class components)
- Custom hooks for state and side effects (`useLineGenerator`, `useCounterpoint`)
- Component composition (Card, Button, Select from Radix UI)
- TypeScript for type safety

**Current Backend Patterns (from CLAUDE.md)**:

- "This project follows an **Object-Oriented** approach using struct-based design with clear data ownership"
- Domain objects with rich behavior (`Pitch::transpose`, `Chord::invert`)
- Services orchestrate domain operations
- Trait implementations for polymorphism

**Alternative Considered**: Functional Programming (FP) paradigm with pure functions, immutable data structures, and algebraic data types.

---

## Decision

We will continue with the **current paradigm** for both frontend and backend:

**Frontend**: **OOP + Functional React Hooks**

- Functional components (not class-based)
- Custom hooks for data fetching and state management
- Component composition with props
- Object-oriented TypeScript types (interfaces, classes where appropriate)

**Backend**: **Object-Oriented** (struct-based)

- Struct-based domain objects with methods
- Service layer orchestration
- Trait implementations for abstraction
- Traditional OOP patterns (builder, strategy)

---

## Rationale

### 1. Consistency with Existing Codebase

**Evidence**:

- `useLineGenerator` hook already established pattern for API calls
- `LineGenerator.tsx` uses functional component with hooks
- Backend CLAUDE.md explicitly states OOP approach
- All domain objects use struct methods (`Pitch`, `Scale`, `Chord`)

**Benefit**: New developers can understand patterns immediately, no cognitive overhead switching between paradigms.

### 2. Faster Development

**Time-to-Market Priority**: DISCUSS wave identified time-to-market as primary driver (frictionless <30s entry, <3s generation).

**Evidence**:

- Reusing `useLineGenerator` hook eliminates reimplementation
- `StandardCard`, `DualProgressionDisplay` follow existing component patterns
- No learning curve for paradigm shift

**Benefit**: Estimated 2-3 week delivery vs. 4-6 weeks if refactoring to FP.

### 3. Team Expertise

**Context**: Single developer (you + me as pair), familiar with React hooks and Rust OOP.

**Benefit**: Leverage existing knowledge, avoid FP learning curve (monads, functors, algebraic effects).

---

## Alternatives Considered

### Alternative 1: Functional Programming (Frontend)

**Description**: Pure functions, immutable data, no side effects in components. Use functional state management (e.g., XState, Zustand with immer).

**Pros**:

- Easier testing (pure functions)
- Predictable state changes
- Better composability

**Cons**:

- **Breaking change**: Would require refactoring existing hooks (`useLineGenerator`, `useCounterpoint`)
- **Learning curve**: React hooks already embrace FP concepts, but stricter FP would require XState/Zustand
- **Inconsistent with existing code**: LineGenerator.tsx uses hooks + local state

**Rejected Reason**: Time-to-market priority. Refactoring existing code delays MVP.

---

### Alternative 2: Functional Programming (Backend)

**Description**: Pure domain functions, immutable structs, algebraic data types (Result, Option as primary control flow).

**Pros**:

- Strong type safety (exhaustive pattern matching)
- Easier testing (pure functions)
- No hidden side effects

**Cons**:

- **Breaking change**: Would require refactoring all domain objects (`Pitch`, `Scale`, `Chord`)
- **CLAUDE.md conflict**: "This project follows an **Object-Oriented** approach" is explicit
- **Inconsistent with existing code**: Current services use mutable state (e.g., `PitchService`, `ScaleService`)

**Rejected Reason**: CLAUDE.md explicitly documents OOP approach. Consistency trumps paradigm preferences.

---

### Alternative 3: Hybrid Approach (FP + OOP)

**Description**: Use FP for new Standards Library code, leave existing code as OOP.

**Pros**:

- Best of both worlds (FP where it shines, OOP where established)
- Gradual migration path

**Cons**:

- **Cognitive overhead**: Developers must switch mental models mid-codebase
- **Maintenance burden**: Two paradigms means two testing strategies, two refactoring approaches
- **Inconsistent patterns**: `useStandards` (FP) vs. `useLineGenerator` (OOP-ish hooks)

**Rejected Reason**: Consistency is more valuable than paradigm purity. Mixing paradigms creates confusion.

---

## Consequences

### Positive

1. **Fast Delivery**: Reuse existing patterns, no refactoring, estimated 2-3 weeks for MVP
2. **Consistency**: All components follow established patterns (hooks, functional components, struct-based services)
3. **No Learning Curve**: Developers familiar with React hooks and Rust OOP can contribute immediately
4. **Reusable Patterns**: `useLineGenerator` hook reused for line generation, `Card` components reused for UI

### Negative

1. **No Pure FP Benefits**: Miss out on stronger type safety (exhaustive pattern matching), easier testing (pure functions)
2. **Potential Refactor Later**: If FP becomes necessary (e.g., complex state management), refactoring cost increases

---

## Implementation Notes

### Frontend (React + Hooks)

**Pattern**: Custom hooks for API calls, functional components for UI.

**Example** (`useStandards`):

```typescript
export const useStandards = (): UseStandardsReturn => {
    const [standards, setStandards] = useState<JazzStandard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchStandards = async () => {
        // ... fetch logic
    };

    useEffect(() => {
        void fetchStandards();
    }, []);

    return { standards, loading, error, refetch: fetchStandards };
};
```

**Rationale**: Matches `useLineGenerator` pattern exactly.

---

### Backend (Rust OOP)

**Pattern**: Struct-based services with methods, trait implementations for abstraction.

**Example** (`JazzStandardsService`):

```rust
pub struct JazzStandardsService {
    repo: JazzStandardsRepository,
}

impl JazzStandardsService {
    pub fn new() -> Self {
        Self {
            repo: JazzStandardsRepository::new(),
        }
    }

    pub fn get_all_standards(&self) -> Result<Vec<JazzStandard>, ServiceError> {
        self.repo.load_standards()
    }

    pub fn get_standard_by_id(&self, id: &str) -> Result<Option<JazzStandard>, ServiceError> {
        let standards = self.repo.load_standards()?;
        Ok(standards.into_iter().find(|s| s.id == id))
    }
}
```

**Rationale**: Matches existing `PitchService`, `ScaleService` patterns.

---

## Review and Approval

**Approved By**: Morgan (Solution Architect)
**Reviewer**: Atlas (Solution Architect Reviewer) - PENDING
**Next Review Date**: After MVP delivery (validate paradigm choice with real usage)

---

## Related Documents

- [Architecture Document](../architecture.md) - Full system design
- [CLAUDE.md](/Users/pedro/src/wes/CLAUDE.md) - Backend development paradigm documentation
- [User Stories](/Users/pedro/src/HarrisApp/docs/feature/experimental-tab/discuss/user-stories.md) - MVP requirements
