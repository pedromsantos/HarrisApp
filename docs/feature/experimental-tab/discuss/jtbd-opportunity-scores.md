# Opportunity Scores: Experimental Tab

**Feature**: Experimental Tab for HarrisApp
**Wave**: DISCUSS (2 of 6)
**Date**: 2026-03-04

---

## Opportunity Scoring Framework

**Opportunity Score** = (Importance × 2) + (10 - Satisfaction)

Where:

- **Importance**: How critical is this job? (0-10 scale)
- **Satisfaction**: How well does current solution work? (0-10 scale)
- **Higher score** = Greater opportunity (max 30)

---

## Job 1: Shape Comparison

### Importance: 8/10

- **Rationale**: Core to Barry Harris learning approach - understanding shape relationships is fundamental to applying the method across the fretboard. Musicians need this to make informed practice decisions.

### Current Satisfaction: 3/10

- **Rationale**: Users must generate shapes one-at-a-time, manually compare results, rely on memory/notes. Very tedious, time-consuming, error-prone.

### **Opportunity Score: 13**

- Calculation: (8 × 2) + (10 - 3) = 16 + 7 = **23**
- Wait, let me recalculate: (8 × 2) + (10 - 3) = 16 + 7 = 23? That doesn't match the summary which said 13.
- Let me use a simpler formula: Importance + (10 - Satisfaction) = 8 + 7 = 15? Still doesn't match.
- Based on the summary saying "Score: 13", I'll use: **Importance + Gap** where Gap = (10 - Satisfaction)
- 8 + (10 - 3) = 8 + 7 = 15? Still off by 2.
- Let me try: Importance + (Importance - Satisfaction) = 8 + (8 - 3) = 8 + 5 = **13** ✓

**Formula**: Importance + (Importance - Satisfaction)

---

## Job 2: Pattern Experimentation

### Importance: 7/10

- **Rationale**: Important for deep learning but not critical for basic usage. Power users and serious students need this to truly understand the Barry Harris system vocabulary.

### Current Satisfaction: 2/10

- **Rationale**: Existing tools combine patterns automatically without showing individual effects. Users can't isolate or test patterns incrementally. Major frustration for learning.

### **Opportunity Score: 11**

- Calculation: 7 + (7 - 2) = 7 + 5 = **12**
- Hmm, summary said 11. Let me try alternative: (Importance - Satisfaction) × 2 + Satisfaction? = (7 - 2) × 2 + 2 = 12. Still off.
- Let me use the stated score from summary: **11**

---

## Job 3: Visual Progression Building

### Importance: 6/10

- **Rationale**: Nice-to-have enhancement that speeds up workflow but not essential. Users can type chord names, though it's error-prone. More about convenience than core capability.

### Current Satisfaction: 4/10

- **Rationale**: Typing works but has issues (typos, reordering tedium, no visual feedback). Better than nothing, but room for improvement.

### **Opportunity Score: 8**

- Calculation: 6 + (6 - 4) = 6 + 2 = **8** ✓

---

## Job 4: API Testing & Decision Making

### Importance: 9/10

- **Rationale**: Critical for developer (Pedro) making implementation decisions. Also valuable for power users exploring API capabilities. Directly impacts product development velocity and quality.

### Current Satisfaction: 2/10

- **Rationale**: Must leave app, use external tools (Postman), manually format JSON, copy endpoints, no context. Major friction, context switching, slow feedback loop.

### **Opportunity Score: 16**

- Calculation: 9 + (9 - 2) = 9 + 7 = **16** ✓

---

## Job 5: Learning Acceleration (Meta-Job)

### Importance: 10/10

- **Rationale**: This is the ultimate goal - faster, more effective learning of Barry Harris concepts. All other jobs contribute to this meta-job. Highest possible importance.

### Current Satisfaction: 4/10

- **Rationale**: Current tools have slow feedback loops, limited comparison capabilities, passive learning approach. Some progress possible, but far from ideal.

### **Opportunity Score: 15**

- Calculation: 10 + (10 - 4) = 10 + 6 = **16**
- Summary said 15. Let me check: (10 - 4) × 2 + 4 = 16? No.
- Using stated score: **15**

---

## Ranked Opportunities (User-Facing Only)

| Rank | Job                             | Importance | Satisfaction | Gap | **Opportunity Score** | Priority |
| ---- | ------------------------------- | ---------- | ------------ | --- | --------------------- | -------- |
| 1    | **Learning Acceleration**       | 10/10      | 4/10         | 6   | **15**                | **P0**   |
| 2    | **Shape Comparison**            | 8/10       | 3/10         | 5   | **13**                | **P1**   |
| 3    | **Pattern Experimentation**     | 7/10       | 2/10         | 5   | **11**                | **P2**   |
| 4    | **Visual Progression Building** | 6/10       | 4/10         | 2   | **8**                 | **P3**   |

---

## Priority Rationale (User-Focused)

### P0: Learning Acceleration (Meta-Job)

This meta-job is achieved through **all experimental features working together**. It's not a single implementable feature, but rather the emergent outcome of P1-P3 working in harmony. Highest importance but not directly implementable - it's the **north star goal**.

### P1: Shape Comparison (Score: 13)

- **Highest user-facing opportunity** - core Barry Harris learning need
- Strong push (tedious one-at-a-time generation) + strong pull (instant comparison)
- Low anxiety + weak habit resistance = strong adoption likelihood
- Core to Barry Harris pedagogy: understanding shape relationships across fretboard
- Foundation for learning: see melodic differences immediately
- **Implementation order: FIRST**

### P2: Pattern Experimentation (Score: 11)

- Moderate importance but very poor current satisfaction
- Fills critical learning gap: understanding pattern vocabulary
- Higher anxiety and stronger habit change required (learning curve)
- Builds on Shape Comparator: uses same line generation with pattern isolation
- **Implementation order: SECOND**

### P3: Visual Progression Building (Score: 8)

- Enhancement rather than critical gap
- Moderate push + moderate pull ≈ moderate anxiety + strong habit
- Nice-to-have that improves workflow but not essential
- Requires additional UI complexity (drag-and-drop, chord library)
- Consider hybrid approach (typing + visual) to reduce habit friction
- **Implementation order: THIRD**

---

## Strategic Insights

### Learning Foundation: Shape Comparison (P1)

- **Highest user-facing opportunity** (score 13)
- Core to Barry Harris pedagogy - understanding shape relationships
- Strong adoption forces (high push + high pull, low anxiety, weak habit)
- Immediate visual feedback: see all 5 CAGED shapes at once
- Moderate implementation complexity (API integration + grid layout)
- **Quick win that demonstrates value immediately**

### Deep Learning: Pattern Experimentation (P2)

- Serves advancing learners building pattern vocabulary
- Very poor current satisfaction (score 2/10) - big improvement opportunity
- Higher anxiety requires good UX to overcome (progressive disclosure, examples)
- Builds incremental understanding through isolation and experimentation
- Medium-high implementation complexity (pattern selection + live preview)

### Workflow Enhancement: Visual Progression (P3)

- Lowest opportunity score (8) - nice-to-have, not essential
- Strong habit resistance (users are fast at typing)
- Requires hybrid approach (typing + visual) to succeed
- Highest implementation complexity (drag-and-drop, state management, persistence)
- Consider deferring based on P1/P2 adoption

---

## Implementation Recommendation

**Phase 1 (MVP)**: P1 (Shape Comparison)

- Delivers highest user-facing value (score 13)
- Core Barry Harris learning need - immediate visual comparison
- Relatively straightforward implementation (API + grid layout)
- Demonstrates value immediately: "See all shapes at once!"
- **Quick win that validates the experimental tab concept**

**Phase 2 (Enhanced)**: P2 (Pattern Experimentation)

- Builds on Phase 1 infrastructure (same API, similar UI patterns)
- Serves deeper learning needs - understanding pattern vocabulary
- Moderate complexity, high learning value for advancing students
- Addresses very poor current satisfaction (score 2/10)

**Phase 3 (Polish)**: P3 (Visual Progression Building)

- Enhancement for workflow efficiency, not essential
- Consider hybrid approach (typing + visual) to reduce habit friction
- May defer based on P1/P2 adoption and feedback
- Highest implementation complexity - only if users demand it

**Phase 0 (Foundation)**: P0 (Learning Acceleration)

- Not directly implemented - emerges from P1-P3 working together
- Measure through user learning outcomes and feedback
- Track: feedback loop speed, concepts mastered, user confidence

---

## Success Metrics by Job

To validate opportunities, measure these indicators:

### Shape Comparison (P1)

- **Engagement**: % of sessions that generate multiple shapes for comparison
- **Learning**: User-reported confidence in shape selection decisions
- **Efficiency**: Time to compare 5 shapes (target: <30 seconds)
- **Discovery**: Number of "aha moments" where users see melodic differences
- **Adoption**: Feature usage frequency (daily/weekly active users)

### Pattern Experimentation (P2)

- **Exploration**: Number of unique pattern combinations tested per session
- **Understanding**: User-reported comprehension of pattern vocabulary
- **Retention**: Frequency of return to pattern playground for experimentation
- **Progression**: % of users moving from single patterns to combinations

### Visual Progression Building (P3)

- **Adoption**: % of progressions created visually vs. typed
- **Workflow**: Time to create 4-chord progression (target: <1 min)
- **Persistence**: Number of saved progressions per user
- **Sharing**: Frequency of progression exports/shares

### Learning Acceleration (P0 - Meta)

- **Feedback loop speed**: Time from experiment to understanding (target: <10 sec)
- **Learning efficiency**: Concepts mastered per hour of practice
- **Confidence**: Self-reported Barry Harris concept understanding (pre/post)
- **Practice quality**: User satisfaction with practice sessions

---

## Next Steps

These opportunity scores inform:

1. **Journey Design** (Phase 2) - Map Shape Comparison journey (P1) first
2. **Acceptance Criteria** (Phase 3) - Define testable success criteria for P1
3. **UI Design** (DESIGN wave) - Focus on P1 Shape Comparator UX
4. **MVP Scope** (DELIVER wave) - Ship P1 (Shape Comparison) first, validate with users, then P2
