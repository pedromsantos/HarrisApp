# Experimental Tab Implementation Plan

## Overview

Create a new "Experimental" tab in the HarrisApp with 5 sub-features for testing and exploring the Barry Harris API capabilities.

**Priority Order (User-Focused):**

1. **CAGED Shape Comparator** (Priority #1) - Side-by-side shape comparison for learning
2. **Pattern Playground** (Priority #2) - Individual pattern experimentation
3. **Progression Builder** (Priority #3) - Visual progression building (if validated by P1/P2 adoption)

---

## Architecture

### Tab Structure

```
/experimental
├── Shape Comparator (default tab)
├── Pattern Playground
└── Progression Builder
```

### Components to Create

```
src/
├── pages/
│   └── Experimental.tsx (main page with sub-tabs)
├── components/
│   └── experimental/
│       ├── ShapeComparator.tsx
│       ├── PatternPlayground.tsx
│       └── ProgressionBuilder.tsx
└── hooks/
    └── useBarryHarrisLines.ts (hook for generate-lines endpoint)
```

---

## Feature 1: API Debugger (TOP PRIORITY)

### Purpose

Raw API request/response viewer for debugging and experimentation with all endpoints.

### Features

- **Endpoint Selection**: Dropdown to select any Barry Harris endpoint
  - `/barry-harris/generate-instructions`
  - `/barry-harris/materialize-instructions`
  - `/barry-harris/generate-lines` (progression lines)
  - Future endpoints as they're added

- **Request Builder**:
  - JSON editor for request body (textarea with syntax highlighting)
  - Common request templates (dropdown with presets)
  - Parameter documentation sidebar

- **Response Display**:
  - Pretty-printed JSON response
  - Copy response button
  - Response time indicator
  - HTTP status code display
  - Error highlighting

- **Request History**:
  - Save last 10 requests
  - Click to restore previous request
  - Export/import functionality

### API Endpoints Used

All Barry Harris endpoints (configurable)

### UI Layout

```
┌─────────────────────────────────────────────┐
│ Endpoint: [Dropdown]  [Send Request] [Copy] │
├─────────────────────────────────────────────┤
│ Request Body:                               │
│ ┌─────────────────────────────────────────┐ │
│ │ {                                       │ │
│ │   "chords": ["Dm7", "G7", "CMaj7"],    │ │
│ │   "caged_shape": "E"                   │ │
│ │ }                                      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Templates: [ii-V-I] [Minor ii-V] [Custom]  │
├─────────────────────────────────────────────┤
│ Response: (342ms) Status: 200              │
│ ┌─────────────────────────────────────────┐ │
│ │ {                                       │ │
│ │   "transitions": [...],                │ │
│ │   "metadata": {...}                    │ │
│ │ }                                      │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Implementation Notes

- Use existing `useBarryHarrisInstructions` hook as reference
- Create generic `useApiDebugger` hook for any endpoint
- Store request history in localStorage
- Add request templates for common test cases

---

## Feature 2: Instructions Explorer (PRIORITY #2)

### Purpose

Enable the existing commented-out InstructionsExplorer with improvements.

### Current State

- Already exists at `src/pages/InstructionsExplorer.tsx`
- Currently commented out in Navigation and App routes
- Uses `/generate-instructions` and `/materialize-instructions` endpoints

### Improvements to Add

1. **Better Visual Feedback**:
   - Loading skeleton for transitions
   - Progress indicator during materialization
   - Success/error toasts

2. **Path Comparison**:
   - Side-by-side view of selected paths
   - Highlight differences between paths
   - Show pattern differences visually

3. **Export Options**:
   - Export instructions as JSON
   - Export materialized lines as ABC notation
   - Copy to clipboard functionality

4. **Preset Progressions**:
   - Dropdown with common progressions (ii-V-I, I-VI-II-V, etc.)
   - Save custom progressions
   - Load from saved progressions

### API Endpoints Used

- `/barry-harris/generate-instructions`
- `/barry-harris/materialize-instructions`

### UI Enhancements

```
┌─────────────────────────────────────────────┐
│ Preset: [Select] or Custom                 │
│ Chords: [Dm7] [G7] [CMaj7] [+ Add]        │
│ Position: [E] [Generate Instructions]      │
├─────────────────────────────────────────────┤
│ Transition 1: Dm7 → G7                     │
│ ┌─────────────────────────────────────────┐ │
│ │ ☐ Path 1: ChordUp → ScaleDown          │ │
│ │ ☐ Path 2: TriadUp → ChordDown          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Materialize Selected] [Export JSON]       │
├─────────────────────────────────────────────┤
│ Materialized Lines:                        │
│ [ABC Notation Display]                     │
│ [Copy] [Export]                            │
└─────────────────────────────────────────────┘
```

---

## Feature 3: CAGED Shape Comparator

### Purpose

Side-by-side comparison of all CAGED shapes for the same progression.

### Features

- **Simultaneous Generation**:
  - Generate lines for all 5 CAGED shapes (C, A, G, E, D)
  - Display in grid layout
  - Highlight differences

- **Visual Comparison**:
  - ABC notation for each shape
  - Fretboard diagrams (if time permits)
  - Pattern indicators (ChordUp, ScaleDown, etc.)

- **Filter/Sort**:
  - Sort by pattern complexity
  - Filter by specific patterns used
  - Show only shapes with specific characteristics

### API Endpoints Used

- `/barry-harris/generate-lines` with different `caged_shape` parameters

### UI Layout

```
┌─────────────────────────────────────────────┐
│ Progression: [Dm7] [G7] [CMaj7]            │
│ [Generate All Shapes]                       │
├──────────┬──────────┬──────────┬───────────┤
│ Shape C  │ Shape A  │ Shape G  │ Shape E  │
│ ┌──────┐ │ ┌──────┐ │ ┌──────┐ │ ┌──────┐ │
│ │ ABC  │ │ │ ABC  │ │ │ ABC  │ │ │ ABC  │ │
│ │ Nota │ │ │ Nota │ │ │ Nota │ │ │ Nota │ │
│ │ tion │ │ │ tion │ │ │ tion │ │ │ tion │ │
│ └──────┘ │ └──────┘ │ └──────┘ │ └──────┘ │
│ Patterns:│ Patterns:│ Patterns:│ Patterns:│
│ ChordUp  │ TriadUp  │ ScaleDown│ ChordUp  │
├──────────┴──────────┴──────────┴───────────┤
│ Shape D                                     │
│ ┌─────────────────────────────────────────┐ │
│ │ ABC Notation                            │ │
│ └─────────────────────────────────────────┘ │
│ Patterns: ChordDown, TriadUp                │
└─────────────────────────────────────────────┘
```

---

## Feature 4: Pattern Playground

### Purpose

Test individual Barry Harris patterns in isolation with live preview.

### Features

- **Pattern Selection**:
  - Dropdown for all available patterns:
    - HalfStepUp
    - ChordUp
    - ChordDown
    - TriadUp
    - TriadDown
    - Pivot
    - ScaleDown
    - ThirdUp
    - ThirdDown

- **Scale Selection**:
  - From Scale (dropdown)
  - To Scale (dropdown)
  - Scale degree selection

- **Live Preview**:
  - ABC notation rendering
  - MIDI playback (if time permits)
  - Guitar tab display

- **Pattern Combination**:
  - Add multiple patterns
  - Reorder patterns
  - See combined result

### API Endpoints Used

- `/barry-harris/generate-lines` with specific pattern parameter

### UI Layout

```
┌─────────────────────────────────────────────┐
│ Pattern Builder                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 1. [ChordUp    ▼] [↑] [↓] [×]          │ │
│ │ 2. [ScaleDown  ▼] [↑] [↓] [×]          │ │
│ │ [+ Add Pattern]                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ From Scale: [C Major ▼]  Degree: [I  ▼]   │
│ To Scale:   [G Dom7  ▼]  Degree: [III ▼]  │
│                                             │
│ CAGED Shape: [E ▼]  [Generate]             │
├─────────────────────────────────────────────┤
│ Preview:                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ [ABC Notation Display]                  │ │
│ │ [Guitar Tab]                            │ │
│ └─────────────────────────────────────────┘ │
│ [Play MIDI] [Copy] [Save Combination]      │
└─────────────────────────────────────────────┘
```

---

## Feature 5: Progression Builder

### Purpose

Visual drag-and-drop chord progression builder with instant line generation.

### Features

- **Chord Library**:
  - Searchable chord list
  - Categories: Major7, Minor7, Dominant7, MinorMaj7
  - Drag chords to progression

- **Progression Canvas**:
  - Drag-and-drop interface
  - Reorder chords
  - Delete chords
  - Copy/paste progressions

- **Instant Generation**:
  - Auto-generate on chord change
  - Show transitions visually
  - Highlight ii-V patterns
  - Show scale choices

- **Save/Load**:
  - Save progressions with names
  - Load from library
  - Export/import as JSON

### API Endpoints Used

- `/barry-harris/generate-lines` (auto-triggered on progression change)

### UI Layout

```
┌─────────────────────────────────────────────┐
│ Chord Library:                              │
│ [Search...] [Major7] [Minor7] [Dom7]       │
│ ┌─────────────────────────────────────────┐ │
│ │ CMaj7  Dm7   Em7   FMaj7  G7    Am7    │ │
│ │ [Drag to add →]                         │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Progression:                                │
│ ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐        │
│ │ Dm7 │→ │ G7  │→ │CMaj7│→ │ [+] │        │
│ │ [×] │  │ [×] │  │ [×] │  │     │        │
│ └─────┘  └─────┘  └─────┘  └─────┘        │
│                                             │
│ Shape: [E ▼]  [Generate Lines]             │
│ [Save Progression] [Load] [Clear]          │
├─────────────────────────────────────────────┤
│ Generated Lines:                            │
│ Transition 1: Dm7 → G7 (ii-V detected)     │
│ Scale: G Dominant                           │
│ ┌─────────────────────────────────────────┐ │
│ │ [ABC Notation]                          │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## Implementation Order

### Phase 1: Core Infrastructure (Day 1)

1. ✅ Create plan document (this file)
2. Install missing dependencies:
   - `@radix-ui/react-tabs` (for tab UI)
   - Any other missing UI components
3. Create UI components:
   - `src/components/ui/tabs.tsx`
   - `src/components/ui/textarea.tsx` (if needed)
4. Create experimental page structure:
   - `src/pages/Experimental.tsx` (main container with tabs)
5. Update routing:
   - Add route in `src/App.tsx`
   - Add navigation link in `src/components/Navigation.tsx`

### Phase 2: Priority Features (Day 1-2)

1. **API Debugger** (Priority #1):
   - Create `src/components/experimental/ApiDebugger.tsx`
   - Create `src/hooks/useApiDebugger.ts`
   - Implement request/response display
   - Add request templates
   - Add request history

2. **Instructions Explorer** (Priority #2):
   - Create `src/components/experimental/InstructionsExplorerTab.tsx`
   - Reuse existing logic from `src/pages/InstructionsExplorer.tsx`
   - Add improvements (presets, export, better UI)

### Phase 3: Additional Features (Day 2-3)

3. **CAGED Shape Comparator**:
   - Create `src/components/experimental/ShapeComparator.tsx`
   - Implement parallel generation for all shapes
   - Create grid layout

4. **Pattern Playground**:
   - Create `src/components/experimental/PatternPlayground.tsx`
   - Pattern selection UI
   - Live preview

5. **Progression Builder**:
   - Create `src/components/experimental/ProgressionBuilder.tsx`
   - Drag-and-drop chord library
   - Save/load functionality

### Phase 4: Polish & Testing (Day 3)

- Add loading states
- Error handling
- Responsive design
- Test all features
- Add documentation

---

## Technical Decisions

### State Management

- Use React hooks (useState, useEffect)
- LocalStorage for persistence (request history, saved progressions)
- No global state library needed (keep it simple)

### Styling

- Existing Tailwind CSS + Radix UI components
- Follow existing component patterns in the app
- Responsive design (mobile-friendly)

### API Integration

- Reuse existing hooks where possible
- Create new hooks for new endpoints
- Handle loading/error states consistently

### Testing

- Manual testing for experimental features (no unit tests required initially)
- Focus on functionality over test coverage

---

## API Endpoints Reference

### 1. Generate Instructions

```
POST /barry-harris/generate-instructions
{
  "chords": ["Dm7", "G7", "CMaj7"],
  "caged_shape": "E",  // Optional
  "guitar_position": "E"  // Guitar position string
}
```

### 2. Materialize Instructions

```
POST /barry-harris/materialize-instructions
{
  "instructions": [
    {
      "patterns": ["ChordUp", "ScaleDown"],
      "discovered_pitches": ["D4", "F4", "A4", ...],
      "source_degree": "I",
      "target_degree": "III"
    }
  ]
}
```

### 3. Generate Lines (Progression)

```
POST /barry-harris/generate-lines
{
  "chord_names": ["Dm7", "G7", "CMaj7"],
  "caged_shape": "E"  // Optional: "C", "A", "G", "E", "D", or "all"
}
```

---

## Success Criteria

### API Debugger

- ✅ Can send requests to any Barry Harris endpoint
- ✅ Request/response displayed clearly
- ✅ Request history saved (last 10)
- ✅ Templates for common requests

### Instructions Explorer

- ✅ Generate instructions for progression
- ✅ Select paths from multiple options
- ✅ Materialize selected paths
- ✅ Export functionality

### Shape Comparator

- ✅ Generate all 5 shapes simultaneously
- ✅ Display side-by-side
- ✅ Visual comparison

### Pattern Playground

- ✅ Select individual patterns
- ✅ Generate and preview
- ✅ Combine patterns

### Progression Builder

- ✅ Drag-and-drop chord selection
- ✅ Auto-generate on change
- ✅ Save/load progressions

---

## Future Enhancements (Post-MVP)

1. **MIDI Playback**: Add audio playback for generated lines
2. **Fretboard Visualization**: Interactive fretboard showing fingering
3. **Pattern Analytics**: Statistics on most-used patterns
4. **Batch Generation**: Generate lines for multiple progressions at once
5. **Compare Modes**: Compare different parameter combinations
6. **Export to DAW**: Export as MIDI files
7. **Share Links**: Generate shareable URLs for configurations

---

## Notes

- Focus on Priority #1 (API Debugger) and #2 (Instructions Explorer) first
- Keep UI simple and functional - polish can come later
- Reuse existing components and patterns from the codebase
- This is an _experimental_ tab - prioritize functionality over perfection
- Document any API quirks or gotchas discovered during development
