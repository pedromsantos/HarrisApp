# Opportunity Scores: Standards-Based Barry Harris Learning

**Feature**: Experimental Tab for HarrisApp
**Wave**: DISCUSS (2 of 6) - REVISED
**Date**: 2026-03-04

---

## Opportunity Scoring Framework

**Opportunity Score** = Importance + (Importance - Satisfaction)

Where:

- **Importance**: How critical is this job? (0-10 scale)
- **Satisfaction**: How well does current solution work? (0-10 scale)
- **Higher score** = Greater opportunity

---

## Job 1: Standards-Based Barry Harris Learning

### Importance: 10/10

**Rationale**: This is THE core job - learning jazz improvisation using Barry Harris method. Without this, the entire app loses its purpose.

- Addresses fundamental learning need: applying method to real music
- Familiar standards provide essential context for learning abstract concepts
- Practice direction is critical: "What should I practice?" answered immediately
- Standards library = entry point to entire Barry Harris system

### Current Satisfaction: 2/10

**Rationale**: Extremely poor current solution - massive friction at every step.

- Must manually transcribe Barry Harris lines from videos/books
- No way to see patterns applied to familiar standards
- Trial-and-error to figure out which patterns work where
- Time-consuming setup prevents actually practicing
- No access to simplified progressions for improvisation

### **Opportunity Score: 18**

**Calculation**: 10 + (10 - 2) = 10 + 8 = **18**

**This is the highest-value opportunity** - Critical need with nearly no current solution.

---

## Job 2: Shape Exploration

### Importance: 8/10

**Rationale**: High importance for fretboard fluency and personal voice development.

- Essential for comfortable playing across full fretboard
- Different shapes offer different melodic approaches
- Shape choice affects practice efficiency and musical results
- Critical for advanced players to explore all positions

### Current Satisfaction: 3/10

**Rationale**: Very poor - must manually figure out each shape.

- No way to instantly compare shapes for same progression
- Manual trial-and-error to discover shape differences
- Limited fretboard exploration due to effort required
- Can't make informed shape choices without comparison

### **Opportunity Score: 13**

**Calculation**: 8 + (8 - 3) = 8 + 5 = **13**

---

## Job 3: Pattern Understanding

### Importance: 7/10

**Rationale**: Important for deep learning but not essential for basic practice.

- Vocabulary building accelerates transfer to new material
- Understanding "why" enhances long-term retention
- Pattern recognition is core to Barry Harris method
- Not required for beginners, more valuable for intermediate/advanced

### Current Satisfaction: 3/10

**Rationale**: Poor - no pattern visibility in current practice.

- Barry Harris videos show patterns but require active analysis
- Can't easily identify which patterns are used where
- No labeling or recognition support in practice
- Building vocabulary is manual and slow

### **Opportunity Score: 11**

**Calculation**: 7 + (7 - 3) = 7 + 4 = **11**

---

## Job 4: Custom Progression Input

### Importance: 6/10

**Rationale**: Moderate importance - valuable flexibility but not core need.

- Nice-to-have for advanced users and original compositions
- 15-standard library covers most learning needs
- Becomes more important as user advances
- Enhancement rather than fundamental capability

### Current Satisfaction: 4/10

**Rationale**: Moderate - library provides good coverage but lacks flexibility.

- Standards library limits to 15 tunes (but covers common learning tunes)
- No support for original compositions or rare standards
- Can't experiment with theoretical progressions
- Workaround exists: practice similar standards from library

### **Opportunity Score: 8**

**Calculation**: 6 + (6 - 4) = 6 + 2 = **8**

---

## Ranked Opportunities

| Rank | Job                               | Importance | Satisfaction | Gap | **Opportunity Score** | Priority |
| ---- | --------------------------------- | ---------- | ------------ | --- | --------------------- | -------- |
| 1    | **Standards-Based Learning** (P1) | 10/10      | 2/10         | 8   | **18**                | **MVP**  |
| 2    | **Shape Exploration** (P2)        | 8/10       | 3/10         | 5   | **13**                | **MVP**  |
| 3    | **Pattern Understanding** (P3)    | 7/10       | 3/10         | 4   | **11**                | **V2**   |
| 4    | **Custom Progression** (P4)       | 6/10       | 4/10         | 2   | **8**                 | **V3**   |

---

## Priority Rationale

### MVP: Standards Library + Shape Exploration (P1 + P2)

**Why bundle together**:

- P1 (Standards Library) is entry point - user must pick a standard first
- P2 (Shape Exploration) is immediate next step - "Let me try different shapes"
- Natural workflow: Pick standard → Generate (default shape) → Explore other shapes
- Both have high scores (18 + 13 = 31 combined value)
- Implementing P1 without P2 would be incomplete - shape switching is core to Barry Harris method

**Combined User Flow**:

1. Browse standards library
2. Select "Autumn Leaves"
3. See generated lines (default shape: E)
4. Click "Try Shape A" → See different melodic approach
5. Practice chosen shape

### V2: Pattern Understanding (P3)

**Why defer to V2**:

- Score of 11 is moderate (not urgent)
- Users can practice effectively without pattern labels
- More valuable for intermediate/advanced users
- Can be added to existing UI (overlay on generated lines)
- Validate P1+P2 adoption before adding complexity

**Implementation**:

- Add pattern labels to generated lines
- Show pattern definitions on hover/click
- Optional: Pattern filter (show me lines with ChordUp)

### V3: Custom Progression (P4)

**Why defer to V3**:

- Lowest score (8) - nice-to-have, not essential
- Standards library covers most learning scenarios
- More complex UI (text input, validation, error handling)
- Only valuable after user exhausts library
- Validate library coverage before building custom input

**Defer criteria**:

- If users frequently request standards not in library → prioritize sooner
- If advanced users dominate user base → move to V2
- If library proves sufficient → may not build at all

---

## Strategic Insights

### MVP Scope: Standards Library + Shape Exploration

**P1: Standards-Based Learning (Score 18)**

- Highest value opportunity in the entire feature set
- Addresses core learning need with nearly zero current satisfaction
- Standards library = familiar entry point (low anxiety)
- Dual progressions visible = Barry Harris pedagogy in action
- Quick win: "Browse → Click → Practice" in 30 seconds

**P2: Shape Exploration (Score 13)**

- Natural complement to P1 - "Now try different shapes"
- High value with strong adoption forces (score 13)
- Simple UI addition: shape selector/switcher
- Unlocks full fretboard for learning
- Moderate implementation complexity

**Why stop at P2 for MVP**:

- P1+P2 delivers complete core experience (pick standard, explore shapes, practice)
- Combined score of 31 = massive value
- Validate approach before adding pattern complexity (P3)
- Custom input (P4) only needed if library proves insufficient

### Design Focus for MVP

**Standards Library (P1) Requirements**:

- 15 carefully curated standards (✅ already have)
- Difficulty levels: beginner (5), intermediate (6), advanced (4)
- Metadata visible: composer, key, tempo, form, difficulty
- Dual progressions displayed clearly (original + improvisation)
- One-click selection → instant generation
- Search/filter by difficulty, key, or name (optional, nice-to-have)

**Shape Exploration (P2) Requirements**:

- Default shape selection (E is most common)
- Shape switcher: buttons or dropdown for C, A, G, E, D
- Instant regeneration when shape changes (<2 sec)
- Side-by-side comparison optional (could be V2 enhancement)
- Visual indication of which shape is active

### Success Metrics by Job

**Standards-Based Learning (P1)**:

- **Adoption**: % of users who generate lines from library vs. never using feature
- **Engagement**: Average standards explored per session (target: 2-3)
- **Stickiness**: Weekly active users returning to library
- **Learning velocity**: User-reported "time to productive practice" (target: <2 min from app open)
- **Satisfaction**: Post-practice survey: "Did this help your Barry Harris learning?"

**Shape Exploration (P2)**:

- **Discovery**: % of users who try multiple shapes per standard (target: >60%)
- **Shape diversity**: Average number of shapes explored per session (target: 2-3)
- **Preference formation**: Users who consistently return to same shape (indicates informed choice)
- **Fretboard fluency**: Self-reported comfort across fretboard positions (pre/post)

**Pattern Understanding (P3)** - V2 Metrics:

- **Engagement**: % of users who interact with pattern labels
- **Transfer**: User-reported ability to recognize patterns in new standards
- **Vocabulary**: Number of pattern names learned (self-reported quiz)

**Custom Progression (P4)** - V3 Metrics:

- **Need validation**: Support requests for standards not in library
- **Advanced usage**: % of active users who are "power users" (>10 standards practiced)
- **Adoption**: % of users who use custom input vs. library

---

## Implementation Recommendation

### MVP (Ship First)

**Phase 1: Standards Library (P1)**

- Backend: `/jazz-standards` endpoints (✅ spec complete, needs implementation)
- Frontend: Standards browser component with metadata display
- Dual progression display (original + improvisation side-by-side)
- Default shape generation (E shape)
- ABC notation rendering

**Phase 2: Shape Exploration (P2)**

- Shape selector UI (C, A, G, E, D buttons)
- Regenerate on shape change
- Loading state during generation
- Active shape indication

**Estimated Delivery**: 2-3 weeks for MVP (P1+P2)

### V2 (After MVP Validation)

**Pattern Understanding (P3)**

- Add pattern labels to generated lines
- Pattern definitions modal/tooltip
- Optional: Pattern filter

**Estimated Delivery**: 1 week (enhancement to existing feature)

### V3 (If Validated by Usage)

**Custom Progression (P4)**

- Custom progression input UI
- Chord validation and suggestions
- Same shape exploration as library standards

**Estimated Delivery**: 1-2 weeks (new input flow)

---

## Risk Mitigation

### Risk 1: Standards Library Insufficient

**Mitigation**: Track user requests for missing standards. If >20% of users request standards not in library within first month, prioritize P4 (Custom Input) to V2.

### Risk 2: Shape Exploration Too Complex

**Mitigation**: Start with simple dropdown. If users struggle, add side-by-side comparison view in V2.

### Risk 3: Users Don't Understand Dual Progressions

**Mitigation**: Add help text explaining Barry Harris simplification approach. Tooltip on "Improvisation Progression" explaining purpose.

### Risk 4: Generated Lines Don't Sound Musical

**Mitigation**: Curate default patterns/shapes per standard during development. Test with jazz musicians for musical quality validation.

---

## Next Steps

These opportunity scores inform:

1. **Journey Design** (next) - Map MVP journey: Standards Library → Shape Exploration → Practice
2. **Acceptance Criteria** (Phase 3) - Define testable requirements for P1+P2
3. **UI Wireframes** (DESIGN wave) - Design standards browser + shape selector
4. **MVP Scope** (DELIVER wave) - Ship P1+P2, defer P3/P4 based on validation
5. **Success Metrics** - Track P1+P2 metrics to validate before building P3/P4
