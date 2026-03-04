# Shared Artifacts Registry: Standards-Based Barry Harris Learning

**Feature**: Experimental Tab - Standards Library
**Wave**: DISCUSS (2 of 6)
**Date**: 2026-03-04

---

## Purpose

This registry documents all data artifacts that flow through the user journey, ensuring:

1. **Single Source of Truth**: Every artifact has one authoritative source
2. **Clear Lifecycle**: Creation, usage, and persistence are explicit
3. **No Orphans**: Every `${variable}` is tracked and documented
4. **Dependency Mapping**: Dependencies between artifacts are clear
5. **Testability**: Each artifact can be validated in acceptance tests

---

## Artifact Categories

| Category                | Description                       | Count |
| ----------------------- | --------------------------------- | ----- |
| **User Inputs**         | Data created by user actions      | 5     |
| **System Data**         | Data loaded from backend/database | 4     |
| **API Requests**        | Request payloads to backend       | 1     |
| **API Responses**       | Response data from backend        | 2     |
| **Computed State**      | Derived data from other artifacts | 2     |
| **Real-World Outcomes** | Physical practice activities      | 1     |
| **Session State**       | Temporary UI state                | 3     |

**Total Artifacts**: 18

---

## Complete Artifact Registry

### 1. `practice_intention`

| Property            | Value                                      |
| ------------------- | ------------------------------------------ |
| **Type**            | User Goal                                  |
| **Created**         | Step 01: Practice Session Begins           |
| **Used**            | Step 02 (Discovery), Step 03 (Selection)   |
| **Source of Truth** | User's mental model at session start       |
| **Persistence**     | Session (in-memory, not stored)            |
| **Format**          | String (unstructured)                      |
| **Example**         | "Apply Barry Harris to familiar standards" |
| **Dependencies**    | None (entry point)                         |
| **Validation**      | N/A (internal user state)                  |

**Description**: The user's practice goal when opening the app. Informs which feature they navigate to (standards library vs. other experimental features).

---

### 2. `standards_catalog`

| Property            | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| **Type**            | System Data (JSON)                                       |
| **Created**         | Step 02: Loaded from database                            |
| **Used**            | Step 02 (Display), Step 03 (Selection), Step 10 (Return) |
| **Source of Truth** | `/Users/pedro/src/wes/data/jazz-standards.json`          |
| **Persistence**     | Database (file-based JSON)                               |
| **Format**          | Array of JazzStandard objects                            |
| **Example**         | See structure below                                      |
| **Dependencies**    | None (loaded at app start)                               |
| **Validation**      | Schema validation on app load                            |

**Structure**:

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
]
```

**API Endpoint**: `GET /jazz-standards`

---

### 3. `selected_standard`

| Property            | Value                                                                  |
| ------------------- | ---------------------------------------------------------------------- |
| **Type**            | User Selection                                                         |
| **Created**         | Step 03: Browse and Select Standard                                    |
| **Used**            | Step 04 (Progression Display), Step 05 (Generation), Step 06 (Display) |
| **Source of Truth** | UI state + URL parameter                                               |
| **Persistence**     | Session + URL (`?standard=autumn-leaves`)                              |
| **Format**          | String (standard ID)                                                   |
| **Example**         | `"autumn-leaves"`                                                      |
| **Dependencies**    | `standards_catalog` (must exist in catalog)                            |
| **Validation**      | Must match an ID in `standards_catalog`                                |

**Description**: The standard selected by the user. Drives all subsequent steps (progression display, line generation). Persisted in URL for shareability.

---

### 4. `chords_original`

| Property            | Value                                                            |
| ------------------- | ---------------------------------------------------------------- |
| **Type**            | System Data (Chord Progression)                                  |
| **Created**         | Step 04: Loaded from selected standard                           |
| **Used**            | Step 04 (Display only)                                           |
| **Source of Truth** | `jazz-standards.json` (chords_original field)                    |
| **Persistence**     | Database (JSON file)                                             |
| **Format**          | Array of chord symbols                                           |
| **Example**         | `["Cm7", "F7", "BbMaj7", "EbMaj7", "Am7b5", "D7", "Gm7", "Gm7"]` |
| **Dependencies**    | `selected_standard`                                              |
| **Validation**      | Must be valid chord symbols                                      |

**Description**: Original chord progression as written in the lead sheet. Used for melody/comping. Displayed to user for educational comparison with simplified version.

---

### 5. `chords_improvisation`

| Property            | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| **Type**            | System Data (Chord Progression)                              |
| **Created**         | Step 04: Loaded from selected standard                       |
| **Used**            | Step 04 (Display), Step 05 (API request)                     |
| **Source of Truth** | `jazz-standards.json` (chords_improvisation field)           |
| **Persistence**     | Database (JSON file)                                         |
| **Format**          | Array of chord symbols                                       |
| **Example**         | `["Cm7", "F7", "BbMaj7", "Am7b5", "D7", "Gm7"]`              |
| **Dependencies**    | `selected_standard`                                          |
| **Validation**      | Must be valid chord symbols, typically shorter than original |

**Description**: Barry Harris simplified progression for improvisation. Removes passing chords and clarifies ii-V patterns. This is what's sent to the API for line generation.

---

### 6. `simplification_explanation`

| Property            | Value                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| **Type**            | System Data (Pedagogical Text)                                               |
| **Created**         | Step 04: Loaded from selected standard                                       |
| **Used**            | Step 04 (Display)                                                            |
| **Source of Truth** | `jazz-standards.json` (description field)                                    |
| **Persistence**     | Database (JSON file)                                                         |
| **Format**          | String (human-readable explanation)                                          |
| **Example**         | "Simplified version removes EbMaj7 passing chord for clearer ii-V patterns." |
| **Dependencies**    | `selected_standard`                                                          |
| **Validation**      | Should explain why simplification was made                                   |

**Description**: Explains the Barry Harris pedagogical reasoning for the simplification. Reduces user anxiety about "why is it different?"

---

### 7. `default_shape`

| Property            | Value                                              |
| ------------------- | -------------------------------------------------- |
| **Type**            | System Default                                     |
| **Created**         | Step 05: System provides default                   |
| **Used**            | Step 05 (API request)                              |
| **Source of Truth** | System configuration                               |
| **Persistence**     | Hardcoded default (could be user preference later) |
| **Format**          | String (CAGED shape letter)                        |
| **Example**         | `"E"`                                              |
| **Dependencies**    | None                                               |
| **Validation**      | Must be one of: C, A, G, E, D                      |

**Description**: Default CAGED shape used for initial line generation. E shape is most common for jazz standards.

---

### 8. `generation_request`

| Property            | Value                                                  |
| ------------------- | ------------------------------------------------------ |
| **Type**            | API Request Payload                                    |
| **Created**         | Step 05: Generate Barry Harris Lines                   |
| **Used**            | Step 05 (API call), Step 06 (Response processing)      |
| **Source of Truth** | Composed from `chords_improvisation` + `default_shape` |
| **Persistence**     | Ephemeral (request lifetime)                           |
| **Format**          | JSON request body                                      |
| **Example**         | See structure below                                    |
| **Dependencies**    | `chords_improvisation`, `default_shape`                |
| **Validation**      | Must match API schema                                  |

**Structure**:

```json
{
    "chords": ["Cm7", "F7", "BbMaj7", "Am7b5", "D7", "Gm7"],
    "caged_shape": "E",
    "guitar_position": "E"
}
```

**API Endpoint**: `POST /barry-harris/generate-instructions`

---

### 9. `generated_lines_E`

| Property            | Value                                                            |
| ------------------- | ---------------------------------------------------------------- |
| **Type**            | API Response (ABC Notation)                                      |
| **Created**         | Step 06: API returns generated lines                             |
| **Used**            | Step 06 (Display), Step 07 (Comparison), Step 08 (Memory)        |
| **Source of Truth** | API response                                                     |
| **Persistence**     | UI display (session, not stored)                                 |
| **Format**          | ABC notation string                                              |
| **Example**         | `X:1\nT:Autumn Leaves - E Shape\nM:4/4\nL:1/8\nK:Gmin\n"Cm7"...` |
| **Dependencies**    | `generation_request`                                             |
| **Validation**      | Must be valid ABC notation, parseable by abcjs                   |

**Description**: Generated Barry Harris melodic lines in E shape. Displayed as musical notation. User evaluates quality and decides whether to explore other shapes.

---

### 10. `shape_selection_A`

| Property            | Value                                        |
| ------------------- | -------------------------------------------- |
| **Type**            | User Choice                                  |
| **Created**         | Step 07: User clicks A button                |
| **Used**            | Step 07 (API request), Step 08 (Display)     |
| **Source of Truth** | UI button click event                        |
| **Persistence**     | Session (current shape)                      |
| **Format**          | String (CAGED shape letter)                  |
| **Example**         | `"A"`                                        |
| **Dependencies**    | `generated_lines_E` (context for comparison) |
| **Validation**      | Must be one of: C, A, G, E, D                |

**Description**: User's choice to explore A shape. Triggers regeneration with new shape parameter.

---

### 11. `generated_lines_A`

| Property            | Value                                                            |
| ------------------- | ---------------------------------------------------------------- |
| **Type**            | API Response (ABC Notation)                                      |
| **Created**         | Step 08: API returns regenerated lines                           |
| **Used**            | Step 08 (Display), Step 09 (Practice)                            |
| **Source of Truth** | API response                                                     |
| **Persistence**     | UI display (session, not stored)                                 |
| **Format**          | ABC notation string                                              |
| **Example**         | `X:1\nT:Autumn Leaves - A Shape\nM:4/4\nL:1/8\nK:Gmin\n"Cm7"...` |
| **Dependencies**    | `shape_selection_A`, `chords_improvisation`                      |
| **Validation**      | Must be valid ABC notation, parseable by abcjs                   |

**Description**: Regenerated lines in A shape. User compares with E shape (from memory or side-by-side) to make informed practice decision.

---

### 12. `shape_decision`

| Property            | Value                                         |
| ------------------- | --------------------------------------------- |
| **Type**            | User Decision                                 |
| **Created**         | Step 08: User decides which shape to practice |
| **Used**            | Step 09 (Practice)                            |
| **Source of Truth** | User's mental comparison + preference         |
| **Persistence**     | Session (could be stored as user preference)  |
| **Format**          | String (CAGED shape letter)                   |
| **Example**         | `"A"`                                         |
| **Rationale**       | "More comfortable fretboard position"         |
| **Dependencies**    | `generated_lines_E`, `generated_lines_A`      |
| **Validation**      | Must be one of the explored shapes            |

**Description**: User's final decision on which shape to practice. Based on comfort, melodic preference, or fretboard familiarity.

---

### 13. `practice_session`

| Property            | Value                                      |
| ------------------- | ------------------------------------------ |
| **Type**            | Real-World Activity                        |
| **Created**         | Step 09: User moves to guitar practice     |
| **Used**            | Step 10 (Context for next standard)        |
| **Source of Truth** | Physical practice (outside app)            |
| **Persistence**     | Real-world outcome (not stored in app)     |
| **Format**          | Conceptual (not a data structure)          |
| **Example**         | Playing "Autumn Leaves" with A shape lines |
| **Dependencies**    | `generated_lines_A`, `shape_decision`      |
| **Validation**      | N/A (real-world activity)                  |

**Description**: The actual guitar practice session. User applies learned lines to instrument. Success metric: user feels prepared and motivated.

---

### 14. `selected_standard_2`

| Property            | Value                                             |
| ------------------- | ------------------------------------------------- |
| **Type**            | User Selection                                    |
| **Created**         | Step 10: User returns and selects second standard |
| **Used**            | Step 10 (Repeat journey steps 4-9)                |
| **Source of Truth** | UI state + URL parameter                          |
| **Persistence**     | Session + URL (`?standard=blue-bossa`)            |
| **Format**          | String (standard ID)                              |
| **Example**         | `"blue-bossa"`                                    |
| **Dependencies**    | `practice_session` (context), `standards_catalog` |
| **Validation**      | Must match an ID in `standards_catalog`           |

**Description**: Second standard selected in same session. Demonstrates iteration and flow state.

---

### 15. `session_standards_explored`

| Property            | Value                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------- |
| **Type**            | Computed State (Session Tracking)                                                            |
| **Created**         | Throughout journey                                                                           |
| **Used**            | Step 10 (Metrics), Analytics                                                                 |
| **Source of Truth** | Computed from all `selected_standard*` artifacts                                             |
| **Persistence**     | Session (analytics)                                                                          |
| **Format**          | Array of {standard_id, shapes_explored[]}                                                    |
| **Example**         | `[{standard: "autumn-leaves", shapes: ["E", "A"]}, {standard: "blue-bossa", shapes: ["E"]}]` |
| **Dependencies**    | All `selected_standard*` and `shape_selection*` artifacts                                    |
| **Validation**      | Must track unique standards and shapes                                                       |

**Description**: Tracks user exploration behavior for metrics: standards_browsed_per_session, shapes_tried_per_standard.

---

### 16. `time_to_first_generation`

| Property            | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| **Type**            | Computed State (Performance Metric)                          |
| **Created**         | Step 05: Computed from Step 01 timestamp                     |
| **Used**            | Analytics, Performance monitoring                            |
| **Source of Truth** | Computed from `app_open_time` and `generation_complete_time` |
| **Persistence**     | Analytics (not displayed to user)                            |
| **Format**          | Number (seconds)                                             |
| **Example**         | `27` (27 seconds from app open to generation)                |
| **Dependencies**    | Timestamps from Step 01 and Step 05                          |
| **Validation**      | Target: <30 seconds                                          |

**Description**: Critical success factor metric. Measures frictionless entry.

---

### 17. `api_response_time`

| Property            | Value                                                |
| ------------------- | ---------------------------------------------------- |
| **Type**            | Computed State (Performance Metric)                  |
| **Created**         | Step 05: Computed from API call timing               |
| **Used**            | Analytics, Performance monitoring, SLA validation    |
| **Source of Truth** | Measured from API request start to response received |
| **Persistence**     | Analytics (not displayed to user)                    |
| **Format**          | Number (milliseconds)                                |
| **Example**         | `2300` (2.3 seconds)                                 |
| **Dependencies**    | `generation_request` timing                          |
| **Validation**      | Target: <3 seconds (95th percentile)                 |

**Description**: Critical success factor metric. Measures fast generation.

---

### 18. `emotional_state_history`

| Property            | Value                                            |
| ------------------- | ------------------------------------------------ |
| **Type**            | Computed State (UX Tracking)                     |
| **Created**         | Throughout journey                               |
| **Used**            | UX validation, Journey quality assessment        |
| **Source of Truth** | Observed or self-reported user emotions per step |
| **Persistence**     | Analytics (research)                             |
| **Format**          | Array of {step_id, emotion, valence, timestamp}  |
| **Example**         | See structure below                              |
| **Dependencies**    | Each journey step                                |
| **Validation**      | Should show positive emotional arc               |

**Structure**:

```json
[
    { "step": "01", "emotion": "Motivated & Slightly Uncertain", "valence": "positive" },
    { "step": "02", "emotion": "Discovery & Relief", "valence": "positive" },
    { "step": "05", "emotion": "Anticipation & Slight Tension", "valence": "neutral" },
    { "step": "06", "emotion": "Satisfaction & Validation", "valence": "positive" },
    { "step": "09", "emotion": "Motivated & Empowered", "valence": "positive" }
]
```

**Description**: Tracks emotional arc throughout journey. Validates UX design goal of sustained positive emotional state with no significant frustration.

---

## Artifact Flow Diagram

```
User Intent → Standards Catalog → Selected Standard → Dual Progressions → Generation Request
                                                              ↓
                                      Generated Lines (E) ← API Response
                                              ↓
                                      Shape Selection (A) → Regeneration Request
                                              ↓
                                      Generated Lines (A) ← API Response
                                              ↓
                                        Shape Decision → Practice Session
                                              ↓
                                    Return to Standards → New Standard Selection
```

---

## Artifact Dependencies Matrix

| Artifact                     | Depends On                                        | Consumed By                                                             |
| ---------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| `practice_intention`         | -                                                 | `standards_catalog` browsing                                            |
| `standards_catalog`          | -                                                 | `selected_standard`                                                     |
| `selected_standard`          | `standards_catalog`                               | `chords_original`, `chords_improvisation`, `simplification_explanation` |
| `chords_original`            | `selected_standard`                               | UI display (Step 04)                                                    |
| `chords_improvisation`       | `selected_standard`                               | `generation_request`                                                    |
| `simplification_explanation` | `selected_standard`                               | UI display (Step 04)                                                    |
| `default_shape`              | -                                                 | `generation_request`                                                    |
| `generation_request`         | `chords_improvisation`, `default_shape`           | API call                                                                |
| `generated_lines_E`          | `generation_request`                              | UI display, user evaluation                                             |
| `shape_selection_A`          | `generated_lines_E` (context)                     | `generation_request` (new)                                              |
| `generated_lines_A`          | `shape_selection_A`, `chords_improvisation`       | UI display, `shape_decision`                                            |
| `shape_decision`             | `generated_lines_E`, `generated_lines_A`          | `practice_session`                                                      |
| `practice_session`           | `generated_lines_A`, `shape_decision`             | Real-world outcome                                                      |
| `selected_standard_2`        | `practice_session` (context), `standards_catalog` | Repeat journey                                                          |

---

## Artifact Validation Rules

### Data Integrity

1. **Referential Integrity**: `selected_standard` must exist in `standards_catalog`
2. **Chord Validation**: All chord symbols must be parseable by chord parser
3. **Shape Validation**: All shape selections must be one of: C, A, G, E, D
4. **ABC Validation**: All generated lines must be valid ABC notation
5. **Timing Validation**: `time_to_first_generation` must be <30 seconds (target)

### Business Rules

1. **Dual Progression Requirement**: Every standard must have both `chords_original` and `chords_improvisation`
2. **Simplification Explanation**: Every standard must explain why simplification was made
3. **Default Shape**: Must always provide a default shape (E) for first generation
4. **Shape Exploration**: User must be able to switch shapes without re-selecting standard
5. **URL State**: `selected_standard` must be reflected in URL for shareability

### Performance Constraints

1. **API Response Time**: <3 seconds (95th percentile)
2. **Standards Load Time**: <2 seconds
3. **ABC Rendering Time**: <500ms client-side
4. **Total Journey Time**: <5 minutes (Step 01 to Step 09)
5. **Time to First Generation**: <30 seconds (Step 01 to Step 05)

---

## Artifact Testing Strategy

### Unit Tests

- Validate each artifact's schema/format
- Test artifact creation from dependencies
- Test validation rules (e.g., shape must be C/A/G/E/D)

### Integration Tests

- Test artifact flow through API boundary (request → response)
- Test artifact persistence (session, URL, database)
- Test artifact loading from `jazz-standards.json`

### Acceptance Tests

- Test complete artifact lifecycle (creation → usage → display)
- Test artifact dependencies (e.g., `selected_standard` loads correct progressions)
- Test emotional arc (artifacts should not cause frustration)

### Performance Tests

- Test timing constraints (`api_response_time`, `time_to_first_generation`)
- Test concurrent artifact access (multiple users, multiple standards)

---

## Artifact Evolution (Future Versions)

### V2 Enhancements

- **Pattern Artifacts**: `used_patterns[]` - Track which Barry Harris patterns were used in lines
- **Pattern Labels**: Add pattern names to `generated_lines_*` for educational value
- **User Preferences**: Store `preferred_shape` per user for default
- **Practice History**: Store `practice_session` data for progress tracking

### V3 Enhancements

- **Custom Progression**: `custom_chords_input` - User-provided chord progression
- **Progression Validation**: `validated_custom_chords` - Validated and parsed input
- **Saved Standards**: `user_saved_standards[]` - User's favorite standards for quick access
- **Practice Analytics**: `practice_time_per_standard` - Time spent practicing each standard

---

## Related Documents

- **Journey Visual Map**: `journey-standards-learning-visual.md` - Narrative description of artifact usage
- **Journey YAML Schema**: `journey-standards-learning.yaml` - Formal structure with artifact references
- **Journey Gherkin Scenarios**: `journey-standards-learning.feature` - Executable tests validating artifacts
- **API Specification**: `/Users/pedro/src/wes/openapi.yaml` - API schema for request/response artifacts
- **Data Source**: `/Users/pedro/src/wes/data/jazz-standards.json` - Source of truth for standards catalog

---

## Conclusion

This registry ensures every artifact in the Standards-Based Barry Harris Learning journey has:

✅ **Single Source of Truth**: No ambiguity about where data comes from
✅ **Clear Lifecycle**: Creation, usage, and persistence are explicit
✅ **Dependency Mapping**: Dependencies between artifacts are documented
✅ **Validation Rules**: Each artifact has testable validation criteria
✅ **Performance Constraints**: Timing requirements are specified
✅ **Evolution Path**: Future enhancements are planned

This registry serves as the authoritative reference for:

- **Developers**: Implementing data flow correctly
- **QA Engineers**: Validating artifact correctness in tests
- **UX Designers**: Understanding what data is available at each step
- **Product Managers**: Tracking metrics and analytics artifacts
