# Job Stories: Standards-Based Barry Harris Learning

**Feature**: Experimental Tab for HarrisApp
**Wave**: DISCUSS (2 of 6) - REVISED
**Date**: 2026-03-04
**Primary Users**: Jazz musicians/students learning improvisation

---

## Job Story Format

All job stories follow the format:

> **When** [situation], **I want to** [motivation], **so I can** [outcome].

---

## Job 1: Standards-Based Barry Harris Learning (PRIMARY)

**When** learning jazz improvisation using the Barry Harris method,
**I want to** practice with familiar jazz standards and explore different Barry Harris approaches,
**So I can** master the method through material I already know and develop my improvisational voice.

### Context

- User is learning Barry Harris improvisation concepts
- Wants to apply method to familiar standards (Autumn Leaves, Blue Bossa, etc.)
- Currently practices without seeing how Barry Harris lines fit the progression
- Familiar harmonic territory makes learning the _method_ easier than abstract theory
- Goal is to understand Barry Harris approach and internalize patterns

### Success Indicators

- Can select jazz standard from library
- Can generate Barry Harris lines for that standard
- Can explore different CAGED shapes for the same standard
- Can see which patterns are used in the generated lines
- Can practice the standard with Barry Harris vocabulary
- Understands _how_ the Barry Harris method works through familiar material

### User Types

1. **Beginner**: Learning Barry Harris basics, needs simple standards (Autumn Leaves, Blue Bossa)
2. **Intermediate**: Expanding vocabulary, ready for complex harmony (All The Things You Are)
3. **Advanced**: Mastering method, exploring advanced applications (Stella By Starlight)

---

## Job 2: Shape Exploration (SECONDARY)

**When** practicing a jazz standard with Barry Harris lines,
**I want to** try different CAGED shapes to hear melodic variations,
**So I can** find the most comfortable and musical approach for my playing.

### Context

- User has generated initial lines for a standard
- Wants to explore how different shapes change the melodic approach
- Different shapes offer different register ranges and fingering options
- Goal is to discover personal preference and expand fretboard knowledge

### Success Indicators

- Can switch between CAGED shapes (C, A, G, E, D) for same standard
- Can hear/see melodic differences between shapes
- Can identify which shape feels most comfortable
- Can compare 2-3 shapes side-by-side
- Makes informed decision about which shape to practice

---

## Job 3: Pattern Understanding (SECONDARY)

**When** exploring Barry Harris lines on a standard,
**I want to** understand which patterns are being used,
**So I can** learn the Barry Harris vocabulary and apply it to other standards.

### Context

- User sees generated lines but doesn't understand the underlying patterns
- Wants to know: "Why did it use ChordUp here? What's ScaleDown doing?"
- Goal is to build pattern vocabulary beyond just copying lines
- Understanding patterns enables transferring knowledge to new standards

### Success Indicators

- Can see which patterns are used in generated lines
- Can understand pattern names (ChordUp, TriadDown, ScaleDown, etc.)
- Can experiment with different pattern combinations
- Can recognize patterns in other standards
- Develops intuition for which patterns work in different contexts

---

## Job 4: Custom Progression Experimentation (TERTIARY)

**When** I want to practice a progression not in the standards library,
**I want to** input my own chord progression,
**So I can** apply Barry Harris method to any musical situation.

### Context

- User knows a tune not in the library
- Wants to experiment with original compositions
- Needs flexibility beyond pre-loaded standards
- Goal is unrestricted exploration of Barry Harris concepts

### Success Indicators

- Can input custom chord progression (text input)
- Can generate Barry Harris lines for custom progression
- Can use all exploration features (shapes, patterns) on custom input
- Validates chord input with helpful errors

---

## Job-to-Feature Mapping

| Job                               | Primary Feature                    | Supporting Features                |
| --------------------------------- | ---------------------------------- | ---------------------------------- |
| **Standards-Based Learning** (P1) | Standards Library + Line Generator | Shape selector, Pattern display    |
| **Shape Exploration** (P2)        | Shape Switcher                     | Side-by-side comparison (optional) |
| **Pattern Understanding** (P3)    | Pattern Indicator/Explorer         | Pattern definitions, examples      |
| **Custom Progression** (P4)       | Custom Progression Input           | Validation, chord suggestions      |

---

## Priority Based on Opportunity Score

1. **Standards-Based Barry Harris Learning** (Score: 17) - Highest value, core learning need
2. **Shape Exploration** (Score: 13) - High value, enables personal discovery
3. **Pattern Understanding** (Score: 11) - Moderate value, deepens comprehension
4. **Custom Progression** (Score: 8) - Enhancement, flexibility for advanced users

**Recommendation**: Implementation order matches opportunity scores. Start with Standards Library + Line Generation (P1), add Shape Exploration (P2), then Pattern Understanding (P3), finally Custom Input (P4) if validated by user adoption.

---

## Key Insights from Reframe

### Why Standards-Based Learning is Primary

**Before reframe**: "Compare CAGED shapes side-by-side" (tool-focused)
**After reframe**: "Learn Barry Harris method via familiar standards" (pedagogy-focused)

**Rationale**:

- Users aren't learning for the sake of comparison - they're learning _improvisation_
- Jazz standards provide familiar harmonic context (user knows the tune)
- Familiar material accelerates learning of _new method_ (Barry Harris approach)
- Standards library removes friction: "What should I practice?" → Browse, click, generate
- Shape exploration becomes a _discovery tool_, not the starting point

### Learning Progression

**Phase 1: Pick Standard** (familiar)

- "I know Autumn Leaves, let me see Barry Harris lines for it"

**Phase 2: Generate Lines** (new approach)

- System generates lines using Barry Harris method
- User sees method applied to familiar material

**Phase 3: Explore** (discover preferences)

- Try different shapes → Find comfortable approach
- See patterns used → Understand vocabulary
- Practice → Internalize method

**Phase 4: Transfer** (apply to new material)

- User understands method well enough to apply to other standards
- Eventually: create own lines using Barry Harris vocabulary

---

## Next Steps

These job stories inform:

1. **Four Forces Analysis** (next) - Map forces for Standards-Based Learning job
2. **Opportunity Scoring** - Rescore with new primary job
3. **Journey Design** - Map user journey from standards library → exploration → practice
4. **Acceptance Criteria** (Phase 3) - Define testable success criteria
