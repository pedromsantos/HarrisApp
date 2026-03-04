# Journey Map: Shape Comparison for Learning

**Feature**: Experimental Tab - CAGED Shape Comparator
**Job**: Shape Comparison (Priority P1, Score: 13)
**Primary User**: Jazz musicians/students learning Barry Harris theory
**Date**: 2026-03-04

---

## Journey Overview

**Job Story**: When learning Barry Harris theory and practicing jazz improvisation, I want to compare different CAGED shapes side-by-side, so I can understand which shape works best for different progressions and learn faster.

**Journey Timespan**: 3-7 minutes (single practice session comparison)

**Success Outcome**: Musician understands melodic differences between CAGED shapes for a specific progression and can make informed choice about which shape to practice.

---

## Journey Steps

### Step 1: Practice Session Begins

**Trigger**: Musician sits down to practice improvisation over a specific progression

**User Actions**:

- Has chord progression in mind (e.g., ii-V-I in C: Dm7 - G7 - CMaj7)
- Wants to practice Barry Harris lines for this progression
- Thinking: "Which CAGED shape should I use for this?"

**Mental Model**:

- "I know there are 5 shapes (C, A, G, E, D)"
- "Different shapes will give different melodic lines"
- "I need to compare them to see which feels best"

**Emotional State**: 😊 **Motivated & Curious**

- Energized to practice
- Curious about shape differences
- Slight uncertainty about which shape to choose

**Shared Artifacts Created**:

- `${practice_progression}`: The chord progression to practice (e.g., "Dm7 - G7 - CMaj7")
- `${learning_goal}`: What the musician wants to learn (e.g., "find comfortable shape for ii-V-I")

**Error Paths**:

- Musician doesn't know what progression to practice → Uses standard ii-V-I
- Uncertain about Barry Harris method → Refers to learning materials first

---

### Step 2: Navigate to Shape Comparator

**User Actions**:

- Open HarrisApp in browser
- Click "Experimental" tab in navigation
- See "Shape Comparator" as first/default sub-tab
- Tab is already selected

**Mental Model**:

- "This is where I can compare all the shapes at once"
- Expects to see comparison grid or side-by-side view
- Familiar with CAGED system terminology

**Emotional State**: 😊 **Focused & Confident**

- Easy navigation - no confusion
- Clear purpose: compare shapes
- Ready to input progression

**Shared Artifacts Used**:

- `${practice_progression}` (carried from Step 1)

**Shared Artifacts Created**:

- `${current_location}`: "Shape Comparator tab"

**Error Paths**:

- Can't find Experimental tab → Checks navigation, asks for help
- Not logged in → Must authenticate first

---

### Step 3: Enter Chord Progression

**User Actions**:

- See input field for chord progression
- Type or select chords: "Dm7", "G7", "CMaj7"
- May see chord suggestions/autocomplete
- Click "Generate All Shapes" or "Compare" button

**Mental Model**:

- "I need to tell it which progression I'm practicing"
- Expects familiar chord notation (Dm7, G7, CMaj7)
- Anticipates immediate comparison results

**Emotional State**: 😊 **Engaged**

- Actively inputting practice material
- Anticipation building: "About to see the comparison"
- Slight concern: "Did I type the chords correctly?"

**Shared Artifacts Used**:

- `${practice_progression}` (entered into UI)

**Shared Artifacts Created**:

- `${chord_input}`: User's typed chord progression
- `${generation_request}`: Request sent to API

**Error Paths**:

- Typo in chord name → Validation error shows, suggests correct spelling
- Invalid progression (< 2 chords) → Error message: "Need at least 2 chords"
- Empty input → Generate button disabled or shows hint

---

### Step 4: Wait for Generation

**User Actions**:

- See loading indicator
- Brief wait (2-5 seconds) while API generates lines for all 5 shapes
- Maintains focus on screen

**Mental Model**:

- "The app is generating lines for all 5 shapes"
- Expects quick response (not long wait)
- Anticipating visual comparison grid

**Emotional State**: 😐 **Anticipation**

- Brief pause in engagement
- Slight tension: "Hope it works"
- Maintaining interest

**Shared Artifacts Used**:

- `${generation_request}` (sent to API)

**Shared Artifacts Created**:

- `${generation_status}`: Loading/processing state

**Error Paths**:

- Request timeout → Error message: "Taking longer than expected, try again"
- API error → Clear message: "Could not generate lines, check progression"
- Network error → "Connection issue, please retry"

---

### Step 5: View Shape Comparison Grid

**User Actions**:

- See grid of 5 CAGED shapes (C, A, G, E, D)
- Each cell shows ABC notation for that shape
- Can see all shapes simultaneously
- Eyes scan across shapes looking for differences

**Mental Model**:

- "Here are the melodic lines for each shape"
- "I can compare them side-by-side"
- "Visual differences should be obvious"
- Familiar with ABC notation from other Barry Harris practice

**Emotional State**: 😊 **Satisfaction & Discovery**

- "Aha! I can see all shapes at once!"
- Relief: No need to remember previous results
- Curiosity activated: Examining differences

**Shared Artifacts Used**:

- `${generation_request}` results

**Shared Artifacts Created**:

- `${shape_lines_C}`: ABC notation for C shape
- `${shape_lines_A}`: ABC notation for A shape
- `${shape_lines_G}`: ABC notation for G shape
- `${shape_lines_E}`: ABC notation for E shape
- `${shape_lines_D}`: ABC notation for D shape
- `${visible_comparison}`: All shapes displayed in grid

**Error Paths**:

- ABC notation not rendering → Shows error placeholder, retry option
- Some shapes missing → Partial results shown, message explains which failed
- Results look identical (bug) → User confused, reports issue

---

### Step 6: Analyze Melodic Differences

**User Actions**:

- Read ABC notation for each shape
- Compare melodic patterns visually
- Notice which shapes use higher/lower register
- Identify which transitions feel more natural
- May mentally "sing" or imagine fingering

**Mental Model**:

- "Shape E starts higher on the neck"
- "Shape A has a smoother transition between chords"
- "Shape C uses more chromatic movement"
- Connecting visual patterns to fretboard positions

**Emotional State**: 😊 **Engaged & Learning**

- Active cognitive processing
- Pattern recognition happening
- Building understanding: "Now I see the difference!"

**Shared Artifacts Used**:

- `${visible_comparison}` (all shape lines)

**Shared Artifacts Created**:

- `${melodic_insights}`: User's understanding of differences (e.g., "E shape stays in upper register")
- `${preferred_shapes}`: Mental note of 2-3 shapes that look interesting

**Error Paths**:

- Melodic differences too subtle → User confused: "They all look the same?"
- ABC notation unfamiliar → User needs reference for notation
- Too much information → User overwhelmed by 5 shapes at once

---

### Step 7: Make Shape Selection Decision

**User Actions**:

- Choose 1-2 shapes to practice based on comparison
- Consider factors:
    - Melodic range (stays in comfortable register?)
    - Pattern clarity (easy to see structure?)
    - Hand position (comfortable fingering?)
    - Musical taste (sounds good?)
- May mentally note: "I'll practice E and A shapes today"

**Mental Model**:

- "Based on what I see, E shape looks most comfortable"
- "A shape has interesting melodic movement"
- "I'll try both and see which feels better on guitar"
- Decision informed by visual comparison

**Emotional State**: 😊 **Confidence & Closure**

- Confident in choice: "I know why I picked this shape"
- Ready to practice with clear direction
- Satisfied with informed decision (not guessing)

**Shared Artifacts Used**:

- `${melodic_insights}` (from Step 6)
- `${preferred_shapes}` (from Step 6)

**Shared Artifacts Created**:

- `${practice_decision}`: Chosen shape(s) to practice (e.g., "E and A shapes")
- `${learning_outcome}`: Understanding gained from comparison

**Error Paths**:

- Can't decide between shapes → That's OK! Will try multiple in practice
- All shapes look bad → User questions progression choice
- Selected shape doesn't match skill level → Discovers during practice, returns to compare

---

### Step 8: Move to Practice

**User Actions**:

- Pick up guitar
- Navigate to fretboard position for chosen shape
- Start practicing lines from chosen shape
- May reference comparison grid while practicing
- May return to app to try different shape

**Mental Model**:

- "Now I practice what I selected"
- "If this doesn't feel right, I can come back and try another shape"
- "The comparison helped me make a smart choice"

**Emotional State**: 😊 **Motivated & Empowered**

- Clear practice direction
- Confidence from informed decision
- Empowered by tool that accelerated learning

**Shared Artifacts Used**:

- `${practice_decision}` (shape to practice)
- `${visible_comparison}` (may reference during practice)

**Shared Artifacts Created**:

- `${practice_session}`: Actual guitar practice with selected shape
- `${skill_development}`: Improving Barry Harris technique

**Error Paths**:

- Chosen shape uncomfortable on guitar → Returns to Step 6, tries different shape
- Can't remember lines → References comparison grid again
- Practice reveals new questions → May try Shape Comparator with different progression

---

### Step 9: (Optional) Iterate with Different Progressions

**User Actions**:

- After practicing one progression, returns to Shape Comparator
- Enters different progression (e.g., "Am7 - D7 - GMaj7")
- Compares shapes for new progression
- Builds comprehensive understanding across multiple progressions

**Mental Model**:

- "Now I understand shapes for ii-V-I in C, let me try ii-V-I in G"
- "Different keys might favor different shapes"
- Building pattern recognition across keys

**Emotional State**: 😊 **Flow State & Mastery**

- Engaged in active learning
- Building comprehensive knowledge
- Confidence growing with each comparison

**Shared Artifacts Used**:

- `${learning_outcome}` (from previous progression)

**Shared Artifacts Created**:

- `${comprehensive_understanding}`: Knowledge across multiple progressions
- `${shape_preferences_by_key}`: Pattern of which shapes work in which keys

**Error Paths**:

- Burnout from too many comparisons → Natural stopping point, returns later
- Confusion from key differences → Focuses on one key first

---

## Emotional Arc Summary

```
Satisfaction
    😊 |        ┌───────┬───────────┬──────────────┐  Step 5-9: Discovery, Learning, Flow
       |    ┌───┤       │           │              │
    😐 |────┤   │       │           │              │  Step 1-3: Motivated, Focused, Engaged
       |    │   └───────┘           │              │
       |    │    Step 4             │              │
       └────────────────────────────────────────────────────> Time
       Step 1  2  3  4  5  6  7  8  9
       Start Nav Enter Wait View Analyze Decide Practice Iterate
```

**Key Emotional Insights**:

- **Quick engagement** (Step 1-3): Clear purpose, easy navigation, familiar input
- **Brief anticipation dip** (Step 4): Loading - must be fast (<5 sec) to maintain engagement
- **Discovery peak** (Step 5): "Aha! I can see everything at once!"
- **Sustained satisfaction** (Step 6-9): Active learning, informed decisions, practice empowerment

---

## Shared Artifacts Registry

| Artifact                   | Created | Used      | Source of Truth      | Persistence         |
| -------------------------- | ------- | --------- | -------------------- | ------------------- |
| `${practice_progression}`  | Step 1  | Steps 2-3 | User's practice goal | Session             |
| `${learning_goal}`         | Step 1  | Steps 6-7 | User motivation      | Session             |
| `${chord_input}`           | Step 3  | Step 4    | Form input           | UI state            |
| `${generation_request}`    | Step 3  | Steps 4-5 | API call             | Transient           |
| `${shape_lines_C/A/G/E/D}` | Step 5  | Steps 6-8 | API response         | UI display          |
| `${visible_comparison}`    | Step 5  | Steps 6-8 | Rendered grid        | UI display          |
| `${melodic_insights}`      | Step 6  | Step 7    | User analysis        | User knowledge      |
| `${preferred_shapes}`      | Step 6  | Step 7    | User evaluation      | User knowledge      |
| `${practice_decision}`     | Step 7  | Steps 8-9 | User choice          | Session/practice    |
| `${learning_outcome}`      | Step 7  | Step 9    | Understanding gained | Long-term knowledge |

---

## Critical Success Factors

### 1. **Instant Visual Comparison**

- All 5 shapes displayed simultaneously in grid
- No need to switch tabs or remember previous results
- Side-by-side layout makes differences obvious

### 2. **Fast Generation (<5 seconds)**

- Loading time MUST be short to maintain engagement
- Show progress indicator during generation
- No page reload - smooth experience

### 3. **Clear Melodic Representation**

- ABC notation rendered clearly
- Differences visually apparent
- Optional: Pattern indicators (ChordUp, ScaleDown labels)

### 4. **Simple Input**

- Familiar chord notation (Dm7, G7, CMaj7)
- Autocomplete/suggestions for chords
- Validation with helpful error messages

### 5. **No Cognitive Overload**

- Grid layout organized logically (alphabetical: C, A, G, E, D)
- Clean design - focus on comparison, not UI complexity
- Optional: Ability to hide shapes for focused comparison

---

## Journey Variations

### Variation 1: Beginner Exploring CAGED System

**Difference**: First time using Shape Comparator, unfamiliar with CAGED
**Example**: User enters "CMaj7" only, doesn't know about ii-V-I progressions
**Outcome**: Discovers CAGED shapes visually, builds foundational understanding

### Variation 2: Advanced Player Testing Complex Progression

**Difference**: Uses longer progressions (4-8 chords), analyzes deeply
**Example**: "Dm7 - Db7 - CMaj7 - E7 - Am7 - D7 - GMaj7"
**Outcome**: Understands shape relationships across extended progressions

### Variation 3: Key Comparison Across Multiple Sessions

**Difference**: Same progression in different keys
**Example**: ii-V-I in C, then G, then F
**Outcome**: Recognizes patterns: "E shape works well in C, A shape better in G"

---

## Design Requirements (Informed by Journey)

### Step 2 (Navigate) Requirements:

- "Shape Comparator" MUST be default/first tab in Experimental
- Clear tab label: no confusion about purpose
- Visual indicator of active tab

### Step 3 (Enter Progression) Requirements:

- Chord input with validation (real-time feedback)
- Autocomplete suggestions for common chords
- Minimum 2 chords required, clear error if violated
- "Generate All Shapes" button prominent and clear
- Example progressions shown (ii-V-I, I-VI-II-V)

### Step 4 (Wait) Requirements:

- Loading indicator with message: "Generating lines for all 5 shapes..."
- Generation MUST complete <5 seconds
- Cancel button if generation takes too long (edge case)

### Step 5 (View) Requirements:

- Grid layout: 5 cells (one per shape)
- Each cell labeled: "Shape C", "Shape A", etc.
- ABC notation rendered clearly
- All shapes visible without scrolling (on desktop)
- Responsive: Mobile shows 2-3 shapes at a time, swipe for more

### Step 6-7 (Analyze/Decide) Requirements:

- Optional: Pattern indicators per shape (e.g., "Patterns: ChordUp, ScaleDown")
- Optional: Fretboard position indicator (e.g., "Position: 7-10")
- Optional: Highlight/favorite shapes for comparison

### Step 8-9 (Practice/Iterate) Requirements:

- Clear button to try new progression
- Previous progression remembered (session state)
- Optional: Save favorite progressions

---

## Anti-Patterns to Avoid

1. **Sequential Generation**: Don't make user generate shapes one-at-a-time
2. **Hidden Shapes**: Don't hide shapes behind tabs/dropdowns - show all simultaneously
3. **Slow Loading**: Don't allow >5 second generation time - kills engagement
4. **Complex Input**: Don't require guitar position or advanced parameters - keep it simple
5. **Overwhelming Details**: Don't show too much technical info - focus on melodic comparison

---

## Next Steps

This journey map informs:

1. **YAML Schema** - Formalize steps, states, artifacts
2. **Gherkin Scenarios** - Executable specifications for acceptance tests
3. **Acceptance Criteria** (Phase 3) - Testable requirements per step
4. **UI Wireframes** (DESIGN wave) - Visual design aligned to journey flow
5. **Performance Requirements** - <5 second generation time is critical
