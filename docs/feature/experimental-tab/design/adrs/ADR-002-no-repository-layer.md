# ADR-002: No Repository Layer for Jazz Standards

**Status**: Accepted
**Date**: 2026-03-04
**Decision Makers**: Morgan (Solution Architect)
**Related User Stories**: Epic 1 (Standards Library)

---

## Context

Jazz standards data is static (15 standards in `/Users/pedro/src/wes/data/jazz-standards.json`). No persistence, updates, or dynamic data required for MVP. Traditional repository pattern creates abstraction layer between service and data source, but may be over-engineering for static file-based data.

**CLAUDE.md Guidance**:

- "Repository pattern has 1:1 relationship with aggregate roots"
- "Only consider repositories for stateful aggregates"
- "For Computational Domains: Traditional repository patterns are **unnecessary** when domain objects are pure computational functions and no persistence is required"

**Current Situation**:

- 15 standards in JSON file (already exists)
- Data never changes during runtime
- No user-generated standards in MVP
- No database or external data source

---

## Decision

Load standards directly in service layer via `include_str!` macro (compile-time file inclusion). **No repository abstraction**.

**Implementation**:

```rust
// In JazzStandardsService
impl JazzStandardsService {
    pub fn get_all_standards(&self) -> Result<Vec<JazzStandard>, ServiceError> {
        let json_content = include_str!("../../../data/jazz-standards.json");
        serde_json::from_str(json_content)
            .map_err(|e| ServiceError::ParseError(e.to_string()))
    }
}
```

---

## Rationale

### 1. Static Data = No Need for Abstraction

**Evidence**: JSON file never changes during runtime. Standards are curated by developers, not users.

**Benefit**: Eliminates unnecessary abstraction layer (YAGNI principle).

### 2. CLAUDE.md Alignment

**Quote**: "Only consider repositories for stateful aggregates... Repository pattern unnecessary when no persistence is required."

**Benefit**: Architecture aligns with documented patterns for computational domains.

### 3. Compile-Time Inclusion (`include_str!`)

**Performance**: File read happens at compile time, not runtime. Zero I/O overhead.

**Benefit**: Faster than runtime file reads, safer than path dependencies.

### 4. Simpler Testing

**Without repository**:

```rust
#[test]
fn test_get_all_standards() {
    let service = JazzStandardsService::new();
    let standards = service.get_all_standards().unwrap();
    assert_eq!(standards.len(), 15);
}
```

**With repository** (unnecessary complexity):

```rust
#[test]
fn test_get_all_standards() {
    let mock_repo = MockJazzStandardsRepository::new();
    mock_repo.expect_load_standards().returning(|| Ok(vec![...]));
    let service = JazzStandardsService::new(mock_repo);
    // ... test logic
}
```

**Benefit**: Testing is simpler without repository mocks.

---

## Alternatives Considered

### Alternative 1: Repository Pattern with File System Abstraction

**Description**: Create `JazzStandardsRepository` trait with `FileJazzStandardsRepository` implementation.

```rust
pub trait JazzStandardsRepository {
    fn load_standards(&self) -> Result<Vec<JazzStandard>, RepositoryError>;
}

pub struct FileJazzStandardsRepository {
    file_path: String,
}

impl JazzStandardsRepository for FileJazzStandardsRepository {
    fn load_standards(&self) -> Result<Vec<JazzStandard>, RepositoryError> {
        let json_content = std::fs::read_to_string(&self.file_path)?;
        serde_json::from_str(&json_content)
            .map_err(|e| RepositoryError::ParseError(e.to_string()))
    }
}
```

**Pros**:

- Follows traditional repository pattern
- Testable with mock repository
- Easier to swap data source (database, API) in future

**Cons**:

- **Over-engineering** for static data
- Runtime file I/O overhead (vs. compile-time `include_str!`)
- Path dependency issues (file must exist at runtime)
- Additional testing complexity (mocking repository)

**Rejected Reason**: YAGNI (You Aren't Gonna Need It). Static data doesn't warrant abstraction overhead.

---

### Alternative 2: Repository with `include_str!` Abstraction

**Description**: Create repository abstraction but use `include_str!` internally.

```rust
pub trait JazzStandardsRepository {
    fn load_standards(&self) -> Result<Vec<JazzStandard>, RepositoryError>;
}

pub struct CompileTimeJazzStandardsRepository;

impl JazzStandardsRepository for CompileTimeJazzStandardsRepository {
    fn load_standards(&self) -> Result<Vec<JazzStandard>, RepositoryError> {
        let json_content = include_str!("../../../data/jazz-standards.json");
        serde_json::from_str(json_content)
            .map_err(|e| RepositoryError::ParseError(e.to_string()))
    }
}
```

**Pros**:

- Maintains repository pattern for consistency
- Uses `include_str!` for performance

**Cons**:

- **Unnecessary abstraction**: Single implementation means trait is dead code
- No benefit over direct service implementation
- Testing still requires mocking (or real data)

**Rejected Reason**: Abstraction without variation is over-engineering. Trait with single implementation violates YAGNI.

---

### Alternative 3: Database with Static Seed Data

**Description**: Store standards in SQLite database, seed on first run.

**Pros**:

- Prepares for future user-generated standards
- Query capabilities (filter by difficulty, search)

**Cons**:

- **Massive over-engineering** for 15 static records
- Database setup complexity (migrations, connection pooling)
- Performance overhead (SQL queries vs. in-memory)
- Cloudflare Workers limitation (no persistent SQLite, would need D1 or external DB)

**Rejected Reason**: No requirements for persistence, search, or dynamic updates in MVP. Adds complexity with zero benefit.

---

## Consequences

### Positive

1. **Faster Delivery**: No repository abstraction to design, implement, or test. Estimated 2 days saved.
2. **Better Performance**: `include_str!` at compile time = zero runtime I/O overhead.
3. **Simpler Testing**: Test service directly, no repository mocks.
4. **CLAUDE.md Compliance**: Aligns with documented patterns for static data.
5. **Zero Runtime Dependencies**: No file paths, no database connections.

### Negative

1. **Refactor If Standards Become Dynamic**: If V2/V3 adds user-generated standards, refactor required.
2. **No Data Source Abstraction**: Cannot easily swap to database/API without code changes.

---

## Migration Path (If Needed)

**Trigger**: V3 feature "Custom Progression Input" (User Story P4) if it includes saving custom standards.

**Refactor Steps**:

1. Create `JazzStandardsRepository` trait
2. Implement `FileJazzStandardsRepository` (runtime file reads)
3. Implement `DatabaseJazzStandardsRepository` (D1, PostgreSQL, etc.)
4. Update `JazzStandardsService` to accept repository via constructor
5. Write integration tests with real database

**Estimated Effort**: 3-5 days (service + repository + tests).

**Mitigation**: V3 timeline includes this refactor as explicit task. Not blocking MVP.

---

## Implementation Notes

### Service Implementation

```rust
// src/services/jazz_standards_service.rs

use crate::domain::JazzStandard;
use crate::services::errors::ServiceError;

pub struct JazzStandardsService;

impl JazzStandardsService {
    pub fn new() -> Self {
        Self
    }

    pub fn get_all_standards(&self) -> Result<Vec<JazzStandard>, ServiceError> {
        let json_content = include_str!("../../../data/jazz-standards.json");
        serde_json::from_str(json_content)
            .map_err(|e| ServiceError::ParseError(e.to_string()))
    }

    pub fn get_standard_by_id(&self, id: &str) -> Result<Option<JazzStandard>, ServiceError> {
        let standards = self.get_all_standards()?;
        Ok(standards.into_iter().find(|s| s.id == id))
    }
}
```

**Rationale**: Direct file inclusion, no abstraction, simple filtering for single standard.

---

### Testing Strategy

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_all_standards_returns_15() {
        let service = JazzStandardsService::new();
        let standards = service.get_all_standards().unwrap();
        assert_eq!(standards.len(), 15);
    }

    #[test]
    fn test_get_standard_by_id_autumn_leaves() {
        let service = JazzStandardsService::new();
        let standard = service.get_standard_by_id("autumn-leaves").unwrap();
        assert!(standard.is_some());
        assert_eq!(standard.unwrap().name, "Autumn Leaves");
    }

    #[test]
    fn test_get_standard_by_id_invalid() {
        let service = JazzStandardsService::new();
        let standard = service.get_standard_by_id("invalid-id").unwrap();
        assert!(standard.is_none());
    }
}
```

**Rationale**: Test with real data (included via `include_str!`). No mocks needed.

---

## Review and Approval

**Approved By**: Morgan (Solution Architect)
**Reviewer**: Atlas (Solution Architect Reviewer) - PENDING
**Next Review Date**: Before V3 (if user-generated standards required)

---

## Related Documents

- [Architecture Document](../architecture.md) - Full system design
- [ADR-001](./ADR-001-development-paradigm-selection.md) - Development paradigm
- [CLAUDE.md](/Users/pedro/src/wes/CLAUDE.md) - Repository pattern guidance
- [User Stories](/Users/pedro/src/HarrisApp/docs/feature/experimental-tab/discuss/user-stories.md) - MVP requirements
