# Journey Map: Standards-Based Barry Harris Learning (MVP)

**Feature**: Experimental Tab - Standards Library + Shape Exploration
**Jobs**: P1 (Standards-Based Learning, Score: 18) + P2 (Shape Exploration, Score: 13)
**Primary User**: Jazz musicians/students learning Barry Harris improvisation
**Date**: 2026-03-04

---

## Journey Overview

**Combined Job Story**:

> **When** learning jazz improvisation using the Barry Harris method,
> **I want to** practice with familiar jazz standards and explore different CAGED shapes,
> **So I can** master the method through material I already know and find my most comfortable approach.

**Journey Timespan**: 5-10 minutes (single practice session)

**Success Outcome**: Musician has Barry Harris lines for a familiar standard, understands which CAGED shape feels best, and is actively practicing with confidence.

---

## Journey Steps

### Step 1: Practice Session Begins - Seeking Direction

**Trigger**: Musician sits down to practice, wants to work on Barry Harris improvisation

**User Actions**:

- Opens HarrisApp on computer/tablet
- Thinking: "What should I practice today?"
- Wants clear direction, not wandering aimlessly
- May have recently watched Barry Harris video and wants to apply concepts

**Mental Model**:

- "I need practice material for Barry Harris method"
- "I know standards like Autumn Leaves, but don't know how to apply Barry Harris to them"
- "Familiar tunes will help me learn the method"

**Emotional State**: 😊 **Motivated & Slightly Uncertain**

- Energized to practice and improve
- Slight uncertainty: "Where do I start?"
- Hoping for clear direction

**Shared Artifacts Created**:

- `${practice_intention}`: Intent to practice Barry Harris improvisation
- `${time_available}`: Practice session timeframe (e.g., 30-60 minutes)

**Error Paths**:

- No clear practice direction → Wastes time deciding what to do
- Opens app but doesn't know where Barry Harris content is → Explores tabs aimlessly

---

### Step 2: Discover Standards Library

**User Actions**:

- Sees "Experimental" tab in navigation (or main tab if prioritized)
- Clicks "Experimental" tab
- Sees "Standards Library" or "Jazz Standards" as prominent feature
- Recognizes familiar standard names (Autumn Leaves, Blue Bossa, etc.)

**Mental Model**:

- "Oh! There's a library of jazz standards here"
- "These are tunes I know - Autumn Leaves, All The Things You Are..."
- "This looks like what I need"

**Emotional State**: 😊 **Discovery & Relief**

- "Aha! This is exactly what I was looking for"
- Relief: Clear entry point, no confusion
- Curiosity activated: "Let me explore this"

**Shared Artifacts Used**:

- `${practice_intention}` (finding what to practice)

**Shared Artifacts Created**:

- `${discovered_library}`: User awareness of standards library
- `${current_location}`: "Standards Library"

**Error Paths**:

- Standards library not visible/prominent → User misses feature
- Tab labeled unclearly → User doesn't recognize it's Barry Harris content
- No standards library, goes directly to custom input → Higher friction

---

### Step 3: Browse and Select Standard

**User Actions**:

- Scrolls through list of 15 jazz standards
- Sees metadata: difficulty, tempo, composer, key
- Thinks: "I know Autumn Leaves well, let me start there"
- Clicks on "Autumn Leaves" (or other familiar tune)

**Mental Model**:

- "I should pick a tune I already know so I can focus on the Barry Harris part"
- "Beginner difficulty - good starting point"
- "Medium Ballad tempo - comfortable"

**Emotional State**: 😊 **Engaged & Confident**

- Making informed choice based on familiar material
- Confidence: "I know this tune"
- Ready to see how Barry Harris applies to it

**Shared Artifacts Used**:

- `${practice_intention}` (choosing appropriate standard)
- `${discovered_library}` (browsing options)

**Shared Artifacts Created**:

- `${selected_standard}`: "Autumn Leaves"
- `${standard_metadata}`: {composer: "Joseph Kosma", key: "G minor", difficulty: "beginner", tempo: "Medium Ballad"}

**Error Paths**:

- Overwhelmed by 15 choices → Spends too long deciding (minor issue)
- Picks overly complex standard (e.g., Stella) as beginner → Frustration later
- No metadata visible → Can't make informed choice

---

### Step 4: View Dual Progressions

**User Actions**:

- Standard detail page loads
- Sees TWO chord progressions displayed:
    - **Original Progression**: "For melody/comping" - 8 chords including EbMaj7
    - **Improvisation Progression**: "For Barry Harris lines" - 6 chords simplified
- Reads explanation: "Barry Harris simplification removes passing chords for clearer ii-V patterns"
- Understands: "This is the Barry Harris approach to this tune"

**Mental Model**:

- "Ah! Barry Harris simplifies the progression for improvisation"
- "I'll comp over the original, but improvise over the simplified version"
- "This makes ii-V patterns clearer"
- Understanding pedagogical approach

**Emotional State**: 😊 **Understanding & Appreciation**

- "This makes sense! Barry Harris clarifies the harmony"
- Appreciation for pedagogical insight
- Slight "aha moment": "So THAT'S how he approaches standards"

**Shared Artifacts Used**:

- `${selected_standard}` (Autumn Leaves)
- `${standard_metadata}` (context for progressions)

**Shared Artifacts Created**:

- `${chords_original}`: ["Cm7", "F7", "BbMaj7", "EbMaj7", "Am7b5", "D7", "Gm7", "Gm7"]
- `${chords_improvisation}`: ["Cm7", "F7", "BbMaj7", "Am7b5", "D7", "Gm7"]
- `${pedagogical_insight}`: Understanding of Barry Harris simplification approach

**Error Paths**:

- Dual progressions not clearly labeled → Confusion about which to use
- No explanation of simplification → User doesn't understand value
- Only showing improvisation progression → Loses reference to original tune

---

### Step 5: Generate Barry Harris Lines (Default Shape)

**User Actions**:

- Sees "Generate Lines" button (or auto-generates on standard selection)
- Default CAGED shape pre-selected (E shape)
- Clicks button or waits for auto-generation
- Brief loading (2-3 seconds)

**Mental Model**:

- "The system will create Barry Harris lines for this progression"
- "Default shape is E - I can change it later"
- Anticipating seeing melodic lines

**Emotional State**: 😐 **Anticipation & Slight Tension**

- Brief wait: "I hope it works"
- Curiosity: "What will the lines look like?"
- Slight tension: "Will they sound musical?"

**Shared Artifacts Used**:

- `${chords_improvisation}` (sent to API for line generation)
- `${standard_metadata}` (context for generation)

**Shared Artifacts Created**:

- `${generation_request}`: API call with chords + shape E
- `${default_shape}`: "E"

**Error Paths**:

- Generation takes too long (>5 sec) → User loses patience
- Generation fails → Error message, retry option needed
- No loading indicator → User confused if anything is happening

---

### Step 6: View Generated Lines (ABC Notation)

**User Actions**:

- Sees ABC notation for Barry Harris lines
- May see guitar tablature (if implemented)
- Can read musical notation
- Reviews the melodic content

**Mental Model**:

- "These are the Barry Harris lines for Autumn Leaves in E shape"
- "This is what I'll practice"
- May mentally "sing" or imagine the sound

**Emotional State**: 😊 **Satisfaction & Validation**

- "It worked! I have lines to practice"
- Relief: Quality looks musical
- First "win" moment: From question to practice material in <2 minutes

**Shared Artifacts Used**:

- `${generation_request}` (completed)

**Shared Artifacts Created**:

- `${generated_lines_E}`: ABC notation for E shape
- `${practice_material}`: Concrete lines to work on
- `${first_success}`: Validation that tool works

**Error Paths**:

- ABC notation doesn't render → Technical error, retry needed
- Lines don't look musical → Quality concern, trust issue
- No explanation of what's shown → User confused about what to do next

---

### Step 7: Curiosity About Other Shapes

**User Actions**:

- Notices shape selector: C, A, G, E (active), D
- Thinks: "I wonder how this looks in A shape?"
- Clicks "A" shape button
- Sees brief loading, then new lines appear

**Mental Model**:

- "Different shapes will give me different melodic approaches"
- "Let me compare to see which feels better"
- Exploring options, not committing yet

**Emotional State**: 😊 **Curiosity & Exploration**

- Engaged in discovery
- No pressure: "Just seeing what's different"
- Building understanding of shape relationships

**Shared Artifacts Used**:

- `${generated_lines_E}` (reference point for comparison)
- `${selected_standard}` (same tune, different shape)

**Shared Artifacts Created**:

- `${shape_exploration_intent}`: User wants to compare approaches
- `${generation_request_A}`: API call for A shape

**Error Paths**:

- Shape selector not visible/obvious → User doesn't discover exploration
- Regeneration too slow → User gives up exploring
- No indication which shape is active → User loses track

---

### Step 8: Compare Shapes & Make Decision

**User Actions**:

- Looks at A shape lines
- Mentally compares to E shape (may switch back and forth)
- Notices: "A shape stays in middle register, E shape goes higher"
- Or: "A shape has smoother transitions between chords"
- Decides: "I'll start with A shape today, it feels more comfortable"

**Mental Model**:

- "Each shape has different character"
- "A shape feels right for my current skill level"
- "I can always try E shape later"
- Making informed decision based on comparison

**Emotional State**: 😊 **Confidence & Empowerment**

- Confident choice: "I know WHY I picked this shape"
- Empowered: Tool enabled informed decision
- Ready to practice with clear direction

**Shared Artifacts Used**:

- `${generated_lines_E}` (comparison reference)
- `${generated_lines_A}` (chosen option)
- `${shape_exploration_intent}` (fulfilled)

**Shared Artifacts Created**:

- `${melodic_comparison_insights}`: Understanding of shape differences (e.g., "A shape more comfortable register")
- `${shape_decision}`: Chosen shape (A) with rationale
- `${practice_plan}`: Clear direction for practice session

**Error Paths**:

- Can't see meaningful difference between shapes → User questions value of exploration
- All shapes look too similar → May indicate API issue or display problem
- Too many shapes tried → Information overload, decision paralysis

---

### Step 9: Move to Guitar Practice

**User Actions**:

- Picks up guitar
- Navigates to A shape position on fretboard
- Starts playing through the Barry Harris lines
- May keep app open for reference
- Practices slowly, building familiarity

**Mental Model**:

- "Now I practice what I selected"
- "I know this is A shape in middle register"
- "If this doesn't work, I can come back and try E shape"
- Feels guided, not guessing

**Emotional State**: 😊 **Motivated & Empowered**

- Clear practice direction: No time wasted
- Confidence from informed choice
- Empowered by tool that accelerated learning
- Satisfaction: "From question to practicing in <5 minutes"

**Shared Artifacts Used**:

- `${generated_lines_A}` (practice material)
- `${shape_decision}` (knows which position to use)
- `${practice_plan}` (clear session direction)

**Shared Artifacts Created**:

- `${practice_session}`: Actual guitar work with selected lines
- `${barry_harris_application}`: Applying method to real music
- `${skill_development}`: Progressing in Barry Harris improvisation

**Error Paths**:

- Chosen shape uncomfortable on guitar → Returns to Step 7, tries different shape
- Can't remember lines without reference → Keeps app open (acceptable)
- Lines too difficult for skill level → Returns to Step 3, picks simpler standard

---

### Step 10: (Optional) Return to Explore More Standards

**User Actions**:

- After 20-30 minutes practicing Autumn Leaves
- Returns to app
- Browses library again
- Selects "Blue Bossa" to explore different harmonic context
- Repeats Steps 4-9 for new standard

**Mental Model**:

- "I've worked on Autumn Leaves, let me try something different"
- "Blue Bossa is also beginner level, good next step"
- Building comprehensive understanding across multiple tunes

**Emotional State**: 😊 **Flow State & Mastery Building**

- Engaged in productive practice
- Building confidence with method
- Seeing how Barry Harris applies across different standards

**Shared Artifacts Used**:

- `${practice_session}` (first standard complete)
- `${skill_development}` (building on previous work)
- `${discovered_library}` (returning for more material)

**Shared Artifacts Created**:

- `${comprehensive_practice}`: Multiple standards explored
- `${barry_harris_fluency}`: Growing comfort with method
- `${session_success}`: Productive practice session achieved

**Error Paths**:

- Burnout from too many standards → Natural stopping point, returns later
- Second standard too similar → User wants more variety (library has diverse options)
- Lost track of which standards practiced → Could add "Recently Practiced" indicator (V2 feature)

---

## Emotional Arc Summary

```
Satisfaction
    😊 |        ┌───────┬──────────┬────────────┬──────────┐  Steps 6-10: Success, Discovery, Practice
       |    ┌───┤       │          │            │          │
    😐 |────┤   │       └──────────┘            │          │  Step 1: Uncertain, Step 5: Anticipation
       |    │   │        Step 5                 │          │
       └────────────────────────────────────────────────────────────> Time
       Step 1  2  3  4  5  6  7  8  9  10
       Start Disc Browse Dual Gen View Explore Compare Practice Iterate
             over  Select Prog
```

**Key Emotional Insights**:

- **Quick engagement** (Steps 1-3): Clear entry point, familiar material, low anxiety
- **Brief anticipation dip** (Step 5): Loading - MUST be fast (<3 sec) to maintain engagement
- **First success peak** (Step 6): "It worked!" - validates tool value
- **Sustained satisfaction** (Steps 7-10): Discovery, informed choice, productive practice
- **No significant frustration points**: Journey designed to avoid common anxieties

---

## Shared Artifacts Registry

| Artifact                         | Created  | Used           | Source of Truth          | Persistence       |
| -------------------------------- | -------- | -------------- | ------------------------ | ----------------- |
| `${practice_intention}`          | Step 1   | Steps 2-3      | User's practice goal     | Session           |
| `${time_available}`              | Step 1   | Step 10        | User's session timeframe | Session           |
| `${discovered_library}`          | Step 2   | Steps 3, 10    | UI feature awareness     | Session           |
| `${selected_standard}`           | Step 3   | Steps 4-6      | User choice              | Session/URL param |
| `${standard_metadata}`           | Step 3   | Steps 4-5      | Jazz standards JSON      | Database          |
| `${chords_original}`             | Step 4   | Display only   | Jazz standards JSON      | Database          |
| `${chords_improvisation}`        | Step 4   | Step 5 (API)   | Jazz standards JSON      | Database          |
| `${pedagogical_insight}`         | Step 4   | User knowledge | Barry Harris theory      | Long-term         |
| `${generation_request}`          | Step 5   | Step 6         | API call                 | Transient         |
| `${default_shape}`               | Step 5   | Steps 6-7      | System default (E)       | Config            |
| `${generated_lines_E/A}`         | Step 6/7 | Steps 7-9      | API response             | UI display        |
| `${practice_material}`           | Step 6   | Step 9         | Generated lines          | Session           |
| `${shape_exploration_intent}`    | Step 7   | Step 8         | User behavior            | Inferred          |
| `${melodic_comparison_insights}` | Step 8   | Step 9         | User analysis            | User knowledge    |
| `${shape_decision}`              | Step 8   | Step 9         | User choice              | Session           |
| `${practice_plan}`               | Step 8   | Step 9         | Derived from choices     | Session           |
| `${practice_session}`            | Step 9   | Step 10        | Guitar practice          | External          |
| `${barry_harris_application}`    | Step 9   | Long-term      | Learning progress        | Long-term         |

---

## Critical Success Factors

### 1. **Frictionless Entry** (<30 seconds to generation)

- Standards library immediately visible
- Familiar standard names recognized
- One-click selection → instant generation
- No configuration required

### 2. **Fast Generation** (<3 seconds)

- API must respond quickly
- Loading indicator for feedback
- No perceived lag in exploration

### 3. **Dual Progression Clarity**

- Both progressions clearly labeled
- Explanation of Barry Harris approach visible
- User understands pedagogical value

### 4. **Quality Musical Output**

- Generated lines must sound musical
- ABC notation renders correctly
- Appropriate for difficulty level

### 5. **Effortless Shape Exploration**

- Shape selector obvious and accessible
- Shape switching feels instant
- Clear indication of active shape

---

## Journey Variations

### Variation 1: Beginner First-Time User

**Difference**: Discovers library serendipitously, unsure what to expect
**Example**: "What's this Standards Library? Oh, these are tunes I know!"
**Outcome**: Delighted discovery, validation of tool value immediately

### Variation 2: Advanced Player Exploring Complex Standard

**Difference**: Selects "All The Things You Are" (intermediate), explores all 5 shapes
**Example**: Compares C, A, G, E, D shapes systematically
**Outcome**: Comprehensive understanding of shape relationships for complex harmony

### Variation 3: Direct Practice Session

**Difference**: User knows exactly what they want: "Autumn Leaves in A shape"
**Example**: Skips browsing, goes directly to known standard and shape
**Outcome**: Instant practice material, <1 minute from app open to practicing

---

## Design Requirements (Informed by Journey)

### Step 2 (Discover) Requirements:

- Standards library prominently placed (main or experimental tab)
- Clear feature name: "Jazz Standards" or "Standards Library"
- Visual indication this is Barry Harris content

### Step 3 (Browse & Select) Requirements:

- List of 15 standards with metadata
- Metadata visible: difficulty, tempo, composer, key, form
- Difficulty filter/sort optional (V2)
- One-click selection (no multi-step wizard)

### Step 4 (Dual Progressions) Requirements:

- TWO progressions displayed side-by-side or clearly separated
- Labels: "Original Progression (Melody/Comping)" vs "Improvisation Progression (Barry Harris)"
- Brief explanation: "Barry Harris simplifies for clearer ii-V patterns"
- Chord names clickable for details (optional, V2)

### Step 5 (Generate) Requirements:

- "Generate Lines" button OR auto-generate on selection
- Default shape: E (most common)
- Loading indicator: "Generating Barry Harris lines..."
- Generation MUST complete <3 seconds

### Step 6 (View Lines) Requirements:

- ABC notation rendered clearly
- Optional: Guitar tablature (if time permits)
- Copy button for lines (optional)
- Visual quality sufficient for practice

### Step 7-8 (Shape Exploration) Requirements:

- Shape selector: C, A, G, E, D buttons or dropdown
- Active shape visually indicated
- Click shape → regenerate with new shape
- Loading during regeneration (<2 sec)
- Optional: Side-by-side comparison (V2 enhancement)

### Step 9 (Practice) Requirements:

- Lines remain visible (no timeout)
- Print-friendly format (optional)
- Reference kept open during practice

### Step 10 (Iterate) Requirements:

- Easy return to standards library
- Previously selected standards remembered (session state)
- Optional: "Recently Practiced" indicator (V2)

---

## Anti-Patterns to Avoid

1. **Complex Onboarding**: Don't require tutorial before using - should be self-evident
2. **Hidden Library**: Don't bury standards in sub-menus - make prominent
3. **Single Progression Only**: Don't show only improvisation chords - both needed
4. **Slow Generation**: Don't allow >5 second generation - kills engagement
5. **Shape Switching Friction**: Don't make shape exploration cumbersome - should be one-click
6. **No Default**: Don't make user choose shape before first generation - pick sensible default
7. **Overwhelming Choice**: Don't show pattern customization in MVP - defer to V2

---

## Next Steps

This journey map informs:

1. **YAML Schema** (next) - Formalize steps, states, artifacts
2. **Gherkin Scenarios** - Executable specifications for acceptance tests
3. **Acceptance Criteria** (Phase 3) - Testable requirements per step
4. **UI Wireframes** (DESIGN wave) - Design standards browser + shape selector
5. **Performance Requirements** - <3 second generation time is critical
6. **API Design** - Ensure `/jazz-standards` + `/generate-lines` support this flow
