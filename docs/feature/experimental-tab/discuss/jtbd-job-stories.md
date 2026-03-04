# Job Stories: Experimental Tab

**Feature**: Experimental Tab for HarrisApp
**Wave**: DISCUSS (2 of 6)
**Date**: 2026-03-04
**Primary Users**: Jazz musicians/students + developer (Pedro)

---

## Job Story Format

All job stories follow the format:

> **When** [situation], **I want to** [motivation], **so I can** [outcome].

---

## Job 1: Shape Comparison

**When** learning Barry Harris theory and practicing jazz improvisation,
**I want to** compare different CAGED shapes side-by-side,
**So I can** understand which shape works best for different progressions and learn faster.

### Context

- User is practicing improvisation over a specific chord progression
- Wants to see how the same progression looks in different fretboard positions
- Currently must generate each shape separately and remember/write down results
- Goal is to make informed choice about which shape to practice

### Success Indicators

- Can view all 5 CAGED shapes (C, A, G, E, D) simultaneously
- Can identify melodic differences between shapes
- Can choose preferred shape based on visual comparison

---

## Job 2: Pattern Experimentation

**When** learning Barry Harris patterns,
**I want to** experiment with individual patterns in isolation,
**So I can** understand how each pattern works before combining them.

### Context

- User is learning Barry Harris method and wants to understand building blocks
- Available patterns: HalfStepUp, ChordUp, ChordDown, TriadUp, TriadDown, Pivot, ScaleDown, ThirdUp, ThirdDown
- Existing tools combine patterns automatically without showing individual effects
- Goal is to build pattern vocabulary through experimentation

### Success Indicators

- Can select and test single pattern
- Can see immediate visual/auditory feedback for that pattern
- Can combine patterns incrementally and understand contribution of each
- Can document which patterns work well together

---

## Job 3: Visual Progression Building

**When** practicing improvisation,
**I want to** build chord progressions visually,
**So I can** quickly test different chord sequences without manual input.

### Context

- User wants to experiment with different progressions
- Typing chord names is error-prone (CMaj7 vs Cmaj7 vs Cmajor7)
- Wants to reorder chords easily to test variations
- Goal is rapid experimentation with different harmonic sequences

### Success Indicators

- Can drag chords from library to progression
- Can reorder chords visually
- Can save/load common progressions
- System highlights detected patterns (ii-V-I, etc.)

---

## Job 4: API Testing & Decision Making

**When** deciding what features to implement or how the API works,
**I want to** test different API endpoints with various parameters,
**So I can** make informed decisions and understand system behavior.

### Context

- Developer (Pedro) needs to test API during development
- Power users want to understand API capabilities
- Currently must use external tools (Postman) or write code
- Goal is rapid API exploration and decision-making

### Success Indicators

- Can send raw API requests from within app
- Can see formatted responses with timing
- Can save/replay request history
- Can use templates for common requests
- Can export requests for use in code

---

## Job 5: Learning Acceleration (Meta-Job)

**When** studying Barry Harris concepts,
**I want to** immediate visual and auditory feedback on my experiments,
**So I can** learn jazz theory more efficiently and build muscle memory faster.

### Context

- Meta-job that spans all other jobs
- User wants to move from passive learning (reading) to active learning (experimenting)
- Current tools have slow feedback loops
- Goal is accelerated understanding through experimentation

### Success Indicators

- Instant feedback on every experiment
- Visual and auditory confirmation of results
- Progressive complexity (start simple, add layers)
- Clear path from experiment to understanding

---

## Job-to-Feature Mapping

| Job                             | Primary Feature        | Supporting Features        |
| ------------------------------- | ---------------------- | -------------------------- |
| **Shape Comparison**            | CAGED Shape Comparator | -                          |
| **Pattern Experimentation**     | Pattern Playground     | API Debugger (for testing) |
| **Visual Progression Building** | Progression Builder    | -                          |
| **API Testing**                 | API Debugger           | -                          |
| **Learning Acceleration**       | All features           | Instructions Explorer      |

---

## Priority Based on Opportunity Score

1. **API Testing** (Score: 16) - Highest opportunity, critical gap
2. **Shape Comparison** (Score: 13) - High value, poor current satisfaction
3. **Pattern Experimentation** (Score: 11) - Moderate value, fills learning gap
4. **Visual Progression Building** (Score: 8) - Enhancement, not critical
5. **Learning Acceleration** (Score: 15) - Meta-goal achieved through all features

**Recommendation**: Implementation order matches opportunity scores and aligns with existing plan (API Debugger → Shape Comparator → Pattern Playground → Progression Builder).
